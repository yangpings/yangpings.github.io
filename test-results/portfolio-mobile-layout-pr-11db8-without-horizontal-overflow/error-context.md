# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: portfolio.spec.ts >> mobile layout provides touch access without horizontal overflow
- Location: tests\portfolio.spec.ts:235:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: getByRole('dialog')
Expected substring: "100,000+"
Received string:    "ERIC’S LITTLE WORLD✕Music roomDrums / Singing / ListeningYour turnMake some noiseDrumsSingingListeningA right-handed kit, viewed from the stool. Tap a piece or use its key.CrashYHi-hatHRideUMid tomGHigh tomTSnareFKickSpaceFloor tomJTap the kit, or focus its frame and use Y H T G U F Space J. Buttons also work with Tab and Enter.Behind the music: try the ML matching deskYou’re building a music discovery tool. “Similar” could mean a similar rhythm or a similar sound. Which matters more to your listener?Rhythm weight: 50% · Tone weight: 50%1. Track BRhythm 60 · Tone 70652. Track ARhythm 90 · Tone 30603. Track CRhythm 25 · Tone 9560Choose Track B for this listenerTry each end of the slider. There isn’t one universal definition of a good match.Invented tracks and synthetic scores for this toy exercise, not BOLERO data or an actual recommendation model.Take a music break: play the keyboardNo recording to press play on here. Make your own: try four different notes to finish this quest.CDEFGABHigh CSound starts only when you press a key. Click, tap, or use Tab and Enter."
Timeout: 5000ms

Call log:
  - Expect "toContainText" getByRole('dialog') with timeout 5000ms
  - waiting for getByRole('dialog')
    14 × locator resolved to <dialog open="" class="entry-dialog" aria-labelledby="entry-title">…</dialog>
       - unexpected value "ERIC’S LITTLE WORLD✕Music roomDrums / Singing / ListeningYour turnMake some noiseDrumsSingingListeningA right-handed kit, viewed from the stool. Tap a piece or use its key.CrashYHi-hatHRideUMid tomGHigh tomTSnareFKickSpaceFloor tomJTap the kit, or focus its frame and use Y H T G U F Space J. Buttons also work with Tab and Enter.Behind the music: try the ML matching deskYou’re building a music discovery tool. “Similar” could mean a similar rhythm or a similar sound. Which matters more to your listener?Rhythm weight: 50% · Tone weight: 50%1. Track BRhythm 60 · Tone 70652. Track ARhythm 90 · Tone 30603. Track CRhythm 25 · Tone 9560Choose Track B for this listenerTry each end of the slider. There isn’t one universal definition of a good match.Invented tracks and synthetic scores for this toy exercise, not BOLERO data or an actual recommendation model.Take a music break: play the keyboardNo recording to press play on here. Make your own: try four different notes to finish this quest.CDEFGABHigh CSound starts only when you press a key. Click, tap, or use Tab and Enter."

```

```yaml
- dialog "Music room":
  - article:
    - text: ERIC’S LITTLE WORLD
    - button "Close details": ✕
    - heading "Music room" [level=2]
    - region "Make some noise":
      - text: Drums / Singing / Listening Your turn
      - heading "Make some noise" [level=3]
      - button "Drums" [pressed]
      - button "Singing"
      - button "Listening"
      - paragraph: A right-handed kit, viewed from the stool. Tap a piece or use its key.
      - group "Playable drum kit":
        - button "Crash Y"
        - button "Hi-hat H"
        - button "Ride U"
        - button "Mid tom G"
        - button "High tom T"
        - button "Snare F"
        - button "Kick Space"
        - button "Floor tom J"
      - status: Tap the kit, or focus its frame and use Y H T G U F Space J. Buttons also work with Tab and Enter.
      - group: "Behind the music: try the ML matching desk"
