# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: portfolio.spec.ts >> all lower rooms allow doorway entry and walking to the far side
- Location: tests\portfolio.spec.ts:30:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('dialog').first().getByRole('heading', { name: 'The longer story.', exact: true })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('dialog').first().getByRole('heading', { name: 'The longer story.', exact: true }) with timeout 5000ms
  - waiting for getByRole('dialog').first().getByRole('heading', { name: 'The longer story.', exact: true })

```

```yaml
- link "Skip to research":
  - /url: "#research"
- banner:
  - link "Eric Yang .":
    - /url: "#"
  - navigation "Main navigation":
    - link "About":
      - /url: "#about"
    - link "Background":
      - /url: "#background"
    - link "Research":
      - /url: "#research"
    - link "Projects":
      - /url: "#projects"
    - link "Art":
      - /url: "#creative"
    - link "Contact":
      - /url: "#contact"
    - link "CV ↗":
      - /url: /images/eric_cv.pdf
    - link "GitHub ↗":
      - /url: https://github.com/yangpings
    - link "LinkedIn ↗":
      - /url: https://www.linkedin.com/in/eyangucsf/
- main:
  - region "One curious mind. One world to find. One step at a time.":
    - paragraph: RESEARCH. ML. SIDE QUESTS.
    - heading "One curious mind. One world to find. One step at a time." [level=1]:
      - text: One curious
      - strong: mind
      - text: . One
      - strong: world
      - text: to find. One
      - strong: step
      - text: at a time.
    - paragraph: I’m Eric, a machine learning researcher and AI engineer working across healthcare and music. I build systems and investigate what they learn, where they fail, and how reliably they work. In my free time, I draw, sing, and design!
    - link "Step into my world ↓":
      - /url: "#world"
    - link "Here for the research? ↗":
      - /url: "#research"
    - text: UCSF M.S. Health Data Science · UCLA B.S. Computational & Systems Biology
    - complementary:
      - button "Make Eric's photo bounce":
        - img "Eric Yang outdoors among green plants"
        - text: NICE TO MEET YOU
      - strong: Eric Yang
      - text: Researcher / Engineer / Artist
  - region "A little of everything I do.":
    - text: 01 / EXPLORE THE WORLD OF ERIC
    - heading "A little of everything I do." [level=2]
    - text: WORLD 001 · AFTER HOURS
    - paragraph: Walk into a room, pick up an instrument, draw something, chase a beat, or investigate a model.
    - text: ERIC’S LITTLE WORLD 1 / 8 rooms explored
    - button "Walk around"
    - group "Interactive world. Use arrow keys or WASD to walk, E to interact, Escape to release controls. Or select any room button.":
      - img "A miniature nighttime workspace with eight connected rooms": FOLLOW YOUR CURIOSITY > WHOAMI_ AI LAB VISION LAB ART STUDIO ♫ MUSIC ROOM THE LIBRARY HOME, SWEET HOME ONE MORE JUST ONE MORE OUT IN THE WORLD THE LIGHTS ARE ON. NO WRONG TURNS HERE.
      - button "Explore AI / Research lab": ↗ AI / Research lab
      - button "Explore Vision lab": ↗ Vision lab
      - button "Explore Art studio": ↗ Art studio
      - button "Explore Music room": ↗ Music room
      - button "Explore Library / CV": ✓ Library / CV
      - button "Explore Home / About Eric": ↗ Home / About Eric
      - button "Explore Arcade": ↗ Arcade
      - button "Explore Travel / Conferences": ↗ Travel / Conferences
      - button "Inspect the suspicious plant": "?"
    - text: WASD / Arrow keys to walk · E to enter At Library / CV
    - button "Move up": ↑
    - button "Move left": ←
    - button "Move down": ↓
    - button "Move right": →
    - button "Enter room"
    - text: Click a room to jump in, or walk through the open doorways. Keyboard, mouse, and touch.
  - region "My Journey":
    - text: 02 / THE PERSON AT THE KEYBOARD
    - heading "My Journey" [level=2]
    - link "Let’s connect on LinkedIn":
      - /url: https://www.linkedin.com/in/eyangucsf/
    - link "eric.yang2@ucsf.edu":
      - /url: mailto:eric.yang2@ucsf.edu
    - paragraph: My path has taken me from studying biology and computation at UCLA to exploring AI in healthcare at UCSF. Along the way, I helped build health technology in Kobe and worked with music at BOLERO, bringing research and engineering into different parts of my life.
    - paragraph: Art has been part of that journey too, through cover illustration and editing. These days, you’ll also find me drawing, singing, playing drums, traveling, or trying one more rhythm game.
    - region "Education":
      - heading "Education" [level=3]
      - link "Full CV ↗":
        - /url: /images/eric_cv.pdf
      - article:
        - text: UCSF 2024-2026
        - heading "M.S. in Health Data Science" [level=4]
        - paragraph: University of California, San Francisco
        - paragraph: San Francisco, California
      - article:
        - text: UCLA 2020-2024
        - heading "B.S. in Computational and Systems Biology" [level=4]
        - paragraph: University of California, Los Angeles
        - paragraph: Los Angeles, California
        - paragraph: "Concentration: Biological Data Sciences · Departmental Highest Honors"
    - region "Research & Work Experience":
      - text: WHERE I’VE WORKED
      - heading "Research & Work Experience" [level=3]
      - paragraph: Research, industry, and creative roles, by start date.
      - list "Positions and experience timeline":
        - listitem:
          - heading "2025" [level=4]
          - article:
            - text: Apr 2025 – Apr 2026 Research
            - heading "Data Science Specialist" [level=4]
            - paragraph: UCSF Department of Medicine
            - paragraph: Led LLM evaluation against physician expert judgment for medical student OSCE assessment.
            - paragraph: Apprenticeship · San Francisco, California · Hybrid
            - group: Full role description
            - button "Try it out ↗"
          - article:
            - text: Apr 2025 – Mar 2026 Industry
            - heading "Lead Data Scientist" [level=4]
            - paragraph: BOLERO · Tokyo, Japan
            - paragraph: Led AI/ML and production data systems for 100,000+ Japanese, English, and Mandarin music tracks.
            - paragraph: Full-time · Remote
            - group: Full role description
            - button "Try it out ↗"
            - link "BOLERO Website ↗":
              - /url: https://bolero.tokyo/
        - listitem:
          - heading "2024" [level=4]
          - article:
            - text: Oct 2024 – Jun 2026 Research
            - heading "Graduate Student Researcher" [level=4]
            - paragraph: UCSF Hswen Lab
            - paragraph: Led methodology, imaging pipelines, anatomical ablations, and foundation-model evaluation for ADRD prediction.
            - paragraph: Apprenticeship · San Francisco, California · Hybrid
            - group: Full role description
            - button "Try it out ↗"
          - article:
            - text: Apr 2024 – Dec 2024 Creative
            - heading "Cover Illustrator" [level=4]
            - paragraph: KADOKAWA Corporation
            - paragraph: Created artwork, contributed to design and editing, and built graphic-design web applications.
            - paragraph: Contract · Tokyo, Japan · Remote
            - group: Full role description
            - button "Try it out ↗"
        - listitem:
          - heading "2023" [level=4]
          - article:
            - text: Mar 2023 – Jun 2024 Research
            - heading "Clinical Design & Analysis Assistant" [level=4]
            - paragraph: UCLA Suthana Lab
            - paragraph: Analyzed 1,000+ patient EEG recordings and built reusable MATLAB and machine-learning workflows for clinical neuroscience.
            - paragraph: David Geffen School of Medicine at UCLA · Santa Monica, California · Hybrid
            - group: Full role description
          - article:
            - text: Sep 2023 – Jun 2024 Creative
            - heading "Assistant Illustrations Editor" [level=4]
            - paragraph: UCLA Student Media
            - paragraph: Supported a nine-member illustration staff, coordinated biweekly artwork, and collaborated on layout illustrations.
            - paragraph: Part-time · Los Angeles, California · On-site
            - group: Full role description
            - button "Try it out ↗"
          - article:
            - text: Jun 2023 – Sep 2023 Industry
            - heading "Chief Technology Officer" [level=4]
            - paragraph: PITTAN · Kobe, Japan
            - paragraph: Led a multimodal skin-analysis platform, hardware/data workflows, and mobile application development and deployment.
            - paragraph: Full-time · On-site
            - group: Full role description
            - link "PITTAN Website ↗":
              - /url: https://www.pittan.life/lang/en
        - listitem:
          - heading "2022" [level=4]
          - article:
            - text: Aug 2022 – Feb 2023 Industry
            - heading "Data Analysis Assistant" [level=4]
            - paragraph: Institute of Neuro Innovation
            - paragraph: Supported clinical-trial analysis for 500+ participants and evaluated three VR/audio therapy protocols for depression.
            - paragraph: Internship · Santa Monica, California · Hybrid
            - group: Full role description
        - listitem:
          - heading "2021" [level=4]
          - article:
            - text: 2021 – 2022 Research
            - heading "Research Assistant" [level=4]
            - paragraph: UCLA Arisaka Lab
            - paragraph: Worked on brain interfaces and UI/UX.
        - listitem:
          - heading "2020" [level=4]
          - article:
            - text: Jun 2020 – Mar 2024 Creative
            - heading "Copy Editor" [level=4]
            - paragraph: Tong Li Publishing
            - paragraph: Translated 20+ manga books and light novels from Japanese to Mandarin, with cover illustration, content polishing, and leadership of a 15-person team.
            - paragraph: Part-time · Taipei, Taiwan · Remote
            - group: Full role description
        - listitem:
          - heading "2018" [level=4]
          - article:
            - text: Sep 2018 – Jun 2021 Industry
            - heading "Customer Service Representative" [level=4]
            - paragraph: Milksha
            - paragraph: Customer service role in Taoyuan, Taiwan.
            - paragraph: Part-time · Taoyuan, Taiwan · On-site
  - region "Research and projects":
    - region "Real questions. Carefully built systems.":
      - text: 03 / THE WORK BEHIND THE WORLD
      - heading "Real questions. Carefully built systems." [level=2]
      - link "More on GitHub ↗":
        - /url: https://github.com/yangpings
      - paragraph: Machine learning, evaluation, and the space between a promising model and a reliable one.
      - article:
        - text: 01 / AI / RESEARCH LAB
        - heading "Clinical LLM Evaluation Against Physician Judgment" [level=3]
        - paragraph: Developed an evaluation framework for LLM-generated assessments of medical student OSCE performance, benchmarking structured scores and narrative feedback against physician expert judgment.
        - text: LLM evaluation Reliable AI
        - button "Explore this work ↗"
      - article:
        - text: 02 / VISION LAB
        - 'heading "TIME AD: Retinal Foundation Models for Alzheimer’s Disease Prediction" [level=3]'
        - paragraph: Evaluated RETFound Vision Transformers and CNNs for Alzheimer’s disease and related dementias prediction using approximately 180,000 UK Biobank retinal images, demographic variables, ICD-10 diagnoses, and linked clinical data.
        - text: Computer vision Foundation models
        - button "Explore this work ↗"
      - article:
        - text: 03 / PROJECT / COMPUTER VISION
        - 'heading "ODIR-5K: Deep Learning Benchmarks for Retinal Disease Detection" [level=3]'
        - paragraph: Built a unified training and evaluation framework comparing multiple deep-learning architectures on ODIR-5K for retinal disease detection.
        - text: Computer vision Retinal imaging
        - button "Explore this work ↗"
      - article:
        - text: 04 / RESEARCH / NLP
        - 'heading "Nicotine Pouch Discourse: Topic Modeling and Sentiment Analysis" [level=3]'
        - paragraph: Built a reproducible NLP workflow to analyze 38,000+ Reddit posts about nicotine-pouch use, studying behavioral patterns, sentiment, and how people discuss these products in online public-health conversations.
        - text: NLP Public health
        - button "Explore this work ↗"
      - article:
        - text: 05 / RESEARCH / BIOMARKERS
        - heading "Sweat Amino Acid Biomarkers for Noninvasive Skin Assessment" [level=3]
        - paragraph: Designed and executed a study of sweat amino-acid biomarkers for non-invasive skin assessment, using 500+ clinical samples collected with Kobe University.
        - text: Biomarkers Multimodal ML
        - button "Explore this work ↗"
      - article:
        - text: 06 / UPCOMING / RESEARCH Coming soon
        - 'heading "Project ANNIE: Retinal Biomarkers and AI for Alzheimer’s Disease" [level=3]'
        - paragraph: A planned research program investigating retinal biomarkers before Alzheimer’s diagnosis, external population validation, improved retinal AI methods, and human-guided versus autonomous multimodal AI.
        - text: Retinal biomarkers Multimodal AI
        - button "Explore this work ↗"
    - region "Project Timelines":
      - text: WHAT I’VE WORKED ON
      - heading "Project Timelines" [level=3]
      - list "Project timeline":
        - listitem:
          - heading "Next" [level=4]
          - article:
            - text: Coming soon Research
            - heading "Project ANNIE" [level=4]
            - paragraph: Planned research on prediagnostic retinal biomarkers, cross-population validation, and whether autonomous AI can integrate retinal, OCT, and clinical evidence more reliably than human-designed workflows.
            - group: Project details
        - listitem:
          - heading "2026" [level=4]
          - article:
            - text: July 2026 · AAIC, London Research
            - heading "Retinal imaging & Alzheimer’s disease" [level=4]
            - paragraph: Benchmarked RETFound Vision Transformers, CNNs, and statistical baselines using approximately 180,000 UK Biobank retinal images and linked clinical data. Used anatomical ablations, calibration, and robustness analysis to investigate what drove model predictions.
            - group: Project details
            - link "TIME AD Projects ↗":
              - /url: https://www.time-ad.org/projects
            - link "TIME AD Team ↗":
              - /url: https://www.time-ad.org/leadership-1
            - link "Research Abstract ↗":
              - /url: https://docs.google.com/document/d/11eGrURvvL8WGgiO9oDmD2h_Cb47VtLhjsPz2RPUrBOw/edit?usp=sharing
            - link "Full-resolution Poster ↗":
              - /url: /images/limits.png
          - article:
            - text: February 2026 · UCSF AI & Education Symposium Research
            - heading "LLM evaluation against physician judgment" [level=4]
            - paragraph: Built multimodal pipelines for LLM assessment of medical student OSCE encounters. Compared model scores and feedback with physician judgment using structured scoring, Cohen’s kappa, semantic similarity, and natural language inference.
            - group: Project details
          - article:
            - text: 2026 · Research documented in CV Research
            - heading "Nicotine-pouch discourse analysis" [level=4]
            - paragraph: Analyzed 38,000+ Reddit posts with preprocessing, lemmatization, LDA topic modeling, and VADER sentiment analysis to study discussion themes, behavioral patterns, and public-health communication.
            - group: Project details
            - link "APHA 2026 Conference Abstract ↗":
              - /url: https://apha.confex.com/apha/2026/meetingapp.cgi/Paper/595449
        - listitem:
          - heading "2025" [level=4]
          - article:
            - text: Apr 2025 – Mar 2026 · During BOLERO appointment Industry
            - heading "Music ML & production data systems" [level=4]
            - paragraph: Built end-to-end ML pipelines for 100,000+ multilingual music tracks, from Fourier-based audio features and representation learning to similarity analysis and prediction. Connected model outputs, external APIs, and databases to a secure web analytics platform.
            - group: Project details
            - link "BOLERO Website ↗":
              - /url: https://bolero.tokyo/
        - listitem:
          - heading "2023" [level=4]
          - article:
            - text: Jun 2023 – Jun 2024 · Honors thesis Research
            - heading "Sweat amino-acid biomarkers" [level=4]
            - paragraph: Designed a non-invasive skin-assessment study using 500+ clinical samples collected with Kobe University. Evaluated random forest and multimodal neural-network models using biochemical measurements and compared diagnostic feasibility with biopsy-based assessment.
            - group: Project details
            - link "PITTAN Website ↗":
              - /url: https://www.pittan.life/lang/en
    - text: FROM THE RESEARCH ARCHIVE
    - heading "Example Work" [level=2]
    - group "Research posters":
      - button "Enlarge Retinal imaging research poster":
        - img "Research poster on limits of fundus-based deep learning for Alzheimer’s disease prediction, anatomical ablation and clinical benchmarking in UK Biobank"
        - text: Retinal imaging research poster
  - region "Different tools. Same curiosity.":
    - text: 04 / OFF THE CLOCK, STILL MAKING THINGS
    - heading "Different tools. Same curiosity." [level=2]
    - button "Visit the art studio ↗"
    - img "Black and white character illustration of Flora"
    - text: "FROM THE STUDIO Concept Code 02: Flora CURRENT SIDE QUESTS Make some noise Music, singing & drumming One more round A little room for play"
    - link "My rhythm-game channel ↗":
      - /url: https://www.youtube.com/@takinouob_b/videos
    - link "My VTuber clipping channel ↗":
      - /url: https://www.youtube.com/@yp1786
    - text: Travelling
  - region "THE ART STUDIO / OPEN GALLERY":
    - text: THE ART STUDIO / OPEN GALLERY
    - group "Digital artwork gallery":
      - button "Enlarge Hatsune Miku Fan Art":
        - img "Colorful Hatsune Miku illustration with turquoise hair"
        - text: Hatsune Miku Fan Art
      - 'button "Enlarge Concept Code 01: Minami"':
        - img "Black and white close-up character illustration of Minami"
        - text: "Concept Code 01: Minami"
      - button "Enlarge Travel to the Future":
        - img "A figure looking toward a luminous planet above colorful clouds"
        - text: Travel to the Future
    - text: SKETCHES & TEXTURES.
    - group "Visual archive":
      - button "Enlarge Architectural illustration":
        - img "White line drawing of a building and trees on black"
        - text: Architectural illustration
      - button "Enlarge From the visual archive":
        - img "Dark blue artwork with fine luminous lines"
        - text: From the visual archive
      - button "Enlarge Original site background":
        - img "Abstract textured artwork in red, blue, green, and gold"
        - text: Original site background
  - region "Let’s make something interesting.":
    - text: 05 / KEEP THE CONVERSATION GOING
    - heading "Let’s make something interesting." [level=2]
    - paragraph: An idea to explore, a problem to untangle, or a reason to say hello.
    - link "eric.yang2@ucsf.edu ↗":
      - /url: mailto:eric.yang2@ucsf.edu
    - link "LinkedIn ↗":
      - /url: https://www.linkedin.com/in/eyangucsf/
    - link "GitHub ↗":
      - /url: https://github.com/yangpings
