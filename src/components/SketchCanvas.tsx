import { useRef, useState, type PointerEvent, type ReactNode } from 'react';

// The Art studio as a sketchbook: spiral-bound pages on blank, dotted or lined paper. Draw with a
// grainy pencil, a crisp ink pen or a translucent marker; the eraser rubs marks away and shows the
// paper underneath. Each page keeps its own undo history; turn to a fresh page or back through
// earlier ones, and save the page you're on.
type Point = { x: number; y: number };
type Tool = 'pencil' | 'pen' | 'marker' | 'eraser';
type Stroke = { tool: Tool; color: string; size: number; points: Point[] };
type Paper = 'blank' | 'dotted' | 'lined';
type Page = { strokes: Stroke[]; history: Stroke[][]; undone: Stroke[][] };
const W = 960, H = 640, PAPER = '#fbf6ea';
const inks = ['#2b2430', '#5a5560', '#c2413b', '#e0873c', '#d8a72e', '#5f8f55', '#2f7f86', '#3d6aa8', '#7a5aa6', '#c96f97'];
const tools: { id: Tool; label: string }[] = [{ id: 'pencil', label: 'Pencil' }, { id: 'pen', label: 'Ink pen' }, { id: 'marker', label: 'Marker' }, { id: 'eraser', label: 'Eraser' }];
const blank = (): Page => ({ strokes: [], history: [], undone: [] });

// A smooth path through the points: quadratic curves between midpoints.
function smooth(points: Point[]) {
  if (points.length < 3) return points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  let d = `M${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 1; i < points.length - 1; i++) {
    const mx = (points[i].x + points[i + 1].x) / 2, my = (points[i].y + points[i + 1].y) / 2;
    d += ` Q${points[i].x.toFixed(1)} ${points[i].y.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
  }
  const last = points[points.length - 1];
  return `${d} L${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
}
const look = (s: Stroke) => s.tool === 'pencil' ? { width: Math.max(1.5, s.size * .45), opacity: .82, filter: 'url(#sb-graphite)' }
  : s.tool === 'marker' ? { width: s.size * 1.6, opacity: .45, filter: undefined } : { width: Math.max(1.5, s.size * .6), opacity: 1, filter: undefined };

function mark(s: Stroke, key: number): ReactNode {
  const { width, opacity, filter } = look(s);
  if (s.points.length === 1) return <circle key={key} cx={s.points[0].x} cy={s.points[0].y} r={width / 2} fill={s.color} opacity={opacity} filter={filter}/>;
  return <path key={key} d={smooth(s.points)} fill="none" stroke={s.color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" opacity={opacity} filter={filter}
    style={s.tool === 'marker' ? { mixBlendMode: 'multiply' } : undefined}/>;
}
// Eraser strokes mask everything drawn before them, so later marks draw over the erased area.
function layers(strokes: Stroke[], prefix: string) {
  let acc: ReactNode[] = []; const masks: ReactNode[] = [];
  strokes.forEach((s, i) => {
    if (s.tool !== 'eraser') { acc.push(mark(s, i)); return; }
    const id = `${prefix}-erase-${i}`;
    masks.push(<mask key={id} id={id} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}><rect width={W} height={H} fill="#fff"/>
      {s.points.length === 1 ? <circle cx={s.points[0].x} cy={s.points[0].y} r={s.size} fill="#000"/> : <path d={smooth(s.points)} fill="none" stroke="#000" strokeWidth={s.size * 2} strokeLinecap="round" strokeLinejoin="round"/>}</mask>);
    acc = [<g key={id} mask={`url(#${id})`}>{acc}</g>];
  });
  return { content: acc, masks };
}
function paperPattern(paper: Paper) {
  return paper === 'dotted' ? <pattern id="sb-paper" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="14" cy="14" r="1.4" fill="#c9bda6"/></pattern>
    : paper === 'lined' ? <pattern id="sb-paper" width={W} height="32" patternUnits="userSpaceOnUse"><path d={`M0 31.5H${W}`} stroke="#c8d6e4" strokeWidth="1.2"/></pattern> : null;
}

