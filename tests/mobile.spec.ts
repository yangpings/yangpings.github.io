import { test, expect } from '@playwright/test';
const rooms = ['AI / Research lab', 'Vision lab', 'Art studio', 'Music room', 'Library / CV', 'Home', 'Arcade', 'Travel / Conferences'];
for (const viewport of [{width:320,height:740},{width:390,height:844},{width:768,height:1024},{width:844,height:390}]) {
  test(`mobile rooms fit and close after scrolling at ${viewport.width}x${viewport.height}`, async ({ browser }) => {
    const context = await browser.newContext({ viewport, hasTouch:true, isMobile:true });
    const page = await context.newPage();
    const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const name of rooms) {
      await page.getByRole('button', {name:`Explore ${name}`,exact:true}).tap();
      const dialog = page.getByRole('dialog');
      expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
      await dialog.evaluate(el => { el.scrollTop = el.scrollHeight; });
      const close = dialog.getByRole('button',{name:'Close details'});
      // Check actual hit testing; visibility alone does not detect a scrolled-away close button.
      expect(await close.evaluate(el => { const r = el.getBoundingClientRect(); return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2) === el; })).toBe(true);
      await close.tap();
      await expect(dialog).not.toBeVisible();
    }
    expect(errors).toEqual([]);
    await context.close();
  });
}

test('touch movement stops on release and cancellation', async ({ browser }) => {
  const context = await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  const page = await context.newPage(); await page.goto('/');
  const player = page.getByTestId('player');
  const right = page.getByRole('button',{name:'Move right',exact:true});
  await right.scrollIntoViewIfNeeded();
  const bounds = (await right.boundingBox())!;
  const session = await context.newCDPSession(page);
  const touchPoints = [{x:bounds.x+bounds.width/2,y:bounds.y+bounds.height/2}];
  await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints});
  await expect.poll(async()=>Number(await player.getAttribute('data-x'))).toBeGreaterThan(110);
  await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await expect(player).toHaveAttribute('data-moving','false');
  const stopped = await player.getAttribute('data-x');
  await page.waitForTimeout(150); expect(await player.getAttribute('data-x')).toBe(stopped);
  await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints});
  await expect(player).toHaveAttribute('data-moving','true');
  await session.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});
  await expect(player).toHaveAttribute('data-moving','false');
  await context.close();
});
