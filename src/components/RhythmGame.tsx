import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useSound } from './SoundCorners';
import { useDrums } from '../drumSynth';

// A four-lane rhythm game on a neon highway that runs into a synthwave sunset. The whole scene is
// drawn on one canvas each frame (sky, sun, scrolling grid floor, the highway, beat lines, notes,
// hit sparks), so React only re-renders when a note is judged. A synthesized track plays while
// notes fall toward the hit line; D F J K or the lane pads strike them. Every hit is judged on the
// same clock as the chart: Perfect, Great, Good or Miss, with combo, accuracy and a final grade.
const BEAT = 500;            // 120 BPM
const LEAD = 1700;           // how long a note is visible before it reaches the line
const WINDOWS = { perfect: 45, great: 90, good: 140 };
type Note = { time: number; lane: number };
type Judgement = 'Perfect' | 'Great' | 'Good' | 'Miss';

// Eight bars: steady quarters, then eighths, a chord, a run, and a finish.
const pattern: [number, number[]][] = [
  [0, [0]], [1, [1]], [2, [2]], [3, [3]], [4, [1]], [5, [2]], [6, [0]], [7, [3]],
  [8, [0]], [8.5, [1]], [9, [2]], [9.5, [3]], [10, [2]], [10.5, [1]], [11, [0, 3]],
  [12, [1]], [13, [2]], [13.5, [2]], [14, [1]], [15, [0, 3]],
  [16, [0]], [16.5, [1]], [17, [2]], [17.5, [3]], [18, [3]], [18.5, [2]], [19, [1]], [19.5, [0]],
  [20, [1, 2]], [21, [0]], [21.5, [3]], [22, [0]], [22.5, [3]], [23, [1, 2]],
  [24, [0]], [24.5, [1]], [25, [2]], [25.5, [3]], [26, [0, 2]], [27, [1, 3]], [28, [0, 1, 2, 3]],
];
export const chart: Note[] = pattern.flatMap(([beat, lanes]) => lanes.map(lane => ({ time: 2000 + beat * BEAT, lane })));
const END = chart[chart.length - 1].time + 900;
const bass = [110, 110, 146.83, 130.81, 98, 98, 130.81, 146.83];
const keys = ['D', 'F', 'J', 'K'];
const COLORS = ['#ff7868', '#ffd078', '#82cfff', '#9ae7b3'];
const BEST_KEY = 'rhythm-best-v1';

function judge(diff: number): Judgement | null {
  const d = Math.abs(diff);
  return d <= WINDOWS.perfect ? 'Perfect' : d <= WINDOWS.great ? 'Great' : d <= WINDOWS.good ? 'Good' : null;
}
const credit: Record<Judgement, number> = { Perfect: 1, Great: .75, Good: .5, Miss: 0 };
const grade = (acc: number) => acc >= .95 ? 'S' : acc >= .85 ? 'A' : acc >= .7 ? 'B' : acc >= .5 ? 'C' : 'D';
const readBest = () => { try { const v = JSON.parse(localStorage.getItem(BEST_KEY) ?? 'null'); return v && typeof v.score === 'number' ? v as { score: number; grade: string } : null; } catch { return null; } };

// ---------- the scene ----------
type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number; color: string; size: number };
type Ring = { lane: number; born: number; color: string };
const D = 2.4, ZF = 9, ZNEAR = -.9;
const scale = (z: number) => 1 / (1 + z / D);

function noteSprite(color: string) {
  const c = document.createElement('canvas'); c.width = 160; c.height = 56;
  const g = c.getContext('2d')!;
  g.shadowColor = color; g.shadowBlur = 16;
  const grad = g.createLinearGradient(0, 14, 0, 42); grad.addColorStop(0, '#ffffff'); grad.addColorStop(.35, color); grad.addColorStop(1, color);
  g.fillStyle = grad; g.beginPath(); g.roundRect(18, 16, 124, 24, 12); g.fill();
  g.shadowBlur = 0; g.fillStyle = '#ffffffb0'; g.beginPath(); g.roundRect(30, 19, 100, 5, 3); g.fill();
  return c;
}

