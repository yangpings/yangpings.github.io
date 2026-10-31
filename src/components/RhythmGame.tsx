import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useSound } from './SoundCorners';

// A four-lane rhythm game on a 3D note highway. A synthesized beat plays (kick, hat, bass) while
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

function judge(diff: number): Judgement | null {
  const d = Math.abs(diff);
  return d <= WINDOWS.perfect ? 'Perfect' : d <= WINDOWS.great ? 'Great' : d <= WINDOWS.good ? 'Good' : null;
}
const credit: Record<Judgement, number> = { Perfect: 1, Great: .75, Good: .5, Miss: 0 };
const grade = (acc: number) => acc >= .95 ? 'S' : acc >= .85 ? 'A' : acc >= .7 ? 'B' : acc >= .5 ? 'C' : 'D';

export default function RhythmGame({ complete }: { complete: () => void }) {
  const { sound } = useSound();
  const callbacks = useRef({ complete, sound }); callbacks.current = { complete, sound };
  const controls = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready');
  const [elapsed, setElapsed] = useState(0);
  const [stats, setStats] = useState({ score: 0, combo: 0, best: 0, judged: 0, credit: 0, counts: { Perfect: 0, Great: 0, Good: 0, Miss: 0 } as Record<Judgement, number> });
  const [pop, setPop] = useState<{ id: number; text: Judgement; lane: number } | null>(null);
  const [bursts, setBursts] = useState<{ id: number; lane: number; kind: Judgement }[]>([]);
  const [pressed, setPressed] = useState<number | null>(null);
  const start = useRef(0), beat = useRef(-1), judged = useRef(new Set<number>()), live = useRef(stats), seq = useRef(0);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(pressTimer.current), []);

  function record(kind: Judgement, lane: number) {
    const s = live.current;
    const combo = kind === 'Miss' ? 0 : s.combo + 1;
    const next = { score: s.score + Math.round(credit[kind] * 100 * (1 + Math.min(combo, 50) / 50)), combo, best: Math.max(s.best, combo), judged: s.judged + 1,
      credit: s.credit + credit[kind], counts: { ...s.counts, [kind]: s.counts[kind] + 1 } };
    live.current = next; setStats(next);
    const id = ++seq.current;
    setPop({ id, text: kind, lane });
    if (kind !== 'Miss') setBursts(b => [...b.slice(-6), { id, lane, kind }]);
  }

  function begin() {
    judged.current.clear(); beat.current = -1;
    live.current = { score: 0, combo: 0, best: 0, judged: 0, credit: 0, counts: { Perfect: 0, Great: 0, Good: 0, Miss: 0 } };
    setStats(live.current); setPop(null); setBursts([]); setElapsed(0);
    start.current = performance.now(); setPhase('playing');
    controls.current?.focus({ preventScroll: true });
  }

  useEffect(() => {
    if (phase !== 'playing') return;
    let frame = 0;
    const tick = () => {
      const time = performance.now() - start.current; setElapsed(time);
      // The backing beat: kick on the beat, hat between, a bass note at the top of each bar.
      const half = Math.floor(time / (BEAT / 2));
      if (half !== beat.current && time < END) {
        beat.current = half;
        void callbacks.current.sound(half % 2 === 0 ? 'kick' : 'hat');
        if (half % 8 === 0) void callbacks.current.sound('bass', bass[Math.floor(half / 8) % bass.length]);
      }
      chart.forEach((note, i) => { if (!judged.current.has(i) && time - note.time > WINDOWS.good) { judged.current.add(i); record('Miss', note.lane); } });
      if (time > END) { setPhase('done'); callbacks.current.complete(); return; }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  function hit(lane: number) {
    if (phase !== 'playing') return;
    setPressed(lane); clearTimeout(pressTimer.current); pressTimer.current = setTimeout(() => setPressed(null), 110);
    const time = performance.now() - start.current;
    let index = -1, best = Infinity;
    chart.forEach((note, i) => { if (note.lane === lane && !judged.current.has(i)) { const d = Math.abs(note.time - time); if (d < best) { best = d; index = i; } } });
    const kind = index >= 0 ? judge(chart[index].time - time) : null;
    if (!kind) return; // a press with no note nearby is ignored rather than punished
    judged.current.add(index);
    void sound('tick', [523.25, 587.33, 659.25, 783.99][lane]);
    record(kind, lane);
  }

  const accuracy = stats.judged ? stats.credit / stats.judged : 1;
  const progress = Math.min(1, elapsed / END);
  return <div className="rhythm" onKeyDown={e => {
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || (e.target instanceof HTMLElement && (e.target.matches('input, textarea, select') || e.target.isContentEditable))) return;
    const lane = ['KeyD', 'KeyF', 'KeyJ', 'KeyK'].indexOf(e.code);
    const resolved = lane >= 0 ? lane : ['d', 'f', 'j', 'k'].indexOf(e.key.toLowerCase());
    if (resolved >= 0 && phase === 'playing') { e.preventDefault(); e.stopPropagation(); hit(resolved); }
  }}>
    <div className="rhythm-hud" aria-hidden={phase === 'ready'}>
      <div><span>Score</span><strong>{stats.score.toLocaleString()}</strong></div>
      <div><span>Accuracy</span><strong>{(accuracy * 100).toFixed(1)}%</strong></div>
      <div><span>Best combo</span><strong>{stats.best}</strong></div>
      <div className="rhythm-progress"><i style={{ width: `${progress * 100}%` }}/></div>
    </div>
    <div ref={controls} className={`rhythm-game rhythm-stage is-${phase}`} tabIndex={0} role="group" aria-label="Rhythm game controls">
      <div className="rhythm-highway" aria-hidden="true">
        <div className="rhythm-board">
          {keys.map((_, lane) => <span key={lane} className={`rhythm-lane lane-${lane}${pressed === lane ? ' is-pressed' : ''}`}/>)}
          <div className="rhythm-target"/>
          {phase === 'playing' && chart.map((note, i) => {
            const ahead = note.time - elapsed;
            if (judged.current.has(i) || ahead > LEAD || ahead < -WINDOWS.good) return null;
            return <span key={i} className={`rhythm-note lane-${note.lane}`} style={{ left: `${note.lane * 25 + 12.5}%`, top: `${86 - (ahead / LEAD) * 86}%` }}/>;
          })}
          {bursts.map(b => <span key={b.id} className={`rhythm-burst lane-${b.lane} is-${b.kind.toLowerCase()}`} style={{ left: `${b.lane * 25 + 12.5}%` }}/>)}
        </div>
      </div>
      {phase === 'playing' && <div className={`rhythm-combo${stats.combo ? '' : ' is-zero'}`} aria-hidden="true"><span>Combo</span><b key={stats.combo}>{stats.combo}</b><small>×{(1 + Math.min(stats.combo, 50) / 50).toFixed(1)} points</small></div>}
      {pop && phase === 'playing' && <div key={pop.id} className={`rhythm-pop is-${pop.text.toLowerCase()}`} aria-hidden="true" style={{ '--lane': pop.lane } as CSSProperties}>{pop.text}</div>}
      {phase === 'done' && <div className="rhythm-result"><span className="rhythm-grade">{grade(accuracy)}</span>
        <dl>{(['Perfect', 'Great', 'Good', 'Miss'] as Judgement[]).map(k => <div key={k}><dt>{k}</dt><dd>{stats.counts[k]}</dd></div>)}</dl></div>}
      {phase === 'ready' && <div className="rhythm-intro"><strong>{chart.length} notes · 120 BPM · about 17 seconds</strong><span>Hit D F J K, or tap a lane, as each note crosses the line.</span></div>}
      <div className="rhythm-buttons">{keys.map((label, lane) => <button key={label} className={`lane-${lane}${pressed === lane ? ' lane-pressed' : ''}`}
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
