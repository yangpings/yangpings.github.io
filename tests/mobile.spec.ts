import { test, expect } from '@playwright/test';
import { openRoom } from './helpers';
const rooms = ['AI / Research lab', 'Vision lab', 'Art studio', 'Music room', 'Library / CV', 'Home', 'Arcade', 'Travel / Conferences'];
for (const viewport of [{width:320,height:740},{width:390,height:844},{width:768,height:1024},{width:844,height:390}]) {
  test(`mobile rooms fit and close after scrolling at ${viewport.width}x${viewport.height}`, async ({ browser }) => {
    const context = await browser.newContext({ viewport, hasTouch:true, isMobile:true });
    const page = await context.newPage();
    const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const name of rooms) {
      await openRoom(page, name);
      const dialog = page.locator('.dial-panel');
      expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
      await dialog.evaluate(el => { el.scrollTop = el.scrollHeight; });
      const close = page.getByRole('button',{name:'Close details'});
      // Check actual hit testing; visibility alone does not detect a scrolled-away close button.
      expect(await close.evaluate(el => { const r = el.getBoundingClientRect(); return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2) === el; })).toBe(true);
      await close.tap();
      await expect(dialog).not.toBeVisible();
    }
    expect(errors).toEqual([]);
    await context.close();
  });
}

test('a vertical swipe on the wheel turns it without scrolling the page; beside it, the page scrolls', async ({ browser }) => {
  const context = await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  const page = await context.newPage(); await page.goto('/');
  const top = await page.locator('.dial-sticky').evaluate(el => el.getBoundingClientRect().top + scrollY - 72);
  await page.evaluate(y => window.scrollTo(0, y), top);
  await page.waitForTimeout(800);
  await expect(page.locator('.dial-item[aria-label="Explore Home"]')).toHaveAttribute('data-here', 'true');
  const y0 = await page.evaluate(() => scrollY);
  const front = await page.locator('.dial-item.is-front').boundingBox();
  const x = Math.round(front!.x + front!.width / 2), y = Math.round(front!.y + front!.height / 2);
  const session = await context.newCDPSession(page);
  const swipe = async (sx: number, from: number, to: number) => {
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: sx, y: from }] });
    for (let yy = from; yy >= to; yy -= 20) await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: sx, y: yy }] });
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  };
  await swipe(x, y + 60, y - 60);
  await expect(page.locator('.dial-item[aria-label="Explore Home"]')).not.toHaveAttribute('data-here', 'true', { timeout: 5000 });
  await expect(page.locator('.dial-panel')).toHaveCount(0);
  expect(await page.evaluate(() => scrollY)).toBe(y0);
  await swipe(20, 700, 300);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(y0);
  await context.close();
});
