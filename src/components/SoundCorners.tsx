import { useEffect, useRef, useState } from 'react';
import StepSequencer from './StepSequencer';

export function useSound() {
  const audio = useRef<AudioContext | null>(null);
  const [error, setError] = useState('');
  useEffect(() => () => { void audio.current?.close(); }, []);
  async function sound(kind: string, frequency = 440) {
    try {
      audio.current ??= new AudioContext(); const ctx = audio.current;
      await ctx.resume(); if (ctx.state === 'closed') return;
      const gain = ctx.createGain(); gain.connect(ctx.destination);
      const duration = kind === 'cymbal' ? .65 : kind === 'tone' ? .65 : kind === 'bass' ? .42 : kind === 'tick' ? .09 : .25;
      gain.gain.setValueAtTime(kind === 'tick' ? .07 : kind === 'bass' ? .2 : .16, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + duration);
      if (kind === 'snare' || kind === 'hat' || kind === 'cymbal') {
        const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
        const data = buffer.getChannelData(0); for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        const source = ctx.createBufferSource(); const filter = ctx.createBiquadFilter();
        filter.type = 'highpass'; filter.frequency.value = kind === 'snare' ? 900 : 6000;
        source.buffer = buffer; source.connect(filter); filter.connect(gain); source.start();
        source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); };
      } else {
        const osc = ctx.createOscillator(); osc.type = kind === 'tone' || kind === 'tick' ? 'sine' : kind === 'bass' ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(kind === 'kick' ? 130 : frequency, ctx.currentTime);
        if (kind !== 'tone' && kind !== 'tick' && kind !== 'bass') osc.frequency.exponentialRampToValueAtTime(kind === 'kick' ? 40 : frequency * .5, ctx.currentTime + duration);
        if (kind === 'bass') { const low = ctx.createBiquadFilter(); low.type = 'lowpass'; low.frequency.value = 420; osc.connect(low); low.connect(gain); osc.start(); osc.stop(ctx.currentTime + duration); osc.onended = () => { osc.disconnect(); low.disconnect(); gain.disconnect(); }; return; }
        osc.connect(gain); osc.start(); osc.stop(ctx.currentTime + duration);
        osc.onended = () => { osc.disconnect(); gain.disconnect(); };
      }
    } catch { setError('Sound is unavailable in this browser.'); }
  }
  return { sound, error };
}

export function DrumKit({ complete }: { complete: () => void }) {
  const { sound, error } = useSound();
  const [hit, setHit] = useState(''); const played = useRef(new Set<string>());
  const pieces = [{ label: 'Crash', key: 'y', kind: 'cymbal', frequency: 440 }, { label: 'Hi-hat', key: 'h', kind: 'hat', frequency: 440 }, { label: 'Ride', key: 'u', kind: 'cymbal', frequency: 660 }, { label: 'Mid tom', key: 'g', kind: 'tom', frequency: 150 }, { label: 'High tom', key: 't', kind: 'tom', frequency: 190 }, { label: 'Snare', key: 'f', kind: 'snare', frequency: 440 }, { label: 'Kick', key: ' ', kind: 'kick', frequency: 70 }, { label: 'Floor tom', key: 'j', kind: 'tom', frequency: 110 }];
  function play(piece: typeof pieces[number]) { void sound(piece.kind, piece.frequency); setHit(piece.label); played.current.add(piece.label); if (played.current.size >= 4) complete(); }
  return <><p>A right-handed kit, viewed from the stool. Tap a piece or use its key.</p><div className="drum-kit" tabIndex={0} role="group" aria-label="Playable drum kit" onKeyDown={e => { if (e.target !== e.currentTarget || e.repeat) return; const piece = pieces.find(p => p.key === e.key.toLowerCase()); if (piece) { e.preventDefault(); play(piece); } }}>{pieces.map(piece => <button key={piece.label} className={`drum-${piece.kind} piece-${piece.label.toLowerCase().replaceAll(' ', '-')} ${hit === piece.label ? 'struck' : ''}`} onClick={() => play(piece)}>{piece.label}<small>{piece.key === ' ' ? 'Space' : piece.key.toUpperCase()}</small></button>)}</div><p role="status" className="activity-feedback">{error || (hit ? `${hit}. Keep the groove going.` : 'Tap the kit, or focus its frame and use Y H T G U F Space J. Buttons also work with Tab and Enter.')}</p></>;
}

