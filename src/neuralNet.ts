// A tiny fully connected neural network for two-dimensional classification, trained in the browser
// with mini-batch gradient descent. Inputs are the point's coordinates (optionally with squared and
// product terms); hidden layers use tanh or ReLU; the output is a sigmoid probability of class B.
import type { Sample } from './mlPlayground';

export type Activation = 'tanh' | 'relu';
export type Net = { sizes: number[]; w: number[][][]; b: number[][]; activation: Activation; steps: number; history: { loss: number; train: number; test: number }[] };

function rand(seed: { s: number }) { seed.s = (seed.s * 1664525 + 1013904223) % 4294967296; return seed.s / 4294967296; }

export function inputs(p: { x: number; y: number }, features: boolean) {
  return features ? [p.x, p.y, p.x * p.x, p.y * p.y, p.x * p.y] : [p.x, p.y];
}

export function createNet(hidden: number[], activation: Activation, features: boolean, seedValue = 7): Net {
  const sizes = [features ? 5 : 2, ...hidden, 1];
  const seed = { s: seedValue };
  const w = sizes.slice(1).map((n, l) => Array.from({ length: n }, () => Array.from({ length: sizes[l] }, () => (rand(seed) * 2 - 1) * Math.sqrt(2 / (sizes[l] + n)))));
  const b = sizes.slice(1).map(n => Array(n).fill(0));
  return { sizes, w, b, activation, steps: 0, history: [] };
}

const act = (a: Activation, z: number) => a === 'tanh' ? Math.tanh(z) : Math.max(0, z);
const dact = (a: Activation, out: number) => a === 'tanh' ? 1 - out * out : out > 0 ? 1 : 0;
const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

// Every layer's activations for one input; the last layer holds the probability.
export function forward(net: Net, x: number[]) {
  const layers = [x];
  net.w.forEach((wl, l) => {
    const last = l === net.w.length - 1, prev = layers[l];
    layers.push(wl.map((row, j) => { let z = net.b[l][j]; for (let i = 0; i < row.length; i++) z += row[i] * prev[i]; return last ? sigmoid(z) : act(net.activation, z); }));
  });
  return layers;
}
export const predict = (net: Net, p: { x: number; y: number }, features: boolean) => forward(net, inputs(p, features)).at(-1)![0];

export function lossOf(net: Net, data: Sample[], features: boolean) {
  if (!data.length) return 0;
  return data.reduce((s, p) => { const q = Math.min(1 - 1e-7, Math.max(1e-7, predict(net, p, features))); return s - (p.label * Math.log(q) + (1 - p.label) * Math.log(1 - q)); }, 0) / data.length;
}
export const accuracyOf = (net: Net, data: Sample[], features: boolean) => data.length ? data.filter(p => Number(predict(net, p, features) >= .5) === p.label).length / data.length : 0;

// One epoch of mini-batch gradient descent with L2 regularisation. Returns a new net.
export function trainEpoch(net: Net, data: Sample[], test: Sample[], features: boolean, rate: number, l2: number, seedValue: number): Net {
  const w = net.w.map(l => l.map(r => [...r])), b = net.b.map(l => [...l]);
  const n = { ...net, w, b };
  const order = data.map((_, i) => i); const seed = { s: seedValue };
  for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rand(seed) * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  const batch = 10;
  for (let start = 0; start < order.length; start += batch) {
    const gw = w.map(l => l.map(r => r.map(() => 0))), gb = b.map(l => l.map(() => 0));
    const chunk = order.slice(start, start + batch);
    for (const k of chunk) {
      const p = data[k]; const layers = forward(n, inputs(p, features));
      let delta = [layers.at(-1)![0] - p.label];
      for (let l = w.length - 1; l >= 0; l--) {
        const prev = layers[l];
        delta.forEach((d, j) => { gb[l][j] += d; for (let i = 0; i < prev.length; i++) gw[l][j][i] += d * prev[i]; });
        if (l > 0) delta = prev.map((out, i) => w[l].reduce((s, row, j) => s + row[i] * delta[j], 0) * dact(net.activation, out));
      }
    }
    const m = chunk.length;
    w.forEach((l, li) => l.forEach((r, j) => r.forEach((_, i) => { r[i] -= rate * (gw[li][j][i] / m + l2 * r[i]); })));
    b.forEach((l, li) => l.forEach((_, j) => { l[j] -= rate * gb[li][j] / m; }));
  }
  const history = [...net.history, { loss: lossOf(n, data, features), train: accuracyOf(n, data, features), test: accuracyOf(n, test, features) }].slice(-160);
  return { ...n, steps: net.steps + 1, history };
}

// Datasets: 2-D points in [-1, 1], with optional label noise.
export type Shape = 'Circle' | 'XOR' | 'Spiral' | 'Gaussians';
export function makeData(shape: Shape, count: number, noise: number, seedValue: number): Sample[] {
  const seed = { s: seedValue }; const r = () => rand(seed);
  const gauss = () => { const u = Math.max(1e-9, r()), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const out: Sample[] = [];
  for (let i = 0; i < count; i++) {
    let x = 0, y = 0, label = 0;
    if (shape === 'Circle') { const radius = i % 2 ? r() * .45 : .62 + r() * .33; const t = r() * Math.PI * 2; x = radius * Math.cos(t); y = radius * Math.sin(t); label = i % 2; }
    else if (shape === 'XOR') { x = r() * 2 - 1; y = r() * 2 - 1; const pad = .06; x += x > 0 ? pad : -pad; y += y > 0 ? pad : -pad; label = Number(x * y > 0); }
    else if (shape === 'Spiral') { label = i % 2; const t = (i / count) * 2.4 * Math.PI; const rr = .08 + (i / count) * .85; x = rr * Math.cos(t + label * Math.PI); y = rr * Math.sin(t + label * Math.PI); }
    else { label = i % 2; x = (label ? .42 : -.42) + gauss() * .26; y = (label ? .38 : -.38) + gauss() * .26; }
    x += gauss() * noise * .25; y += gauss() * noise * .25;
    if (r() < noise * .25) label = 1 - label;
    out.push({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)), label });
  }
  return out;
}
