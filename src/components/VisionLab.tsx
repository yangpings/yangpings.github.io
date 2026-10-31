import { useState, type PointerEvent } from 'react';

// The Vision lab: an interactive fundus viewer beside the study's real results. Switch the model's
// input between the full fundus, a central-retina crop and a vessel-enhanced image; toggle the
// anatomy; sweep a magnifying lens over the retina; and lay an illustrative attention map on top.
// The chart shows AUROC for Alzheimer's disease from Eric's UK Biobank study.
type View = 'full' | 'central' | 'vessels';
const views: { id: View; label: string; auroc: number; note: string }[] = [
  { id: 'full', label: 'Full fundus', auroc: .671, note: 'The whole image holds anatomy, but also camera, lighting and quality cues. A score alone cannot say which signal the model used.' },
  { id: 'central', label: 'Central retina', auroc: .658, note: 'Cropped to the centre around the macula, the score barely moves: most of what the model used survives the crop.' },
  { id: 'vessels', label: 'Vessel-enhanced', auroc: .608, note: 'Keeping mostly the vessel tree costs the most. Vessels carry some signal, but not all of it.' },
];
const benchmarks = [
  { label: 'Demographics only', auroc: .710 },
  { label: 'Demographics + fundus', auroc: .714 },
  { label: 'OCT-derived measures', auroc: .795 },
];
const vessels = 'M285 145 C260 100 220 60 165 53 S85 65 48 90 M285 151 C260 200 218 240 155 247 S70 225 40 205 M285 147 C314 108 339 87 369 81 M285 153 C320 188 346 205 375 211 M230 80 Q195 100 172 108 M206 66 Q170 30 125 32 M217 220 Q185 197 165 190 M154 247 Q125 270 95 266 M320 109 Q320 65 341 44 M335 190 Q331 238 350 254 M92 59 Q69 43 48 50 M250 118 Q232 132 205 128 M252 180 Q230 170 208 178';
const MIN = .5, MAX = .85;
const pct = (v: number) => ((v - MIN) / (MAX - MIN)) * 100;

