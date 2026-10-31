import { useEffect, useRef, type ReactNode } from 'react';

// A sideways row moved by its own scrollbar underneath (the pictures themselves don't drag, so a
// click always opens a picture). Touch, trackpads and shift + wheel scroll it natively. The bar shows while the pointer is over the gallery
// or focus is inside it; its thumb can be dragged and its track clicked to jump.
export default function DragRow({ children, label }: { children: ReactNode; label: string }) {
  const row = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = row.current, bar = track.current, knob = thumb.current;
    if (!element || !bar || !knob) return;

    // Thumb size and position follow the row; written straight to style, no re-render.
    const sync = () => {
      const max = element.scrollWidth - element.clientWidth;
      const share = element.scrollWidth ? element.clientWidth / element.scrollWidth : 1;
      const width = Math.max(48, bar.clientWidth * share);
      knob.style.width = `${width}px`;
      knob.style.transform = `translateX(${max > 0 ? (element.scrollLeft / max) * (bar.clientWidth - width) : 0}px)`;
      bar.parentElement!.dataset.scrollable = max > 2 ? 'true' : 'false';
    };

    // Dragging the thumb, or clicking the track to centre the thumb there.
    let thumbStart = 0, thumbScroll = 0, thumbDrag = false;
    const ratio = () => (element.scrollWidth - element.clientWidth) / Math.max(1, bar.clientWidth - knob.offsetWidth);
    const knobDown = (event: PointerEvent) => {
      event.preventDefault(); event.stopPropagation();
      thumbDrag = true; thumbStart = event.clientX; thumbScroll = element.scrollLeft;
      knob.setPointerCapture(event.pointerId); bar.classList.add('is-active'); element.classList.add('is-dragging');
    };
    const knobMove = (event: PointerEvent) => { if (thumbDrag) element.scrollLeft = thumbScroll + (event.clientX - thumbStart) * ratio(); };
    const knobUp = () => { thumbDrag = false; bar.classList.remove('is-active'); element.classList.remove('is-dragging'); };
    const barDown = (event: PointerEvent) => {
      if (event.target === knob) return;
      const box = bar.getBoundingClientRect();
      element.scrollTo({ left: (event.clientX - box.left - knob.offsetWidth / 2) * ratio(), behavior: 'smooth' });
    };

    sync();
    const resize = new ResizeObserver(sync);
    resize.observe(element);
    element.querySelectorAll('img').forEach(img => img.addEventListener('load', sync));
    element.addEventListener('scroll', sync, { passive: true });
    knob.addEventListener('pointerdown', knobDown);
    knob.addEventListener('pointermove', knobMove);
    knob.addEventListener('pointerup', knobUp);
    knob.addEventListener('pointercancel', knobUp);
    bar.addEventListener('pointerdown', barDown);
    return () => {
      resize.disconnect();
      element.querySelectorAll('img').forEach(img => img.removeEventListener('load', sync));
      element.removeEventListener('scroll', sync);
      knob.removeEventListener('pointerdown', knobDown);
      knob.removeEventListener('pointermove', knobMove);
      knob.removeEventListener('pointerup', knobUp);
      knob.removeEventListener('pointercancel', knobUp);
      bar.removeEventListener('pointerdown', barDown);
    };
  }, []);

  return <div className="drag-wrap">
    <div ref={row} className="drag-row" role="region" aria-label={label} tabIndex={0} data-lenis-prevent-horizontal>{children}</div>
    {/* The row itself scrolls from the keyboard, so the bar is for pointers only. */}
    <div ref={track} className="drag-bar" aria-hidden="true"><div ref={thumb} className="drag-thumb"/></div>
  </div>;
}
