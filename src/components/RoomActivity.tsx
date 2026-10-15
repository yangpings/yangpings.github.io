import { useEffect, useRef, useState } from 'react';
import SoundCorners from './SoundCorners';
import ModelSandbox from './ModelSandbox';
import RhythmGame from './RhythmGame';
import TravelActivity from './TravelActivity';
import SketchCanvas from './SketchCanvas';

const quests = [
  { id: 'llm', label: 'Investigate a model', role: 'AI / ML' },
  { id: 'retina', label: 'Question the signal', role: 'Computer vision' },
  { id: 'music', label: 'Make some noise', role: 'Drums / Singing / Listening' },
  { id: 'art', label: 'Your canvas', role: 'Art studio' },
  { id: 'arcade', label: 'One more song', role: 'Rhythm games' },
  { id: 'travel', label: 'Pick a destination', role: 'Travel' },
];

function MusicDesk({ complete }: { complete: () => void }) {
  const [weight, setWeight] = useState(50);
  const [matched, setMatched] = useState(false);
  const candidates = [{ name: 'Track A', rhythm: 90, tone: 30 }, { name: 'Track B', rhythm: 60, tone: 70 }, { name: 'Track C', rhythm: 25, tone: 95 }];
  const ranked = candidates.map(track => ({ ...track, score: Math.round(track.rhythm * weight / 100 + track.tone * (100 - weight) / 100) })).sort((a, b) => b.score - a.score);
  return <><p>You’re building a music discovery tool. “Similar” could mean a similar rhythm or a similar sound. Which matters more to your listener?</p><label className="music-weight" htmlFor="music-weight">Rhythm weight: {weight}% · Tone weight: {100 - weight}%<input id="music-weight" type="range" min="0" max="100" value={weight} onChange={e => { setWeight(Number(e.target.value)); setMatched(false); }}/></label><div className="track-ranking">{ranked.map((track, i) => <div key={track.name}><strong>{i + 1}. {track.name}</strong><span>Rhythm {track.rhythm} · Tone {track.tone}</span><meter min="0" max="100" value={track.score} aria-label={`${track.name} weighted similarity`}/><b>{track.score}</b></div>)}</div><div className="activity-options"><button onClick={() => { setMatched(true); complete(); }}>Choose {ranked[0].name} for this listener</button></div><p className="activity-feedback" role="status">{matched ? 'A match, with a reason behind it. Change the weights and the recommendation can change too. A real system needs richer representations and listener feedback.' : 'Try each end of the slider. There isn’t one universal definition of a good match.'}</p><small>Invented tracks and synthetic scores for this toy exercise, not BOLERO data or an actual recommendation model.</small><details className="music-break"><summary>Take a music break: play the keyboard</summary><Keyboard complete={() => {}}/></details></>;
}

