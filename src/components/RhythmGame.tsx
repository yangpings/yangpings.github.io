import { useEffect, useRef, useState } from 'react';
import { useSound } from './SoundCorners';

const chart = Array.from({ length: 24 }, (_, i) => ({ time: 2000 + i * 500, lane: [0, 1, 2, 1, 3, 2, 0, 3][i % 8] }));
export default function RhythmGame({ complete }: { complete: () => void }) {
  const { sound } = useSound();
  const callbacks = useRef({ complete, sound }); callbacks.current = { complete, sound };
  const beat = useRef(-1);
  const controls = useRef<HTMLDivElement>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [pressedLane, setPressedLane] = useState<number | null>(null);
  useEffect(() => () => clearTimeout(flashTimer.current), []);
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready');
  const [elapsed, setElapsed] = useState(0); const [score, setScore] = useState(0); const [feedback, setFeedback] = useState('');
  const start = useRef(0); const judged = useRef(new Set<number>()); const points = useRef(0);
  function begin() { judged.current.clear(); points.current = 0; beat.current = -1; setScore(0); setElapsed(0); setFeedback('Get ready…'); void sound('hat'); start.current = performance.now(); setPhase('playing'); controls.current?.focus({ preventScroll: true }); }
  useEffect(() => {
    if (phase !== 'playing') return;
    let frame = 0;
    const tick = () => {
      const time = performance.now() - start.current; setElapsed(time);
      const currentBeat = Math.floor(time / 500);
      if (currentBeat !== beat.current) { beat.current = currentBeat; void callbacks.current.sound(currentBeat % 2 === 0 ? 'kick' : 'hat'); }
      chart.forEach((note, i) => { if (!judged.current.has(i) && time - note.time > 180) { judged.current.add(i); setFeedback('Miss · keep going'); } });
      if (time > chart[chart.length - 1].time + 600) { setPhase('done'); callbacks.current.complete(); return; }
      frame = requestAnimationFrame(tick);
    }; frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase]);
  function hit(lane: number) {
    if (phase !== 'playing') return;
    setPressedLane(lane); clearTimeout(flashTimer.current); flashTimer.current = setTimeout(() => setPressedLane(null), 120);
    const time = performance.now() - start.current;
    const index = chart.findIndex((note, i) => note.lane === lane && !judged.current.has(i) && Math.abs(note.time - time) <= 180);
    if (index < 0) { setFeedback('Off beat · wait for the target line'); return; }
    judged.current.add(index); const difference = Math.abs(chart[index].time - time); const reward = difference < 75 ? 100 : 50;
    points.current += reward; setScore(points.current); setFeedback(reward === 100 ? 'Perfect!' : 'Good!');
  }
  return <div onKeyDown={e => {
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || (e.target instanceof HTMLElement && (e.target.matches('input, textarea, select') || e.target.isContentEditable))) return;
    const lane = ['KeyD', 'KeyF', 'KeyJ', 'KeyK'].indexOf(e.code);
    const resolved = lane >= 0 ? lane : ['d', 'f', 'j', 'k'].indexOf(e.key.toLowerCase());
    if (resolved >= 0 && phase === 'playing') { e.preventDefault(); e.stopPropagation(); hit(resolved); }
  }}><p>A short four-lane rhythm session. Hit D F J K, or tap a lane, when a note reaches the gold line. Timing is measured against the same clock as the chart.</p><div ref={controls} className="rhythm-game" tabIndex={0} role="group" aria-label="Rhythm game controls"><div className="rhythm-track" aria-hidden="true"><div className="rhythm-target"/>{phase === 'playing' && chart.map((note, i) => !judged.current.has(i) && note.time - elapsed < 1600 && note.time - elapsed > -180 ? <span key={i} className={`rhythm-note pad-${note.lane}`} style={{ left: `${note.lane * 25 + 2}%`, top: `${82 - (note.time - elapsed) / 1600 * 82}%` }}/> : null)}</div><div className="rhythm-buttons">{['D', 'F', 'J', 'K'].map((label, lane) => <button key={label} className={`pad-${lane}${pressedLane === lane ? ' lane-pressed' : ''}`} onPointerDown={e => { e.preventDefault(); hit(lane); }} onClick={e => { if (e.detail === 0) hit(lane); }}>{label}</button>)}</div></div><div className="activity-options compact"><button data-primary onClick={begin}>{phase === 'ready' ? 'Start rhythm session' : 'Restart session'}</button>{phase === 'playing' && <button onClick={() => { setPhase('ready'); setFeedback('Session stopped.'); }}>Stop session</button>}</div><p className="activity-feedback" role="status">{phase === 'done' ? `Session complete · ${score} / 2400 points. One more?` : `${score} points · ${feedback || '24 notes. About 14 seconds. No audio required.'}`}</p><small>Visual timing game. D F J K are active after starting; lane buttons support touch and keyboard. Moving notes are essential to this activity.</small></div>;
}