export function Singing({ complete }: { complete: () => void }) {
  const { sound, error } = useSound(); const [note, setNote] = useState(0); const [listening, setListening] = useState(false); const [pending, setPending] = useState(false); const [pitch, setPitch] = useState(''); const [cents, setCents] = useState<number | null>(null);
  const cleanup = useRef<() => void>(() => {}); const alive = useRef(true);
  const targets = [{ name: 'C4', hz: 261.63 }, { name: 'D4', hz: 293.66 }, { name: 'E4', hz: 329.63 }, { name: 'G4', hz: 392 }];
  useEffect(() => { alive.current = true; return () => { alive.current = false; cleanup.current(); }; }, []);
  async function listen() {
    if (pending || listening) return;
    setPending(true);
    setPitch('Waiting for microphone access…');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!alive.current) { stream.getTracks().forEach(t => t.stop()); return; }
      const ctx = new AudioContext(); const source = ctx.createMediaStreamSource(stream); const analyser = ctx.createAnalyser(); analyser.fftSize = 2048; source.connect(analyser);
      let frame = 0; cleanup.current = () => { cancelAnimationFrame(frame); stream.getTracks().forEach(t => t.stop()); source.disconnect(); void ctx.close(); };
      await ctx.resume(); setListening(true); const data = new Float32Array(analyser.fftSize); let held = 0;
      const tick = () => {
        analyser.getFloatTimeDomainData(data); let energy = 0; for (const value of data) energy += value * value;
        if (Math.sqrt(energy / data.length) < .015) { setPitch('Sing or hum a steady note…'); setCents(null); held = 0; }
        else {
          let best = 0; let lag = 0;
          for (let offset = Math.floor(ctx.sampleRate / 650); offset < Math.floor(ctx.sampleRate / 80); offset++) {
            let dot = 0, a = 0, b = 0;
            for (let i = 0; i < data.length - offset; i++) { dot += data[i] * data[i + offset]; a += data[i] ** 2; b += data[i + offset] ** 2; }
            const correlation = dot / Math.sqrt(a * b || 1); if (correlation > best) { best = correlation; lag = offset; }
          }
          if (best > .85 && lag) { const hz = ctx.sampleRate / lag; const cents = 1200 * Math.log2(hz / targets[note].hz); const matched = Math.abs(cents) < 50; setCents(Math.max(-100, Math.min(100, cents))); setPitch(`${Math.round(hz)} Hz · ${matched ? 'On the note!' : cents < 0 ? 'Try a little higher' : 'Try a little lower'}`); held = matched ? held + 1 : 0; if (held >= 12) complete(); }
          else { setPitch('Try a clear, steady vowel. Headphones help.'); held = 0; }
        }
        frame = requestAnimationFrame(tick);
      }; tick();
    } catch { cleanup.current(); if (alive.current) setPitch('Microphone unavailable or access declined. You can still play a note and sing along.'); }
    finally { if (alive.current) setPending(false); }
  }
  return <><p>Play a reference note, then sing or hum it back. Choose a comfortable pitch. This is a warm-up, not a judgment of your voice.</p><div className="activity-options compact">{targets.map((target, i) => <button key={target.name} disabled={listening} aria-pressed={note === i} onClick={() => setNote(i)}>{target.name}</button>)}<button onClick={() => { void sound('tone', targets[note].hz); complete(); }}>Play reference note</button></div><div className="activity-options compact"><button disabled={listening || pending} onClick={() => void listen()}>Enable microphone pitch guide</button>{listening && <button onClick={() => { cleanup.current(); setListening(false); setPitch('Microphone stopped.'); }}>Stop microphone</button>}</div><div className={`pitch-meter${listening ? ' is-live' : ''}`} aria-hidden="true"><span className="pitch-note">{targets[note].name}</span><div className="pitch-track"><i className="pitch-zone"/><b style={{ left: `${50 + (cents ?? 0) / 2}%`, opacity: cents === null ? .25 : 1 }} className={cents !== null && Math.abs(cents) < 50 ? 'is-on' : ''}/></div><div className="pitch-scale"><span>Flat</span><span>On pitch</span><span>Sharp</span></div></div><p role="status" className="activity-feedback">{error || pitch || 'Sing along without a microphone, or enable the optional live pitch guide.'}</p><small>Microphone audio is analyzed in your browser. It is never recorded or uploaded. The pitch guide is approximate.</small></>;
}

export function Listening({ complete }: { complete: () => void }) {
  const { sound, error } = useSound(); const [playing, setPlaying] = useState(false); const [mood, setMood] = useState('Slow glow');
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined); const step = useRef(0);
  function stop() { clearInterval(timer.current); timer.current = undefined; setPlaying(false); }
  useEffect(() => () => clearInterval(timer.current), []);
  const [lit, setLit] = useState(-1);
  const notesFor = (m: string) => m === 'Slow glow' ? [261.63, 329.63, 392, 329.63] : [440, 523.25, 659.25, 523.25, 392, 523.25];
  function start() { stop(); setPlaying(true); complete(); step.current = 0; const notes = notesFor(mood); const tick = () => { const i = step.current++ % notes.length; setLit(i); void sound('tone', notes[i]); }; tick(); timer.current = setInterval(tick, mood === 'Slow glow' ? 650 : 300); }
  const notes = notesFor(mood);
  return <><p>Put on headphones and settle in. Pick a little instrumental loop and let it play while you listen.</p>
    <div className={`listen-visual${playing ? ' is-playing' : ''}`} aria-hidden="true">
      <div className="listen-disc"><span/></div>
      <div className="listen-bars">{notes.map((hz, i) => <i key={i} className={playing && lit === i ? 'is-lit' : ''} style={{ height: `${30 + (hz - 250) / 420 * 70}%` }}/>)}</div>
    </div>
    <div className="activity-options compact">{['Slow glow', 'Bright steps'].map(label => <button key={label} aria-pressed={mood === label} onClick={() => { stop(); setMood(label); }}>{label}</button>)}<button onClick={playing ? stop : start}>{playing ? 'Stop listening' : 'Listen to loop'}</button></div><p className="activity-feedback" role="status">{error || (playing ? `Now playing: ${mood}` : 'No loop is playing.')}</p><small>Synthesized demo loops made for this site. These are not Eric's recordings or a claimed favorite playlist.</small></>;
}

export default function SoundCorners({ onComplete }: { onComplete: (id: string) => void }) {
  const [corner, setCorner] = useState('Drums');
  return <><div className="corner-picker" aria-label="Music corners">{['Drums', 'Singing', 'Listening'].map(label => <button key={label} aria-pressed={corner === label} onClick={() => setCorner(label)}>{label}</button>)}</div><div key={corner}>{corner === 'Drums' ? <><StepSequencer complete={() => onComplete('drums')}/><details className="music-break"><summary>Play the kit by hand</summary><DrumKit complete={() => onComplete('drums')}/></details></> : corner === 'Singing' ? <Singing complete={() => onComplete('singing')}/> : <Listening complete={() => onComplete('listening')}/>}</div></>;
}
