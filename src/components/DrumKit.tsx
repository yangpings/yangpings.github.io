import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useDrums, type Voice } from '../drumSynth';

// A drawn, playable drum kit. Every piece is a real button holding its own slice of one shared
// drawing (a 1000 × 620 stage), so the pieces line up exactly with the stands behind them and only
// the painted shapes take clicks. Pieces answer on pointer-down, with a hit animation and sound.
// The keys play the kit once it has focus. A small tape deck records a take and loops it.
const W = 1000, H = 620;

type Piece = {
  id: string; label: string; keys: string[]; cap: string; voice: Voice; pitch?: number;
  kind: 'cym' | 'drum' | 'kick'; box: [number, number, number, number]; chip: [number, number]; z: number; art: ReactNode;
};

function drum(cx: number, cy: number, rx: number, ry: number, h: number) {
  const lugs = [-.78, -.36, .1, .55];
  return <>
    <g className="kit-shake">
      <path className="kit-hit" d={`M${cx - rx},${cy} V${cy + h} A${rx},${ry} 0 0 0 ${cx + rx},${cy + h} V${cy} Z`} fill="url(#kit-shell)"/>
      <path d={`M${cx - rx},${cy + h * .5} A${rx},${ry} 0 0 0 ${cx + rx},${cy + h * .5}`} fill="none" stroke="#ffd0b8" strokeOpacity=".22" strokeWidth="2"/>
      {lugs.map(a => { const x = cx + rx * a, y = cy + ry * Math.sqrt(1 - a * a); return <g key={a}>
        <line x1={x} y1={y} x2={x} y2={y + h} stroke="#d9d4dc" strokeOpacity=".55" strokeWidth="1.5"/>
        <rect x={x - 4} y={y + h * .3} width="8" height={Math.max(10, h * .38)} rx="3" fill="url(#kit-chrome)"/>
      </g>; })}
      <path d={`M${cx - rx},${cy + h} A${rx},${ry} 0 0 0 ${cx + rx},${cy + h}`} fill="none" stroke="url(#kit-chrome)" strokeWidth="5"/>
    </g>
    <g className="kit-head">
      <ellipse className="kit-hit" cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#kit-skin)"/>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="url(#kit-chrome)" strokeWidth="5"/>
    </g>
    <ellipse className="kit-ring" cx={cx} cy={cy} rx={rx * .55} ry={ry * .55} fill="none" stroke="#fff7e6" strokeWidth="3"/>
  </>;
}

function cymbal(cx: number, cy: number, rx: number, ry: number) {
  return <g className="kit-swing">
    <ellipse cx={cx} cy={cy + 3} rx={rx} ry={ry} fill="#4a300c" opacity=".55"/>
    <ellipse className="kit-hit" cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#kit-bronze)"/>
    {[.86, .7, .54, .38].map(k => <ellipse key={k} cx={cx} cy={cy} rx={rx * k} ry={ry * k} fill="none" stroke="#fff3c4" strokeOpacity=".22" strokeWidth="1"/>)}
    <ellipse cx={cx} cy={cy - ry * .2} rx={rx * .16} ry={ry * .45} fill="url(#kit-bell)"/>
    <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="#ffe7a1" strokeOpacity=".55" strokeWidth="1.5"/>
    <ellipse className="kit-ring" cx={cx} cy={cy} rx={rx * .6} ry={ry * .6} fill="none" stroke="#fff3c4" strokeWidth="2.5"/>
  </g>;
}

