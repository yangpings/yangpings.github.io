import { research } from './content';

// Short names for the project index, sentence-case labels, and the poster each project has (if any).
// Full titles and descriptions stay in content.ts.
export type ProjectDisplay = { name: string; label: string; image?: string };

export const projectDisplay: Record<string, ProjectDisplay> = {
  llm: { name: 'Clinical LLM evaluation', label: 'AI research lab' },
  retina: { name: 'TIME AD', label: 'Vision lab', image: 'limits.png' },
  odir: { name: 'ODIR-5K', label: 'Computer vision project' },
  nlp: { name: 'Nicotine pouch discourse', label: 'NLP research' },
  sweat: { name: 'Sweat biomarkers', label: 'Biomarker research', image: 'sweat.png' },
  annie: { name: 'Project ANNIE', label: 'Upcoming research' },
};

export const displayFor = (id: string, title: string, category: string): ProjectDisplay => projectDisplay[id] ?? { name: title, label: category };

// The project after this one, wrapping round, for "Next project" in the case-study sheet.
export function nextProject(id: string) {
  const index = research.findIndex(entry => entry.id === id);
  return index < 0 ? undefined : research[(index + 1) % research.length];
}
