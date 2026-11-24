import { useEffect, useRef, useState } from 'react';

// A small synthesised drum kit, built from Web Audio nodes only (no samples to download).
// Kick: a falling sine with a click on top. Snare: filtered noise over a short tonal body.
// Hi-hat and cymbals: six detuned square waves (the classic 808 metal) through band and high
// passes, plus noise for the crash wash. Toms: a sine that drops into its pitch.
export type Voice = 'kick' | 'snare' | 'hat' | 'crash' | 'ride' | 'tom';

const METAL = [2, 3, 4.16, 5.43, 6.79, 8.21].map(r => r * 40);

export function createDrums() {
  let ctx: AudioContext | null = null;
  let out: GainNode | null = null;
  let noise: AudioBuffer | null = null;

  function init() {
    if (ctx) return ctx;
    ctx = new AudioContext();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16; comp.ratio.value = 4; comp.attack.value = .002; comp.release.value = .2;
    out = ctx.createGain(); out.gain.value = .9;
    out.connect(comp); comp.connect(ctx.destination);
    noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return ctx;
  }

  // An envelope on a gain node: a fast attack, then an exponential decay to silence.
  function amp(c: AudioContext, t: number, peak: number, decay: number, attack = .001) {
    const g = c.createGain();
    g.gain.setValueAtTime(.0001, t);
    g.gain.linearRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(.0001, t + attack + decay);
    g.connect(out!);
    return g;
  }
  function filter(c: AudioContext, type: BiquadFilterType, freq: number, q = .7) {
    const f = c.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q; return f;
  }
  function burst(c: AudioContext, t: number, dur: number, chain: AudioNode[]) {
    const s = c.createBufferSource(); s.buffer = noise;
    let node: AudioNode = s;
    for (const n of chain) { node.connect(n); node = n; }
    s.start(t, Math.random() * 1.5, dur + .05);
    s.onended = () => { s.disconnect(); chain.forEach(n => n.disconnect()); };
  }
  function tone(c: AudioContext, t: number, type: OscillatorType, from: number, to: number, glide: number, dur: number, dest: AudioNode) {
    const o = c.createOscillator(); o.type = type;
    o.frequency.setValueAtTime(from, t);
    if (to !== from) o.frequency.exponentialRampToValueAtTime(to, t + glide);
    o.connect(dest); o.start(t); o.stop(t + dur + .05);
    o.onended = () => o.disconnect();
  }
  function metal(c: AudioContext, t: number, decay: number, band: number, peak: number) {
    const env = amp(c, t, peak, decay);
    const hp = filter(c, 'highpass', 7000); const bp = filter(c, 'bandpass', band, .8);
    bp.connect(hp); hp.connect(env);
    for (const f of METAL) tone(c, t, 'square', f, f, 0, decay + .02, bp);
    setTimeout(() => { bp.disconnect(); hp.disconnect(); env.disconnect(); }, (decay + .3) * 1000);
  }

  function play(voice: Voice, pitch = 150) {
    const c = init();
    void c.resume();
    const t = c.currentTime + .004;
    switch (voice) {
      case 'kick': {
        const body = amp(c, t, 1, .5);
        tone(c, t, 'sine', 165, 46, .11, .5, body);
        burst(c, t, .012, [filter(c, 'highpass', 2500), amp(c, t, .35, .012)]);
        setTimeout(() => body.disconnect(), 800);
        break;
      }
      case 'snare': {
        burst(c, t, .22, [filter(c, 'highpass', 1400), filter(c, 'peaking', 4200, 1), amp(c, t, .75, .2)]);
        const body = amp(c, t, .45, .1);
        tone(c, t, 'triangle', 220, 165, .06, .12, body);
        setTimeout(() => body.disconnect(), 400);
        break;
      }
      case 'hat':
        metal(c, t, .06, 10000, .45);
        break;
      case 'crash':
        metal(c, t, 1.3, 8000, .32);
        burst(c, t, 1.4, [filter(c, 'highpass', 5000), amp(c, t, .3, 1.3)]);
        break;
      case 'ride': {
        metal(c, t, .9, 6500, .2);
        const bell = amp(c, t, .07, .7);
        tone(c, t, 'triangle', 1760, 1760, 0, .7, bell); tone(c, t, 'sine', 2637, 2637, 0, .5, bell);
        setTimeout(() => bell.disconnect(), 1100);
        break;
      }
      case 'tom': {
        const decay = pitch < 130 ? .6 : .45;
        const body = amp(c, t, .95, decay);
        tone(c, t, 'sine', pitch * 1.7, pitch, .09, decay, body);
        burst(c, t, .03, [filter(c, 'lowpass', 1800), amp(c, t, .25, .03)]);
        setTimeout(() => body.disconnect(), (decay + .3) * 1000);
        break;
      }
    }
  }

  return { play, close: () => { void ctx?.close(); ctx = null; } };
}

// One kit per component, closed when it unmounts. Errors (no Web Audio) become a message.
export function useDrums() {
  const kit = useRef<ReturnType<typeof createDrums> | null>(null);
  const [error, setError] = useState('');
  useEffect(() => () => { kit.current?.close(); kit.current = null; }, []);
  function play(voice: Voice, pitch?: number) {
    try { (kit.current ??= createDrums()).play(voice, pitch); }
    catch { setError('Sound is unavailable in this browser.'); }
  }
  return { play, error };
}
