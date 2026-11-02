import { asset } from './content';

export const preview = (file: string) => asset(`optimized/${file.replace(/\.[^.]+$/, '.webp')}`);
export type Media = { file: string; title: string; alt: string; width: number; height: number; href?: string; noLink?: boolean };
export const artworks: Media[] = [
  { file: 'pro.png', width: 1080, height: 1350, title: 'Concept Code 02: Flora', alt: 'Black and white character illustration of Flora', href: 'https://www.pixiv.net/artworks/128093526' },
  { file: 'miku2.png', width: 2688, height: 2688, title: 'Hatsune Miku Fan Art', alt: 'Colorful Hatsune Miku illustration with turquoise hair', href: 'https://www.pixiv.net/artworks/116375366' },
  { file: 'minami.png', width: 1024, height: 1024, title: 'Concept Code 01: Minami', alt: 'Black and white close-up character illustration of Minami', href: 'https://www.pixiv.net/artworks/118904947' },
  { file: 'earth.png', width: 4096, height: 4096, title: 'Travel to the Future', alt: 'A figure looking toward a luminous planet above colorful clouds', href: 'https://www.pixiv.net/artworks/118752021' },
];
export const posters: Media[] = [
  { file: 'limits.png', width: 3648, height: 3168, title: 'Retinal imaging research poster', alt: 'Research poster on limits of fundus-based deep learning for Alzheimer\'s disease prediction, anatomical ablation and clinical benchmarking in UK Biobank' },
  { file: 'sweat.png', width: 4608, height: 3456, title: 'Sweat amino-acid research poster', alt: 'Research poster on an alternative skin analysis using sweat amino-acid content' },
];
// Charts inside a case study, each placed after the paragraph (0-based) whose claim it shows.
export const projectFigures: Record<string, { after: number; figure: Media }[]> = {
  ehrasof: [
    { after: 1, figure: { file: 'ehr-asof-leakage.png', width: 1300, height: 840, title: 'Mortality AUROC by prediction time, on synthetic data with a planted leak', alt: 'Line chart of mortality AUROC with 95% confidence intervals at 6, 12, 24 and 48 hours after admission. Reported stays near 1.0 throughout; honest and deployed start far lower, about 0.84 and 0.77 at 6 hours, and approach about 0.95 at 48 hours.' } },
    { after: 2, figure: { file: 'ehr-asof-scaling.png', width: 1500, height: 600, title: 'Throughput and p95 latency under load', alt: 'Throughput and p95 latency vs concurrent clients for 1, 2, 4 and 8 workers' } },
  ],
};
// These assets have no supplied project context. Preserve descriptive labels only.
export const visualArchive: Media[] = [
  { file: 'illus.png', width: 5740, height: 3280, title: 'Sketch', alt: 'White line drawing of a building and trees on black', noLink: true },
  { file: 'timeful.png', width: 1234, height: 415, title: 'From the visual archive', alt: 'Dark blue artwork with fine luminous lines' },
  { file: 'background.png', width: 2072, height: 2078, title: 'Original site background', alt: 'Abstract textured artwork in red, blue, green, and gold' },
];