export default function SketchCanvas({ complete }: { complete: () => void }) {
  const [pages, setPages] = useState<Page[]>([blank()]);
  const [index, setIndex] = useState(0);
  const [turn, setTurn] = useState<'next' | 'back' | null>(null);
  const [tool, setTool] = useState<Tool>('pencil');
  const [color, setColor] = useState(inks[0]);
  const [size, setSize] = useState(8);
  const [paper, setPaper] = useState<Paper>('dotted');
  const [draft, setDraft] = useState<Stroke | null>(null);
  const drawing = useRef<Stroke | null>(null);
  const pointer = useRef<number | null>(null);
  const [cursor, setCursor] = useState<Point>({ x: W / 2, y: H / 2 });
  const [keyboard, setKeyboard] = useState(false);
  const page = pages[index];

  function update(fn: (p: Page) => Page) { setPages(all => all.map((p, i) => i === index ? fn(p) : p)); }
  function commit(next: Stroke[]) {
    update(p => ({ strokes: next, history: [...p.history.slice(-49), p.strokes], undone: [] }));
    if (next.length) complete();
  }
  const undo = () => update(p => { const last = p.history.at(-1); return last ? { strokes: last, history: p.history.slice(0, -1), undone: [...p.undone, p.strokes] } : p; });
  const redo = () => update(p => { const last = p.undone.at(-1); return last ? { strokes: last, history: [...p.history, p.strokes], undone: p.undone.slice(0, -1) } : p; });
  function flip(to: number, direction: 'next' | 'back') {
    setTurn(direction); setIndex(to);
    window.setTimeout(() => setTurn(null), 520);
  }
  function newPage() { setPages(all => [...all, blank()]); flip(pages.length, 'next'); }
  function position(e: PointerEvent<SVGSVGElement>): Point {
    const b = e.currentTarget.getBoundingClientRect();
    return { x: Math.max(0, Math.min(W, (e.clientX - b.left) / b.width * W)), y: Math.max(0, Math.min(H, (e.clientY - b.top) / b.height * H)) };
  }
  function finish() {
    if (!drawing.current) return;
    commit([...page.strokes, drawing.current]); drawing.current = null; pointer.current = null; setDraft(null);
  }
  function save() {
    const { content, masks } = layers(page.strokes, 'export');
    void import('react-dom/server').then(({ renderToStaticMarkup }) => {
      const svg = renderToStaticMarkup(<svg xmlns="http://www.w3.org/2000/svg" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>{paperPattern(paper)}{graphite}{masks}</defs><rect width={W} height={H} fill={PAPER}/>{paper !== 'blank' && <rect width={W} height={H} fill="url(#sb-paper)"/>}{content}</svg>);
      const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
      const link = document.createElement('a'); link.href = url; link.download = `sketchbook-page-${index + 1}.svg`; link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }
  const stroke = (points: Point[]): Stroke => ({ tool, color, size, points });
  const shown = draft ? [...page.strokes, draft] : page.strokes;
  const { content, masks } = layers(shown, `p${index}`);

  return <div className="sketchbook">
    <div className="sketchbook-tools">
      <div className="sketchbook-group" role="radiogroup" aria-label="Drawing tool">{tools.map(t => <button key={t.id} role="radio" aria-checked={tool === t.id} className={`tool-${t.id}`} onClick={() => setTool(t.id)}>
        <span className="tool-tip" aria-hidden="true"/>{t.label}</button>)}</div>
      <div className="sketchbook-inks" aria-label="Ink colours">
        {inks.map(fill => <button key={fill} style={{ background: fill }} aria-label={`Use ink ${fill}`} aria-pressed={color === fill && tool !== 'eraser'} onClick={() => { setColor(fill); if (tool === 'eraser') setTool('pen'); }}/>)}
        <label className="sketchbook-custom" title="Any colour"><input type="color" aria-label="Brush color" value={color} onChange={e => { setColor(e.target.value); if (tool === 'eraser') setTool('pen'); }}/></label>
      </div>
      <label className="sketchbook-size">Size <output>{size}</output><input type="range" aria-label="Brush size" min="2" max="40" value={size} onChange={e => setSize(Number(e.target.value))}/></label>
      <div className="sketchbook-group" role="radiogroup" aria-label="Paper">{(['blank', 'dotted', 'lined'] as Paper[]).map(p => <button key={p} role="radio" aria-checked={paper === p} onClick={() => setPaper(p)}>{p[0].toUpperCase() + p.slice(1)}</button>)}</div>
    </div>

    <div className="sketchbook-book">
      <div className="sketchbook-rings" aria-hidden="true">{Array.from({ length: 14 }, (_, i) => <span key={i}/>)}</div>
      <div className="sketchbook-stack" aria-hidden="true"/>
      <div key={index} className={`sketchbook-page${turn ? ` is-turning-${turn}` : ''}`}>
        <svg viewBox={`0 0 ${W} ${H}`} tabIndex={0} role="application" aria-label="Drawing canvas" aria-describedby="sketchbook-help" onBlur={() => setKeyboard(false)}
          onPointerDown={e => { if (pointer.current !== null || e.button !== 0) return; e.preventDefault(); e.currentTarget.focus(); setKeyboard(false); pointer.current = e.pointerId; e.currentTarget.setPointerCapture(e.pointerId); const s = stroke([position(e)]); drawing.current = s; setDraft(s); }}
          onPointerMove={e => { if (pointer.current !== e.pointerId || !drawing.current) return; const p = position(e); const last = drawing.current.points.at(-1)!; if (Math.hypot(p.x - last.x, p.y - last.y) < 1.5) return; const next = { ...drawing.current, points: [...drawing.current.points, p] }; drawing.current = next; setDraft(next); }}
          onPointerUp={e => { if (pointer.current === e.pointerId) finish(); }} onPointerCancel={finish} onLostPointerCapture={finish}
          onKeyDown={e => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); if (e.shiftKey) redo(); else undo(); return; }
            const dir: Record<string, Point> = { ArrowLeft: { x: -10, y: 0 }, ArrowRight: { x: 10, y: 0 }, ArrowUp: { x: 0, y: -10 }, ArrowDown: { x: 0, y: 10 } };
            if (dir[e.key]) { e.preventDefault(); setKeyboard(true); const d = dir[e.key]; const next = { x: Math.max(0, Math.min(W, cursor.x + d.x)), y: Math.max(0, Math.min(H, cursor.y + d.y)) }; if (e.shiftKey) commit([...page.strokes, stroke([cursor, next])]); setCursor(next); }
            if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setKeyboard(true); commit([...page.strokes, stroke([cursor])]); }
          }}>
          <defs>{paperPattern(paper)}{graphite}{masks}</defs>
          <rect width={W} height={H} fill={PAPER}/>
          {paper !== 'blank' && <rect width={W} height={H} fill="url(#sb-paper)"/>}
          {paper === 'lined' && <path d={`M86 0V${H}`} stroke="#e8a5a0" strokeWidth="1.4"/>}
          {content}
          {keyboard && <circle cx={cursor.x} cy={cursor.y} r={size / 2 + 4} fill="none" stroke="#2b2430" strokeWidth="2" strokeDasharray="4 3"/>}
        </svg>
        <span className="sketchbook-folio" aria-hidden="true">{index + 1}</span>
      </div>
    </div>

    <div className="sketchbook-footer">
      <div className="sketchbook-group">
        <button disabled={!page.history.length} onClick={undo}>Undo</button>
        <button disabled={!page.undone.length} onClick={redo}>Redo</button>
        <button disabled={!page.strokes.length} onClick={() => commit([])}>Clear canvas</button>
      </div>
      <div className="sketchbook-group sketchbook-pager">
        <button aria-label="Previous page" disabled={index === 0} onClick={() => flip(index - 1, 'back')}>‹</button>
        <span>Page {index + 1} of {pages.length}</span>
        <button aria-label="Next page" disabled={index === pages.length - 1} onClick={() => flip(index + 1, 'next')}>›</button>
        <button onClick={newPage}>New page</button>
      </div>
      <button className="studio-save" disabled={!page.strokes.length} onClick={save}>Save my sketch</button>
    </div>
    <p className="studio-status" role="status">{page.strokes.length ? `${page.strokes.length} ${page.strokes.length === 1 ? 'stroke' : 'strokes'} on page ${index + 1}` : `Page ${index + 1} is blank. Make your first mark.`}</p>
    <small id="sketchbook-help">Draw with a mouse, pen or touch. On the page: arrows move, Shift + arrows draw, Space dabs, Ctrl+Z undoes. Undo also restores a cleared page.</small>
  </div>;
}

// A light graphite grain for the pencil.
const graphite = <filter id="sb-graphite" x="-5%" y="-5%" width="110%" height="110%">
  <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="4" result="grain"/>
  <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.4 1.15" result="holes"/>
  <feComposite in="SourceGraphic" in2="holes" operator="in"/>
</filter>;