export default function VisionLab({ complete }: { complete: () => void }) {
  const [view, setView] = useState<View>('full');
  const [seen, setSeen] = useState(new Set<View>(['full']));
  const [layers, setLayers] = useState({ disc: true, macula: true, vessels: false });
  const [heat, setHeat] = useState(0);
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null);
  const current = views.find(v => v.id === view)!;

  function choose(id: View) {
    setView(id);
    const next = new Set(seen).add(id); setSeen(next);
    if (next.size === views.length) complete();
  }
  function move(e: PointerEvent<SVGSVGElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    setLens({ x: (e.clientX - r.left) / r.width * 420, y: (e.clientY - r.top) / r.height * 320 });
  }

  const vesselOnly = view === 'vessels';
  // The picture itself, drawn once and reused inside the lens.
  const retina = <g clipPath={view === 'central' ? 'url(#vl-central)' : 'url(#vl-field)'}>
    <circle cx="210" cy="150" r="140" fill={vesselOnly ? '#120509' : 'url(#vl-fundus)'}/>
    {!vesselOnly && <><ellipse cx="171" cy="156" rx="52" ry="46" fill="url(#vl-macula)"/><circle cx="171" cy="156" r="5" fill="#5a1d25"/>
      <ellipse cx="285" cy="149" rx="20" ry="25" fill="#f4c287"/><ellipse cx="288" cy="149" rx="9" ry="14" fill="#ffe4b4"/></>}
    <path d={vessels} fill="none" stroke={vesselOnly ? '#fff1db' : '#7a2328'} strokeWidth={vesselOnly ? 3.4 : 4.2} strokeLinecap="round"/>
    {!vesselOnly && <path d={vessels} transform="translate(2 -3)" fill="none" stroke="#b9372b" strokeWidth="1.8" strokeLinecap="round" opacity=".8"/>}
    {heat > 0 && <g opacity={heat / 100} style={{ mixBlendMode: 'screen' }}>
      <circle cx="285" cy="149" r="46" fill="url(#vl-heat)"/><circle cx="171" cy="156" r="58" fill="url(#vl-heat)"/>
      <circle cx="230" cy="96" r="34" fill="url(#vl-heat)"/><circle cx="222" cy="214" r="30" fill="url(#vl-heat)"/>
    </g>}
  </g>;

  return <div className="vision-lab">
    <div className="vision-views" role="radiogroup" aria-label="Model input">
      {views.map(v => <button key={v.id} role="radio" aria-checked={view === v.id} onClick={() => choose(v.id)}>
        <strong>{v.label}</strong>
      </button>)}
    </div>
    <div className="vision-grid">
      <figure className="vision-viewer">
        <svg viewBox="0 0 420 320" role="img" aria-label={view === 'central' ? 'Central-retina crop centered on the macula and fovea' : view === 'vessels' ? 'Vessel-enhanced view of the retinal vessel tree' : 'Right-eye fundus with the macula temporal to the optic disc'}
          onPointerMove={move} onPointerLeave={() => setLens(null)}>
          <defs>
            <radialGradient id="vl-fundus"><stop stopColor="#e06d3c"/><stop offset=".65" stopColor="#bb4527"/><stop offset="1" stopColor="#4a1820"/></radialGradient>
            <radialGradient id="vl-macula"><stop stopColor="#4c1d26"/><stop offset="1" stopColor="#a73e2c" stopOpacity="0"/></radialGradient>
            <radialGradient id="vl-heat"><stop stopColor="#fff38a"/><stop offset=".45" stopColor="#ff9b3d" stopOpacity=".75"/><stop offset="1" stopColor="#ff3d6e" stopOpacity="0"/></radialGradient>
            <clipPath id="vl-field"><circle cx="210" cy="150" r="140"/></clipPath>
            <clipPath id="vl-central"><circle cx="190" cy="152" r="78"/></clipPath>
            {lens && <clipPath id="vl-lens"><circle cx={lens.x} cy={lens.y} r="46"/></clipPath>}
          </defs>
          {retina}
          {view === 'central' && <circle cx="190" cy="152" r="78" fill="none" stroke="#ffd078" strokeDasharray="5 6"/>}
          {layers.disc && !vesselOnly && view !== 'central' && <g className="vision-label"><ellipse cx="285" cy="149" rx="27" ry="32" fill="none"/><path d="M302 124l22-30"/><text x="330" y="88">Optic disc</text></g>}
          {layers.macula && !vesselOnly && <g className="vision-label"><circle cx="171" cy="156" r="40" fill="none"/><path d="M150 190l-22 32"/><text x="96" y="236">Macula · fovea</text></g>}
          {layers.vessels && <g clipPath={view === 'central' ? 'url(#vl-central)' : 'url(#vl-field)'}><path className="vision-vessel-trace" d={vessels} fill="none"/></g>}
          {lens && <g className="vision-lens" pointerEvents="none">
            <g clipPath="url(#vl-lens)"><rect x="0" y="0" width="420" height="320" fill="#12050a"/><g transform={`translate(${lens.x} ${lens.y}) scale(2.4) translate(${-lens.x} ${-lens.y})`}>{retina}</g></g>
            <circle cx={lens.x} cy={lens.y} r="46" fill="none" stroke="#fff1db" strokeWidth="2.5"/>
          </g>}
        </svg>
        <figcaption>Illustration of a right-eye fundus. Move over it to magnify.</figcaption>
      </figure>

      <div className="vision-side">
        <div className="vision-toggles" aria-label="Overlays">
          {([['disc', 'Optic disc'], ['macula', 'Macula'], ['vessels', 'Trace vessels']] as const).map(([key, label]) =>
            <button key={key} aria-pressed={layers[key]} onClick={() => setLayers(l => ({ ...l, [key]: !l[key] }))}>{label}</button>)}
        </div>
        <label className="vision-heat">Attention overlay <output>{heat}%</output>
          <input type="range" min="0" max="100" value={heat} aria-label="Attention overlay strength" onChange={e => setHeat(Number(e.target.value))}/></label>
        <small>The attention overlay is an illustration of where image models often focus, not output from the study's model.</small>

        <div className="vision-chart" role="img" aria-label={`AUROC for Alzheimer's disease. ${[...views, ...benchmarks].map(b => `${b.label} ${b.auroc.toFixed(3)}`).join(', ')}. Chance is 0.5.`}>
          <span className="vision-chart-title">AUROC for Alzheimer's disease</span>
          {views.map(v => <div key={v.id} className={`vision-bar${v.id === view ? ' is-current' : ''}`}><span>{v.label}</span><i style={{ width: `${pct(v.auroc)}%` }}/><b>{v.auroc.toFixed(3)}</b></div>)}
          <hr/>
          {benchmarks.map(b => <div key={b.label} className="vision-bar is-bench"><span>{b.label}</span><i style={{ width: `${pct(b.auroc)}%` }}/><b>{b.auroc.toFixed(3)}</b></div>)}
          <div className="vision-axis"><span>0.50 chance</span><span>0.85</span></div>
        </div>
      </div>
    </div>
    <p className="activity-feedback" role="status">{current.label}: {current.note}</p>
    <small>Results from Eric's first-author UK Biobank study: 156,724 fundus images from 78,349 participants, including 535 with Alzheimer's disease. Fundus images added little beyond demographics; OCT-derived measures did better.</small>
  </div>;
}