function kick(cx: number, cy: number, r: number) {
  return <>
    <g className="kit-head">
      <circle className="kit-hit" cx={cx} cy={cy} r={r} fill="url(#kit-shell-round)"/>
      <circle cx={cx} cy={cy} r={r - 11} fill="url(#kit-reso)"/>
      <circle cx={cx} cy={cy} r={r - 11} fill="none" stroke="url(#kit-chrome)" strokeWidth="4"/>
      {Array.from({ length: 10 }, (_, i) => { const a = i / 10 * Math.PI * 2 + .3; return <rect key={i} x={cx + Math.cos(a) * (r - 5) - 4} y={cy + Math.sin(a) * (r - 5) - 7} width="8" height="14" rx="3"
        fill="url(#kit-chrome)" transform={`rotate(${a * 180 / Math.PI + 90} ${cx + Math.cos(a) * (r - 5)} ${cy + Math.sin(a) * (r - 5)})`}/>; })}
      <text x={cx} y={cy + 4} textAnchor="middle" className="kit-logo">EY</text>
      <text x={cx} y={cy + 38} textAnchor="middle" className="kit-logo-sub">WORLD.EXE</text>
      <circle cx={cx + r * .42} cy={cy + r * .42} r="17" fill="#12050a" stroke="url(#kit-chrome)" strokeWidth="3"/>
    </g>
    <circle className="kit-ring" cx={cx} cy={cy} r={r * .6} fill="none" stroke="#ffd078" strokeWidth="3"/>
  </>;
}

const PAD = 14;
const box = (x0: number, y0: number, x1: number, y1: number): [number, number, number, number] => [x0 - PAD, y0 - PAD, x1 - x0 + PAD * 2, y1 - y0 + PAD * 2];

const PIECES: Piece[] = [
  { id: 'crash', label: 'Crash', keys: ['y'], cap: 'Y', voice: 'crash', kind: 'cym', z: 1, box: box(132, 118, 368, 172), chip: [250, 172], art: cymbal(250, 145, 118, 22) },
  { id: 'ride', label: 'Ride', keys: ['u'], cap: 'U', voice: 'ride', kind: 'cym', z: 1, box: box(655, 145, 925, 205), chip: [790, 205], art: cymbal(790, 175, 135, 25) },
  { id: 'hihat', label: 'Hi-hat', keys: ['h'], cap: 'H', voice: 'hat', kind: 'cym', z: 2, box: box(32, 300, 208, 355), chip: [120, 356],
    art: <>{cymbal(120, 338, 88, 15)}<line x1="120" y1="300" x2="120" y2="324" stroke="url(#kit-chrome)" strokeWidth="4"/>{cymbal(120, 322, 88, 15)}</> },
  { id: 'kick', label: 'Kick', keys: [' ', 'b'], cap: 'Space', voice: 'kick', kind: 'kick', z: 2, box: box(360, 300, 640, 580), chip: [500, 548], art: kick(500, 440, 140) },
  { id: 'hightom', label: 'High tom', keys: ['t'], cap: 'T', voice: 'tom', pitch: 196, kind: 'drum', z: 3, box: box(368, 221, 492, 313), chip: [430, 238], art: drum(430, 238, 62, 17, 58) },
  { id: 'midtom', label: 'Mid tom', keys: ['g'], cap: 'G', voice: 'tom', pitch: 160, kind: 'drum', z: 3, box: box(504, 220, 636, 318), chip: [570, 238], art: drum(570, 238, 66, 18, 62) },
  { id: 'snare', label: 'Snare', keys: ['f'], cap: 'F', voice: 'snare', kind: 'drum', z: 4, box: box(193, 401, 377, 501), chip: [285, 425], art: drum(285, 425, 92, 24, 52) },
  { id: 'floortom', label: 'Floor tom', keys: ['j'], cap: 'J', voice: 'tom', pitch: 104, kind: 'drum', z: 4, box: box(637, 378, 833, 547), chip: [735, 405], art: drum(735, 405, 98, 27, 115) },
];
const LANE: Record<Piece['kind'], number> = { cym: 0, drum: 1, kick: 2 };
const MAX_TAKE = 8000;

type Hit = { t: number; id: string };

