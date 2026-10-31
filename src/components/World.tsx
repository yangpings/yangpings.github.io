import { useEffect, useRef, useState, type CSSProperties } from 'react';

import WorldPlayer from './WorldPlayer';
import MapScenery from './MapScenery';
import useSectionMotion from '../useSectionMotion';
import { levelOrder, rooms, type Point } from '../world';

// An overworld map in the spirit of a platformer's level select: eight levels on a winding road
// across an island, from Home to the castle on the hill. The player hops along the road between
// levels; entering one opens its room. Visiting a level plants a flag and lights the road ahead.
const levels = levelOrder.map(id => rooms.find(room => room.id === id)!);
const spots: Point[] = [
  { x: 95, y: 455 }, { x: 235, y: 365 }, { x: 375, y: 450 }, { x: 510, y: 350 },
  { x: 645, y: 445 }, { x: 775, y: 345 }, { x: 885, y: 440 }, { x: 880, y: 185 },
];
// Each stretch of road bends: a quadratic curve with this control point.
const bends: Point[] = spots.slice(0, -1).map((a, i) => {
  const b = spots[i + 1];
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  return i === spots.length - 2 ? { x: mx + 90, y: my + 20 } : { x: mx, y: my + (i % 2 ? 45 : -45) };
});
const along = (i: number, t: number): Point => {
  const a = spots[i], c = bends[i], b = spots[i + 1], u = 1 - t;
  return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y };
};
const roadPath = (i: number) => `M${spots[i].x} ${spots[i].y}Q${bends[i].x} ${bends[i].y} ${spots[i + 1].x} ${spots[i + 1].y}`;
const lengths = spots.slice(0, -1).map((_, i) => { let total = 0, prev = along(i, 0); for (let k = 1; k <= 24; k++) { const next = along(i, k / 24); total += Math.hypot(next.x - prev.x, next.y - prev.y); prev = next; } return total; });
const confetti = Array.from({ length: 28 }, (_, i) => ({ left: (i * 37) % 100, delay: (i % 7) * .12, color: ['#ffd078', '#ff7868', '#fff1db', '#82cfff', '#9ae7b3'][i % 5], spin: i % 2 ? 1 : -1 }));
const SPEED = 300;
const stand = (p: Point): Point => ({ x: p.x, y: p.y - 12 });

