import { useRef, useState, type KeyboardEvent } from 'react';
import { openSource, research } from '../content';
import ProjectIndex from './ProjectIndex';

const tabs = [
  { id: 'research', label: 'Research', projects: research },
  { id: 'open-source', label: 'Open source', projects: openSource },
];

// One Projects section with two lists, using the same tab pattern as ExperienceTabs. Both panels
// always exist so each tab's aria-controls has a target; only the active one renders its cards,
// so the page is only as long as the list being read. Arrow keys move between tabs.
export default function ProjectTabs({ onOpen }: { onOpen: (id: string) => void }) {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (event: KeyboardEvent) => {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (active + step + tabs.length) % tabs.length;
    setActive(next);
    buttons.current[next]?.focus();
  };
  return <div className="project-tabs">
    <div className="exp-tablist" role="tablist" aria-label="Choose a project list" onKeyDown={onKey}>
      {tabs.map((tab, i) => <button key={tab.id} ref={el => { buttons.current[i] = el; }} role="tab" id={`project-tab-${tab.id}`} aria-controls={`project-panel-${tab.id}`}
        aria-selected={active === i} tabIndex={active === i ? 0 : -1} className="exp-tab" onClick={() => setActive(i)}>{tab.label} ({tab.projects.length})</button>)}
    </div>
    {tabs.map((tab, i) => <div key={tab.id} role="tabpanel" id={`project-panel-${tab.id}`} aria-labelledby={`project-tab-${tab.id}`} hidden={active !== i} className="exp-tabpanel">
      {active === i && <ProjectIndex projects={tab.projects} onOpen={onOpen}/>}
    </div>)}
  </div>;
}
