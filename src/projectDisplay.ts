import { openSource, research } from './content';

// Short names for the project index, sentence-case labels, and the poster each project has (if any).
// Full titles and descriptions stay in content.ts.
export type ProjectDisplay = { name: string; label: string; image?: string; chart?: boolean };

export const projectDisplay: Record<string, ProjectDisplay> = {
  llm: { name: 'Clinical LLM evaluation', label: 'AI research lab' },
  retina: { name: 'TIME AD', label: 'Vision lab', image: 'limits.png' },
  odir: { name: 'ODIR-5K', label: 'Computer vision project' },
  nlp: { name: 'Nicotine pouch discourse', label: 'NLP research' },
  sweat: { name: 'Sweat biomarkers', label: 'Biomarker research', image: 'sweat.png' },
  annie: { name: 'Project ANNIE', label: 'Upcoming research' },
  ehrasof: { name: 'ehr-asof', label: 'Clinical ML engineering', image: 'ehr-asof-leakage.png', chart: true },
  cohortdiff: { name: 'cohort-diff', label: 'Clinical data tooling' },
};

export const displayFor = (id: string, title: string, category: string): ProjectDisplay => projectDisplay[id] ?? { name: title, label: category };

// The project after this one in its own list, wrapping round, for "Next project" in the case-study sheet.
export function nextProject(id: string) {
  const list = [research, openSource].find(projects => projects.some(entry => entry.id === id));
  if (!list || list.length < 2) return undefined;
  return list[(list.findIndex(entry => entry.id === id) + 1) % list.length];
}
