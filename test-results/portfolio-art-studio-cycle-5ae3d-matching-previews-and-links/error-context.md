# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: portfolio.spec.ts >> art studio cycles through every artwork with matching previews and links
- Location: tests\portfolio.spec.ts:332:1

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator: getByRole('dialog').first().locator('.dialog-art')
Expected pattern: /pro\.webp$/
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveAttribute" getByRole('dialog').first().locator('.dialog-art') with timeout 5000ms
  - waiting for getByRole('dialog').first().locator('.dialog-art')

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
      - button "Explore Art studio": ✓ Art studio
      - button "Explore Music room": ↗ Music room
      - button "Explore Library / CV": ↗ Library / CV
      - button "Explore Home / About Eric": ↗ Home / About Eric
      - button "Explore Arcade": ↗ Arcade
      - button "Explore Travel / Conferences": ↗ Travel / Conferences
      - button "Inspect the suspicious plant": "?"
    - text: WASD / Arrow keys to walk · E to enter Follow the hallway to an open doorway.
    - button "Move up": ↑
    - button "Move left": ←
    - button "Move down": ↓
    - button "Move right": →
    - button "Enter room" [disabled]
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
- dialog "Art studio":
  - article:
    - text: ERIC’S LITTLE WORLD
    - button "Close details": ✕
    - heading "Art studio" [level=2]
    - region "Your canvas":
      - text: Art studio Your turn
      - paragraph: A little room to make something. Choose any color, set your brush, and draw.
      - button "Brush" [pressed]
      - button "Eraser"
      - text: Color
      - textbox "Brush color": "#da5b58"
      - text: "#DA5B58 Brush size"
      - status "Brush size 12": "12"
      - slider "Brush size": "12"
      - 'button "Use color #292432"'
      - 'button "Use color #ffffff"'
      - 'button "Use color #da5b58" [pressed]'
      - 'button "Use color #ef9951"'
      - 'button "Use color #e5bb4b"'
      - 'button "Use color #83a66c"'
      - 'button "Use color #489c9a"'
      - 'button "Use color #5687be"'
      - 'button "Use color #8d73b5"'
      - 'button "Use color #d78bad"'
      - 'button "Use color #98674e"'
      - 'button "Use color #fff8eb"'
      - application "Drawing canvas"
      - button "Undo" [disabled]
      - button "Redo" [disabled]
      - button "Clear canvas" [disabled]
      - button "Save my sketch" [disabled]
      - status: A fresh sheet. Make your first mark.
      - text: Draw with a mouse, pen, or touch. On the canvas, use arrows to move, Shift + arrows to draw, and Space to dab. Undo also restores a cleared canvas.
```

# Test source

```ts
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
  341 |     const dialog = page.getByRole('dialog').first();
> 342 |     await expect(dialog.locator('.dialog-art')).toHaveAttribute('src', new RegExp(`${file}\\.webp$`));
      |                                                 ^ Error: expect(locator).toHaveAttribute(expected) failed
  343 |     await expect(dialog.getByRole('link', {name:'View this artwork on Pixiv'})).toHaveAttribute('href', `https://www.pixiv.net/artworks/${id}`);
  344 |     await page.keyboard.press('Escape');
  345 |     await expect(page.locator('.art-preview img')).toHaveAttribute('src', new RegExp(`${file}\\.webp$`));
  346 |     await expect(page.locator('.world-art image')).toHaveAttribute('href', new RegExp(`${file}\\.webp$`));
  347 |   }
  348 | });
  349 | 
```