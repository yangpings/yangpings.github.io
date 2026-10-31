import { useEffect, useRef, useState } from 'react';
import SoundCorners from './SoundCorners';
import ModelSandbox from './ModelSandbox';
import RhythmGame from './RhythmGame';
import TravelActivity from './TravelActivity';
import SketchCanvas from './SketchCanvas';
import VisionLab from './VisionLab';

const quests = [
  { id: 'llm', label: 'Train a neural network', role: 'AI / ML' },
  { id: 'retina', label: 'What does the model see?', role: 'Computer vision' },
  { id: 'music', label: 'Make some noise', role: 'Drums / Singing / Listening' },
  { id: 'art', label: 'Sketchbook', role: 'Art studio' },
  { id: 'arcade', label: 'One more song', role: 'Rhythm games' },
  { id: 'travel', label: 'Pick a destination', role: 'Travel' },
];

function MusicDesk({ complete }: { complete: () => void }) {
  const [weight, setWeight] = useState(50);
  const [matched, setMatched] = useState(false);
  const candidates = [{ name: 'Track A', rhythm: 90, tone: 30 }, { name: 'Track B', rhythm: 60, tone: 70 }, { name: 'Track C', rhythm: 25, tone: 95 }];
  const ranked = candidates.map(track => ({ ...track, score: Math.round(track.rhythm * weight / 100 + track.tone * (100 - weight) / 100) })).sort((a, b) => b.score - a.score);
  return <><p>You're building a music discovery tool. "Similar" could mean a similar rhythm or a similar sound. Which matters more to your listener?</p><label className="music-weight" htmlFor="music-weight">Rhythm weight: {weight}% · Tone weight: {100 - weight}%<input id="music-weight" type="range" min="0" max="100" value={weight} onChange={e => { setWeight(Number(e.target.value)); setMatched(false); }}/></label><div className="track-ranking">{ranked.map((track, i) => <div key={track.name}><strong>{i + 1}. {track.name}</strong><span>Rhythm {track.rhythm} · Tone {track.tone}</span><meter min="0" max="100" value={track.score} aria-label={`${track.name} weighted similarity`}/><b>{track.score}</b></div>)}</div><div className="activity-options"><button onClick={() => { setMatched(true); complete(); }}>Choose {ranked[0].name} for this listener</button></div><p className="activity-feedback" role="status">{matched ? 'A match, with a reason behind it. Change the weights and the recommendation can change too. A real system needs richer representations and listener feedback.' : 'Try each end of the slider. There isn\'t one universal definition of a good match.'}</p><small>Invented tracks and synthetic scores for this toy exercise, not BOLERO data or an actual recommendation model.</small><details className="music-break"><summary>Take a music break: play the keyboard</summary><Keyboard complete={() => {}}/></details></>;
}

function Keyboard({ complete }: { complete: () => void }) {
  const context = useRef<AudioContext | null>(null);
  const played = useRef(new Set<number>());
  const [last, setLast] = useState('');
  const [error, setError] = useState(false);
  useEffect(() => () => { void context.current?.close(); }, []);
  async function play(i: number) {
    try {
      context.current ??= new AudioContext();
      const audio = context.current;
      await audio.resume();
      if (audio.state === 'closed') return;
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.type = 'triangle';
      oscillator.frequency.value = [261.63, 293.66, 329.63, 349.23, 392, 440, 493.88, 523.25][i];
      gain.gain.setValueAtTime(0, audio.currentTime);
      gain.gain.linearRampToValueAtTime(.12, audio.currentTime + .015);
      gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + .6);
      oscillator.connect(gain); gain.connect(audio.destination);
      oscillator.start(); oscillator.stop(audio.currentTime + .65);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
      setLast(['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C↑'][i]);
      played.current.add(i); if (played.current.size >= 4) complete();
    } catch { setError(true); }
  }
  return <><p>No recording to press play on here. Make your own: try four different notes to finish this quest.</p><div className="mini-keyboard">{['C', 'D', 'E', 'F', 'G', 'A', 'B', 'High C'].map((note, i) => <button key={note} aria-label={`Play ${note}`} onClick={() => void play(i)}>{note}</button>)}</div><p className="activity-feedback" role="status">{error ? 'Audio is unavailable in this browser.' : last ? `${last} · ${played.current.size} different notes played. Try another note.` : 'Sound starts only when you press a key. Click, tap, or use Tab and Enter.'}</p></>;
}

function Memory({ complete }: { complete: () => void }) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [phase, setPhase] = useState<'idle' | 'study' | 'play' | 'won' | 'lost'>('idle');
  const [input, setInput] = useState<number[]>([]);
  const labels = ['Coral', 'Gold', 'Sky', 'Mint'];
  function start() { setSequence(Array.from({ length: 5 }, () => Math.floor(Math.random() * 4))); setInput([]); setPhase('study'); }
  function press(i: number) {
    const next = [...input, i]; setInput(next);
    if (sequence[input.length] !== i) setPhase('lost');
    else if (next.length === sequence.length) { setPhase('won'); complete(); }
  }
  return <><p>Five colors. One memory. Study the sequence for as long as you like, then hide it and repeat it.</p><div className="memory-sequence">{phase === 'study' ? sequence.map((i, n) => <span key={n} className={`pad-${i}`}>{n + 1}. {labels[i]}</span>) : <span>{phase === 'idle' ? 'Start a round to see the sequence.' : `${input.length} / 5 inputs`}</span>}</div><div className="memory-pads">{labels.map((label, i) => <button key={label} className={`pad-${i}`} disabled={phase !== 'play'} onClick={() => press(i)}>{label}</button>)}</div><div className="activity-options compact">{phase === 'study' ? <button onClick={() => setPhase('play')}>Hide sequence & play</button> : <button data-primary onClick={start}>{phase === 'idle' ? 'Start round' : 'New round'}</button>}</div><p className="activity-feedback" role="status">{phase === 'won' ? 'You matched the sequence. Select New round to play again.' : phase === 'lost' ? `Not quite. The sequence was ${sequence.map(i => labels[i]).join(' → ')}. Try a fresh round.` : phase === 'play' ? 'Your turn. No timer, no pressure.' : 'Use click, touch, or Tab and Enter. Colors also have names.'}</p></>;
}

export default function RoomActivity({ id, completed, onComplete }: { id: string; completed: boolean; onComplete: (id: string) => void }) {
  const quest = quests.find(q => q.id === id);
  if (!quest) return null;
  const complete = () => onComplete(id);
  return <section className="room-activity" aria-label={quest.label}><div className="activity-heading"><span className="eyebrow">{quest.role}</span><span>{completed ? '✓ Moment complete' : 'Your turn'}</span></div><h3>{quest.label}</h3>{id === 'llm' ? <ModelSandbox complete={complete}/> : id === 'retina' ? <VisionLab complete={complete}/> : id === 'music' ? <><SoundCorners onComplete={() => complete()}/><details className="music-break"><summary>Behind the music: try the ML matching desk</summary><MusicDesk complete={complete}/></details></> : id === 'art' ? <SketchCanvas complete={complete}/> : id === 'travel' ? <TravelActivity complete={complete}/> : <><RhythmGame complete={complete}/><details className="music-break"><summary>Bonus: memory cabinet</summary><Memory complete={complete}/></details></>}</section>;
}
