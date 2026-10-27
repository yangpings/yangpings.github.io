import { useState } from 'react';
import { roadmap, roadmapStatus } from '../roadmap';
import { links } from '../content';
import Icon from './Icon';
import WorldPlayer from './WorldPlayer';

// Trail stops in a 1000 × 520 map, climbing from the base camp (Level 1) to the summit (Level 7).
const stops = [{ x: 130, y: 470 }, { x: 300, y: 440 }, { x: 500, y: 400 }, { x: 700, y: 340 }, { x: 590, y: 265 }, { x: 420, y: 190 }, { x: 540, y: 78 }];
const trail = stops.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join(' ');
const statusLabel = (status: string) => ({ Now: 'Building now', Next: 'Up next', Later: 'Queued' }[status] ?? status);
const slug = (status: string) => status.toLowerCase().replace(' ', '-');

export default function Roadmap() {
  const currentIndex = Math.max(0, roadmap.findIndex(level => level.status === 'Now'));
  const [selected, setSelected] = useState(currentIndex);
  const level = roadmap[selected];
  const here = stops[currentIndex];
  return <section id="roadmap" className="roadmap-section" aria-labelledby="roadmap-title">
    <div className="section-bar"><div><span className="eyebrow">05 / WHAT I’M BUILDING</span><h2 id="roadmap-title">Roadmap.</h2></div><a href={links.github} target="_blank" rel="noreferrer" className="text-link"><Icon name="github"/>Follow along on GitHub ↗</a></div>
    <p className="section-intro roadmap-intro">I’m building open-source medical AI in public, in seven stages: from trustworthy EHR data pipelines (Level 1) to safety research on frontier models (Level 7). Each stage ships repos with tested code, results with confidence intervals, and a paper. Pick a stop to see what’s in it.</p>
    <div className="roadmap-climb">
      <div className="roadmap-map">
        <svg className="roadmap-art" viewBox="0 0 1000 520" role="img" aria-label={`A mountain trail with seven stops. Eric is at Level ${roadmap[currentIndex].level}; the summit is Level 7.`}>
          <defs><linearGradient id="roadmap-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1a1030"/><stop offset="1" stopColor="#3c1426"/></linearGradient></defs>
          <rect width="1000" height="520" fill="url(#roadmap-sky)"/>
          <g fill="#fff0d7">{[[80, 60], [190, 120], [300, 40], [760, 70], [880, 140], [930, 40], [660, 30], [120, 210], [850, 250]].map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width="4" height="4" opacity=".7"/>)}</g>
          <path d="M0 520V430l70-20 40-40 60 10 60-50 50 20 70-70 20 10V520Z" fill="#2a1830"/>
          <path d="M1000 520V420l-60-30-50 20-70-80-40 20-50-50-20 10V520Z" fill="#2a1830"/>
          <path d="M30 520 120 470 160 476 230 420 270 428 330 360 370 368 430 280 450 288 500 170 520 176 540 40 560 176 580 168 650 290 670 282 760 380 800 372 880 450 920 446 980 520Z" fill="#5c1e2c" stroke="#8e342d" strokeWidth="4" strokeLinejoin="bevel"/>
          <path d="M516 110 540 40 564 110 552 102 540 116 528 102Z" fill="#fff0d7"/>
          <g className="roadmap-clouds" fill="#b0bbd5"><path d="M300 225h90v-14h40v-12h70v12h30v14h90v16H300Z" opacity=".35"/><path d="M560 160h70v-12h50v12h60v14H560Z" opacity=".3"/><path d="M250 150h60v-10h40v10h40v12H250Z" opacity=".25"/></g>
          <path d={trail} fill="none" stroke="#160912" strokeWidth="12" strokeLinejoin="round" strokeLinecap="round"/>
          <path d={trail} fill="none" stroke="#ffd078" strokeWidth="4" strokeDasharray="2 14" strokeLinecap="round" opacity=".8"/>
          <g transform={`translate(${stops[6].x} ${stops[6].y - 22})`}><path d="M0 0V-46" stroke="#fff0d7" strokeWidth="4"/><path d="M2-46h34l-8 10 8 10H2Z" fill="#ff7868"/></g>
          <g transform={`translate(${here.x - 66} ${here.y + 6}) scale(1.6)`}><WorldPlayer position={{ x: 0, y: 0 }} paused decorative/></g>
        </svg>
        <ol className="roadmap-stops" aria-label="Roadmap levels">{roadmap.map((item, i) => <li key={item.level} style={{ left: `${stops[i].x / 10}%`, top: `${stops[i].y / 5.2}%` }}>
          <button type="button" className={`roadmap-stop status-${slug(item.status)}${i === selected ? ' is-selected' : ''}`} aria-pressed={i === selected} aria-controls="roadmap-log" onClick={() => setSelected(i)}>
            <span className="roadmap-stop-number" aria-hidden="true">{item.level}</span><span className="roadmap-stop-label"><span className="sr-only">Level {item.level}: </span>{item.theme}</span>
          </button>
        </li>)}</ol>
      </div>
      <article id="roadmap-log" className={`roadmap-log status-${slug(level.status)}`} aria-live="polite">
        <div className="roadmap-log-top"><span className="roadmap-badge">Level {level.level} · {statusLabel(level.status)}</span><span className="roadmap-log-step">{selected === currentIndex ? `Now: ${roadmapStatus.step}` : selected > currentIndex ? `Starts after Level ${level.level - 1}` : 'Shipped'}</span></div>
        <h3>{level.theme}</h3>
        <p className="roadmap-goal">{level.goal}</p>
        <div className="tags">{level.focus.map(item => <span key={item}>{item}</span>)}</div>
        <h4>Builds</h4>
        <ul>{level.builds.map(build => <li key={build.name}><code>{build.name}</code> {build.summary}</li>)}</ul>
        <p className="roadmap-paper"><b>Paper from this work:</b> {level.paper}</p>
        <div className="roadmap-log-nav"><button type="button" onClick={() => setSelected(selected - 1)} disabled={selected === 0}>← Down a level</button><button type="button" onClick={() => setSelected(selected + 1)} disabled={selected === roadmap.length - 1}>Up a level →</button></div>
      </article>
    </div>
  </section>;
}
