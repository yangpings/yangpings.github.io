# Eric Yang — A world of curious things

First production foundation for yangpings.github.io. React 19, TypeScript, and Vite; static hosting, no backend.

## Run locally

```sh
npm ci
npm run dev
npm run build
npm run preview
```

On Windows, use `npm.cmd` if PowerShell blocks the npm script.

## What was here

The original prototype is preserved in `archive/index.html` and `archive/style.css`. An archive-only base URL keeps its original image and stylesheet references working when served over HTTP from the project root. The prototype contained a long inline script for particle and neural sphere animations, portfolio sections, an unwired contact form, and menu buttons without handlers. Original assets remain in `images/`; the production asset copies are in `public/images/`. There was no Git metadata, package manifest, build tool, or deployment workflow in the supplied folder.

## Architecture

- `src/content.ts`: typed research, biography, verified links, and asset paths. Edit this to update the content shared by world dialogs and research cards. Existing CV is retained; its currency has not been verified.
- `src/background.ts`: education, project milestones, positions, and expanded role descriptions. Education and research/industry dates use the updated CV; creative and earlier Arisaka roles use the original portfolio. `Background.tsx` renders two independent dot timelines: projects/presentation milestones and positions/experience. The honors thesis belongs to projects. Conference dates describe presentations rather than inferred project start dates; the BOLERO project period is labeled as its appointment period. Both histories include brief summaries and expandable details. The project timeline lives in Projects; education and the positions timeline live under About. Each timeline uses the full section width. The interface uses DM Sans throughout.
- `src/App.tsx`: direct navigation and conventional portfolio sections.
- `src/components/World.tsx`: SVG rooms and native HTML interaction buttons, with a small frame-based movement loop. No continuous animation runs until the world has focus. Movement is paused while a detail dialog is open.
- `src/world.ts`: room geometry, walkability, collision, and movement. Coordinates use a fixed 1000 × 610 world, independent of screen size.
- `src/components/EntryDialog.tsx`: reusable content presentation and native modal dialog. Escape closes; focus returns to the invoking control.
- `src/styles.css`: shared colors, typography, responsive layouts, visible focus, reduced-motion support.

World controls: focus the world, use WASD/arrows, and press E near a room. Escape releases the world controls; Tab always navigates normally. Every room also has a direct button for mouse, touch, and keyboard navigation. Progress is session-only. A plant hides a small fictional Easter egg. There is no autoplay audio or game barrier to professional information.

SVG and HTML are sufficient for this small first world and keep interactions accessible without a game engine. Introduce a lazy-loaded Phaser scene if future mini-games, larger maps, sprites, or camera behavior justify it; keep the content data and conventional React interface independent.

## GitHub Pages

The supplied folder is not a Git checkout. This implementation has not been pushed or deployed.

1. Place these files in the actual `yangpings.github.io` repository and commit the generated `package-lock.json`.
2. In repository Settings → Pages, select **GitHub Actions** as the source.
3. Push to `main`, or run **Deploy portfolio to GitHub Pages** manually. Adjust the workflow branch if necessary.

The workflow installs locked dependencies, type-checks, builds, and deploys `dist/`. Vite uses relative asset URLs, including the CV and artwork, so the build also works under a project subpath. Navigation uses fragments and needs no SPA rewrite rule.

## Verification

```sh
npx playwright install chromium
npm test
```

Tests cover movement and collision, nearby interaction, focus return, direct research access, real asset paths, and mobile layout. The test runner starts a local Vite server.

## Next iterations

1. Review the world layout and research descriptions; replace or refresh the repository CV.
2. Add verified publication citations, project URLs, presentation material, and approved research figures. No missing links or findings have been fabricated.
3. Add further art as needed. The site now includes the portrait, all four original portfolio pieces, both research posters, the illustration and texture archive, responsive background variants, logo, and favicon. Optimized WebP previews are generated with `python scripts/prepare-images.py` (requires Pillow); full-resolution originals remain accessible from image previews. Image metadata and verified Pixiv links live in `src/media.ts`.
4. Add supplied music recordings, travel material, and one optional mini-game. Arcade content currently describes this planned addition explicitly.
5. Consider additional rooms, richer sprites, and persistent achievements after the first experience is reviewed.

Google Fonts is optional: system sans-serif fallbacks keep the site usable offline. Font Awesome and the prototype's eval-based snippet runner are not part of the production app.
