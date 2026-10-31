import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

import WorldPlayer from './WorldPlayer';
import MapScenery from './MapScenery';
import useSectionMotion from '../useSectionMotion';
import { levelOrder, rooms, type Point } from '../world';

// An overworld map in the spirit of a platformer's level select: eight levels on a winding road
// across an island, from Home to the castle on the hill. The player hops along the road between
// levels; entering one opens its room. Visiting a level fills it in and lights the road ahead.
const levels = levelOrder.map(id => rooms.find(room => room.id === id)!);
const spots: Point[] = [
  { x: 95, y: 455 }, { x: 235, y: 365 }, { x: 375, y: 450 }, { x: 510, y: 350 },
  { x: 645, y: 445 }, { x: 775, y: 345 }, { x: 885, y: 440 }, { x: 832, y: 214 },
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
const SPEED = 300, TRAVEL_SPEED = 560;
// What each level is, at a glance: a name and an icon.
const names: Record<string, string> = { home: 'Home', library: 'Library', llm: 'AI lab', retina: 'Vision lab', art: 'Art studio', music: 'Music room', arcade: 'Arcade', travel: 'Travel' };
const icons: Record<string, ReactNode> = {
  home: <><path d="M14 30 32 16l18 14v20H14Z"/><path d="M27 50V38h10v12"/></>,
  library: <><path d="M14 18h12v32H14ZM26 18h10v32H26Z"/><path d="m38 20 9-2 6 31-9 2Z"/></>,
  llm: <><circle cx="18" cy="20" r="4"/><circle cx="46" cy="20" r="4"/><circle cx="32" cy="44" r="4"/><path d="M22 20h20M20 24l10 17M44 24 34 41"/></>,
  retina: <><path d="M8 32s9-14 24-14 24 14 24 14-9 14-24 14S8 32 8 32Z"/><circle cx="32" cy="32" r="7"/></>,
  art: <><path d="M44 12 52 20 28 44l-10 2 2-10Z"/><path d="M14 52c6 0 8-4 8-6"/></>,
  music: <><path d="M26 44V16l22-4v28"/><circle cx="20" cy="44" r="6"/><circle cx="42" cy="40" r="6"/></>,
  arcade: <><rect x="10" y="22" width="44" height="22" rx="11"/><path d="M20 28v10M15 33h10"/><circle cx="40" cy="30" r="2.5"/><circle cx="46" cy="36" r="2.5"/></>,
  travel: <><path d="M10 34 54 18l-12 28-9-10-10 6 2-11Z"/></>,
};
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
  const target = useRef<number | null>(null);
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
        if (forward || back) target.current = null;
        // A clicked level: keep hopping toward it, one stretch of road at a time.
        const goal = target.current;
        if (goal !== null && goal === atRef.current) target.current = null;
        const by = forward ? 1 : back ? -1 : goal !== null && goal !== atRef.current ? Math.sign(goal - atRef.current) : 0;
        const to = atRef.current + by;
        if (to !== atRef.current && to >= 0 && to < spots.length) { walk.current = { from: atRef.current, to, t: 0 }; setWalking(true); }
      }
      const step = walk.current;
      if (step) {
        const segment = Math.min(step.from, step.to);
        step.t = Math.min(1, step.t + (dt * (target.current !== null ? TRAVEL_SPEED : SPEED)) / lengths[segment]);
        const t = step.to > step.from ? step.t : 1 - step.t;
        setPosition(stand(along(segment, t)));
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

  // Clicking a level walks the player there along the road; clicking the level they stand on opens it.
  const goTo = (index: number) => {
    if (!walk.current && atRef.current === index) { target.current = null; onOpen(levels[index].id); return; }
    target.current = index; world.current?.focus({ preventScroll: true });
  };
  // The phone shortcut list jumps straight there and opens it.
  const jumpTo = (index: number) => { walk.current = null; target.current = null; setWalking(false); atRef.current = index; setAt(index); setPosition(stand(spots[index])); onOpen(levels[index].id); };

  return <section ref={section} id="world" className="world-section" aria-labelledby="world-title" data-chapter="World">
    <div className="section-bar"><div><h2 id="world-title" className="code-title">World.exe</h2></div></div>
    <div data-ui className="world-shell">
      <div className="world-head">
        <div className="world-progress">
          <ol className="hud-stamps world-segments" aria-label="Levels explored">{levels.map(level => <li key={level.id} className={visited.has(level.id) ? 'is-stamped' : undefined} style={{ '--room': level.color } as CSSProperties} title={names[level.id]}>
            <span className="sr-only">{names[level.id]}: {visited.has(level.id) ? 'explored' : 'not explored yet'}</span>
          </li>)}</ol>
          <span className="hud-count"><b>{visited.size}</b> of 8 explored<span className="sr-only"> · {visited.size} / 8 rooms explored</span></span>
        </div>
        <p className="world-keys" aria-hidden="true"><kbd>←</kbd><kbd>→</kbd> walk <span>·</span> <kbd>E</kbd> enter</p>
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
          {levels.map((level, i) => { const spot = spots[i]; const cleared = visited.has(level.id); return <g key={level.id} transform={`translate(${spot.x},${spot.y})`} className={`map-level${cleared ? ' is-cleared' : ''}${i === nextLevel ? ' is-next' : ''}${here?.id === level.id ? ' is-here' : ''}`} style={{ '--room': level.color } as CSSProperties}>
            {<>{i === nextLevel && <circle className="level-pulse" r="26"/>}
              <circle r="24" className="level-disc"/><g className="level-icon" transform="translate(-12 -12) scale(.375)">{icons[level.id]}</g>
              <g className="level-badge" transform="translate(19 15)"><circle r="10"/><text y="4" textAnchor="middle">{completed.has(level.id) ? '★' : i + 1}</text></g></>}
            <text y="48" textAnchor="middle" className="level-label">{names[level.id]}</text>
          </g>; })}
          <g transform="translate(560,128)"><path d="m-7-1 3 13h8l3-13Z" fill="#b38c6a"/><path d="M0-1v-18m0 11q-14-14-11-3Q-6-2 0-3m0-8q12-17 11-6Q8-7 0-7" stroke="#9ae7b3" strokeWidth="3.5" fill="none"/></g>
          <WorldPlayer position={position} paused={paused || !active || !walking}/>
          {here && <g className="press-e" transform={`translate(${position.x},${position.y - 48})`} aria-hidden="true">
            <rect x="-34" y="-14" width="68" height="24" rx="12"/><path d="M-5 10 0 16 5 10Z"/>
            <text y="3" textAnchor="middle">{active ? 'Press E' : 'Enter'}</text>
          </g>}
        </svg>
        {levels.map((level, i) => <button key={level.id} className={`room-hit level-hit ${here?.id === level.id ? 'nearby' : ''}`} style={{ left: `${(spots[i].x - 30) / 10}%`, top: `${(spots[i].y - 30) / 5.6}%`, width: '6%', height: '10.7%' }} data-here={here?.id === level.id ? 'true' : undefined} onClick={() => goTo(i)} aria-label={`Explore ${level.label}`}><span className="sr-only">Level {i + 1}: {level.label}{visited.has(level.id) ? ', cleared' : ''}</span></button>)}
        <button className="plant-hit" style={{ left: '54.6%', top: '17%' }} aria-label="Inspect the suspicious plant" onClick={() => onOpen('plant')}>?</button>
        {allClear && <p className="world-banner" role="status">World clear! Every level is done.</p>}
        {celebrate && <div className="world-confetti" aria-hidden="true">{confetti.map((piece, i) => <span key={i} style={{ left: `${piece.left}%`, animationDelay: `${piece.delay}s`, background: piece.color, '--spin': piece.spin } as CSSProperties}/>)}</div>}
      </div>
      <div className="world-dock">
        <div className="world-place" style={{ '--room': (here ?? levels[at]).color } as CSSProperties}>
          <span className="world-place-icon" aria-hidden="true"><svg viewBox="0 0 64 64">{icons[(here ?? levels[at]).id]}</svg></span>
          <span className="world-place-text"><small>{here ? `Level ${at + 1} of 8` : 'On the road'}</small><b aria-live="polite">{here ? names[here.id] : 'Walking…'}</b></span>
        </div>
        <div className="world-touch-controls" aria-label="Movement controls">{[{ label: 'Move left', key: 'a', dir: -1, d: 'M15 5 8 12l7 7' }, { label: 'Move right', key: 'd', dir: 1, d: 'm9 5 7 7-7 7' }].map(control => <button key={control.key} aria-label={control.label}
          onPointerDown={e => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); world.current?.focus(); keys.current.add(control.key); }} onPointerUp={() => keys.current.clear()} onPointerCancel={() => keys.current.clear()} onLostPointerCapture={() => keys.current.clear()}
          onClick={e => { if (e.detail === 0) { const to = Math.max(0, Math.min(spots.length - 1, atRef.current + control.dir)); atRef.current = to; setAt(to); setPosition(stand(spots[to])); } }}><svg viewBox="0 0 24 24" aria-hidden="true"><path d={control.d}/></svg></button>)}</div>
        <button className="world-enter" disabled={!here} onClick={() => { if (here) onOpen(here.id); }}>{here ? `Enter ${names[here.id]}` : 'Enter'}</button>
      </div>
    </div>
    <div className="mobile-room-directory" aria-label="Level shortcuts">{levels.map((level, i) => <button key={level.id} onClick={() => jumpTo(i)}>{i + 1}. {level.label}</button>)}</div>
  </section>;
}
