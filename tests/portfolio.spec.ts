import { expect, test } from '@playwright/test';

test('playground supports nonlinear patterns, live pause, and custom training data', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Explore AI / Research lab', exact: true }).click();
  const sandbox = page.locator('.model-sandbox');
  await sandbox.getByRole('button', { name: 'Four corners', exact: true }).click();
  await sandbox.getByRole('button', { name: 'Train 50 steps' }).click();
  const linear = await sandbox.getByRole('status').textContent();
  await sandbox.getByRole('button', { name: 'Use curved features' }).click();
  await sandbox.getByRole('button', { name: 'Train 50 steps' }).click();
  const curved = await sandbox.getByRole('status').textContent();
  const correct = (value: string | null) => Number(value!.match(/correctly classifies (\d+)/)![1]);
  expect(correct(curved)).toBeGreaterThan(correct(linear));
  await sandbox.getByRole('button', { name: 'Start live training' }).click();
  await expect(sandbox.getByRole('status')).toContainText('Training live.');
  await sandbox.getByRole('button', { name: 'Pause training' }).click();
  const paused = await sandbox.getByRole('status').textContent();
  await page.waitForTimeout(250);
  expect(await sandbox.getByRole('status').textContent()).toBe(paused);
  await sandbox.locator('.keyboard-dots summary').click();
  await sandbox.getByRole('button', { name: 'Add coral dot: upper left', exact: true }).click();
  await expect(sandbox.getByRole('status')).toContainText('0 training steps');
  await expect(sandbox.getByRole('status')).toContainText('1 custom dots added');
  await expect(sandbox).toContainText('Held-out accuracy / 22 dots');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('all lower rooms allow doorway entry and walking to the far side', async ({ page }) => {
  test.setTimeout(45000);
  for (const room of [{ x: 30, title: 'The longer story.' }, { x: 270, title: 'Hi, I’m Eric.' }, { x: 510, title: 'One more round?' }, { x: 750, title: 'Ideas get to travel, too.' }]) {
    await page.goto('/');
    const world = page.getByRole('group', { name: /Interactive world/ });
    const player = page.getByTestId('player');
    await world.focus();
    const key = room.x + 110 < 500 ? 'a' : 'd';
    await page.keyboard.down(key);
    await expect.poll(async () => Math.abs(Number(await player.getAttribute('data-x')) - room.x - 110), { intervals: [16] }).toBeLessThan(9);
    await page.keyboard.up(key);
    await page.keyboard.down('s');
    await expect.poll(async () => Number(await player.getAttribute('data-y'))).toBeGreaterThan(420);
    await page.keyboard.up('s');
    await page.keyboard.press('e');
    await expect(page.getByRole('dialog').first().getByRole('heading', { name: room.title, exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await page.keyboard.down('a');
    await expect.poll(async () => Number(await player.getAttribute('data-x'))).toBeLessThan(room.x + 40);
    await page.keyboard.up('a');
    await page.keyboard.down('s');
    await expect.poll(async () => Number(await player.getAttribute('data-y'))).toBeGreaterThan(520);
    await page.keyboard.up('s');
  }
});

test('on-screen controls move the character and open the lower arcade', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const player = page.getByTestId('player');
  const right = page.getByRole('button', { name: 'Move right', exact: true });
  await right.scrollIntoViewIfNeeded();
  const rightBounds = await right.boundingBox();
  await page.mouse.move(rightBounds!.x + rightBounds!.width / 2, rightBounds!.y + rightBounds!.height / 2);
  await page.mouse.down();
  await expect.poll(async () => Number(await player.getAttribute('data-x')), { intervals: [16] }).toBeGreaterThan(615);
  await page.mouse.up();
  const down = page.getByRole('button', { name: 'Move down', exact: true });
  const downBounds = await down.boundingBox();
  await page.mouse.move(downBounds!.x + downBounds!.width / 2, downBounds!.y + downBounds!.height / 2);
  await page.mouse.down();
  await expect.poll(async () => Number(await player.getAttribute('data-y'))).toBeGreaterThan(420);
  await page.mouse.up();
  await page.getByRole('button', { name: 'Enter room', exact: false }).click();
  await expect(page.getByRole('dialog').first()).toContainText('One more song');
});

test('AI sandbox learns from synthetic data and resets when features change', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Explore AI / Research lab', exact: true }).click();
  const sandbox = page.locator('.model-sandbox');
  const initial = await sandbox.getByRole('status').textContent();
  await sandbox.getByRole('button', { name: 'Train 50 steps' }).click();
  await expect(sandbox.getByRole('status')).toContainText('50 training steps');
  expect(await sandbox.getByRole('status').textContent()).not.toBe(initial);
  await sandbox.getByRole('button', { name: 'Use horizontal feature only' }).click();
  await expect(sandbox.getByRole('status')).toContainText('0 training steps');
  await sandbox.getByRole('button', { name: 'Train 50 steps' }).click();
  await sandbox.getByRole('button', { name: 'Reset model' }).click();
  await expect(sandbox.getByRole('status')).toContainText('0 training steps');
});

test('singing handles declined microphone access without blocking the room', async ({ page }) => {
  await page.addInitScript(() => {
    navigator.mediaDevices.getUserMedia = async () => { throw new DOMException('Declined', 'NotAllowedError'); };
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Explore Music room', exact: true }).click();
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
  await page.getByRole('button', { name: 'Explore Music room', exact: true }).click();
  await page.getByRole('button', { name: 'Singing', exact: true }).click();
  await page.getByRole('button', { name: 'Enable microphone pitch guide' }).click();
  await expect(page.getByRole('button', { name: 'Stop microphone', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Drums', exact: true }).click();
  expect(await page.evaluate(() => (window as unknown as { testStream: MediaStream }).testStream.getTracks().every(track => track.readyState === 'ended'))).toBe(true);
});

test('little world has playable music, rhythm, art, and travel corners', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#world-title')).toHaveText("Welcome to Eric's home.");
  await expect(page.getByText('Start your day', { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Explore Music room', exact: true }).click();
  for (const label of ['Crash', 'Snare', 'Kick', 'Floor tom']) await page.getByRole('button', { name: new RegExp(label) }).click();
  await expect(page.getByRole('status')).toContainText('Floor tom');
  await page.getByRole('button', { name: 'Singing', exact: true }).click();
  await page.getByRole('button', { name: 'Play reference note' }).click();
  await expect(page.getByText('Microphone audio is analyzed', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Listening', exact: true }).click();
  await page.getByRole('button', { name: 'Listen to loop' }).click();
  await expect(page.getByRole('status')).toContainText('Now playing');
  await page.getByRole('button', { name: 'Stop listening' }).click();
  await expect(page.getByRole('status')).toContainText('No loop is playing.');
  await page.getByRole('button', { name: 'Close details' }).click();
  await page.getByRole('button', { name: 'Explore Arcade', exact: true }).click();
  await page.getByRole('button', { name: 'Start rhythm session' }).click();
  await expect(page.locator('.rhythm-note').first()).toBeVisible();
  const controls = page.getByRole('group', { name: 'Rhythm game controls' });
  await controls.focus();
  await page.keyboard.press('d');
  await page.getByRole('button', { name: 'Restart session' }).click();
  await expect(page.getByRole('status')).toContainText('0 points');
  await expect(page.getByRole('status')).toContainText('Session complete', { timeout: 17000 });
  await page.getByRole('button', { name: 'Close details' }).click();
  await page.getByRole('button', { name: 'Explore Art studio', exact: true }).click();
  await page.getByRole('application', { name: 'Drawing canvas' }).focus();
  await page.keyboard.press('Space');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Save my sketch' }).click();
  expect((await download).suggestedFilename()).toBe('my-eric-world-sketch.svg');
  await page.getByRole('button', { name: 'Close details' }).click();
  await page.getByRole('button', { name: 'Explore Travel / Conferences', exact: true }).click();
  await page.getByRole('button', { name: 'Tokyo', exact: true }).click();
  await expect(page.getByRole('dialog').first().locator('iframe')).toHaveAttribute('title', 'Map of Tokyo');
});

test('professional content opens directly and restores focus', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('navigation').getByRole('link', { name: 'Research', exact: true }).click();
  const trigger = page.getByRole('button', {name: 'Explore this work'}).first();
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Cohen’s kappa');
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
    await card.getByRole('button', { name: 'Explore this work' }).click();
    const dialog = page.getByRole('dialog').first();
    await expect(dialog.locator('.room-activity')).toHaveCount(0);
    expect(await dialog.locator('.entry-details p').count()).toBeGreaterThanOrEqual(2);
    await page.getByRole('button', { name: 'Close details' }).click();
  }
  await page.getByRole('button', { name: 'Explore AI / Research lab', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Train 50 steps' })).toBeVisible();
});

test('movement respects walls, enters doorways, and interacts nearby', async ({ page }) => {
  await page.goto('/');
  const world = page.getByRole('group', { name: /Interactive world/ });
  const player = page.getByTestId('player');
  await world.focus();
  await page.keyboard.down('w');
  await page.waitForTimeout(700);
  await page.keyboard.up('w');
  const blockedY = Number(await player.getAttribute('data-y'));
  expect(blockedY).toBeGreaterThanOrEqual(282);
  // Align with the art studio doorway at x=620, then walk into it.
  await page.keyboard.down('d');
  await expect.poll(async () => Number(await player.getAttribute('data-x'))).toBeGreaterThan(610);
  await page.keyboard.up('d');
  await page.keyboard.down('w');
  await expect.poll(async () => Number(await player.getAttribute('data-y'))).toBeLessThan(230);
  await page.keyboard.up('w');
  await page.keyboard.press('e');
  await expect(page.getByRole('dialog')).toContainText('A little room to make something.');
  await page.keyboard.press('Escape');
  await expect(world).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(world).not.toBeFocused();
});

test('all rooms, secret, and existing CV are reachable', async ({ page, request }) => {
  await page.goto('/');
  for (const button of await page.getByRole('button', {name: /^Explore (AI|Vision|Art|Music|Library|Home|Arcade|Travel)/}).all()) {
    await button.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', {name: 'Close details'}).click();
  }
  await expect(page.getByText('8 / 8 rooms explored')).toBeVisible();
  await page.getByRole('button', { name: 'Inspect the suspicious plant' }).click();
  await expect(page.getByRole('dialog')).toContainText('You found the office plant');
  await page.keyboard.press('Escape');
  await expect(page.locator('footer')).toContainText('You found the hidden plant.');
  const cv = await page.getByRole('navigation').getByRole('link', { name: 'CV ↗' }).getAttribute('href');
  expect((await request.get(cv!)).status()).toBe(200);
});

test('mobile layout provides touch access without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole('button', {name:'Explore Music room'}).click();
  await expect(page.getByRole('dialog')).toContainText('100,000+');
  await page.getByRole('button', {name:'Close details'}).click();
  await page.screenshot({path:'test-results/mobile.png',fullPage:true});
});

test('portrait, artwork, posters, and nested image previews are available', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByAltText('Eric Yang outdoors among green plants')).toBeVisible();
  const gallery = page.getByRole('group', { name: 'Digital artwork gallery', exact: true });
  await expect(gallery.getByRole('button')).toHaveCount(3);
  const artwork = gallery.getByRole('button', { name: 'Enlarge Hatsune Miku Fan Art' });
  await artwork.click();
  await expect(page.getByRole('dialog', { name: 'Hatsune Miku Fan Art' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'View on Pixiv' })).toHaveAttribute('href', 'https://www.pixiv.net/artworks/116375366');
  await page.keyboard.press('Escape');
  await expect(artwork).toBeFocused();
  await page.getByRole('button', { name: 'Explore Vision lab', exact: true }).click();
  await page.getByRole('button', { name: 'Enlarge Retinal imaging research poster' }).last().click();
  await expect(page.getByRole('dialog', { name: 'Retinal imaging research poster', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  // Scroll through the page to load every lazy preview and check for broken images.
  for (const img of await page.locator('main img').all()) {
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
  const positions = page.getByRole('list', {name: 'Positions and experience timeline', exact: true});
  await expect(projects.locator('article')).toHaveCount(6);
  await expect(positions.locator('article')).toHaveCount(11);
  await expect(positions.locator('.research-branch article')).toHaveCount(4);
  await expect(positions.locator('.other-branch article')).toHaveCount(7);
  const firstYear = positions.locator('.timeline-year').first();
  const leftBounds = await firstYear.locator('.research-branch article').boundingBox();
  const markerBounds = await firstYear.locator('.year-marker').boundingBox();
  const rightBounds = await firstYear.locator('.other-branch article').boundingBox();
  expect(leftBounds!.x + leftBounds!.width).toBeLessThan(markerBounds!.x);
  expect(rightBounds!.x).toBeGreaterThan(markerBounds!.x + markerBounds!.width);
  expect(await positions.locator('article h4').first().evaluate(el => getComputedStyle(el).fontSize)).toBe('20px');
  await expect(projects).toContainText('July 2026');
  await expect(projects).toContainText('Sweat amino-acid biomarkers');
  await expect(positions).toContainText('Lead Data Scientist');
  await expect(positions).toContainText('Clinical Design & Analysis Assistant');
  await expect(positions).toContainText('Data Analysis Assistant');
  await expect(positions).toContainText('Apr 2024 – Dec 2024');
  await expect(positions).toContainText('Sep 2018 – Jun 2021');
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
  const projectDetails = projects.locator('article').filter({ has: page.getByRole('heading', { name: 'Retinal imaging & Alzheimer’s disease', exact: true }) }).locator('details');
  await projectDetails.locator('summary').click();
  await expect(projectDetails).toContainText('RETFound');
  await projectDetails.locator('summary').click();
  const projectBounds = await projects.boundingBox();
  const positionBounds = await positions.boundingBox();
  expect(positionBounds!.y).toBeLessThan(projectBounds!.y);
  await expect(page.locator('#projects').getByRole('list', {name:'Project timeline', exact:true})).toBeVisible();
  await expect(page.locator('#about').getByRole('list', {name:'Positions and experience timeline', exact:true})).toBeVisible();
  await page.setViewportSize({width:390,height:844});
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('page follows introduction, world, about, projects, creative, roadmap, contact order', async ({ page }) => {
  await page.goto('/');
  const order = await page.locator('main > section').evaluateAll(sections => sections.map(section => section.id || section.className));
  expect(order).toEqual(['hero', 'world', 'about', 'projects', 'creative', 'image-archive', 'roadmap', 'contact']);
  await expect(page.locator('#projects').getByRole('group', {name:'Research posters'})).toHaveCount(1);
  await expect(page.locator('#contact').getByRole('link', {name:'eric.yang2@ucsf.edu'})).toHaveAttribute('href', 'mailto:eric.yang2@ucsf.edu');
});

test('art studio cycles through every artwork with matching previews and links', async ({ page }) => {
  await page.goto('/');
  const studio = page.getByRole('button', { name: 'Explore Art studio', exact: true });
  const pieces = [
    ['pro', '128093526'], ['miku2', '116375366'],
    ['minami', '118904947'], ['earth', '118752021'], ['pro', '128093526'],
  ];
  for (const [file, id] of pieces) {
    await studio.click();
    const dialog = page.getByRole('dialog').first();
    await expect(dialog.locator('.dialog-art')).toHaveAttribute('src', new RegExp(`${file}\\.webp$`));
    await expect(dialog.getByRole('link', {name:'View this artwork on Pixiv'})).toHaveAttribute('href', `https://www.pixiv.net/artworks/${id}`);
    await page.keyboard.press('Escape');
    await expect(page.locator('.art-preview img')).toHaveAttribute('src', new RegExp(`${file}\\.webp$`));
    await expect(page.locator('.world-art image')).toHaveAttribute('href', new RegExp(`${file}\\.webp$`));
  }
});

test('roadmap climb shows the current level and opens planned work per stop', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Roadmap', exact: true }).click();
  const roadmap = page.locator('#roadmap');
  await expect(roadmap.getByRole('heading', { name: 'Roadmap.' })).toBeVisible();
  const stops = roadmap.getByRole('list', { name: 'Roadmap levels' }).getByRole('button');
  await expect(stops).toHaveCount(7);
  await expect(roadmap.getByRole('button', { name: 'Level 1: Engineering foundations' })).toHaveAttribute('aria-pressed', 'true');
  const log = roadmap.locator('#roadmap-log');
  await expect(log).toContainText('evalkit');
  await roadmap.getByRole('button', { name: 'Level 3: LLM systems & evaluation' }).click();
  await expect(log).toContainText('clineval');
  await log.getByRole('button', { name: 'Up a level →' }).click();
  await expect(log).toContainText('mednote-lora');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('footer lists the technologies behind the website', async ({ page }) => {
  await page.goto('/');
  const stack = page.locator('footer').getByRole('list', { name: 'Technologies used to build this website' });
  await expect(stack.getByRole('listitem')).toHaveCount(8);
  await expect(stack).toContainText('TypeScript');
  await expect(stack).toContainText('React');
  await expect(stack).toContainText('Playwright');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
