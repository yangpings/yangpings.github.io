import { useEffect, useRef, useState } from 'react';
import { useSound } from './SoundCorners';

// A 16-step drum sequencer: rows of instruments, columns of sixteenth notes. Toggle cells, press
// play, and the pattern loops with a playhead sweeping across. Tempo and a swing feel are
// adjustable; a few starter grooves load with one click.
const rows = [
  { label: 'Crash', kind: 'cymbal', frequency: 440 },
  { label: 'Hi-hat', kind: 'hat', frequency: 440 },
  { label: 'Snare', kind: 'snare', frequency: 440 },
  { label: 'High tom', kind: 'tom', frequency: 190 },
  { label: 'Floor tom', kind: 'tom', frequency: 110 },
  { label: 'Kick', kind: 'kick', frequency: 70 },
];
const STEPS = 16;
const grid = (on: Record<number, number[]>) => rows.map((_, r) => Array.from({ length: STEPS }, (_, s) => (on[r] ?? []).includes(s)));
const presets: Record<string, boolean[][]> = {
  'Rock': grid({ 1: [0, 2, 4, 6, 8, 10, 12, 14], 2: [4, 12], 5: [0, 8, 10] }),
  'Funk': grid({ 1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 2: [4, 7, 12, 15], 5: [0, 3, 6, 10] }),
  'Half-time': grid({ 0: [0], 1: [0, 4, 8, 12], 2: [8], 4: [14, 15], 5: [0, 3] }),
  'Empty': grid({}),
};

export default function StepSequencer({ complete }: { complete: () => void }) {
  const { sound, error } = useSound();
  const [cells, setCells] = useState(presets['Rock']);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);
  const [tempo, setTempo] = useState(100);
  const [swing, setSwing] = useState(0);
  const live = useRef({ cells, tempo, swing, sound, complete }); live.current = { cells, tempo, swing, sound, complete };
  const loops = useRef(0);

  useEffect(() => {
    if (!playing) { setStep(-1); return; }
    let s = -1, timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      s = (s + 1) % STEPS; setStep(s);
      const { cells: c, tempo: t, swing: sw } = live.current;
      c.forEach((row, r) => { if (row[s]) void live.current.sound(rows[r].kind, rows[r].frequency); });
      if (s === STEPS - 1 && ++loops.current === 2) live.current.complete();
      const sixteenth = 60000 / t / 4;
      // Swing: lengthen the on-beat sixteenth and shorten the off-beat one.
      timer = setTimeout(tick, s % 2 === 0 ? sixteenth * (1 + sw / 100 * .5) : sixteenth * (1 - sw / 100 * .5));
    };
    tick();
    const hide = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener('visibilitychange', hide);
    return () => { clearTimeout(timer); document.removeEventListener('visibilitychange', hide); };
  }, [playing]);

  const toggle = (r: number, s: number) => setCells(c => c.map((row, i) => i === r ? row.map((v, j) => j === s ? !v : v) : row));
  const count = cells.flat().filter(Boolean).length;

  return <div className="sequencer">
    <div className="sequencer-bar">
      <button data-primary aria-pressed={playing} onClick={() => setPlaying(p => !p)}>{playing ? 'Stop pattern' : 'Play pattern'}</button>
      <div className="sequencer-presets" role="group" aria-label="Starter grooves">{Object.keys(presets).map(name => <button key={name} onClick={() => setCells(presets[name])}>{name}</button>)}</div>
      <label>Tempo <output>{tempo} BPM</output><input type="range" min="70" max="160" value={tempo} aria-label="Tempo" onChange={e => setTempo(Number(e.target.value))}/></label>
      <label>Swing <output>{swing}%</output><input type="range" min="0" max="60" step="5" value={swing} aria-label="Swing" onChange={e => setSwing(Number(e.target.value))}/></label>
    </div>
    <div className="sequencer-grid" role="grid" aria-label="Drum pattern, 6 instruments by 16 steps">
      {rows.map((row, r) => <div key={row.label} role="row" className="sequencer-row">
        <span role="rowheader" className="sequencer-label">{row.label}</span>
        {cells[r].map((on, s) => <button key={s} role="gridcell" aria-pressed={on} aria-label={`${row.label}, step ${s + 1}`}
          className={`sequencer-cell${on ? ' is-on' : ''}${s === step ? ' is-now' : ''}${s % 4 === 0 ? ' is-beat' : ''}`} onClick={() => toggle(r, s)}/>)}
      </div>)}
    </div>
    <p role="status" className="activity-feedback">{error || (playing ? `Playing ${count} hits at ${tempo} BPM${swing ? `, ${swing}% swing` : ''}.` : `${count} hits programmed. Press Play pattern.`)}</p>
  </div>;
}
