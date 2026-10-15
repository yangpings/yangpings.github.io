import { useRef, useState, type PointerEvent } from 'react';
type Point = { x: number; y: number };
type Stroke = { color: string; size: number; points: Point[] };
const paper = '#fff8eb';
const swatches = ['#292432', '#ffffff', '#da5b58', '#ef9951', '#e5bb4b', '#83a66c', '#489c9a', '#5687be', '#8d73b5', '#d78bad', '#98674e', '#fff8eb'];
function path(points: Point[]) { return points.map((point, i) => `${i ? 'L' : 'M'}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' '); }
export default function SketchCanvas({ complete }: { complete: () => void }) {
  const [color, setColor] = useState('#da5b58');
  const [size, setSize] = useState(12);
  const [eraser, setEraser] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [undone, setUndone] = useState<Stroke[][]>([]);
  const [history, setHistory] = useState<Stroke[][]>([]);
  const [draft, setDraft] = useState<Stroke | null>(null);
  const drawing = useRef<Stroke | null>(null);
  const pointer = useRef<number | null>(null);
  const [cursor, setCursor] = useState<Point>({ x: 480, y: 300 });
  const [keyboard, setKeyboard] = useState(false);
  function commit(next: Stroke[]) {
    setHistory(previous => [...previous.slice(-49), strokes]); setStrokes(next); setUndone([]);
    if (next.length) complete();
  }
  function position(e: PointerEvent<SVGSVGElement>): Point {
    const bounds = e.currentTarget.getBoundingClientRect();
    return { x: Math.max(0, Math.min(960, (e.clientX - bounds.left) / bounds.width * 960)), y: Math.max(0, Math.min(600, (e.clientY - bounds.top) / bounds.height * 600)) };
  }
  function finish() {
    if (!drawing.current) return;
    commit([...strokes, drawing.current]); drawing.current = null; pointer.current = null; setDraft(null);
  }
  function undo() {
    const last = history.at(-1); if (!last) return;
    setUndone(previous => [...previous, strokes]); setStrokes(last); setHistory(previous => previous.slice(0, -1));
  }
  function redo() {
    const last = undone.at(-1); if (!last) return;
    setHistory(previous => [...previous, strokes]); setStrokes(last); setUndone(previous => previous.slice(0, -1));
  }
  function download() {
    const marks = strokes.map(stroke => stroke.points.length === 1
      ? `<circle cx="${stroke.points[0].x}" cy="${stroke.points[0].y}" r="${stroke.size / 2}" fill="${stroke.color}"/>`
      : `<path d="${path(stroke.points)}" fill="none" stroke="${stroke.color}" stroke-width="${stroke.size}" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
    const url = URL.createObjectURL(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" width="960" height="600" viewBox="0 0 960 600"><rect width="960" height="600" fill="${paper}"/>${marks}</svg>`], { type: 'image/svg+xml' }));
    const link = document.createElement('a'); link.href = url; link.download = 'my-eric-world-sketch.svg'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const visible = draft ? [...strokes, draft] : strokes;
  return <div className="studio-drawing"><p>A little room to make something. Choose any color, set your brush, and draw.</p>
    <div className="studio-tools"><div className="studio-tool-group"><button aria-pressed={!eraser} onClick={() => setEraser(false)}>Brush</button><button aria-pressed={eraser} onClick={() => setEraser(true)}>Eraser</button></div><label className="studio-color">Color<input type="color" aria-label="Brush color" value={color} onChange={e => { setColor(e.target.value); setEraser(false); }}/><span>{color.toUpperCase()}</span></label><label className="studio-brush">Brush size <output>{size}</output><input type="range" aria-label="Brush size" min="2" max="64" value={size} onChange={e => setSize(Number(e.target.value))}/></label></div>
    <div className="studio-swatches" aria-label="Color shortcuts">{swatches.map(fill => <button key={fill} style={{ background: fill }} aria-label={`Use color ${fill}`} aria-pressed={color === fill && !eraser} onClick={() => { setColor(fill); setEraser(false); }}/>)}</div>
    <div className="studio-paper"><svg viewBox="0 0 960 600" tabIndex={0} role="application" aria-label="Drawing canvas" aria-describedby="studio-drawing-help" style={{ background: paper }} onBlur={() => setKeyboard(false)}
      onPointerDown={e => { if (pointer.current !== null || e.button !== 0) return; e.preventDefault(); e.currentTarget.focus(); setKeyboard(false); pointer.current = e.pointerId; e.currentTarget.setPointerCapture(e.pointerId); const stroke = { color: eraser ? paper : color, size, points: [position(e)] }; drawing.current = stroke; setDraft(stroke); }}
      onPointerMove={e => { if (pointer.current !== e.pointerId || !drawing.current) return; const next = { ...drawing.current, points: [...drawing.current.points, position(e)] }; drawing.current = next; setDraft(next); }} onPointerUp={e => { if (pointer.current === e.pointerId) finish(); }} onPointerCancel={finish} onLostPointerCapture={finish}
      onKeyDown={e => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); if (e.shiftKey) redo(); else undo(); return; }
        const direction: Record<string, Point> = { ArrowLeft: { x: -10, y: 0 }, ArrowRight: { x: 10, y: 0 }, ArrowUp: { x: 0, y: -10 }, ArrowDown: { x: 0, y: 10 } };
        if (direction[e.key]) { e.preventDefault(); setKeyboard(true); const delta = direction[e.key]; const next = { x: Math.max(0, Math.min(960, cursor.x + delta.x)), y: Math.max(0, Math.min(600, cursor.y + delta.y)) }; if (e.shiftKey) commit([...strokes, { color: eraser ? paper : color, size, points: [cursor, next] }]); setCursor(next); }
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setKeyboard(true); commit([...strokes, { color: eraser ? paper : color, size, points: [cursor] }]); }
      }}>
      {visible.map((stroke, i) => stroke.points.length === 1 ? <circle key={i} cx={stroke.points[0].x} cy={stroke.points[0].y} r={stroke.size / 2} fill={stroke.color}/> : <path key={i} d={path(stroke.points)} fill="none" stroke={stroke.color} strokeWidth={stroke.size} strokeLinecap="round" strokeLinejoin="round"/>)}
      {keyboard && <circle cx={cursor.x} cy={cursor.y} r={size / 2 + 4} fill="none" stroke="#292432" strokeWidth="2" strokeDasharray="4 3"/>}
    </svg></div>
    <div className="studio-footer"><div className="studio-tool-group"><button disabled={!history.length} onClick={undo}>Undo</button><button disabled={!undone.length} onClick={redo}>Redo</button><button disabled={!strokes.length} onClick={() => commit([])}>Clear canvas</button></div><button className="studio-save" disabled={!strokes.length} onClick={download}>Save my sketch</button></div>
    <p className="studio-status" role="status">{strokes.length ? `${strokes.length} ${strokes.length === 1 ? 'stroke' : 'strokes'} on your canvas` : 'A fresh sheet. Make your first mark.'}</p><small id="studio-drawing-help">Draw with a mouse, pen, or touch. On the canvas, use arrows to move, Shift + arrows to draw, and Space to dab. Undo also restores a cleared canvas.</small>
  </div>;
}
