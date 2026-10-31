import { useState } from 'react';
import { roadmap, roadmapStatus } from '../roadmap';
import { links } from '../content';
import Icon from './Icon';
import WorldPlayer from './WorldPlayer';

const statusLabel = (status: string) => ({ Done: 'Done', Now: 'Building now', Next: 'Up next', Later: 'Queued' }[status] ?? status);
const slug = (status: string) => status.toLowerCase().replace(' ', '-');

// The roadmap as a staircase: seven blocks that rise from Level 1 to Level 7, each a button.
// Choosing a level fills it and every level below it: reaching a level means knowing what came before.
// The character from the room game stands on the level being built now. The chosen level opens
// below as its plan: the goal, what it focuses on, what it builds, and the paper it should produce.
export default function Roadmap() {
  const currentIndex = Math.max(0, roadmap.findIndex(level => level.status === 'Now'));
  const [selected, setSelected] = useState(currentIndex);
  const level = roadmap[selected];
  return <section id="roadmap" className="roadmap-section stair-roadmap" aria-labelledby="roadmap-title" data-chapter="Roadmap">
    <div className="section-bar"><div><h2 id="roadmap-title" className="code-title">Roadmap</h2></div><a href={links.github} target="_blank" rel="noreferrer" className="text-link"><Icon name="github"/>Follow along on GitHub</a></div>
    <p className="section-intro roadmap-intro">I'm building open-source medical AI in public, in seven stages: from trustworthy EHR data pipelines (Level 1) to safety research on frontier models (Level 7). Each stage ships repos with tested code, results with confidence intervals, and a paper. Pick a step to see what's in it.</p>

    <ol className="roadmap-stops stairs" aria-label="Roadmap levels">{roadmap.map((item, i) => <li key={item.level} style={{ '--step': i } as React.CSSProperties}>
      {i === currentIndex && <svg className="stair-player" viewBox="-14 -34 28 38" aria-hidden="true"><WorldPlayer position={{ x: 0, y: 0 }} paused decorative/></svg>}
      <button type="button" className={`roadmap-stop stair status-${slug(item.status)}${i === selected ? ' is-selected' : ''}${i < selected ? ' is-climbed' : ''}`} aria-pressed={i === selected} aria-controls="roadmap-log" onClick={() => setSelected(i)}>
        <span className="stair-number" aria-hidden="true">{item.level}</span>
        <span className="stair-theme"><span className="sr-only">Level {item.level}: </span>{item.theme}</span>
        <span className="stair-status" aria-hidden="true">{statusLabel(item.status)}</span>
      </button>
    </li>)}</ol>

    <article id="roadmap-log" className={`roadmap-log stair-plan status-${slug(level.status)}`} aria-live="polite">
      <div className="plan-lead">
        <p className="plan-kicker"><span className="plan-dot" aria-hidden="true"/>Level {level.level}, {statusLabel(level.status).toLowerCase()}</p>
        <h3>{level.theme}</h3>
        <p className="roadmap-goal">{level.goal}</p>
        <p className="plan-step">{selected === currentIndex ? `Now: ${roadmapStatus.step}` : selected > currentIndex ? `Starts after Level ${level.level - 1}.` : 'Shipped.'}</p>
        <ul className="plan-focus" aria-label="Focus">{level.focus.map(item => <li key={item}>{item}</li>)}</ul>
      </div>
      <div className="plan-detail">
        <h4>What it builds</h4>
        <ul className="plan-builds">{level.builds.map(build => <li key={build.name}><b>{build.name}</b><span>{build.summary}</span></li>)}</ul>
        <h4>Paper from this work</h4>
        <p className="roadmap-paper">{level.paper}</p>
        <div className="roadmap-log-nav"><button type="button" onClick={() => setSelected(selected - 1)} disabled={selected === 0}>← Down a level</button><button type="button" onClick={() => setSelected(selected + 1)} disabled={selected === roadmap.length - 1}>Up a level →</button></div>
      </div>
    </article>
  </section>;
}