export default function RhythmGame({ complete }: { complete: () => void }) {
  const { sound } = useSound();
  const drums = useDrums();
  const callbacks = useRef({ complete, sound, drums }); callbacks.current = { complete, sound, drums };
  const controls = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const bar = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready');
  const [stats, setStats] = useState({ score: 0, combo: 0, best: 0, judged: 0, credit: 0, counts: { Perfect: 0, Great: 0, Good: 0, Miss: 0 } as Record<Judgement, number> });
  const [pop, setPop] = useState<{ id: number; text: Judgement; lane: number } | null>(null);
  const [pressed, setPressed] = useState<number | null>(null);
  const [record, setRecord] = useState(readBest);
  const [newBest, setNewBest] = useState(false);
  const start = useRef(0), beat = useRef(-1), judged = useRef(new Set<number>()), live = useRef(stats), seq = useRef(0);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const phaseRef = useRef(phase); phaseRef.current = phase;
  // Scene state the canvas reads every frame.
  const fx = useRef({ press: [-1e9, -1e9, -1e9, -1e9], miss: [-1e9, -1e9, -1e9, -1e9], sparks: [] as Spark[], rings: [] as Ring[], pulse: -1e9, milestone: { at: -1e9, n: 0 } });
  const still = useRef(false);
  const sprites = useRef<HTMLCanvasElement[]>([]);
  const bg = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => () => clearTimeout(pressTimer.current), []);

  function now() { return performance.now() - start.current; }

  function burst(lane: number, kind: Judgement) {
    const c = canvas.current; if (!c) return;
    const g = geometry(c);
    const x = g.cx + (lane - 1.5) * g.laneW, y = g.hitY;
    const color = kind === 'Perfect' ? '#fff3c4' : COLORS[lane];
    const n = still.current ? 6 : kind === 'Perfect' ? 26 : 16;
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (Math.random() - .5) * Math.PI * 1.1, v = (.25 + Math.random() * .55) * g.laneW / 60;
      fx.current.sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: 380 + Math.random() * 320, color: Math.random() < .35 ? '#ffffff' : color, size: 1.5 + Math.random() * 2.5 });
    }
    fx.current.rings.push({ lane, born: now(), color });
  }

  function recordHit(kind: Judgement, lane: number) {
    const s = live.current;
    const combo = kind === 'Miss' ? 0 : s.combo + 1;
    const next = { score: s.score + Math.round(credit[kind] * 100 * (1 + Math.min(combo, 50) / 50)), combo, best: Math.max(s.best, combo), judged: s.judged + 1,
      credit: s.credit + credit[kind], counts: { ...s.counts, [kind]: s.counts[kind] + 1 } };
    live.current = next; setStats(next);
    const id = ++seq.current;
    setPop({ id, text: kind, lane });
    if (kind === 'Miss') fx.current.miss[lane] = now();
    else { burst(lane, kind); if (combo > 0 && combo % 10 === 0) fx.current.milestone = { at: now(), n: combo }; }
  }

  function begin() {
    judged.current.clear(); beat.current = -1;
    live.current = { score: 0, combo: 0, best: 0, judged: 0, credit: 0, counts: { Perfect: 0, Great: 0, Good: 0, Miss: 0 } };
    fx.current.sparks = []; fx.current.rings = []; fx.current.milestone = { at: -1e9, n: 0 };
    setStats(live.current); setPop(null); setNewBest(false);
    start.current = performance.now(); setPhase('playing');
    controls.current?.focus({ preventScroll: true });
  }

  // ---------- drawing ----------
  function geometry(c: HTMLCanvasElement) {
    const W = c.width, H = c.height;
    const laneW = W < 560 * (c.width / c.clientWidth || 1) ? W * .2 : Math.min(W * .14, H * .23);
    return { W, H, cx: W / 2, hor: H * .34, hitY: H * .8, laneW };
  }

  function paintBackdrop(c: HTMLCanvasElement) {
    const off = bg.current ?? document.createElement('canvas'); bg.current = off;
    off.width = c.width; off.height = c.height;
    const ctx = off.getContext('2d')!;
    const { W, H, cx, hor } = geometry(c);
    const sky = ctx.createLinearGradient(0, 0, 0, hor);
    sky.addColorStop(0, '#12040b'); sky.addColorStop(.55, '#3d0d27'); sky.addColorStop(1, '#a8304a');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, hor + 1);
    for (let i = 0; i < 40; i++) { // a few fixed stars
      const sx = (i * 997 % 1000) / 1000 * W, sy = (i * 613 % 1000) / 1000 * hor * .7;
      ctx.fillStyle = `rgba(255,241,219,${.15 + (i % 5) * .08})`; ctx.fillRect(sx, sy, 1.5, 1.5);
    }
    const R = H * .2;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, hor); ctx.clip();
    const glow = ctx.createRadialGradient(cx, hor, R * .6, cx, hor, R * 2.4);
    glow.addColorStop(0, 'rgba(255,140,110,.35)'); glow.addColorStop(1, 'rgba(255,140,110,0)');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, W, hor);
    const sun = ctx.createLinearGradient(0, hor - R, 0, hor);
    sun.addColorStop(0, '#ffe39a'); sun.addColorStop(.5, '#ffa36b'); sun.addColorStop(1, '#ff5d73');
    ctx.fillStyle = sun; ctx.beginPath(); ctx.arc(cx, hor, R, Math.PI, 0); ctx.fill();
    ctx.fillStyle = sky; // stripes cut through the lower half of the sun
    for (let i = 0; i < 6; i++) { const y = hor - R * .5 + i * R * .1, h = 1 + i * R * .016; ctx.fillRect(cx - R, y, R * 2, h); }
    ctx.restore();
    // Two layers of low hills on the horizon.
    for (const [k, col] of [[.09, '#2a0a1d'], [.05, '#1a0612']] as const) {
      ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, hor);
      for (let x = 0; x <= W; x += W / 24) ctx.lineTo(x, hor - H * k * (.45 + .55 * Math.abs(Math.sin(x / W * 7.3 + k * 40))));
      ctx.lineTo(W, hor); ctx.closePath(); ctx.fill();
    }

    const floor = ctx.createLinearGradient(0, hor, 0, H);
    floor.addColorStop(0, '#2a0819'); floor.addColorStop(1, '#0c0207');
    ctx.fillStyle = floor; ctx.fillRect(0, hor, W, H - hor);
  }

  function draw(t: number, playing: boolean) {
    const c = canvas.current; if (!c || !c.width) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    const { W, H, cx, hor, hitY, laneW } = geometry(c);
    const X = (x: number, z: number) => cx + x * laneW * scale(z);
    const Y = (z: number) => hor + (hitY - hor) * scale(z);
    const beatPhase = playing ? ((t % BEAT) + BEAT) % BEAT / BEAT : 0;
    const thump = playing && t < END ? Math.pow(1 - beatPhase, 3) : 0;
    const age = (stamp: number) => playing ? t - stamp : 1e9;

    // The sky, sun and hills are drawn once per size; only the sun's glow pulses with the beat.
    if (bg.current) ctx.drawImage(bg.current, 0, 0);
    if (thump > .02) {
      const R = H * .2;
      const glow = ctx.createRadialGradient(cx, hor, R * .8, cx, hor, R * 2);
      glow.addColorStop(0, `rgba(255,150,110,${thump * .22})`); glow.addColorStop(1, 'rgba(255,150,110,0)');
      ctx.fillStyle = glow; ctx.fillRect(cx - R * 2, hor - R * 2, R * 4, R * 2);
    }

    // Floor and its scrolling grid.
    ctx.lineWidth = Math.max(1, W / 900);
    const travel = playing ? t / BEAT : 0;
    for (let k = 0; k < 26; k++) {
      const z = k * .7 - (travel * .7 % .7) + ZNEAR;
      if (z < ZNEAR) continue;
      const y = Y(z); ctx.strokeStyle = `rgba(255,93,143,${.42 * scale(z)})`;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(255,93,143,.22)';
    for (let x = -14; x <= 14; x++) { ctx.beginPath(); ctx.moveTo(X(x, ZNEAR - 1.4), Y(ZNEAR - 1.4)); ctx.lineTo(X(x, 60), Y(60)); ctx.stroke(); }

    // The highway.
    ctx.fillStyle = 'rgba(14,3,9,.88)';
    ctx.beginPath(); ctx.moveTo(X(-2, ZNEAR), Y(ZNEAR)); ctx.lineTo(X(2, ZNEAR), Y(ZNEAR)); ctx.lineTo(X(2, ZF), Y(ZF)); ctx.lineTo(X(-2, ZF), Y(ZF)); ctx.closePath(); ctx.fill();
    // Lane beams: a press lights its lane; a miss flashes it red.
    for (let lane = 0; lane < 4; lane++) {
      const pressAge = age(fx.current.press[lane]), missAge = age(fx.current.miss[lane]);
      const a = Math.max(0, 1 - pressAge / 180) * .5, m = Math.max(0, 1 - missAge / 260) * .35;
      if (a <= 0 && m <= 0) continue;
      const x0 = lane - 2, x1 = lane - 1;
      const beam = ctx.createLinearGradient(0, Y(0), 0, Y(ZF * .7));
      const col = m > a ? '255,60,80' : hexRgb(COLORS[lane]);
      beam.addColorStop(0, `rgba(${col},${Math.max(a, m)})`); beam.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = beam;
      ctx.beginPath(); ctx.moveTo(X(x0, ZNEAR), Y(ZNEAR)); ctx.lineTo(X(x1, ZNEAR), Y(ZNEAR)); ctx.lineTo(X(x1, ZF * .7), Y(ZF * .7)); ctx.lineTo(X(x0, ZF * .7), Y(ZF * .7)); ctx.closePath(); ctx.fill();
    }
    ctx.lineWidth = Math.max(1, W / 1000); ctx.strokeStyle = 'rgba(255,241,219,.12)';
    for (const x of [-1, 0, 1]) { ctx.beginPath(); ctx.moveTo(X(x, ZNEAR), Y(ZNEAR)); ctx.lineTo(X(x, ZF), Y(ZF)); ctx.stroke(); }
    // Beat and bar lines travel down the highway.
    if (playing) {
      const first = Math.ceil(t / BEAT);
      for (let b = first; b * BEAT - t <= LEAD; b++) {
        const z = (b * BEAT - t) / LEAD * ZF; if (z < 0) continue;
        ctx.strokeStyle = `rgba(255,241,219,${(b % 4 === 0 ? .32 : .1) * (.4 + scale(z))})`; ctx.lineWidth = b % 4 === 0 ? 2 : 1;
        ctx.beginPath(); ctx.moveTo(X(-2, z), Y(z)); ctx.lineTo(X(2, z), Y(z)); ctx.stroke();
      }
    }
    // Glowing edges.
    // A wide faint stroke under a thin bright one reads as glow, without the cost of shadowBlur.
    const glowLine = (x0: number, y0: number, x1: number, y1: number, col: string, w: number) => {
      ctx.strokeStyle = col;
      for (const [k, a] of [[5, .12 + thump * .1], [2.4, .3], [1, 1]] as const) {
        ctx.globalAlpha = a; ctx.lineWidth = w * k; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };
    ctx.lineCap = 'round';
    for (const [x, col] of [[-2, '#ff7868'], [2, '#82cfff']] as const) glowLine(X(x, ZNEAR), Y(ZNEAR), X(x, ZF), Y(ZF), col, Math.max(2, W / 420));
    // The hit line and the four receptors.
    glowLine(X(-2, 0), Y(0), X(2, 0), Y(0), '#ffe7b0', Math.max(2, W / 460));
    ctx.lineCap = 'butt';
    const rw = laneW * .8, rh = laneW * .24;
    for (let lane = 0; lane < 4; lane++) {
      const x = cx + (lane - 1.5) * laneW, on = Math.max(0, 1 - age(fx.current.press[lane]) / 140);
      ctx.save(); ctx.translate(x, hitY); ctx.scale(1 + on * .08, 1 + on * .08);
      ctx.fillStyle = `rgba(${hexRgb(COLORS[lane])},${.12 + on * .55})`; ctx.strokeStyle = COLORS[lane]; ctx.lineWidth = Math.max(1.5, W / 600);
      ctx.beginPath(); ctx.roundRect(-rw / 2, -rh / 2, rw, rh, rh / 2); ctx.fill(); ctx.stroke();
      ctx.restore();
    }

    // Notes, far to near so near ones draw on top.
    if (playing) {
      const sp = sprites.current;
      for (let i = chart.length - 1; i >= 0; i--) {
        const note = chart[i], ahead = note.time - t;
        if (judged.current.has(i) || ahead > LEAD || ahead < -WINDOWS.good) continue;
        const z = ahead / LEAD * ZF, s = scale(z);
        const w = laneW * .86 * s * 1.29, h = w * .35;
        const x = cx + (note.lane - 1.5) * laneW * s, y = Y(z);
        ctx.globalAlpha = Math.min(1, (ZF - z) / 1.2 + .15);
        ctx.drawImage(sp[note.lane], x - w / 2, y - h / 2, w, h);
      }
      ctx.globalAlpha = 1;
    }

    // Rings and sparks, added light.
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    if (!playing) { fx.current.rings = []; fx.current.sparks = []; }
    fx.current.rings = fx.current.rings.filter(r => t - r.born < 420);
    for (const r of fx.current.rings) {
      const k = (t - r.born) / 420, x = cx + (r.lane - 1.5) * laneW;
      ctx.strokeStyle = r.color; ctx.globalAlpha = 1 - k; ctx.lineWidth = 3 * (1 - k) + 1;
      ctx.beginPath(); ctx.ellipse(x, hitY, rw * (.5 + k * .7), rh * (.5 + k * 1.6), 0, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    const dt = 16;
    fx.current.sparks = fx.current.sparks.filter(p => (p.life += dt) < p.max);
    for (const p of fx.current.sparks) {
      p.x += p.vx * dt; p.y += p.vy * dt; p.vy += .0016 * dt * laneW / 60;
      ctx.globalAlpha = 1 - p.life / p.max; ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    ctx.restore();

    // Countdown to the first note, on the beat.
    if (playing && t < chart[0].time) {
      const n = Math.floor(t / BEAT), k = (t % BEAT) / BEAT;
      const label = ['3', '2', '1', 'GO'][n] ?? '';
      ctx.save(); ctx.globalAlpha = 1 - k; ctx.fillStyle = n === 3 ? '#ffd078' : '#fff1db';
      ctx.font = `800 ${Math.round(H * (.2 + (1 - k) * .04))}px 'Bricolage Grotesque', sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.shadowColor = '#ff7868'; ctx.shadowBlur = 24; ctx.fillText(label, cx, H * .5); ctx.restore();
    }
    // Every tenth combo, a banner sweeps across the sky.
    const ms = t - fx.current.milestone.at;
    if (playing && ms < 900) {
      const k = ms / 900;
      ctx.save(); ctx.globalAlpha = Math.sin(k * Math.PI); ctx.fillStyle = '#fff3c4';
      ctx.font = `800 ${Math.round(H * .075)}px 'Bricolage Grotesque', sans-serif`; ctx.textAlign = 'center';
      ctx.shadowColor = '#ffd078'; ctx.shadowBlur = 20; ctx.fillText(`${fx.current.milestone.n} COMBO`, cx, hor - H * .05 + (1 - k) * 10); ctx.restore();
    }
  }

  // Size the canvas to its box (capped pixel ratio) and draw a still frame when idle.
  useEffect(() => {
    still.current = matchMedia('(prefers-reduced-motion: reduce)').matches;
    sprites.current = COLORS.map(noteSprite);
    const c = canvas.current!;
    const fit = () => {
      const dpr = Math.min(2, devicePixelRatio || 1);
      c.width = Math.round(c.clientWidth * dpr); c.height = Math.round(c.clientHeight * dpr);
      paintBackdrop(c);
      if (phaseRef.current !== 'playing') draw(0, false);
    };
    fit();
    const ro = new ResizeObserver(fit); ro.observe(c);
    return () => ro.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (phase !== 'playing') { draw(0, false); return; }
    let frame = 0;
    const tick = () => {
      const time = now();
      // The backing track: kick on the beat, snare on 2 and 4, hats between, a bass note each bar.
      const half = Math.floor(time / (BEAT / 2));
      if (half !== beat.current && time < END) {
        beat.current = half;
        const { drums: d, sound: s } = callbacks.current;
        if (half % 2 === 0) d.play(half % 8 === 4 ? 'snare' : 'kick'); else d.play('hat');
        if (half % 8 === 0) void s('bass', bass[Math.floor(half / 8) % bass.length]);
        if (half % 2 === 0) fx.current.pulse = time;
      }
      chart.forEach((note, i) => { if (!judged.current.has(i) && time - note.time > WINDOWS.good) { judged.current.add(i); recordHit('Miss', note.lane); } });
      if (bar.current) bar.current.style.transform = `scaleX(${Math.min(1, time / END)})`;
      draw(time, true);
      if (time > END) {
        setPhase('done'); callbacks.current.complete();
        const s = live.current, acc = s.judged ? s.credit / s.judged : 1;
        const prev = readBest();
        if (!prev || s.score > prev.score) {
          const next = { score: s.score, grade: grade(acc) };
          try { localStorage.setItem(BEST_KEY, JSON.stringify(next)); } catch { /* storage may be blocked */ }
          setRecord(next); setNewBest(s.score > 0);
        }
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  function hit(lane: number) {
    if (phase !== 'playing') return;
    setPressed(lane); clearTimeout(pressTimer.current); pressTimer.current = setTimeout(() => setPressed(null), 110);
    const time = now();
    fx.current.press[lane] = time;
    let index = -1, best = Infinity;
    chart.forEach((note, i) => { if (note.lane === lane && !judged.current.has(i)) { const d = Math.abs(note.time - time); if (d < best) { best = d; index = i; } } });
    const kind = index >= 0 ? judge(chart[index].time - time) : null;
    if (!kind) return; // a press with no note nearby is ignored rather than punished
    judged.current.add(index);
    void sound('tick', [523.25, 587.33, 659.25, 783.99][lane]);
    recordHit(kind, lane);
  }

  const accuracy = stats.judged ? stats.credit / stats.judged : 1;
  const fullCombo = phase === 'done' && stats.counts.Miss === 0 && stats.judged > 0;
  return <div className="rhythm rg" onKeyDown={e => {
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || (e.target instanceof HTMLElement && (e.target.matches('input, textarea, select') || e.target.isContentEditable))) return;
    const lane = ['KeyD', 'KeyF', 'KeyJ', 'KeyK'].indexOf(e.code);
    const resolved = lane >= 0 ? lane : ['d', 'f', 'j', 'k'].indexOf(e.key.toLowerCase());
    if (resolved >= 0 && phase === 'playing') { e.preventDefault(); e.stopPropagation(); hit(resolved); }
  }}>
    <div ref={controls} className={`rg-stage is-${phase}`} tabIndex={0} role="group" aria-label="Rhythm game controls">
      <canvas ref={canvas} className="rg-canvas" aria-hidden="true"/>
      <span className="rg-progress" aria-hidden="true"><i ref={bar}/></span>

      {phase === 'playing' && <div className="rg-hud" aria-hidden="true">
        <div className="rg-hud-score"><span>Score</span><b>{stats.score.toLocaleString()}</b></div>
        <div className={`rg-hud-combo${stats.combo ? '' : ' is-zero'}`}><b key={stats.combo}>{stats.combo}</b><span>combo · ×{(1 + Math.min(stats.combo, 50) / 50).toFixed(1)}</span></div>
        <div className="rg-hud-acc"><span>Accuracy</span><b>{(accuracy * 100).toFixed(1)}%</b></div>
      </div>}
      {pop && phase === 'playing' && <div key={pop.id} className={`rg-pop is-${pop.text.toLowerCase()}`} aria-hidden="true" style={{ '--lane': pop.lane } as CSSProperties}>{pop.text}</div>}

      {phase === 'ready' && <div className="rg-card rg-intro">
        <span className="rg-eyebrow">Now playing</span>
        <strong className="rg-title">Coral Rush</strong>
        <span className="rg-meta">{chart.length} notes · 120 BPM · about 17 seconds</span>
        <span className="rg-keys" aria-hidden="true">{keys.map((k, i) => <kbd key={k} style={{ '--c': COLORS[i] } as CSSProperties}>{k}</kbd>)}</span>
        <span className="rg-hint">Hit D F J K, or tap a lane, as each note crosses the line.</span>
        {record && <span className="rg-record">Your best · {record.score.toLocaleString()} · {record.grade}</span>}
      </div>}

      {phase === 'done' && <div className="rg-card rg-result">
        <span className={`rg-grade grade-${grade(accuracy).toLowerCase()}`}>{grade(accuracy)}</span>
        <div className="rg-result-body">
          <div className="rg-badges">{fullCombo && <span className="rg-badge">Full combo</span>}{newBest && <span className="rg-badge is-best">New best</span>}</div>
          <strong className="rg-result-score">{stats.score.toLocaleString()} <span>points</span></strong>
          <span className="rg-meta">{(accuracy * 100).toFixed(1)}% accuracy · best combo {stats.best}</span>
          <div className="rg-breakdown">{(['Perfect', 'Great', 'Good', 'Miss'] as Judgement[]).map(k => <div key={k} className={`is-${k.toLowerCase()}`}>
            <span>{k}</span><i style={{ '--w': stats.counts[k] / chart.length } as CSSProperties}/><b>{stats.counts[k]}</b>
          </div>)}</div>
        </div>
      </div>}

      <div className="rg-pads">{keys.map((label, lane) => <button key={label} type="button" className={`rx rg-pad lane-${lane}${pressed === lane ? ' lane-pressed' : ''}`} style={{ '--c': COLORS[lane] } as CSSProperties}
        onPointerDown={e => { e.preventDefault(); hit(lane); }} onClick={e => { if (e.detail === 0) hit(lane); }}>{label}</button>)}</div>
    </div>
    <div className="activity-options compact">
      <button data-primary onClick={begin}>{phase === 'ready' ? 'Start rhythm session' : 'Restart session'}</button>
      {phase === 'playing' && <button onClick={() => { setPhase('ready'); setPop(null); }}>Stop session</button>}
    </div>
    <p className="activity-feedback" role="status">{phase === 'done'
      ? `Session complete · grade ${grade(accuracy)} · ${stats.score.toLocaleString()} points · ${(accuracy * 100).toFixed(1)}% accuracy · best combo ${stats.best}.`
      : phase === 'playing' ? `${stats.score.toLocaleString()} points · ${stats.combo} combo${pop ? ` · ${pop.text}` : ''}`
      : 'Session stopped or not started. Sound plays a backing beat; the game works without it.'}</p>
    <small>Timing windows: Perfect within 45 ms, Great within 90 ms, Good within 140 ms. Moving notes are essential to this activity.</small>
  </div>;
}

function hexRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return `${n >> 16 & 255},${n >> 8 & 255},${n & 255}`;
}