- contentinfo:
  - link "Eric Yang.":
    - /url: "#"
  - paragraph: Built with curiosity. Best explored with a little of yours.
  - text: © 2026 Eric Yang
- dialog "Library":
  - article:
    - text: ERIC’S LITTLE WORLD
    - button "Close details": ✕
    - heading "Library" [level=2]
    - paragraph: Choose a bookshelf and pack a tiny fantasy adventure.
    - button "Harry Potter" [pressed]
    - button "The Lord of the Rings"
    - heading "Pack for a night at Hogwarts." [level=3]
    - button "+ Wand"
    - button "+ Invisibility cloak"
    - button "+ Chocolate frogs"
    - status: Your adventure bag is empty.
```

# Test source

```ts
  1   | import { expect, test } from '@playwright/test';
  2   | 
  3   | test('playground supports nonlinear patterns, live pause, and custom training data', async ({ page }) => {
  4   |   await page.goto('/');
  5   |   await page.getByRole('button', { name: 'Explore AI / Research lab', exact: true }).click();
  6   |   const sandbox = page.locator('.model-sandbox');
  7   |   await sandbox.getByRole('button', { name: 'Four corners', exact: true }).click();
  8   |   await sandbox.getByRole('button', { name: 'Train 50 steps' }).click();
  9   |   const linear = await sandbox.getByRole('status').textContent();
  10  |   await sandbox.getByRole('button', { name: 'Use curved features' }).click();
  11  |   await sandbox.getByRole('button', { name: 'Train 50 steps' }).click();
  12  |   const curved = await sandbox.getByRole('status').textContent();
  13  |   const correct = (value: string | null) => Number(value!.match(/steps \/ (\d+)/)![1]);
  14  |   expect(correct(curved)).toBeGreaterThan(correct(linear));
  15  |   await sandbox.getByRole('button', { name: 'Start live training' }).click();
  16  |   await expect(sandbox.getByRole('status')).toContainText('Training live.');
  17  |   await sandbox.getByRole('button', { name: 'Pause training' }).click();
  18  |   const paused = await sandbox.getByRole('status').textContent();
  19  |   await page.waitForTimeout(250);
  20  |   expect(await sandbox.getByRole('status').textContent()).toBe(paused);
  21  |   await sandbox.locator('.keyboard-dots summary').click();
  22  |   await sandbox.getByRole('button', { name: 'Add coral dot: upper left', exact: true }).click();
  23  |   await expect(sandbox.getByRole('status')).toContainText('0 training steps');
  24  |   await expect(sandbox.getByRole('status')).toContainText('1 custom dots added');
  25  |   await expect(sandbox).toContainText('Held-out accuracy / 22 dots');
  26  |   await page.setViewportSize({ width: 390, height: 844 });
  27  |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  28  | });
  29  | 
  30  | test('all lower rooms allow doorway entry and walking to the far side', async ({ page }) => {
  31  |   test.setTimeout(45000);
  32  |   for (const room of [{ x: 30, title: 'The longer story.' }, { x: 270, title: 'Hi, I’m Eric.' }, { x: 510, title: 'One more round?' }, { x: 750, title: 'Ideas get to travel, too.' }]) {
  33  |     await page.goto('/');
  34  |     const world = page.getByRole('group', { name: /Interactive world/ });
  35  |     const player = page.getByTestId('player');
  36  |     await world.focus();
  37  |     const key = room.x + 110 < 500 ? 'a' : 'd';
  38  |     await page.keyboard.down(key);
  39  |     await expect.poll(async () => Math.abs(Number(await player.getAttribute('data-x')) - room.x - 110), { intervals: [16] }).toBeLessThan(9);
  40  |     await page.keyboard.up(key);
  41  |     await page.keyboard.down('s');
  42  |     await expect.poll(async () => Number(await player.getAttribute('data-y'))).toBeGreaterThan(420);
  43  |     await page.keyboard.up('s');
  44  |     await page.keyboard.press('e');
> 45  |     await expect(page.getByRole('dialog').first().getByRole('heading', { name: room.title, exact: true })).toBeVisible();
      |                                                                                                            ^ Error: expect(locator).toBeVisible() failed
  46  |     await page.keyboard.press('Escape');
  47  |     await page.keyboard.down('a');
  48  |     await expect.poll(async () => Number(await player.getAttribute('data-x'))).toBeLessThan(room.x + 40);
  49  |     await page.keyboard.up('a');
  50  |     await page.keyboard.down('s');
  51  |     await expect.poll(async () => Number(await player.getAttribute('data-y'))).toBeGreaterThan(520);
  52  |     await page.keyboard.up('s');
  53  |   }
  54  | });
  55  | 
  56  | test('on-screen controls move the character and open the lower arcade', async ({ page }) => {
  57  |   await page.setViewportSize({ width: 390, height: 844 });
  58  |   await page.goto('/');
  59  |   const player = page.getByTestId('player');
  60  |   const right = page.getByRole('button', { name: 'Move right', exact: true });
  61  |   await right.scrollIntoViewIfNeeded();
  62  |   const rightBounds = await right.boundingBox();
  63  |   await page.mouse.move(rightBounds!.x + rightBounds!.width / 2, rightBounds!.y + rightBounds!.height / 2);
  64  |   await page.mouse.down();
  65  |   await expect.poll(async () => Number(await player.getAttribute('data-x')), { intervals: [16] }).toBeGreaterThan(615);
  66  |   await page.mouse.up();
  67  |   const down = page.getByRole('button', { name: 'Move down', exact: true });
  68  |   const downBounds = await down.boundingBox();
  69  |   await page.mouse.move(downBounds!.x + downBounds!.width / 2, downBounds!.y + downBounds!.height / 2);
  70  |   await page.mouse.down();
  71  |   await expect.poll(async () => Number(await player.getAttribute('data-y'))).toBeGreaterThan(420);
  72  |   await page.mouse.up();
  73  |   await page.getByRole('button', { name: 'Enter room', exact: false }).click();
  74  |   await expect(page.getByRole('dialog').first()).toContainText('One more song');
  75  | });
  76  | 
  77  | test('AI sandbox learns from synthetic data and resets when features change', async ({ page }) => {
  78  |   await page.goto('/');
  79  |   await page.getByRole('button', { name: 'Explore AI / Research lab', exact: true }).click();
  80  |   const sandbox = page.locator('.model-sandbox');
  81  |   const initial = await sandbox.getByRole('status').textContent();
  82  |   await sandbox.getByRole('button', { name: 'Train 50 steps' }).click();
  83  |   await expect(sandbox.getByRole('status')).toContainText('50 training steps');
  84  |   expect(await sandbox.getByRole('status').textContent()).not.toBe(initial);
  85  |   await sandbox.getByRole('button', { name: 'Use horizontal feature only' }).click();
  86  |   await expect(sandbox.getByRole('status')).toContainText('0 training steps');
  87  |   await sandbox.getByRole('button', { name: 'Train 50 steps' }).click();
  88  |   await sandbox.getByRole('button', { name: 'Reset model' }).click();
  89  |   await expect(sandbox.getByRole('status')).toContainText('0 training steps');
  90  | });
  91  | 
  92  | test('singing handles declined microphone access without blocking the room', async ({ page }) => {
  93  |   await page.addInitScript(() => {
  94  |     navigator.mediaDevices.getUserMedia = async () => { throw new DOMException('Declined', 'NotAllowedError'); };
  95  |   });
  96  |   await page.goto('/');
  97  |   await page.getByRole('button', { name: 'Explore Music room', exact: true }).click();
  98  |   await page.getByRole('button', { name: 'Singing', exact: true }).click();
  99  |   await page.getByRole('button', { name: 'Enable microphone pitch guide' }).click();
  100 |   await expect(page.getByRole('status')).toContainText('access declined');
  101 |   await expect(page.getByRole('button', { name: 'Play reference note' })).toBeEnabled();
  102 | });
  103 | 
  104 | test('microphone tracks stop when leaving the singing corner', async ({ page }) => {
  105 |   await page.addInitScript(() => {
  106 |     navigator.mediaDevices.getUserMedia = async () => {
  107 |       const audio = new AudioContext();
  108 |       const destination = audio.createMediaStreamDestination();
  109 |       const oscillator = audio.createOscillator();
  110 |       oscillator.connect(destination); oscillator.start();
  111 |       (window as unknown as { testStream: MediaStream }).testStream = destination.stream;
  112 |       return destination.stream;
  113 |     };
  114 |   });
  115 |   await page.goto('/');
  116 |   await page.getByRole('button', { name: 'Explore Music room', exact: true }).click();
  117 |   await page.getByRole('button', { name: 'Singing', exact: true }).click();
  118 |   await page.getByRole('button', { name: 'Enable microphone pitch guide' }).click();
  119 |   await expect(page.getByRole('button', { name: 'Stop microphone', exact: true })).toBeVisible();
  120 |   await page.getByRole('button', { name: 'Drums', exact: true }).click();
  121 |   expect(await page.evaluate(() => (window as unknown as { testStream: MediaStream }).testStream.getTracks().every(track => track.readyState === 'ended'))).toBe(true);
  122 | });
  123 | 
  124 | test('little world has playable music, rhythm, art, and travel corners', async ({ page }) => {
  125 |   await page.goto('/');
  126 |   await expect(page.locator('#world-title')).toHaveText('A little of everything I do.');
  127 |   await expect(page.getByText('Start your day', { exact: true })).toHaveCount(0);
  128 |   await page.getByRole('button', { name: 'Explore Music room', exact: true }).click();
  129 |   for (const label of ['Crash', 'Snare', 'Kick', 'Floor tom']) await page.getByRole('button', { name: new RegExp(label) }).click();
  130 |   await expect(page.getByRole('status')).toContainText('Floor tom');
  131 |   await page.getByRole('button', { name: 'Singing', exact: true }).click();
  132 |   await page.getByRole('button', { name: 'Play reference note' }).click();
  133 |   await expect(page.getByText('Microphone audio is analyzed', { exact: false })).toBeVisible();
  134 |   await page.getByRole('button', { name: 'Listening', exact: true }).click();
  135 |   await page.getByRole('button', { name: 'Listen to loop' }).click();
  136 |   await expect(page.getByRole('status')).toContainText('Now playing');
  137 |   await page.getByRole('button', { name: 'Stop listening' }).click();
  138 |   await expect(page.getByRole('status')).toContainText('quiet');
  139 |   await page.getByRole('button', { name: 'Close details' }).click();
  140 |   await page.getByRole('button', { name: 'Explore Arcade', exact: true }).click();
  141 |   await page.getByRole('button', { name: 'Start rhythm session' }).click();
  142 |   await expect(page.locator('.rhythm-note').first()).toBeVisible();
  143 |   const controls = page.getByRole('group', { name: 'Rhythm game controls' });
  144 |   await controls.focus();
  145 |   await page.keyboard.press('d');
```