export default function World({ onOpen, visited, paused, completed }: { completed: Set<string>; onOpen: (id: string) => void; visited: Set<string>; paused: boolean; artwork: string }) {
  const section = useSectionMotion('world');
  const [at, setAt] = useState(0);
  const [position, setPosition] = useState<Point>(stand(spots[0]));
  const [walking, setWalking] = useState(false);
  const [active, setActive] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const keys = useRef(new Set<string>());
  const walk = useRef<{ from: number; to: number; t: number } | null>(null);
  const atRef = useRef(0);
  const world = useRef<HTMLDivElement>(null);
  const here = walking ? undefined : levels[at];
  const nextLevel = levels.findIndex(level => !visited.has(level.id));
  const allClear = visited.size === levels.length;

  // Walking: hold a direction to hop to the next level (right / down) or the previous one (left / up).
  useEffect(() => {
    if (!active || paused) { keys.current.clear(); return; }
    let frame = 0, last = 0;
    const tick = (time: number) => {
      const dt = last ? Math.min((time - last) / 1000, .035) : 0;
      last = time;
      const held = keys.current;
      if (!walk.current) {
        const forward = held.has('d') || held.has('arrowright') || held.has('s') || held.has('arrowdown');
        const back = held.has('a') || held.has('arrowleft') || held.has('w') || held.has('arrowup');
        const to = atRef.current + (forward ? 1 : back ? -1 : 0);
        if (to !== atRef.current && to >= 0 && to < spots.length) { walk.current = { from: atRef.current, to, t: 0 }; setWalking(true); }
      }
      const step = walk.current;
      if (step) {
        const segment = Math.min(step.from, step.to);
        step.t = Math.min(1, step.t + (dt * SPEED) / lengths[segment]);
        const t = step.to > step.from ? step.t : 1 - step.t;
        const point = along(segment, t);
        setPosition(stand(point));
        if (step.t >= 1) { atRef.current = step.to; setAt(step.to); walk.current = null; setWalking(false); }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const clear = () => keys.current.clear();
    window.addEventListener('blur', clear);
    document.addEventListener('visibilitychange', clear);
    return () => { cancelAnimationFrame(frame); clear(); window.removeEventListener('blur', clear); document.removeEventListener('visibilitychange', clear); };
  }, [active, paused]);

  useEffect(() => {
    if (!allClear) return;
    setCelebrate(true);
    const done = window.setTimeout(() => setCelebrate(false), 4200);
    return () => window.clearTimeout(done);
  }, [allClear]);

  // Clicking a level jumps the player there and opens it.
  const jumpTo = (index: number) => { walk.current = null; setWalking(false); atRef.current = index; setAt(index); setPosition(stand(spots[index])); onOpen(levels[index].id); };

  return <section ref={section} id="world" className="world-section" aria-labelledby="world-title" data-chapter="World">
    <div className="section-bar"><div><h2 id="world-title" className="code-title">World.exe</h2></div></div>
    <div data-ui className="world-shell">
      <div className="world-toolbar game-hud">
        <ol className="hud-stamps" aria-label="Levels cleared">{levels.map(level => <li key={level.id} className={visited.has(level.id) ? 'is-stamped' : undefined} style={{ '--room': level.color } as CSSProperties} title={level.label}>
          <span className="sr-only">{level.label}: {visited.has(level.id) ? 'cleared' : 'not cleared yet'}</span>
        </li>)}</ol>
        <span className="hud-count">{visited.size} / 8 rooms explored</span>
        <button className="world-walk" onClick={() => world.current?.focus()}>Walk around</button>
      </div>
      <div ref={world} className={`world-stage map-stage ${active ? 'playing' : ''}`} tabIndex={0} role="group" aria-label="Interactive world. Use arrow keys or WASD to walk between levels, E or Enter to play a level, Escape to release controls. Or select any level button."
        onFocus={() => setActive(true)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) { setActive(false); keys.current.clear(); } }}
        onKeyDown={e => {
          if (paused || e.target !== e.currentTarget) return;
          const key = e.key.toLowerCase();
          if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) { e.preventDefault(); keys.current.add(key); }
          if ((key === 'e' || key === 'enter') && here && !e.repeat) { e.preventDefault(); onOpen(here.id); }
          if (key === 'escape') { keys.current.clear(); world.current?.blur(); }
        }} onKeyUp={e => keys.current.delete(e.key.toLowerCase())}>
        <svg viewBox="0 0 1000 560" role="img" aria-label="An island map with eight levels on a winding road, from Home to a castle on a hill" className="world-art map-art">
          <MapScenery allClear={allClear}/>
          {/* The road: dark bed, then dashes; stretches after a cleared level glow solid gold. */}
          {spots.slice(0, -1).map((_, i) => <g key={i}>
            <path d={roadPath(i)} fill="none" stroke="#1c0910" strokeWidth="16" strokeLinecap="round"/>
            <path d={roadPath(i)} fill="none" className={`map-road${visited.has(levels[i].id) ? ' is-lit' : ''}`} strokeWidth="5" strokeLinecap="round"/>
          </g>)}
          {/* Levels. */}
          {levels.map((level, i) => { const spot = spots[i]; const cleared = visited.has(level.id); const castle = i === levels.length - 1; return <g key={level.id} transform={`translate(${spot.x},${spot.y})`} className={`map-level${cleared ? ' is-cleared' : ''}${i === nextLevel ? ' is-next' : ''}${here?.id === level.id ? ' is-here' : ''}`} style={{ '--room': level.color } as CSSProperties}>
            {!castle && <><ellipse cy="8" rx="30" ry="10" fill="#120509" opacity=".6"/>{i === nextLevel && <circle className="level-pulse" r="26"/>}
              <circle r="22" className="level-disc"/><text y="7" textAnchor="middle" className="level-number">{completed.has(level.id) ? '★' : i + 1}</text></>}
            {castle && <>{i === nextLevel && <circle className="level-pulse" r="28"/>}<circle r="16" className="level-disc"/><text y="6" textAnchor="middle" className="level-number">8</text></>}
            {cleared && !castle && <g className="level-flag" transform="translate(16,-14)"><path d="M0 0v-30" stroke="#fff1db" strokeWidth="2.5"/><path d="M1.5-30h18l-5 6 5 6h-18Z" fill="#ffd078"/></g>}
            <text y={castle ? 34 : 46} textAnchor="middle" className="level-label">{level.label.split(' / ')[0]}</text>
          </g>; })}
          <g transform="translate(560,128)"><path d="m-7-1 3 13h8l3-13Z" fill="#b38c6a"/><path d="M0-1v-18m0 11q-14-14-11-3Q-6-2 0-3m0-8q12-17 11-6Q8-7 0-7" stroke="#9ae7b3" strokeWidth="3.5" fill="none"/></g>
          <WorldPlayer position={position} paused={paused || !active || !walking}/>
          {here && <g className="press-e" transform={`translate(${position.x},${position.y - 48})`} aria-hidden="true">
            <rect x="-34" y="-14" width="68" height="24" rx="12"/><path d="M-5 10 0 16 5 10Z"/>
            <text y="3" textAnchor="middle">{active ? 'Press E' : 'Enter'}</text>
          </g>}
        </svg>
        {levels.map((level, i) => <button key={level.id} className={`room-hit level-hit ${here?.id === level.id ? 'nearby' : ''}`} style={{ left: `${(spots[i].x - 30) / 10}%`, top: `${(spots[i].y - 30) / 5.6}%`, width: '6%', height: '10.7%' }} onClick={() => jumpTo(i)} aria-label={`Explore ${level.label}`}><span className="sr-only">Level {i + 1}: {level.label}{visited.has(level.id) ? ', cleared' : ''}</span></button>)}
        <button className="plant-hit" style={{ left: '54.6%', top: '17%' }} aria-label="Inspect the suspicious plant" onClick={() => onOpen('plant')}>?</button>
        {allClear && <p className="world-banner" role="status">World clear! Every level is done.</p>}
        {celebrate && <div className="world-confetti" aria-hidden="true">{confetti.map((piece, i) => <span key={i} style={{ left: `${piece.left}%`, animationDelay: `${piece.delay}s`, background: piece.color, '--spin': piece.spin } as CSSProperties}/>)}</div>}
      </div>
      <div className="world-bottom"><div className="world-control-copy"><span><kbd>←</kbd> <kbd>→</kbd> or <kbd>WASD</kbd> to walk · <kbd>E</kbd> to play</span><span aria-live="polite">{here ? here.label : 'On the road…'}</span></div>
        <div className="world-touch-controls" aria-label="Movement controls">{[{ label: 'Move up', key: 'w', icon: '↑', dir: -1 }, { label: 'Move left', key: 'a', icon: '←', dir: -1 }, { label: 'Move down', key: 's', icon: '↓', dir: 1 }, { label: 'Move right', key: 'd', icon: '→', dir: 1 }].map(control => <button key={control.key} aria-label={control.label}
          onPointerDown={e => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); world.current?.focus(); keys.current.add(control.key); }} onPointerUp={() => keys.current.clear()} onPointerCancel={() => keys.current.clear()} onLostPointerCapture={() => keys.current.clear()}
          onClick={e => { if (e.detail === 0) { const to = Math.max(0, Math.min(spots.length - 1, atRef.current + control.dir)); atRef.current = to; setAt(to); setPosition(stand(spots[to])); } }}>{control.icon}</button>)}</div>
        <button className="world-enter" disabled={!here} onClick={() => { if (here) onOpen(here.id); }}>Play level</button></div>
    </div>
    <div className="mobile-room-directory" aria-label="Level shortcuts">{levels.map((level, i) => <button key={level.id} onClick={() => jumpTo(i)}>{i + 1}. {level.label}</button>)}</div>
  </section>;
}
