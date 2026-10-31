import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import type { Sample } from '../mlPlayground';
import { accuracyOf, createNet, forward, inputs, lossOf, makeData, predict, trainEpoch, type Activation, type Net, type Shape } from '../neuralNet';
import ModelEvaluation from './ModelEvaluation';

// A neural-network playground: pick a dataset, shape the network, and watch it learn. The decision
// boundary is painted live on a canvas; the network diagram shows each weight's sign and strength;
// curves track loss and train/test accuracy every epoch. Click the plot to add your own points.
const SHAPES: Shape[] = ['Circle', 'XOR', 'Spiral', 'Gaussians'];
const A = [255, 120, 104], B = [130, 207, 255];

export default function ModelSandbox({ complete }: { complete: () => void }) {
  const [shape, setShape] = useState<Shape>('Circle');
  const [noise, setNoise] = useState(10);
  const [hidden, setHidden] = useState([6, 4]);
  const [activation, setActivation] = useState<Activation>('tanh');
  const [features, setFeatures] = useState(false);
  const [rate, setRate] = useState(.1);
  const [l2, setL2] = useState(0);
  const [extra, setExtra] = useState<Sample[]>([]);
  const [brush, setBrush] = useState(0);
  const [running, setRunning] = useState(false);
  const [seed, setSeed] = useState(1);
  const data = useMemo(() => makeData(shape, 240, noise / 100, seed * 97 + SHAPES.indexOf(shape)), [shape, noise, seed]);
  const train = useMemo(() => [...data.filter((_, i) => i % 4 !== 0), ...extra], [data, extra]);
  const test = useMemo(() => data.filter((_, i) => i % 4 === 0), [data]);
  const [net, setNet] = useState<Net>(() => createNet([6, 4], 'tanh', false, 1));
  const canvas = useRef<HTMLCanvasElement>(null);
  const done = useRef(false);

  // Any change to the data or the network starts a fresh model, so comparisons are fair.
  const rebuild = () => { setRunning(false); setNet(createNet(hidden, activation, features, seed)); };
  useEffect(rebuild, [hidden, activation, features, data, extra, seed]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!running) return;
    let frame = 0, count = 0;
    const loop = () => { setNet(n => trainEpoch(n, train, test, features, rate, l2 / 1000, n.steps + 11)); if (++count < 4000) frame = requestAnimationFrame(loop); };
    frame = requestAnimationFrame(loop);
    const hide = () => { if (document.hidden) setRunning(false); };
    document.addEventListener('visibilitychange', hide);
    return () => { cancelAnimationFrame(frame); document.removeEventListener('visibilitychange', hide); };
  }, [running, train, test, features, rate, l2]);

  const last = net.history.at(-1);
  const testAcc = last?.test ?? accuracyOf(net, test, features);
  useEffect(() => { if (!done.current && net.steps >= 20 && testAcc >= .85) { done.current = true; complete(); } }, [net.steps, testAcc, complete]);

  // Paint the decision boundary: a coarse grid of probabilities, colour by class, alpha by confidence.
  useEffect(() => {
    const c = canvas.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    const N = 60, img = ctx.createImageData(N, N);
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const p = net.steps ? predict(net, { x: (i + .5) / N * 2 - 1, y: 1 - (j + .5) / N * 2 }, features) : .5;
      const col = p >= .5 ? B : A, conf = Math.abs(p - .5) * 2, k = (j * N + i) * 4;
      img.data[k] = col[0]; img.data[k + 1] = col[1]; img.data[k + 2] = col[2]; img.data[k + 3] = 30 + conf * 120;
    }
    const off = document.createElement('canvas'); off.width = N; off.height = N; off.getContext('2d')!.putImageData(img, 0, 0);
    ctx.clearRect(0, 0, c.width, c.height); ctx.imageSmoothingEnabled = true; ctx.drawImage(off, 0, 0, c.width, c.height);
  }, [net, features]);

  function addPoint(e: MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width * 2 - 1, y = 1 - (e.clientY - r.top) / r.height * 2;
    if (Math.abs(x) > 1 || Math.abs(y) > 1 || extra.length >= 60) return;
    setExtra(p => [...p, { x, y, label: brush }]);
  }
  const step = (epochs: number) => { setRunning(false); setNet(n => { let m = n; for (let i = 0; i < epochs; i++) m = trainEpoch(m, train, test, features, rate, l2 / 1000, m.steps + 11); return m; }); };

  // The network diagram: neurons by layer, edges coloured by sign, thickness by size.
  const probe = forward(net, inputs({ x: .3, y: .3 }, features));
  const layerX = (l: number) => 30 + l * (300 / (net.sizes.length - 1));
  const nodeY = (l: number, i: number) => { const n = net.sizes[l]; return 100 + (i - (n - 1) / 2) * Math.min(26, 170 / n); };
  const labels = features ? ['x', 'y', 'x²', 'y²', 'xy'] : ['x', 'y'];
  const curve = (key: 'loss' | 'train' | 'test', max: number) => net.history.length > 1 ? net.history.map((h, i) => `${(i / (net.history.length - 1)) * 300},${70 - Math.min(h[key], max) / max * 64}`).join(' ') : '';

  return <div className="ml-playground nn">
    <div className="model-sandbox">
      <div className="nn-top">
        <div className="dataset-picker" role="radiogroup" aria-label="Dataset presets">{SHAPES.map(s => <button key={s} role="radio" aria-checked={shape === s} aria-pressed={shape === s} onClick={() => { setShape(s); setExtra([]); }}>{s}</button>)}</div>
        <div className="nn-run">
          <button className="sandbox-train" data-primary aria-pressed={running} onClick={() => setRunning(v => !v)}><svg viewBox="0 0 16 16" aria-hidden="true">{running ? <path d="M4 3h3v10H4zM9 3h3v10H9z"/> : <path d="M4 2.5v11l9-5.5z"/>}</svg>{running ? 'Pause' : net.steps ? 'Resume training' : 'Train'}</button>
          <button onClick={() => step(1)}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 2.5v11l7-5.5zM11 3h2.5v10H11z"/></svg>Step 1 epoch</button>
          <button onClick={rebuild}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3a5 5 0 1 1-4.6 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M2 2v5h5z"/></svg>Reset model</button>
        </div>
      </div>

      <div className="nn-grid">
        <div className="nn-plot-wrap">
          <div className="nn-plot" onClick={addPoint} role="img" aria-label={`Decision boundary plot of ${shape} data. Click to add a ${brush ? 'sky' : 'coral'} training point.`}>
            <canvas ref={canvas} width="360" height="360"/>
            <svg viewBox="-1 -1 2 2" preserveAspectRatio="none" aria-hidden="true">
              {train.map((p, i) => <circle key={`t${i}`} cx={p.x} cy={-p.y} r=".028" className={p.label ? 'pt-b' : 'pt-a'} />)}
              {test.map((p, i) => <rect key={`v${i}`} x={p.x - .024} y={-p.y - .024} width=".048" height=".048" className={`pt-test ${p.label ? 'pt-b' : 'pt-a'}`}/>)}
            </svg>
          </div>
          <div className="nn-brush"><span>Add points:</span>
            <button aria-pressed={brush === 0} onClick={() => setBrush(0)}><i className="pt-a"/>Coral</button>
            <button aria-pressed={brush === 1} onClick={() => setBrush(1)}><i className="pt-b"/>Sky</button>
            {extra.length > 0 && <button onClick={() => setExtra([])}>Remove {extra.length} added</button>}
          </div>
        </div>

        <div className="nn-side">
          <svg className="nn-diagram" viewBox="0 0 360 200" role="img" aria-label={`Network with layers ${net.sizes.join(', ')}.`}>
            {net.w.map((wl, l) => wl.map((row, j) => row.map((wt, i) => <line key={`${l}-${j}-${i}`} x1={layerX(l)} y1={nodeY(l, i)} x2={layerX(l + 1)} y2={nodeY(l + 1, j)}
              stroke={wt >= 0 ? '#82cfff' : '#ff7868'} strokeOpacity={Math.min(.9, .15 + Math.abs(wt) * .5)} strokeWidth={Math.min(4, .4 + Math.abs(wt) * 1.6)}/>)))}
            {net.sizes.map((n, l) => Array.from({ length: n }, (_, i) => { const v = probe[l][i] ?? 0; return <g key={`${l}-${i}`}>
              <circle cx={layerX(l)} cy={nodeY(l, i)} r="8" fill={`rgba(255,209,120,${Math.min(1, .2 + Math.abs(v) * .8)})`} stroke="#fff1db" strokeWidth="1.2"/>
              {l === 0 && <text x={layerX(l) - 14} y={nodeY(l, i) + 4} textAnchor="end">{labels[i]}</text>}</g>; }))}
            <text x={layerX(net.sizes.length - 1) + 14} y="104">ŷ</text>
          </svg>
          <div className="nn-layers">
            <span>Hidden layers</span>
            {hidden.map((n, i) => <div key={i} className="nn-layer"><button aria-label={`Fewer neurons in layer ${i + 1}`} disabled={n <= 1} onClick={() => setHidden(h => h.map((v, k) => k === i ? v - 1 : v))}>−</button><b>{n}</b><button aria-label={`More neurons in layer ${i + 1}`} disabled={n >= 8} onClick={() => setHidden(h => h.map((v, k) => k === i ? v + 1 : v))}>+</button></div>)}
            <button disabled={hidden.length >= 3} onClick={() => setHidden(h => [...h, 3])}>Add layer</button>
            <button disabled={hidden.length <= 1} onClick={() => setHidden(h => h.slice(0, -1))}>Remove layer</button>
          </div>
          <div className="nn-settings">
            <div role="radiogroup" aria-label="Activation">{(['tanh', 'relu'] as Activation[]).map(a => <button key={a} role="radio" aria-checked={activation === a} aria-pressed={activation === a} onClick={() => setActivation(a)}>{a === 'tanh' ? 'tanh' : 'ReLU'}</button>)}</div>
            <button aria-pressed={features} onClick={() => setFeatures(f => !f)}>Use curved features</button>
            <label>Learning rate <output>{rate}</output><input type="range" min="0" max="5" value={[.01, .03, .1, .3, .6, 1].indexOf(rate)} aria-label="Learning rate" onChange={e => setRate([.01, .03, .1, .3, .6, 1][Number(e.target.value)])}/></label>
            <label>Regularisation <output>{l2 ? `${l2}e-3` : 'off'}</output><input type="range" min="0" max="10" value={l2} aria-label="Regularisation" onChange={e => setL2(Number(e.target.value))}/></label>
            <label>Noise <output>{noise}%</output><input type="range" min="0" max="50" step="5" value={noise} aria-label="Noise" onChange={e => setNoise(Number(e.target.value))}/></label>
            <button onClick={() => setSeed(s => s + 1)}>New sample</button>
          </div>
        </div>
      </div>

      <div className="nn-metrics">
        <div><span>Epoch</span><strong>{net.steps}</strong></div>
        <div><span>Training loss</span><strong>{(last?.loss ?? lossOf(net, train, features)).toFixed(3)}</strong></div>
        <div><span>Train accuracy</span><strong>{Math.round((last?.train ?? accuracyOf(net, train, features)) * 100)}%</strong></div>
        <div><span>Held-out accuracy / {test.length} points</span><strong>{Math.round(testAcc * 100)}%</strong></div>
        <svg className="nn-curves" viewBox="0 0 300 72" role="img" aria-label="Loss and accuracy over training">
          <polyline points={curve('loss', 1)} className="c-loss"/><polyline points={curve('train', 1)} className="c-train"/><polyline points={curve('test', 1)} className="c-test"/>
        </svg>
        <div className="nn-legend"><i className="c-loss"/>Loss <i className="c-train"/>Train <i className="c-test"/>Held-out</div>
      </div>
      <p role="status" className="activity-feedback playground-status">After {net.steps} {net.steps === 1 ? 'epoch' : 'epochs'}, the network classifies {Math.round(testAcc * 100)}% of {test.length} held-out points correctly. {extra.length ? `${extra.length} custom points added. ` : ''}{running ? 'Training live.' : 'Paused.'}</p>
      <p className="sandbox-explanation">{net.steps === 0 ? 'Press Start live training and watch the boundary form. Then try the Spiral, add noise, or shrink the network until it can no longer fit.'
        : last && last.train - last.test > .12 ? 'Training accuracy is well above held-out accuracy: the network is memorising noise. Try regularisation or a smaller network.'
        : testAcc < .7 ? 'Not separating yet. A deeper or wider network, curved features, or a higher learning rate can help.'
        : 'It fits. Now try to break it: add points that contradict the pattern, or raise the noise.'}</p>
      <small>A fully connected network trained with mini-batch gradient descent and cross-entropy loss, all in your browser.</small>
    </div>
    <details className="model-evaluation"><summary>How would you test this model?</summary><div><ModelEvaluation complete={complete}/></div></details>
  </div>;
}
