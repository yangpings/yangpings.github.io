import { expect, test } from '@playwright/test';
import { openRoom } from './helpers';

test('neural network playground trains live, pauses, and takes custom points', async ({ page }) => {
  await page.goto('/');
  await openRoom(page, 'AI / Research lab');
  const sandbox = page.locator('.model-sandbox');
  const status = sandbox.locator('.playground-status');
  await sandbox.getByRole('radio', { name: 'XOR', exact: true }).click();
  await sandbox.getByRole('button', { name: 'Step 1 epoch' }).click();
  await expect(status).toContainText('After 1 epoch');
  await sandbox.getByRole('button', { name: 'Resume training' }).click();
  await expect(status).toContainText('Training live.');
  await sandbox.getByRole('button', { name: 'Pause', exact: true }).click();
  const paused = await status.textContent();
  await page.waitForTimeout(250);
  expect(await status.textContent()).toBe(paused);
  const plot = (await sandbox.locator('.nn-plot').boundingBox())!;
  await page.mouse.click(plot.x + plot.width * .2, plot.y + plot.height * .2);
  await expect(status).toContainText('After 0 epochs');
  await expect(status).toContainText('1 custom points added');
  await expect(sandbox).toContainText('Held-out accuracy / 60 points');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('neural network learns, and resets when the architecture changes', async ({ page }) => {
  await page.goto('/');
  await openRoom(page, 'AI / Research lab');
  const sandbox = page.locator('.model-sandbox');
  const status = sandbox.locator('.playground-status');
  await sandbox.getByRole('button', { name: 'Step 1 epoch' }).click();
  await sandbox.getByRole('button', { name: 'Step 1 epoch' }).click();
  await expect(status).toContainText('After 2 epochs');
  await sandbox.getByRole('button', { name: 'More neurons in layer 1' }).click();
  await expect(status).toContainText('After 0 epochs');
  await sandbox.getByRole('button', { name: 'Train', exact: true }).click();
  await expect(status).toContainText('Training live.');
  await sandbox.getByRole('button', { name: 'Reset model' }).click();
  await expect(status).toContainText('After 0 epochs');
});

test('singing handles declined microphone access without blocking the room', async ({ page }) => {
  await page.addInitScript(() => {
    navigator.mediaDevices.getUserMedia = async () => { throw new DOMException('Declined', 'NotAllowedError'); };
  });
  await page.goto('/');
  await openRoom(page, 'Music room');
  await page.getByRole('button', { name: 'Singing', exact: true }).click();
  await page.getByRole('button', { name: 'Enable microphone pitch guide' }).click();
  await expect(page.getByRole('status')).toContainText('access declined');
  await expect(page.getByRole('button', { name: 'Play reference note' })).toBeEnabled();
});

test('microphone tracks stop when leaving the singing corner', async ({ page }) => {
  await page.addInitScript(() => {
    navigator.mediaDevices.getUserMedia = async () => {
      const audio = new AudioContext();
      const destination = audio.createMediaStreamDestination();
      const oscillator = audio.createOscillator();
      oscillator.connect(destination); oscillator.start();
      (window as unknown as { testStream: MediaStream }).testStream = destination.stream;
      return destination.stream;
    };
  });
  await page.goto('/');
  await openRoom(page, 'Music room');
  await page.getByRole('button', { name: 'Singing', exact: true }).click();
  await page.getByRole('button', { name: 'Enable microphone pitch guide' }).click();
  await expect(page.getByRole('button', { name: 'Stop microphone', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Drums', exact: true }).click();
  expect(await page.evaluate(() => (window as unknown as { testStream: MediaStream }).testStream.getTracks().every(track => track.readyState === 'ended'))).toBe(true);
});

test('little world has playable music, rhythm, art, and travel corners', async ({ page }) => {
  test.setTimeout(60000); // it plays a full rhythm session (about 20 s) as well as visiting four levels
  await page.goto('/');
  await expect(page.locator('#world-title')).toHaveText('World.exe');
  await openRoom(page, 'Music room');
  const seq = page.locator('.sequencer [role=status]');
  await page.getByRole('button', { name: 'Funk' }).click();
  await page.getByRole('button', { name: 'Play pattern' }).click();
  await expect(seq).toContainText('Playing');
  await page.getByRole('button', { name: 'Stop pattern' }).click();
  await expect(seq).toContainText('hits programmed');
  await page.getByRole('button', { name: 'Singing', exact: true }).click();
  await page.getByRole('button', { name: 'Play reference note' }).click();
  await expect(page.getByText('Microphone audio is analyzed', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Listening', exact: true }).click();
  await page.getByRole('button', { name: 'Listen to loop' }).click();
  await expect(page.getByRole('status')).toContainText('Now playing');
  await page.getByRole('button', { name: 'Stop listening' }).click();
  await expect(page.getByRole('status')).toContainText('No loop is playing.');
  await page.getByRole('button', { name: 'Close details' }).click();
  await openRoom(page, 'Arcade');
  await page.getByRole('button', { name: 'Start rhythm session' }).click();
  await expect(page.locator('.rg-stage.is-playing')).toBeVisible({ timeout: 4000 });
  const rhythm = page.locator('.rhythm [role=status]');
  await page.getByRole('button', { name: 'Restart session' }).click();
  await expect(rhythm).toContainText('0 points');
  await expect(rhythm).toContainText('Session complete', { timeout: 22000 });
  await page.getByRole('button', { name: 'Close details' }).click();
  await openRoom(page, 'Art studio');
  await page.getByRole('application', { name: 'Drawing canvas' }).focus();
  await page.keyboard.press('Space');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Save my sketch' }).click();
  expect((await download).suggestedFilename()).toBe('sketchbook-page-1.svg');
  await page.getByRole('button', { name: 'Close details' }).click();
  await openRoom(page, 'Travel / Conferences');
  await page.getByRole('button', { name: 'Tokyo', exact: true }).click();
  await expect(page.locator('.dial-panel iframe')).toHaveAttribute('title', 'Map of Tokyo');
});

test('professional content opens directly and restores focus', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('navigation').getByRole('link', { name: 'Research', exact: true }).click();
  const trigger = page.getByRole('button', {name: /: open the case study$/}).first();
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Cohen\'s kappa');
  await expect(dialog.locator('.room-activity')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  expect(errors).toEqual([]);
});

test('project cards open narrative panels while world rooms retain activities', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('.research-card');
  await expect(cards).toHaveCount(6);
  for (const card of await cards.all()) {
    await card.getByRole('button', { name: /: open the case study$/ }).click();
    const dialog = page.getByRole('dialog').first();
    await expect(dialog.locator('.room-activity')).toHaveCount(0);
    expect(await dialog.locator('.entry-details p').count()).toBeGreaterThanOrEqual(2);
    await page.getByRole('button', { name: 'Close details' }).click();
  }
  await openRoom(page, 'AI / Research lab');
  await expect(page.getByRole('button', { name: 'Train', exact: true })).toBeVisible();
});

test('all rooms and the existing CV are reachable, and every explored room fills a dot', async ({ page, request }) => {
  await page.goto('/');
  for (const label of ['AI / Research lab', 'Vision lab', 'Art studio', 'Music room', 'Library / CV', 'Home', 'Arcade', 'Travel / Conferences']) {
    await openRoom(page, label);
    await expect(page.locator('.dial-panel')).toBeVisible();
    await page.getByRole('button', {name: 'Close details'}).click();
  }
  await expect(page.getByText('8 / 8 rooms explored')).toBeVisible();
  await expect(page.locator('.dial-dots li.is-done')).toHaveCount(8);
  const cv = await page.getByRole('navigation').getByRole('link', { name: 'CV' }).getAttribute('href');
  expect((await request.get(cv!)).status()).toBe(200);
});

test('mobile layout provides touch access without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole('button', {name:'Music'}).click();
  await expect(page.getByRole('dialog')).toContainText('100,000+');
  await page.getByRole('button', {name:'Close details'}).click();
  await page.screenshot({path:'test-results/mobile.png',fullPage:true});
});

test('portrait, artwork, posters, and nested image previews are available', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByAltText('Eric Yang outdoors among green plants')).toBeVisible();
  const gallery = page.getByRole('group', { name: 'Digital artwork gallery', exact: true });
  // Gallery pictures link straight to their own Pixiv pages.
  await expect(gallery.getByRole('link')).toHaveCount(3);
  await expect(gallery.getByRole('link', { name: 'Hatsune Miku Fan Art on Pixiv (opens in a new tab)' })).toHaveAttribute('href', 'https://www.pixiv.net/artworks/116375366');
  await expect(gallery.getByRole('link', { name: /Concept Code 01: Minami/ })).toHaveAttribute('href', 'https://www.pixiv.net/artworks/118904947');
  await expect(gallery.getByRole('link', { name: /Hatsune/ })).toHaveAttribute('target', '_blank');
  await openRoom(page, 'Vision lab');
  await page.getByRole('button', { name: 'Enlarge Retinal imaging research poster' }).last().click();
  await expect(page.getByRole('dialog', { name: 'Retinal imaging research poster', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.dial-panel')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.dial-panel')).toHaveCount(0);
  // Scroll through the page to load every lazy preview and check for broken images.
  // Dial levels round the back of the ring are hidden by design; check every picture that is on show.
  for (const img of await page.locator('main img').filter({ visible: true }).all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('project and position timelines stay separate and retain full descriptions', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation').getByRole('link', {name: 'Background'}).click();
  const background = page.locator('#background');
  await expect(background.locator('.education-overview')).toContainText('2024-2026');
  const projects = page.getByRole('list', {name: 'Project timeline', exact: true});
  const positions = page.getByRole('list', {name: 'Experience timeline', exact: true});
  await page.getByRole('tab', { name: 'Project timeline' }).click();
  await expect(projects.locator('article')).toHaveCount(6);
  await page.getByRole('tab', { name: 'Experience timeline' }).click();
  await expect(positions.locator('article')).toHaveCount(11);
  // Ledger: a pinned year beside its entries, and filters for each kind of work.
  await expect(positions.locator('article[data-category="research"]')).toHaveCount(4);
  await expect(positions.locator('article:not([data-category="research"])')).toHaveCount(7);
  const firstYear = positions.locator('.ledger-year').first();
  const numeral = await firstYear.locator('.ledger-numeral').boundingBox();
  const entry = await firstYear.locator('article').first().boundingBox();
  expect(entry!.x).toBeGreaterThan(numeral!.x + numeral!.width);
  await page.getByRole('group', { name: 'Filter experience timeline' }).getByRole('button', { name: /^Research/ }).click();
  await expect(positions.locator('article')).toHaveCount(4);
  await page.getByRole('group', { name: 'Filter experience timeline' }).getByRole('button', { name: /^All/ }).click();
  await expect(positions.locator('article')).toHaveCount(11);
  await page.getByRole('tab', { name: 'Project timeline' }).click();
  await expect(projects).toContainText('July 2026');
  await expect(projects).toContainText('Sweat amino-acid biomarkers');
  await page.getByRole('tab', { name: 'Experience timeline' }).click();
  await expect(positions).toContainText('Lead Data Scientist');
  await expect(positions).toContainText('Clinical Design & Analysis Assistant');
  await expect(positions).toContainText('Data Analysis Assistant');
  await expect(positions).toContainText('Apr 2024 to Dec 2024');
  await expect(positions).toContainText('Sep 2018 to Jun 2021');
  const illustration = positions.locator('article').filter({has: page.getByRole('heading', {name:'Cover Illustrator', exact:true})});
  await illustration.locator('summary').click();
  await expect(illustration).toContainText('20-person team');
  await illustration.locator('summary').click();
  await expect(positions).not.toContainText('Undergraduate Honors Thesis');
  const bolero = positions.locator('article').filter({has: page.getByRole('heading', {name:'Lead Data Scientist', exact:true})});
  const details = bolero.locator('details');
  await details.locator('summary').click();
  await expect(details).toHaveAttribute('open', '');
  await expect(details).toContainText('representation learning');
  await expect(details).toContainText('¥20M seed funding round');
  await details.locator('summary').click();
  await bolero.getByRole('button', { name: 'Try it out' }).click();
  await expect(page.getByRole('dialog').first()).toContainText('BOLERO');
  await page.keyboard.press('Escape');
  await page.getByRole('tab', { name: 'Project timeline' }).click();
  const projectDetails = projects.locator('article').filter({ has: page.getByRole('heading', { name: 'Retinal imaging & Alzheimer\'s disease', exact: true }) }).locator('details');
  await projectDetails.locator('summary').click();
  await expect(projectDetails).toContainText('RETFound');
  await projectDetails.locator('summary').click();
  await expect(page.locator('#experience').getByRole('list', {name:'Project timeline', exact:true})).toBeVisible();
  await page.getByRole('tab', { name: 'Experience timeline' }).click();
  await expect(page.locator('#experience').getByRole('list', {name:'Experience timeline', exact:true})).toBeVisible();
  await page.setViewportSize({width:390,height:844});
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('page follows the chapter order of the split-stage layout', async ({ page }) => {
  await page.goto('/');
  const order = await page.locator('main [data-chapter]').evaluateAll(chapters => chapters.map(chapter => chapter.id || chapter.className.split(' ')[0]));
  expect(order).toEqual(['hero', 'about', 'world', 'projects', 'skills', 'experience', 'creative', 'side-quests', 'image-archive', 'roadmap', 'blog', 'contact']);
  // The research posters live with their projects now: in the preview beside the list and in each case study.
  await expect(page.locator('.project-preview img')).toHaveCount(0);
  await page.locator('#research .research-card').nth(1).hover();
  await expect(page.locator('.project-preview img')).toHaveCount(1);
  await expect(page.locator('#contact').getByRole('link', {name:'eric.yang2@ucsf.edu'})).toHaveAttribute('href', 'mailto:eric.yang2@ucsf.edu');
});

test('art studio cycles through every artwork with matching previews and links', async ({ page }) => {
  await page.goto('/');
  const pieces = [
    ['pro', '128093526'], ['miku2', '116375366'],
    ['minami', '118904947'], ['earth', '118752021'], ['pro', '128093526'],
  ];
  for (const [file, id] of pieces) {
    await openRoom(page, 'Art studio');
    const dialog = page.getByRole('dialog').first();
    await expect(dialog.locator('.dialog-art')).toHaveAttribute('src', new RegExp(`${file}\.webp$`));
    await expect(dialog.getByRole('link', {name:'View this artwork on Pixiv'})).toHaveAttribute('href', `https://www.pixiv.net/artworks/${id}`);
    await page.keyboard.press('Escape');
    await expect(page.locator('.art-preview img')).toHaveAttribute('src', new RegExp(`${file}\.webp$`));
  }
});

test('roadmap climb shows the current level and opens planned work per stop', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Roadmap', exact: true }).click();
  const roadmap = page.locator('#roadmap');
  await expect(roadmap.getByRole('heading', { name: 'Roadmap', exact: true })).toBeVisible();
  const stops = roadmap.getByRole('list', { name: 'Roadmap levels' }).getByRole('button');
  await expect(stops).toHaveCount(7);
  await expect(roadmap.getByRole('button', { name: 'Level 2: Deep learning internals' })).toHaveAttribute('aria-pressed', 'true');
  const log = roadmap.locator('#roadmap-log');
  await expect(log).toContainText('clinical-tokenizer-tax');
  await roadmap.getByRole('button', { name: 'Level 1: Engineering foundations' }).click();
  await expect(log).toContainText('cohort-diff');
  await roadmap.getByRole('button', { name: 'Level 3: LLM systems & evaluation' }).click();
  await expect(log).toContainText('clinical-agent-redteam');
  await log.getByRole('button', { name: 'Up a level →' }).click();
  await expect(log).toContainText('mednote-lora');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('footer lists the technologies behind the website', async ({ page }) => {
  await page.goto('/');
  const stack = page.locator('footer').getByRole('list', { name: 'Technologies used to build this website' });
  await expect(stack.getByRole('listitem')).toHaveCount(12);
  await expect(stack).toContainText('GSAP');
  await expect(stack).toContainText('TypeScript');
  await expect(stack).toContainText('React');
  await expect(stack).toContainText('Playwright');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('the dial turns with the keyboard and opens the level at the front', async ({ page }) => {
  await page.goto('/');
  const home = page.locator('.dial-item[aria-label="Explore Home"]');
  await expect(home).toHaveAttribute('data-here', 'true');
  await home.focus();
  await page.keyboard.press('ArrowRight');
  const library = page.locator('.dial-item[aria-label="Explore Library / CV"]');
  await expect(library).toHaveAttribute('data-here', 'true', { timeout: 5000 });
  await expect(library).toBeFocused();
  await expect(page.locator('.dial-caption')).toHaveText('Library');
  await page.keyboard.press('e');
  await expect(page.locator('.dial-panel .library')).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(page.locator('.dial-panel')).toHaveCount(0);
  await expect(library).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(home).toHaveAttribute('data-here', 'true', { timeout: 5000 });
});

test('scrolling over the wheel turns it without scrolling the page, and a side level turns to the front when clicked', async ({ page }) => {
  await page.goto('/');
  const top = await page.locator('.dial-sticky').evaluate(el => el.getBoundingClientRect().top + scrollY - 80);
  await page.evaluate(y => window.scrollTo(0, y), top);
  await page.waitForTimeout(800);
  const y0 = await page.evaluate(() => scrollY);
  const front = await page.locator('.dial-item.is-front').boundingBox();
  await page.mouse.move(front!.x + front!.width / 2, front!.y + front!.height / 2);
  for (let i = 0; i < 3; i++) { await page.mouse.wheel(0, 100); await page.waitForTimeout(300); }
  await expect(page.locator('.dial-caption')).toHaveText('Vision lab', { timeout: 5000 });
  for (let i = 0; i < 12; i++) { await page.mouse.wheel(0, 100); await page.waitForTimeout(80); }
  await expect(page.locator('.dial-caption')).toHaveText('Travel', { timeout: 5000 });
  // Even past the last level, the page itself has not moved.
  expect(await page.evaluate(() => scrollY)).toBe(y0);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  // Scrolling over the white space beside the wheel scrolls the page and leaves the wheel alone.
  await page.mouse.move(200, 700);
  await page.mouse.wheel(0, 300);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(y0);
  await expect(page.locator('.dial-caption')).toHaveText('Travel');
  await page.evaluate(y => window.scrollTo(0, y), y0);
  await page.locator('.dial-again').click();
  await expect(page.locator('.dial-caption')).toHaveText('Home', { timeout: 5000 });
  await page.waitForTimeout(800);
  await page.locator('.dial-item[aria-label="Explore Library / CV"]').click();
  await expect(page.locator('.dial-item[aria-label="Explore Library / CV"]')).toHaveAttribute('data-here', 'true', { timeout: 5000 });
  // It opens beside the wheel once it arrives, not in a popup, and its name moves up to head it.
  await expect(page.locator('.dial-panel')).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('projects section switches between research and open source by mouse and keyboard', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('#research');
  const research = section.getByRole('tab', { name: 'Research (6)' });
  const openSource = section.getByRole('tab', { name: 'Open source (2)' });
  await expect(research).toHaveAttribute('aria-selected', 'true');
  await expect(section.getByRole('tabpanel')).toHaveCount(1);
  await expect(section.locator('.research-card')).toHaveCount(6);

  await research.focus();
  await page.keyboard.press('ArrowRight');
  await expect(openSource).toBeFocused();
  await expect(openSource).toHaveAttribute('aria-selected', 'true');
  await expect(research).toHaveAttribute('tabindex', '-1');
  await expect(section.locator('.research-card')).toHaveCount(2);
  await expect(section.getByRole('tabpanel')).toContainText('cohort-diff');
  await page.keyboard.press('ArrowRight');
  await expect(research).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(openSource).toBeFocused();

  // "Next project" stays inside the list the project came from.
  await section.getByRole('button', { name: 'ehr-asof: open the case study' }).click();
  const dialog = page.getByRole('dialog').first();
  await expect(dialog.getByRole('heading', { name: /ehr-asof/ })).toBeVisible();
  await expect(dialog.getByRole('link', { name: 'ehr-asof on GitHub' })).toHaveAttribute('href', 'https://github.com/yangpings/ehr-asof');
  const charts = dialog.locator('.sheet-figure img');
  await expect(charts).toHaveCount(2);
  for (const chart of await charts.all()) {
    await chart.scrollIntoViewIfNeeded();
    await expect.poll(() => chart.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
  }
  await dialog.getByRole('button', { name: /Next project/ }).click();
  await expect(dialog.getByRole('heading', { name: /cohort-diff/ })).toBeVisible();
  await dialog.getByRole('button', { name: /Next project/ }).click();
  await expect(dialog.getByRole('heading', { name: /ehr-asof/ })).toBeVisible();
  await page.getByRole('button', { name: 'Close details' }).click();

  await research.click();
  await section.getByRole('button', { name: 'Project ANNIE: open the case study' }).click();
  await page.getByRole('dialog').first().getByRole('button', { name: /Next project/ }).click();
  await expect(page.getByRole('dialog').first().getByRole('heading', { name: /Clinical LLM evaluation/ })).toBeVisible();
  await page.getByRole('button', { name: 'Close details' }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('popups keep their content while closing, then clear it and return focus', async ({ page }) => {
  await page.goto('/');
  const trigger = page.locator('#research').getByRole('button', { name: 'TIME AD: open the case study' });
  await trigger.click();
  const dialog = page.locator('dialog.is-project');
  await expect(dialog).toHaveJSProperty('open', true);
  await expect.poll(() => dialog.evaluate(el => getComputedStyle(el).clipPath)).toBe('inset(0px)');
  await page.getByRole('button', { name: 'Close details' }).click();
  await expect(dialog).toHaveJSProperty('open', false);
  await expect(trigger).toBeFocused();
  await expect(dialog.locator('.project-sheet')).toHaveCount(0);
  await trigger.click();
  await expect(dialog.locator('.project-sheet')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveJSProperty('open', false);
});

test('blog section is in the navigation and says coming soon until the first post is published', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Blog', exact: true }).click();
  const blog = page.locator('#blog');
  await expect(blog.getByRole('heading', { name: 'Blog', exact: true })).toBeVisible();
  await expect(blog).toContainText('Coming soon');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