```

# Test source

```ts
  140 |   await page.getByRole('button', { name: 'Explore Arcade', exact: true }).click();
  141 |   await page.getByRole('button', { name: 'Start rhythm session' }).click();
  142 |   await expect(page.locator('.rhythm-note').first()).toBeVisible();
  143 |   const controls = page.getByRole('group', { name: 'Rhythm game controls' });
  144 |   await controls.focus();
  145 |   await page.keyboard.press('d');
  146 |   await page.getByRole('button', { name: 'Restart session' }).click();
  147 |   await expect(page.getByRole('status')).toContainText('0 points');
  148 |   await expect(page.getByRole('status')).toContainText('Session complete', { timeout: 17000 });
  149 |   await page.getByRole('button', { name: 'Close details' }).click();
  150 |   await page.getByRole('button', { name: 'Explore Art studio', exact: true }).click();
  151 |   await page.getByRole('application', { name: 'Drawing canvas' }).focus();
  152 |   await page.keyboard.press('Space');
  153 |   const download = page.waitForEvent('download');
  154 |   await page.getByRole('button', { name: 'Save my sketch' }).click();
  155 |   expect((await download).suggestedFilename()).toBe('my-eric-world-sketch.svg');
  156 |   await page.getByRole('button', { name: 'Close details' }).click();
  157 |   await page.getByRole('button', { name: 'Explore Travel / Conferences', exact: true }).click();
  158 |   await page.getByRole('button', { name: 'Tokyo', exact: true }).click();
  159 |   await expect(page.getByRole('dialog').first().locator('iframe')).toHaveAttribute('title', 'Map of Tokyo');
  160 | });
  161 | 
  162 | test('professional content opens directly and restores focus', async ({ page }) => {
  163 |   const errors: string[] = [];
  164 |   page.on('pageerror', error => errors.push(error.message));
  165 |   await page.goto('/');
  166 |   await page.getByRole('navigation').getByRole('link', { name: 'Research', exact: true }).click();
  167 |   const trigger = page.getByRole('button', {name: 'Explore this work'}).first();
  168 |   await trigger.click();
  169 |   const dialog = page.getByRole('dialog');
  170 |   await expect(dialog).toBeVisible();
  171 |   await expect(dialog).toContainText('Cohen’s kappa');
  172 |   await expect(dialog.locator('.room-activity')).toHaveCount(0);
  173 |   await page.keyboard.press('Escape');
  174 |   await expect(dialog).not.toBeVisible();
  175 |   await expect(trigger).toBeFocused();
  176 |   expect(errors).toEqual([]);
  177 | });
  178 | 
  179 | test('project cards open narrative panels while world rooms retain activities', async ({ page }) => {
  180 |   await page.goto('/');
  181 |   const cards = page.locator('.research-card');
  182 |   await expect(cards).toHaveCount(6);
  183 |   for (const card of await cards.all()) {
  184 |     await card.getByRole('button', { name: 'Explore this work' }).click();
  185 |     const dialog = page.getByRole('dialog').first();
  186 |     await expect(dialog.locator('.room-activity')).toHaveCount(0);
  187 |     expect(await dialog.locator('.entry-details p').count()).toBeGreaterThanOrEqual(2);
  188 |     await page.getByRole('button', { name: 'Close details' }).click();
  189 |   }
  190 |   await page.getByRole('button', { name: 'Explore AI / Research lab', exact: true }).click();
  191 |   await expect(page.getByRole('button', { name: 'Train 50 steps' })).toBeVisible();
  192 | });
  193 | 
  194 | test('movement respects walls, enters doorways, and interacts nearby', async ({ page }) => {
  195 |   await page.goto('/');
  196 |   const world = page.getByRole('group', { name: /Interactive world/ });
  197 |   const player = page.getByTestId('player');
  198 |   await world.focus();
  199 |   await page.keyboard.down('w');
  200 |   await page.waitForTimeout(700);
  201 |   await page.keyboard.up('w');
  202 |   const blockedY = Number(await player.getAttribute('data-y'));
  203 |   expect(blockedY).toBeGreaterThanOrEqual(282);
  204 |   // Align with the art studio doorway at x=620, then walk into it.
  205 |   await page.keyboard.down('d');
  206 |   await expect.poll(async () => Number(await player.getAttribute('data-x'))).toBeGreaterThan(610);
  207 |   await page.keyboard.up('d');
  208 |   await page.keyboard.down('w');
  209 |   await expect.poll(async () => Number(await player.getAttribute('data-y'))).toBeLessThan(230);
  210 |   await page.keyboard.up('w');
  211 |   await page.keyboard.press('e');
  212 |   await expect(page.getByRole('dialog')).toContainText('A little room to make something.');
  213 |   await page.keyboard.press('Escape');
  214 |   await expect(world).toBeFocused();
  215 |   await page.keyboard.press('Escape');
  216 |   await expect(world).not.toBeFocused();
  217 | });
  218 | 
  219 | test('all rooms, secret, and existing CV are reachable', async ({ page, request }) => {
  220 |   await page.goto('/');
  221 |   for (const button of await page.getByRole('button', {name: /^Explore (AI|Vision|Art|Music|Library|Home|Arcade|Travel)/}).all()) {
  222 |     await button.click();
  223 |     await expect(page.getByRole('dialog')).toBeVisible();
  224 |     await page.getByRole('button', {name: 'Close details'}).click();
  225 |   }
  226 |   await expect(page.getByText('8 / 8 rooms explored')).toBeVisible();
  227 |   await page.getByRole('button', { name: 'Inspect the suspicious plant' }).click();
  228 |   await expect(page.getByRole('dialog')).toContainText('zero parameters');
  229 |   await page.keyboard.press('Escape');
  230 |   await expect(page.locator('footer')).toContainText('Peer-reviewed by a plant');
  231 |   const cv = await page.getByRole('navigation').getByRole('link', { name: 'CV ↗' }).getAttribute('href');
  232 |   expect((await request.get(cv!)).status()).toBe(200);
  233 | });
  234 | 
  235 | test('mobile layout provides touch access without horizontal overflow', async ({ page }) => {
  236 |   await page.setViewportSize({width:390,height:844});
  237 |   await page.goto('/');
  238 |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  239 |   await page.getByRole('button', {name:'Explore Music room'}).click();
> 240 |   await expect(page.getByRole('dialog')).toContainText('100,000+');
      |                                          ^ Error: expect(locator).toContainText(expected) failed
  241 |   await page.getByRole('button', {name:'Close details'}).click();
  242 |   await page.screenshot({path:'test-results/mobile.png',fullPage:true});
  243 | });
  244 | 
  245 | test('portrait, artwork, posters, and nested image previews are available', async ({ page }) => {
  246 |   await page.goto('/');
  247 |   await expect(page.getByAltText('Eric Yang outdoors among green plants')).toBeVisible();
  248 |   const gallery = page.getByRole('group', { name: 'Digital artwork gallery', exact: true });
  249 |   await expect(gallery.getByRole('button')).toHaveCount(3);
  250 |   const artwork = gallery.getByRole('button', { name: 'Enlarge Hatsune Miku Fan Art' });
  251 |   await artwork.click();
  252 |   await expect(page.getByRole('dialog', { name: 'Hatsune Miku Fan Art' })).toBeVisible();
  253 |   await expect(page.getByRole('link', { name: 'View on Pixiv' })).toHaveAttribute('href', 'https://www.pixiv.net/artworks/116375366');
  254 |   await page.keyboard.press('Escape');
  255 |   await expect(artwork).toBeFocused();
  256 |   await page.getByRole('button', { name: 'Explore Vision lab', exact: true }).click();
  257 |   await page.getByRole('button', { name: 'Enlarge Retinal imaging research poster' }).last().click();
  258 |   await expect(page.getByRole('dialog', { name: 'Retinal imaging research poster', exact: true })).toBeVisible();
  259 |   await page.keyboard.press('Escape');
  260 |   await expect(page.getByRole('dialog')).toBeVisible();
  261 |   await page.keyboard.press('Escape');
  262 |   // Scroll through the page to load every lazy preview and check for broken images.
  263 |   for (const img of await page.locator('main img').all()) {
  264 |     await img.scrollIntoViewIfNeeded();
  265 |     await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  266 |   }
  267 |   await page.setViewportSize({ width: 390, height: 844 });
  268 |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  269 | });
  270 | 
  271 | test('project and position timelines stay separate and retain full descriptions', async ({ page }) => {
  272 |   await page.goto('/');
  273 |   await page.getByRole('navigation').getByRole('link', {name: 'Background'}).click();
  274 |   const background = page.locator('#background');
  275 |   await expect(background.locator('.education-overview')).toContainText('2024-2026');
  276 |   const projects = page.getByRole('list', {name: 'Project timeline', exact: true});
  277 |   const positions = page.getByRole('list', {name: 'Positions and experience timeline', exact: true});
  278 |   await expect(projects.locator('article')).toHaveCount(6);
  279 |   await expect(positions.locator('article')).toHaveCount(11);
  280 |   await expect(positions.locator('.research-branch article')).toHaveCount(4);
  281 |   await expect(positions.locator('.other-branch article')).toHaveCount(7);
  282 |   const firstYear = positions.locator('.timeline-year').first();
  283 |   const leftBounds = await firstYear.locator('.research-branch article').boundingBox();
  284 |   const markerBounds = await firstYear.locator('.year-marker').boundingBox();
  285 |   const rightBounds = await firstYear.locator('.other-branch article').boundingBox();
  286 |   expect(leftBounds!.x + leftBounds!.width).toBeLessThan(markerBounds!.x);
  287 |   expect(rightBounds!.x).toBeGreaterThan(markerBounds!.x + markerBounds!.width);
  288 |   expect(await positions.locator('article h4').first().evaluate(el => getComputedStyle(el).fontSize)).toBe('20px');
  289 |   await expect(projects).toContainText('July 2026');
  290 |   await expect(projects).toContainText('Sweat amino-acid biomarkers');
  291 |   await expect(positions).toContainText('Lead Data Scientist');
  292 |   await expect(positions).toContainText('Clinical Design & Analysis Assistant');
  293 |   await expect(positions).toContainText('Data Analysis Assistant');
  294 |   await expect(positions).toContainText('Apr 2024 – Dec 2024');
  295 |   await expect(positions).toContainText('Sep 2018 – Jun 2021');
  296 |   const illustration = positions.locator('article').filter({has: page.getByRole('heading', {name:'Cover Illustrator', exact:true})});
  297 |   await illustration.locator('summary').click();
  298 |   await expect(illustration).toContainText('20-person team');
  299 |   await illustration.locator('summary').click();
  300 |   await expect(positions).not.toContainText('Undergraduate Honors Thesis');
  301 |   const bolero = positions.locator('article').filter({has: page.getByRole('heading', {name:'Lead Data Scientist', exact:true})});
  302 |   const details = bolero.locator('details');
  303 |   await details.locator('summary').click();
  304 |   await expect(details).toHaveAttribute('open', '');
  305 |   await expect(details).toContainText('representation learning');
  306 |   await expect(details).toContainText('¥20M seed funding round');
  307 |   await details.locator('summary').click();
  308 |   await bolero.getByRole('button', { name: 'Try it out' }).click();
  309 |   await expect(page.getByRole('dialog').first()).toContainText('BOLERO');
  310 |   await page.keyboard.press('Escape');
  311 |   const projectDetails = projects.locator('article').filter({ has: page.getByRole('heading', { name: 'Retinal imaging & Alzheimer’s disease', exact: true }) }).locator('details');
  312 |   await projectDetails.locator('summary').click();
  313 |   await expect(projectDetails).toContainText('RETFound');
  314 |   await projectDetails.locator('summary').click();
  315 |   const projectBounds = await projects.boundingBox();
  316 |   const positionBounds = await positions.boundingBox();
  317 |   expect(positionBounds!.y).toBeLessThan(projectBounds!.y);
  318 |   await expect(page.locator('#projects').getByRole('list', {name:'Project timeline', exact:true})).toBeVisible();
  319 |   await expect(page.locator('#about').getByRole('list', {name:'Positions and experience timeline', exact:true})).toBeVisible();
  320 |   await page.setViewportSize({width:390,height:844});
  321 |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  322 | });
  323 | 
  324 | test('page follows introduction, world, about, projects, creative, contact order', async ({ page }) => {
  325 |   await page.goto('/');
  326 |   const order = await page.locator('main > section').evaluateAll(sections => sections.map(section => section.id || section.className));
  327 |   expect(order).toEqual(['hero', 'world', 'about', 'projects', 'creative', 'image-archive', 'contact']);
  328 |   await expect(page.locator('#projects').getByRole('group', {name:'Research posters'})).toHaveCount(1);
  329 |   await expect(page.locator('#contact').getByRole('link', {name:'eric.yang2@ucsf.edu'})).toHaveAttribute('href', 'mailto:eric.yang2@ucsf.edu');
  330 | });
  331 | 
  332 | test('art studio cycles through every artwork with matching previews and links', async ({ page }) => {
  333 |   await page.goto('/');
  334 |   const studio = page.getByRole('button', { name: 'Explore Art studio', exact: true });
  335 |   const pieces = [
  336 |     ['pro', '128093526'], ['miku2', '116375366'],
  337 |     ['minami', '118904947'], ['earth', '118752021'], ['pro', '128093526'],
  338 |   ];
  339 |   for (const [file, id] of pieces) {
  340 |     await studio.click();
```