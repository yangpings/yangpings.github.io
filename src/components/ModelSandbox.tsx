import { useEffect, useState } from 'react';
import { accuracy, dataset, freshModel, loss, predict, train, type Dataset, type Features, type Sample } from '../mlPlayground';
import ModelEvaluation from './ModelEvaluation';

export default function ModelSandbox({ complete }: { complete: () => void }) {
  const [preset, setPreset] = useState<Dataset>('Diagonal');
  const [points, setPoints] = useState(() => dataset('Diagonal').filter((_, i) => i % 3 !== 0));
  const [mode, setMode] = useState<Features>('both');
  const [model, setModel] = useState(freshModel);
  const [running, setRunning] = useState(false);
  const [brush, setBrush] = useState(0);
  const [added, setAdded] = useState(0);
  const heldout = dataset(preset).filter((_, i) => i % 3 === 0);
  const correct = accuracy(heldout, model.weights, mode);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setModel(previous => train(previous, points, mode, 5)), 80);
    return () => clearInterval(timer);
  }, [running, points, mode]);
  useEffect(() => {
    const hide = () => { if (document.hidden) setRunning(false); };
    document.addEventListener('visibilitychange', hide);
    return () => document.removeEventListener('visibilitychange', hide);
  }, []);
  function reset() { setRunning(false); setModel(freshModel()); }
  function choose(value: Dataset) { setPreset(value); setPoints(dataset(value).filter((_, i) => i % 3 !== 0)); setAdded(0); reset(); }
  function feature(value: Features) { if (value !== mode) { setMode(value); reset(); } }
  function insert(point: Sample) { if (points.length >= 200) return; setPoints(previous => [...previous, point]); setAdded(previous => previous + 1); reset(); }
  function draw(event: React.MouseEvent<SVGSVGElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const sx = (event.clientX - bounds.left) / bounds.width * 400;
    const sy = (event.clientY - bounds.top) / bounds.height * 320;
    if (sx < 40 || sx > 360 || sy < 20 || sy > 280) return;
    insert({ x: (sx - 40) / 160 - 1, y: 1 - (sy - 20) / 130, label: brush });
  }
  const challenge = preset === 'Diagonal' ? 'Can a straight boundary separate these classes?' : preset === 'Four corners' ? 'Opposite corners share a class. Try a straight boundary, then curved features.' : 'One class forms an island. Can your model learn a boundary around it?';
  return <div className="ml-playground"><div className="model-sandbox">
    <div className="sandbox-intro"><span className="eyebrow">THE ML PLAYGROUND</span><h4>Draw data. Train a model. Try to break it.</h4><p>{challenge}</p></div>
    <div className="dataset-picker" aria-label="Dataset presets">{(['Diagonal', 'Four corners', 'Island'] as Dataset[]).map(name => <button key={name} aria-pressed={preset === name} onClick={() => choose(name)}>{name}</button>)}</div>
    <div className="sandbox-layout"><div className="sandbox-chart">
      <div className="plot-tools"><span>Add a training dot:</span><button aria-pressed={brush === 0} onClick={() => setBrush(0)}>Coral / A</button><button aria-pressed={brush === 1} onClick={() => setBrush(1)}>Sky / B</button></div>
      <svg viewBox="0 0 400 320" role="img" aria-label="Editable classification plot. Click to add a training dot. Keyboard add-dot controls are below." onClick={draw}>
        <rect x="40" y="20" width="320" height="260" fill="#280d15"/>
        {Array.from({ length: 520 }, (_, i) => { const x = (i % 26 + .5) / 26 * 2 - 1; const y = 1 - (Math.floor(i / 26) + .5) / 20 * 2; const p = predict({ x, y, label: 0 }, model.weights, mode); return <rect key={i} x={40 + i % 26 * 320 / 26} y={20 + Math.floor(i / 26) * 13} width={320 / 26 + .2} height="13.2" fill={p >= .5 ? '#82cfff' : '#ff7868'} opacity={model.steps ? .08 + Math.abs(p - .5) * .48 : .035}/>; })}
        <path d="M40 20v260h320M200 20v260M40 150h320" fill="none" stroke="#b66b77" strokeOpacity=".4"/>
        {[...points, ...heldout].map((point, i) => { const x = 40 + (point.x + 1) * 160; const y = 20 + (1 - point.y) * 130; const prediction = predict(point, model.weights, mode) >= .5 ? '#82cfff' : '#ff7868'; return <g key={i}>{i >= points.length ? <rect x={x - 6} y={y - 6} width="12" height="12" rx="1" fill="#280d15" stroke={prediction} strokeWidth="2"/> : <circle cx={x} cy={y} r="6" fill="#280d15" stroke={prediction} strokeWidth="2"/>}<circle cx={x} cy={y} r="3" fill={point.label ? '#82cfff' : '#ff7868'}/></g>; })}
        <text x="200" y="308" textAnchor="middle" fill="#e9b5b0" fontSize="12">Horizontal feature</text><text transform="translate(17,150) rotate(-90)" textAnchor="middle" fill="#e9b5b0" fontSize="12">Vertical feature</text>
      </svg><div className="sandbox-legend"><span>Circle: training dot</span><span>Square: held-out dot</span></div><small>Center = true class. Outline = prediction. Shading = learned probability.</small>
      <details className="keyboard-dots"><summary>Add dots without a mouse</summary><div className="activity-options compact">{[{ x: -.5, y: .5, label: brush }, { x: .5, y: .5, label: brush }, { x: -.5, y: -.5, label: brush }, { x: .5, y: -.5, label: brush }].map((point, i) => <button key={i} disabled={points.length >= 200} onClick={() => insert(point)}>Add {brush ? 'sky' : 'coral'} dot: {['upper left', 'upper right', 'lower left', 'lower right'][i]}</button>)}</div></details>
    </div><div className="sandbox-controls"><span className="eyebrow">MODEL INPUTS</span><div className="activity-options"><button aria-pressed={mode === 'both'} onClick={() => feature('both')}>Use both features</button><button aria-pressed={mode === 'horizontal'} onClick={() => feature('horizontal')}>Use horizontal feature only</button><button aria-pressed={mode === 'curved'} onClick={() => feature('curved')}>Use curved features</button></div><span className="eyebrow">TRAINING CONTROLS</span><div className="activity-options"><button className="sandbox-train" onClick={() => setRunning(value => !value)}>{running ? 'Pause training' : 'Start live training'}</button><button onClick={() => { setRunning(false); setModel(previous => train(previous, points, mode, 50)); }}>Train 50 steps</button><button onClick={reset}>Reset model</button></div><div className="loss-chart"><span>Training loss <strong>{loss(points, model.weights, mode).toFixed(3)}</strong></span><svg viewBox="0 0 200 65" role="img" aria-label="Training loss history"><path d="M0 60h200" stroke="#804452"/>{model.losses.length > 1 && <polyline points={model.losses.map((value, i) => `${i / (model.losses.length - 1) * 200},${60 - Math.min(value, 1.5) / 1.5 * 55}`).join(' ')} fill="none" stroke="#ffd078" strokeWidth="2"/>}</svg></div></div></div>
    <div className="sandbox-metrics"><div><strong>{Math.round(accuracy(points, model.weights, mode) / points.length * 100)}%</strong><span>Training accuracy / {points.length} dots</span></div><div><strong>{Math.round(correct / heldout.length * 100)}%</strong><span>Held-out accuracy / {heldout.length} dots</span></div><div><strong>{model.steps}</strong><span>Training steps</span></div></div>
    <p role="status" className="activity-feedback playground-status">{model.steps} training steps / {correct} / {heldout.length} held-out dots classified correctly. {added ? `${added} custom dots added.` : ''} {running ? 'Training live.' : 'Paused.'}</p>
    <p className="sandbox-explanation">{model.steps === 0 ? 'Train first, then change the dataset or add a surprising dot. Editing data or inputs resets the model for a fair comparison.' : mode === 'curved' ? 'Curved features add interactions and squared coordinates. Check whether those richer inputs help on the held-out examples too.' : preset !== 'Diagonal' ? 'More training steps alone cannot fix a representation that cannot capture this pattern. Try curved features.' : mode === 'horizontal' ? 'The true classes depend on both coordinates. More training cannot recover a missing input.' : 'Add an outlier with the opposite label. Does training accuracy tell the whole story?'}</p>
    <small>Logistic regression with optional polynomial features.</small>
  </div><details className="model-evaluation"><summary>Put your evaluator hat on: would you trust a high score?</summary><div><ModelEvaluation complete={complete}/></div></details></div>;
}