function Ablation({ complete }: { complete: () => void }) {
  const [region, setRegion] = useState('Full image');
  const [tested, setTested] = useState(new Set<string>());
  const notes: Record<string, string> = {
    'Full image': 'The whole image contains anatomy, but also acquisition and quality cues. A strong score alone cannot tell you which signal the model uses.',
    'Macular region': 'Restrict the input to the macular region. Does performance survive? Compare across repeated experiments before interpreting a difference.',
    'Vessel representation': 'Keep vessel structure and remove much of the surrounding appearance. This probes another possible source of information, with its own preprocessing limitations.',
  };
  const vessels = 'M285 145 C260 100 220 60 165 53 S85 65 48 90 M285 151 C260 200 218 240 155 247 S70 225 40 205 M285 147 C314 108 339 87 369 81 M285 153 C320 188 346 205 375 211 M230 80 Q195 100 172 108 M206 66 Q170 30 125 32 M217 220 Q185 197 165 190 M154 247 Q125 270 95 266 M320 109 Q320 65 341 44 M335 190 Q331 238 350 254 M92 59 Q69 43 48 50';
  return <><p>Switch between a retinal view, a macula crop, and a vessel schematic.</p><div className="activity-options compact">{Object.keys(notes).map(label => <button key={label} aria-pressed={region === label} onClick={() => { setRegion(label); const next = new Set([...tested, label]); setTested(next); if (next.size === 3) complete(); }}>{label}</button>)}</div><figure className={`fundus-view ${region === 'Vessel representation' ? 'vessel-view' : ''}`}><svg viewBox={region === 'Macular region' ? '100 90 160 180' : '0 0 420 320'} role="img" aria-label={region === 'Macular region' ? 'Macula crop centered on the fovea, temporal to the optic disc' : 'Right-eye fundus schematic with a temporal macula and nasal optic disc'}><defs><radialGradient id="fundus"><stop stopColor="#d56335"/><stop offset=".7" stopColor="#b84226"/><stop offset="1" stopColor="#541c22"/></radialGradient><radialGradient id="macula"><stop stopColor="#52212a"/><stop offset="1" stopColor="#a73e2c" stopOpacity="0"/></radialGradient><clipPath id="retinal-field"><circle cx="210" cy="150" r="140"/></clipPath><clipPath id="macula-crop"><circle cx="171" cy="156" r="53"/></clipPath></defs><g clipPath={region === 'Macular region' ? 'url(#macula-crop)' : 'url(#retinal-field)'}><circle cx="210" cy="150" r="140" fill={region === 'Vessel representation' ? '#fff0df' : 'url(#fundus)'}/>{region !== 'Vessel representation' && <><ellipse cx="171" cy="156" rx="49" ry="43" fill="url(#macula)"/><circle cx="171" cy="156" r="5" fill="#66232a"/><ellipse cx="285" cy="149" rx="19" ry="24" fill="#f6c58b"/><ellipse cx="288" cy="149" rx="8" ry="13" fill="#ffe2ae"/></>}<path d={vessels} fill="none" stroke={region === 'Vessel representation' ? '#542431' : '#7c2529'} strokeWidth="4" strokeLinecap="round"/><path d={vessels} transform="translate(2 -4)" fill="none" stroke={region === 'Vessel representation' ? '#542431' : '#b72f26'} strokeWidth="2" strokeLinecap="round"/></g>{region !== 'Vessel representation' && <><circle cx="171" cy="156" r="53" fill="none" stroke="#ffd078" strokeDasharray="4 5"/><path d="M171 210v20" stroke="#ffd078"/><text x="171" y="245" textAnchor="middle">Macula / fovea at center</text>{region === 'Full image' && <><path d="M295 130l20-28" stroke="#ffd078"/><text x="310" y="92" textAnchor="middle">Optic disc</text></>}</>}<text x="210" y="310" textAnchor="middle">Right eye / fundus view</text></svg></figure><p className="activity-feedback" role="status">{region === 'Macular region' ? 'The macula surrounds the fovea, temporal to the optic disc. The dashed circle marks the illustrative crop.' : region === 'Full image' ? 'The optic disc is the pale area where vessels converge. The darker macula lies temporal to it, with the fovea at its center.' : 'A schematic of the larger retinal vessels, which arc around the central macula.'}</p><small>Schematic anatomy, not a patient image. <a href="https://www.nei.nih.gov/eye-health-information/healthy-vision/nei-for-kids/about-eye" target="_blank" rel="noreferrer">Eye anatomy reference</a></small></>;

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
  return <><p>No recording to press play on here. Make your own: try four different notes to finish this quest.</p><div className="mini-keyboard">{['C', 'D', 'E', 'F', 'G', 'A', 'B', 'High C'].map((note, i) => <button key={note} aria-label={`Play ${note}`} onClick={() => void play(i)}>{note}</button>)}</div><p className="activity-feedback" role="status">{error ? 'Audio is unavailable in this browser.' : last ? `${last} · ${played.current.size} different notes played. Your neighbors have not complained. Yet.` : 'Sound starts only when you press a key. Click, tap, or use Tab and Enter.'}</p></>;
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
  return <><p>Five colors. One memory. Study the sequence for as long as you like, then hide it and repeat it.</p><div className="memory-sequence">{phase === 'study' ? sequence.map((i, n) => <span key={n} className={`pad-${i}`}>{n + 1}. {labels[i]}</span>) : <span>{phase === 'idle' ? 'The cabinet is waiting.' : `${input.length} / 5 inputs`}</span>}</div><div className="memory-pads">{labels.map((label, i) => <button key={label} className={`pad-${i}`} disabled={phase !== 'play'} onClick={() => press(i)}>{label}</button>)}</div><div className="activity-options compact">{phase === 'study' ? <button onClick={() => setPhase('play')}>Hide sequence & play</button> : <button onClick={start}>{phase === 'idle' ? 'Start round' : 'New round'}</button>}</div><p className="activity-feedback" role="status">{phase === 'won' ? 'Perfect recall. The cabinet would like to offer you one more round.' : phase === 'lost' ? `Not quite. The sequence was ${sequence.map(i => labels[i]).join(' → ')}. Try a fresh round.` : phase === 'play' ? 'Your turn. No timer, no pressure.' : 'Use click, touch, or Tab and Enter. Colors also have names.'}</p></>;
}

export default function RoomActivity({ id, completed, onComplete }: { id: string; completed: boolean; onComplete: (id: string) => void }) {
  const quest = quests.find(q => q.id === id);
  if (!quest) return null;
  const complete = () => onComplete(id);
  return <section className="room-activity" aria-label={quest.label}><div className="activity-heading"><span className="eyebrow">{quest.role}</span><span>{completed ? '✓ Moment complete' : 'Your turn'}</span></div><h3>{quest.label}</h3>{id === 'llm' ? <ModelSandbox complete={complete}/> : id === 'retina' ? <Ablation complete={complete}/> : id === 'music' ? <><SoundCorners onComplete={() => complete()}/><details className="music-break"><summary>Behind the music: try the ML matching desk</summary><MusicDesk complete={complete}/></details></> : id === 'art' ? <SketchCanvas complete={complete}/> : id === 'travel' ? <TravelActivity complete={complete}/> : <><RhythmGame complete={complete}/><details className="music-break"><summary>Bonus: memory cabinet</summary><Memory complete={complete}/></details></>}</section>;
}