export default function DrumKit({ complete }: { complete: () => void }) {
  const { play, error } = useDrums();
  const kit = useRef<HTMLDivElement>(null);
  const els = useRef(new Map<string, HTMLButtonElement>());
  const played = useRef(new Set<string>());
  const [last, setLast] = useState<string | null>(null);
  const [hits, setHits] = useState(0);
  const [armed, setArmed] = useState(false);
  // The tape deck: idle, recording (from the first hit), or looping the last take.
  const [mode, setMode] = useState<'idle' | 'rec' | 'loop'>('idle');
  const [take, setTake] = useState<{ hits: Hit[]; len: number } | null>(null);
  const [recHits, setRecHits] = useState<Hit[]>([]);
  const [lap, setLap] = useState(0);
  const rec = useRef<{ start: number | null; hits: Hit[] }>({ start: null, hits: [] });
  const modeRef = useRef(mode); modeRef.current = mode;
  const timers = useRef<number[]>([]);
  const recTimer = useRef(0);
  const still = useRef(false);

  useEffect(() => {
    still.current = matchMedia('(prefers-reduced-motion: reduce)').matches;
    // A looping take stops when the tab is hidden, like the sequencer.
    const hide = () => { if (document.hidden && modeRef.current === 'loop') { timers.current.forEach(clearTimeout); timers.current = []; setMode('idle'); } };
    document.addEventListener('visibilitychange', hide);
    return () => { timers.current.forEach(clearTimeout); clearTimeout(recTimer.current); document.removeEventListener('visibilitychange', hide); };
  }, []);

  function animate(piece: Piece) {
    const el = els.current.get(piece.id); if (!el) return;
    el.animate([{ filter: 'brightness(1.45)' }, { filter: 'brightness(1)' }], { duration: 260, easing: 'ease-out' });
    if (still.current) return;
    const ring = el.querySelector('.kit-ring');
    ring?.animate([{ opacity: .85, transform: 'scale(.6)' }, { opacity: 0, transform: 'scale(1.7)' }], { duration: 520, easing: 'cubic-bezier(.23,1,.32,1)' });
    if (piece.kind === 'cym') {
      el.querySelector('.kit-swing')?.animate([
        { transform: 'rotate(0deg)' }, { transform: 'rotate(-7deg) translateY(4px)' }, { transform: 'rotate(4deg)' },
        { transform: 'rotate(-2deg)' }, { transform: 'rotate(1deg)' }, { transform: 'rotate(0deg)' },
      ], { duration: piece.id === 'hihat' ? 320 : 900, easing: 'ease-out' });
    } else if (piece.kind === 'kick') {
      el.querySelector('.kit-head')?.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.035)' }, { transform: 'scale(1)' }], { duration: 220, easing: 'ease-out' });
      kit.current?.querySelector('.kit-floor')?.animate([{ opacity: 1 }, { opacity: .45 }], { duration: 380, easing: 'ease-out' });
    } else {
      el.querySelector('.kit-head')?.animate([{ transform: 'translateY(0) scaleY(1)' }, { transform: 'translateY(3px) scaleY(.86)' }, { transform: 'translateY(0) scaleY(1)' }], { duration: 170, easing: 'ease-out' });
      el.querySelector('.kit-shake')?.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(2px)' }, { transform: 'translateY(0)' }], { duration: 170, easing: 'ease-out' });
    }
  }

  function strike(piece: Piece, fromTape = false) {
    play(piece.voice, piece.pitch);
    animate(piece);
    setLast(piece.label);
    if (fromTape) return;
    setHits(n => n + 1);
    played.current.add(piece.id); if (played.current.size >= 4) complete();
    if (modeRef.current === 'rec') {
      const now = performance.now();
      if (rec.current.start === null) { rec.current.start = now; recTimer.current = window.setTimeout(stopRecording, MAX_TAKE); setLap(l => l + 1); }
      const hit = { t: now - rec.current.start, id: piece.id };
      rec.current.hits.push(hit); setRecHits([...rec.current.hits]);
    }
  }

  function stopTape() { timers.current.forEach(clearTimeout); timers.current = []; }
  function loop(t: { hits: Hit[]; len: number }) {
    stopTape(); setMode('loop');
    const run = () => {
      setLap(l => l + 1);
      for (const h of t.hits) { const p = PIECES.find(x => x.id === h.id)!; timers.current.push(window.setTimeout(() => strike(p, true), h.t)); }
      timers.current.push(window.setTimeout(run, t.len));
    };
    run();
  }
  function startRecording() { stopTape(); rec.current = { start: null, hits: [] }; setRecHits([]); setMode('rec'); }
  function stopRecording() {
    clearTimeout(recTimer.current);
    const { start, hits: h } = rec.current;
    if (start === null || !h.length) { setMode('idle'); return; }
    // The take ends where the player stopped, or rounds up a beat past the last hit if they ran out of time.
    const len = Math.max(400, Math.min(MAX_TAKE, performance.now() - start));
    const t = { hits: h, len };
    setTake(t); loop(t);
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    const piece = PIECES.find(p => p.keys.includes(k));
    if (!piece) return;
    e.preventDefault();
    if (!e.repeat) strike(piece);
  }

  const shown = mode === 'rec' ? recHits : take?.hits ?? [];
  const len = mode === 'rec' ? MAX_TAKE : take?.len ?? MAX_TAKE;

  return <div className="kit" ref={kit} tabIndex={0} role="group" aria-label="Playable drum kit" onKeyDown={onKey}
    onFocus={() => setArmed(true)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setArmed(false); }}>
    <div className="kit-stage">
      <svg className="kit-back" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        <defs>
          <linearGradient id="kit-shell" x1="0" x2="1">
            <stop offset="0" stopColor="#3d0b17"/><stop offset=".16" stopColor="#a82c38"/><stop offset=".3" stopColor="#ff8f72"/>
            <stop offset=".4" stopColor="#e2584e"/><stop offset=".78" stopColor="#8f2231"/><stop offset="1" stopColor="#330913"/>
          </linearGradient>
          <radialGradient id="kit-shell-round" cx=".38" cy=".3" r=".8">
            <stop offset="0" stopColor="#ff8f72"/><stop offset=".45" stopColor="#c23b42"/><stop offset="1" stopColor="#4a0f1c"/>
          </radialGradient>
          <radialGradient id="kit-reso" cx=".4" cy=".35" r=".75">
            <stop offset="0" stopColor="#4a1a26"/><stop offset="1" stopColor="#1a0710"/>
          </radialGradient>
          <radialGradient id="kit-skin" cx=".42" cy=".35" r=".8">
            <stop offset="0" stopColor="#fffaf0"/><stop offset=".7" stopColor="#efe4d2"/><stop offset="1" stopColor="#cbbca6"/>
          </radialGradient>
          <linearGradient id="kit-chrome" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#ffffff"/><stop offset=".45" stopColor="#b9b3bf"/><stop offset=".55" stopColor="#6f6874"/><stop offset="1" stopColor="#d8d3dc"/>
          </linearGradient>
          <linearGradient id="kit-bronze" x1="0" x2="1" y1="0" y2=".4">
            <stop offset="0" stopColor="#7a4c12"/><stop offset=".32" stopColor="#f6cf73"/><stop offset=".5" stopColor="#d79b38"/><stop offset=".78" stopColor="#a96c1d"/><stop offset="1" stopColor="#5c3a0c"/>
          </linearGradient>
          <radialGradient id="kit-bell" cx=".4" cy=".3" r=".8"><stop offset="0" stopColor="#fff0b8"/><stop offset="1" stopColor="#b77d25"/></radialGradient>
          <radialGradient id="kit-light" cx=".5" cy=".42" r=".6"><stop offset="0" stopColor="#ff9c7a" stopOpacity=".28"/><stop offset="1" stopColor="#ff9c7a" stopOpacity="0"/></radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#kit-light)"/>
        <ellipse className="kit-floor" cx="500" cy="585" rx="470" ry="30" fill="#ff7868" fillOpacity=".16"/>
        <g stroke="url(#kit-chrome)" strokeLinecap="round" fill="none">
          {/* crash, ride and hi-hat stands with tripod legs */}
          <path d="M250 150 L232 525 M232 520 L180 584 M232 520 L284 584 M232 520 L234 590" strokeWidth="5"/>
          <path d="M790 180 L835 525 M835 520 L785 584 M835 520 L888 584 M835 520 L838 590" strokeWidth="5"/>
          <path d="M120 340 L120 530 M120 520 L70 584 M120 520 L170 584" strokeWidth="5"/>
          <path d="M102 578 L150 572" strokeWidth="9"/>
          {/* snare stand, floor-tom legs, kick spurs and the tom mount */}
          <path d="M285 500 L285 530 M285 528 L238 584 M285 528 L332 584" strokeWidth="5"/>
          <path d="M650 470 L636 584 M820 470 L834 584" strokeWidth="5"/>
          <path d="M392 520 L364 588 M608 520 L636 588" strokeWidth="5"/>
          <path d="M500 302 L500 282 M470 282 L530 282 M440 300 L470 282 M560 300 L530 282" strokeWidth="6"/>
        </g>
      </svg>
      {PIECES.map(p => {
        const [x, y, w, h] = p.box;
        return <button key={p.id} type="button" className={`kit-piece kit-${p.kind} rx${last === p.label ? ' is-last' : ''}`} ref={el => { if (el) els.current.set(p.id, el); else els.current.delete(p.id); }}
          style={{ left: `${x / W * 100}%`, top: `${y / H * 100}%`, width: `${w / W * 100}%`, height: `${h / H * 100}%`, zIndex: p.z }}
          aria-label={p.label} aria-keyshortcuts={p.cap === 'Space' ? 'Space' : p.cap}
          onPointerDown={e => { if (e.button !== 0) return; if (!kit.current?.contains(document.activeElement)) kit.current?.focus({ preventScroll: true }); strike(p); }}
          onClick={e => { if (e.detail === 0) strike(p); }}>
          <svg viewBox={`${x} ${y} ${w} ${h}`} aria-hidden="true">{p.art}</svg>
          <span className="kit-chip" style={{ left: `${(p.chip[0] - x) / w * 100}%`, top: `${(p.chip[1] - y) / h * 100}%` }} aria-hidden="true">
            <kbd>{p.cap}</kbd><span>{p.label}</span>
          </span>
        </button>;
      })}
      <p className={`kit-keys${armed ? ' is-on' : ''}`} aria-hidden="true">{armed ? 'Keyboard on' : 'Click the kit to play with your keys'}</p>
    </div>

    <div className="kit-deck">
      <div className="kit-deck-buttons">
        <button type="button" className={`rx kit-btn kit-rec${mode === 'rec' ? ' is-on' : ''}`} aria-pressed={mode === 'rec'} onClick={() => mode === 'rec' ? stopRecording() : startRecording()}>
          <i aria-hidden="true"/>{mode === 'rec' ? (recHits.length ? 'Stop & loop' : 'Waiting for a hit…') : 'Record a take'}
        </button>
        <button type="button" className="rx kit-btn" disabled={!take || mode === 'rec'} aria-pressed={mode === 'loop'} onClick={() => { if (mode === 'loop') { stopTape(); setMode('idle'); } else if (take) loop(take); }}>
          {mode === 'loop' ? 'Stop loop' : 'Play loop'}
        </button>
        <button type="button" className="rx kit-btn kit-btn-quiet" disabled={!take || mode === 'rec'} onClick={() => { stopTape(); setTake(null); setMode('idle'); }}>Clear</button>
      </div>
      <div className={`kit-tape is-${mode}`} aria-hidden="true">
        {[0, 1, 2].map(l => <span key={l} className="kit-lane"/>)}
        {shown.map((h, i) => { const p = PIECES.find(x => x.id === h.id)!; return <i key={i} className={`kit-dot lane-${LANE[p.kind]}`} style={{ '--x': Math.min(1, h.t / len) } as CSSProperties}/>; })}
        {mode !== 'idle' && (mode === 'loop' || recHits.length > 0) && <b key={lap} className="kit-head-line" style={{ animationDuration: `${len}ms` }}/>}
        {!shown.length && <em>{mode === 'rec' ? 'Recording starts on your first hit (up to 8 seconds)' : 'Record a take and it loops here'}</em>}
      </div>
    </div>
    <p role="status" className="activity-feedback kit-status">{error || (last ? `${last}${mode === 'loop' ? ' · looping your take' : mode === 'rec' && recHits.length ? ' · recording' : ''} · ${hits} ${hits === 1 ? 'hit' : 'hits'}` : 'Tap any drum or cymbal. On a keyboard: Y H T G U F J, and Space for the kick.')}</p>
  </div>;
}
