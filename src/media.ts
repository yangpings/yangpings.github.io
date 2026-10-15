import { asset } from './content';

export const preview = (file: string) => asset(`optimized/${file.replace(/\.[^.]+$/, '.webp')}`);
export type Media = { file: string; title: string; alt: string; width: number; height: number; href?: string };
export const artworks: Media[] = [
  { file: 'pro.png', width: 1080, height: 1350, title: 'Concept Code 02: Flora', alt: 'Black and white character illustration of Flora', href: 'https://www.pixiv.net/artworks/128093526' },
  { file: 'miku2.png', width: 2688, height: 2688, title: 'Hatsune Miku Fan Art', alt: 'Colorful Hatsune Miku illustration with turquoise hair', href: 'https://www.pixiv.net/artworks/116375366' },
  { file: 'minami.png', width: 1024, height: 1024, title: 'Concept Code 01: Minami', alt: 'Black and white close-up character illustration of Minami', href: 'https://www.pixiv.net/artworks/118904947' },
  { file: 'earth.png', width: 4096, height: 4096, title: 'Travel to the Future', alt: 'A figure looking toward a luminous planet above colorful clouds', href: 'https://www.pixiv.net/artworks/118752021' },
];
export const posters: Media[] = [
  { file: 'limits.png', width: 3648, height: 3168, title: 'Retinal imaging research poster', alt: 'Research poster on limits of fundus-based deep learning for Alzheimer’s disease prediction, anatomical ablation and clinical benchmarking in UK Biobank' },
  { file: 'sweat.png', width: 4608, height: 3456, title: 'Sweat amino-acid research poster', alt: 'Research poster on an alternative skin analysis using sweat amino-acid content' },
];
// These assets have no supplied project context. Preserve descriptive labels only.
export const visualArchive: Media[] = [
  { file: 'illus.png', width: 5740, height: 3280, title: 'Architectural illustration', alt: 'White line drawing of a building and trees on black' },
  { file: 'timeful.png', width: 1234, height: 415, title: 'From the visual archive', alt: 'Dark blue artwork with fine luminous lines' },
  { file: 'background.png', width: 2072, height: 2078, title: 'Original site background', alt: 'Abstract textured artwork in red, blue, green, and gold' },
];
