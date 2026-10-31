import { useRef, useState, type KeyboardEvent } from 'react';
import { PositionTimeline, ProjectTimeline } from './Background';

const tabs = [
  { id: 'positions', label: 'Research and work experience', Panel: PositionTimeline },
  { id: 'projects', label: 'Project timeline', Panel: ProjectTimeline },
];

// The two ledgers share one place: tabs switch between them. Both stay mounted (the hidden one is
// only hidden), so each keeps its own filter. Arrow keys move between tabs.
export default function ExperienceTabs() {
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
  return <section className="exp-tabs" aria-label="Experience and projects">
    <div className="exp-tablist" role="tablist" aria-label="Choose a timeline" onKeyDown={onKey}>
      {tabs.map((tab, i) => <button key={tab.id} ref={el => { buttons.current[i] = el; }} role="tab" id={`exp-tab-${tab.id}`} aria-controls={`exp-panel-${tab.id}`}
        aria-selected={active === i} tabIndex={active === i ? 0 : -1} className="exp-tab" onClick={() => setActive(i)}>{tab.label}</button>)}
    </div>
    {tabs.map(({ id, Panel }, i) => <div key={id} role="tabpanel" id={`exp-panel-${id}`} aria-labelledby={`exp-tab-${id}`} hidden={active !== i} className="exp-tabpanel">
      <Panel/>
    </div>)}
  </section>;
}
