import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

import useSectionMotion from '../useSectionMotion';
import { asset, findEntry } from '../content';
import { smoothScrollTo } from '../useSmoothScroll';
import WorldPanel, { worldTitles } from './WorldPanel';
import { createPlanet, facing, FRONT, FRONT_DEPTH, levelSpots, orientationAt, orientations, planetLayout, project, rotate, type Layout } from './planet';
import { levelOrder, rooms } from '../world';

// World.exe as a little planet. Each level stands at its own spot on the globe, joined by a dashed
// route; scrolling or swiping over the planet rotates it to bring the next spot up to the front.
// The level at the front is large and in colour; its neighbours are small silhouettes near the horizon.
const levels = levelOrder.map(id => rooms.find(room => room.id === id)!);
const COUNT = levels.length;
const STEP = 360 / COUNT;
const names: Record<string, string> = { home: 'Home', library: 'Library', llm: 'AI lab', retina: 'Vision lab', art: 'Art studio', music: 'Music room', arcade: 'Arcade', travel: 'Travel' };
const pictures: Partial<Record<string, string>> = Object.fromEntries(levelOrder.map(id => [id, asset(`optimized/world/${id}.webp`)]));
const icons: Record<string, ReactNode> = {};
const confetti = Array.from({ length: 28 }, (_, i) => ({ left: (i * 37) % 100, delay: (i % 7) * .12, color: ['#ffd078', '#ff7868', '#fff1db', '#82cfff', '#9ae7b3'][i % 5], spin: i % 2 ? 1 : -1 }));
const SPOTS = levelSpots(COUNT);
const TURNS = orientations(SPOTS);

export default function World({ onVisit, onComplete, visited, paused, completed }: { completed: Set<string>; onVisit: (id: string) => void; onComplete: (id: string) => void; visited: Set<string>; paused: boolean; artwork: string }) {
  const section = useSectionMotion('world');
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const canvas = useRef<HTMLCanvasElement>(null);
  const planet = useRef<ReturnType<typeof createPlanet> | undefined>(undefined);
  const layout = useRef<Layout>(planetLayout(1000, 560));
  const [planetReady, setPlanetReady] = useState(false);
  const [planetTick, setPlanetTick] = useState(0);
  const [onScreen, setOnScreen] = useState(false);
  const aside = useRef(0); // 0 to 1: how far the planet has moved aside for an open level
  const orbit = useRef<SVGEllipseElement>(null);
  const size = useRef({ w: 1000, h: 560, bleed: 0 }); // bleed: how far the screen runs on past the section's right edge
  const angle = useRef(0); // level i sits at i·STEP + angle; the front is 0°
  const velocity = useRef(0);
  const target = useRef(0);
  const frame = useRef(0);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const [celebrate, setCelebrate] = useState(false);
  const allClear = visited.size === COUNT;
  const level = levels[active];
  // The level being read: its activity opens in the white space beside the wheel, not in a popup.
  const [openId, setOpenId] = useState<string>();
  const openEntry = openId ? findEntry(openId) : undefined;
  const panel = useRef<HTMLDivElement>(null); // the scrolling text of the open level
  const reader = useRef<HTMLDivElement>(null); // the panel with its Close link and scrollbar
  const bar = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLSpanElement>(null);
  const pending = useRef<number | null>(null); // a level that was clicked off-front: open it when it arrives
  const pendingTimer = useRef(0);
  const gestureAt = useRef(-Infinity); // when the visitor last scrolled, swiped or pressed a key outside the panel

  // Turn the planet and stand every level on its spot: written straight to the DOM, no React render per frame.
  const draw = useCallback(() => {
    const { w, h, bleed } = size.current;
    const L = layout.current = planetLayout(w, h, aside.current, bleed);
    const pos = -angle.current / STEP; // which level is at the front, as a fraction
    const q = orientationAt(TURNS, pos);
    items.current.forEach((el, i) => {
      if (!el) return;
      const spot = rotate(q, SPOTS[i]);
      const feet = project(L, spot), tip = project(L, spot.map(c => c * 1.25) as typeof spot);
      const u = Math.abs(i - pos);
      // Big only at the front, small for the neighbours; farther spots are smaller still.
      const size = (.3 + .7 * Math.exp(-1.3 * u * u)) * (FRONT_DEPTH / feet.z);
      const lean = Math.atan2(tip.x - feet.x, feet.y - tip.y) * 180 / Math.PI; // stand along the ground's normal
      // Fade out over the horizon, and beyond the nearest neighbours.
      const opacity = Math.max(0, Math.min(1, (facing(spot) - .02) / .14, (2.2 - u) / .7)) * (1 - aside.current * Math.min(1, u * 2)); // while reading, only the open level stays
      el.style.transform = `translate(${feet.x - L.base / 2}px, ${feet.y - L.base}px) rotate(${lean}deg) scale(${size})`;
      el.style.zIndex = String(Math.round(200 - u * 40));
      if (el.dataset.base !== String(L.base)) { el.dataset.base = String(L.base); el.style.width = el.style.height = `${L.base}px`; }
      // Full colour at the front, a dark silhouette elsewhere: set on the two layers, not via a CSS variable
      // on the button, so the browser doesn't recalculate every child's style each frame.
      const colour = Math.max(0, Math.min(1, 1 - u / .35));
      const img = el.querySelector<HTMLElement>('.dial-art img'), sil = el.querySelector<HTMLElement>('.dial-silhouette');
      if (img) img.style.opacity = String(colour);
      if (sil) sil.style.opacity = String(1 - colour);
      el.style.opacity = String(opacity);
      el.style.visibility = opacity < .02 ? 'hidden' : 'visible';
    });
    // Until (or unless) WebGL draws the planet, a plain circle stands in for it.
    const e = orbit.current;
    if (e) { e.setAttribute('cx', String(L.cx)); e.setAttribute('cy', String(L.cy)); e.setAttribute('rx', String(L.R)); e.setAttribute('ry', String(L.R)); }
    planet.current?.render(L, q, aside.current);
    stage.current?.style.setProperty('--front-y', `${project(L, FRONT).y - L.base / 2}px`);
  }, []);

  const settleActive = useCallback(() => {
    const index = Math.max(0, Math.min(COUNT - 1, Math.round(-angle.current / STEP)));
    if (index !== activeRef.current) { activeRef.current = index; setActive(index); }
  }, []);

  // A critically damped spring from the current angle to the one the scroll position asks for.
  const run = useCallback(() => {
    cancelAnimationFrame(frame.current);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      angle.current = target.current; velocity.current = 0; draw(); settleActive(); return;
    }
    let last = 0;
    const k = 100, c = 2 * Math.sqrt(k); // critically damped, settles in about half a second
    const tick = (time: number) => {
      const dt = last ? Math.min((time - last) / 1000, .032) : 1 / 60;
      last = time;
      velocity.current += (-k * (angle.current - target.current) - c * velocity.current) * dt;
      angle.current += velocity.current * dt;
      draw(); settleActive();
      if (Math.abs(angle.current - target.current) < .05 && Math.abs(velocity.current) < .5) { angle.current = target.current; velocity.current = 0; draw(); settleActive(); return; }
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }, [draw, settleActive]);

  // The wheel turns on its own, not with the page: scrolling or swiping over the wheel turns it and
  // never scrolls the page; scrolling anywhere else scrolls the page and leaves the wheel alone.
  const LAST = -(COUNT - 1) * STEP;
  const snapTimer = useRef(0);
  const draggedAt = useRef(-Infinity); // a swipe just turned the wheel: the tap that ends it is not a click
  const turnTo = useCallback((next: number) => { target.current = next; run(); }, [run]);
  // Past either end the wheel gives a little and then springs back.
  const nudge = useCallback((by: number) => {
    const beyond = target.current < LAST || target.current > 0;
    turnTo(Math.max(LAST - STEP * .25, Math.min(STEP * .25, target.current + (beyond ? by * .3 : by))));
  }, [LAST, turnTo]);
  const snap = useCallback((ahead = 0) => {
    const index = Math.max(0, Math.min(COUNT - 1, Math.round(-(target.current + ahead) / STEP)));
    turnTo(-index * STEP);
  }, [turnTo]);
  // Is this point (in screen coordinates) on the wheel, rather than the white space beside it?
  const onWheelArea = useCallback((clientX: number, clientY: number, node: EventTarget | null) => {
    const el = stage.current;
    if (!el) return false;
    if ((node as HTMLElement | null)?.closest?.('.dial-item, .dial-again')) return true;
    const box = el.getBoundingClientRect(), { cx, cy, R, base } = layout.current;
    return Math.hypot(clientX - box.left - cx, clientY - box.top - cy) <= R + base * .3;
  }, []);

  useLayoutEffect(() => {
    const el = stage.current!;
    const measure = () => {
      const bleed = Math.max(0, Math.round(document.documentElement.clientWidth - el.getBoundingClientRect().right));
      size.current = { w: el.clientWidth, h: el.clientHeight, bleed };
      el.style.setProperty('--bleed', `${bleed}px`);
      draw();
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    // Mouse wheel and trackpad: the wheel follows the scroll, then settles on the nearest level.
    let smoothUntil = 0, lastWheel = 0, speed = 0;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX) || !onWheelArea(e.clientX, e.clientY, e.target)) return;
      e.preventDefault(); e.stopPropagation(); // the page (and the smooth scroller) never see it
      const delta = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? el.clientHeight : 1);
      const now = e.timeStamp;
      // Trackpads send a stream of small steps; a mouse sends big notches. Once small steps are seen,
      // treat the stream as a trackpad until it pauses.
      if (Math.abs(delta) < 50) smoothUntil = now + 400;
      window.clearTimeout(snapTimer.current);
      if (now > smoothUntil) {
        // One notch, one level, in a single glide. Fast notches queue up and the spring runs through them.
        const at = Math.round(-target.current / STEP), next = at + Math.sign(delta);
        if (next < 0 || next > COUNT - 1) { // at an end: a small give, then back
          turnTo(-at * STEP - Math.sign(delta) * STEP * .12);
          snapTimer.current = window.setTimeout(() => snap(), 120);
        } else turnTo(-next * STEP);
        return;
      }
      const dt = Math.max(8, now - lastWheel); lastWheel = now;
      speed = dt > 100 ? 0 : .6 * (delta / dt) + .4 * speed;
      nudge(-delta * STEP / 130);
      // When the stream stops, settle on the level the swipe was heading for, not just the nearest.
      snapTimer.current = window.setTimeout(() => { snap(-speed * 90 * STEP / 130); speed = 0; }, 90);
    };
    // Touch: a vertical swipe that starts on the wheel drags it with the finger, then carries on
    // with the swipe's speed and settles on a level.
    let touch: { y: number; t: number; v: number; claimed: boolean; startX: number; startY: number } | null = null;
    const onTouchStart = (e: TouchEvent) => {
      const p = e.touches[0];
      touch = e.touches.length === 1 && onWheelArea(p.clientX, p.clientY, e.target) ? { y: p.clientY, t: e.timeStamp, v: 0, claimed: false, startX: p.clientX, startY: p.clientY } : null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!touch) return;
      const p = e.touches[0];
      if (!touch.claimed) {
        const dx = Math.abs(p.clientX - touch.startX), dy = Math.abs(p.clientY - touch.startY);
        if (dy < 8 && dx < 8) return;
        if (dx > dy) { touch = null; return; }
        touch.claimed = true; window.clearTimeout(snapTimer.current);
      }
      e.preventDefault();
      const dy = p.clientY - touch.y, dt = Math.max(1, e.timeStamp - touch.t);
      touch.v = .7 * (dy / dt) + .3 * touch.v; touch.y = p.clientY; touch.t = e.timeStamp;
      nudge(dy * STEP / 90);
      draggedAt.current = performance.now();
    };
    const onTouchEnd = () => {
      if (touch?.claimed) { draggedAt.current = performance.now(); snap(touch.v * 140 * STEP / 90); } // a flick carries on a level or two
      touch = null;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);
    el.addEventListener('touchcancel', onTouchEnd);
    return () => {
      observer.disconnect(); cancelAnimationFrame(frame.current); window.clearTimeout(snapTimer.current);
      el.removeEventListener('wheel', onWheel); el.removeEventListener('touchstart', onTouchStart); el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd); el.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [draw, nudge, onWheelArea, snap]);

  // Opening a level moves the planet aside to make room for it; closing brings it back.
  const reading = !!openEntry;
  useEffect(() => {
    const goal = reading ? 1 : 0, from = aside.current;
    if (from === goal) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { aside.current = goal; draw(); return; }
    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / 440), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; // the caption's ease-in-out
      aside.current = from + (goal - from) * e; draw();
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reading, draw]);
  // The planet itself is drawn with three.js, loaded once the section is on its way.
  useEffect(() => {
    let gone = false;
    import('three').then(THREE => {
      if (gone || !canvas.current) return;
      try { planet.current = createPlanet(canvas.current, THREE, SPOTS); } catch { return; } // no WebGL: keep the plain circle
      planet.current.setVisited(levels.map(l => visited.has(l.id)));
      setPlanetReady(true);
      setPlanetTick(t => t + 1);
      draw();
    }).catch(() => undefined);
    return () => { gone = true; planet.current?.dispose(); planet.current = undefined; };
  }, [draw]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { planet.current?.setVisited(levels.map(l => visited.has(l.id))); draw(); }, [visited, draw]);
  // The moon goes round only while the planet is on screen, nothing covers it, and motion is welcome.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    planet.current?.setVisible(onScreen);
    planet.current?.play(onScreen && !paused && !openEntry && !still); // an open level hides the moon: don't spend frames on it
  }, [onScreen, paused, !!openEntry, planetTick]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!allClear) return;
    setCelebrate(true);
    const done = window.setTimeout(() => setCelebrate(false), 4200);
    return () => window.clearTimeout(done);
  }, [allClear]);

  const goTo = (index: number) => turnTo(-Math.max(0, Math.min(COUNT - 1, index)) * STEP);
  const openLevel = (i: number) => {
    pending.current = null;
    const id = levels[i].id;
    setOpenId(id); onVisit(id);
    // Bring the whole section into view so the level can be read, if the page sits partly above or below it.
    const sticky = track.current?.firstElementChild as HTMLElement | null;
    const header = (document.querySelector('.site-header') as HTMLElement | null)?.offsetHeight ?? 80;
    const off = sticky ? sticky.getBoundingClientRect().top - header : 0;
    if (Math.abs(off) > 24) smoothScrollTo(window.scrollY + off);
  };
  const close = () => { setOpenId(undefined); items.current[activeRef.current]?.focus({ preventScroll: true }); };
  // Every click shows the level: the front one opens straight away (or closes if it is already open);
  // any other turns the wheel and opens once it reaches the front.
  const choose = (i: number) => {
    if (paused ||performance.now() - draggedAt.current < 350) return;
    if (i === activeRef.current && Math.abs(angle.current + i * STEP) < STEP / 3) {
      if (openId === levels[i].id) setOpenId(undefined); else openLevel(i);
    } else {
      pending.current = i;
      window.clearTimeout(pendingTimer.current);
      pendingTimer.current = window.setTimeout(() => { pending.current = null; }, 4000);
      goTo(i);
    }
  };
  // Turning the wheel to another level closes the one being read, or opens the one that was clicked.
  // Only the visitor turning it closes the panel: a scroll the browser makes by itself (bringing
  // something focused in the panel into view, say) leaves it open.
  useEffect(() => {
    const note = (e: Event) => { if (!reader.current?.contains(e.target as Node)) gestureAt.current = performance.now(); };
    const kinds = ['wheel', 'touchmove', 'keydown', 'pointerdown'] as const;
    kinds.forEach(kind => window.addEventListener(kind, note, { capture: true, passive: true }));
    return () => kinds.forEach(kind => window.removeEventListener(kind, note, { capture: true }));
  }, []);
  useEffect(() => {
    if (pending.current === active) openLevel(active);
    else if (performance.now() - gestureAt.current < 1500) setOpenId(id => (id && id !== levels[active].id ? undefined : id));
  }, [active]);
  useEffect(() => { if (openId) panel.current?.focus({ preventScroll: true }); }, [openId]);
  // The panel's own scrollbar, drawn like the gallery's: a slim track whose thumb follows the text.
  const placeThumb = useCallback(() => {
    const el = panel.current, track = bar.current, knob = thumb.current;
    if (!el || !track || !knob) return;
    const room = el.scrollHeight - el.clientHeight;
    track.dataset.scrollable = String(room > 1);
    const size = Math.max(36, track.clientHeight * el.clientHeight / el.scrollHeight);
    knob.style.height = `${size}px`;
    knob.style.transform = `translateY(${room > 0 ? (el.scrollTop / room) * (track.clientHeight - size) : 0}px)`;
  }, []);
  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    placeThumb();
    const observer = new ResizeObserver(placeThumb);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    el.addEventListener('scroll', placeThumb, { passive: true });
    // Scrolling over the open level scrolls only the level: at its top or bottom the page stays put,
    // so it doesn't run on, turn the wheel and close what you were reading.
    const box = reader.current;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      for (let n = e.target as HTMLElement | null; n && n !== el.parentElement; n = n.parentElement) {
        if (n.scrollHeight > n.clientHeight + 1 && /(auto|scroll)/.test(getComputedStyle(n).overflowY)) {
          const canMove = e.deltaY < 0 ? n.scrollTop > 0 : n.scrollTop + n.clientHeight < n.scrollHeight - 1;
          if (canMove) return; // something under the pointer can still scroll this way: let it
        }
      }
      e.preventDefault();
    };
    box?.addEventListener('wheel', onWheel, { passive: false });
    return () => { observer.disconnect(); el.removeEventListener('scroll', placeThumb); box?.removeEventListener('wheel', onWheel); };
  }, [openId, placeThumb]);
  // Drag the thumb to scroll; press the track to jump there.
  const onBarDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = panel.current, track = bar.current, knob = thumb.current;
    if (!el || !track || !knob) return;
    e.preventDefault();
    const room = el.scrollHeight - el.clientHeight, span = track.clientHeight - knob.offsetHeight;
    if (e.target !== knob) {
      const y = e.clientY - track.getBoundingClientRect().top - knob.offsetHeight / 2;
      el.scrollTop = Math.max(0, Math.min(1, y / Math.max(1, span))) * room;
    }
    const startY = e.clientY, startTop = el.scrollTop;
    track.setPointerCapture(e.pointerId);
    track.classList.add('is-active');
    const move = (ev: PointerEvent) => { el.scrollTop = startTop + (ev.clientY - startY) * room / Math.max(1, span); };
    const up = () => {
      track.classList.remove('is-active');
      track.removeEventListener('pointermove', move); track.removeEventListener('pointerup', up); track.removeEventListener('pointercancel', up);
    };
    track.addEventListener('pointermove', move); track.addEventListener('pointerup', up); track.addEventListener('pointercancel', up);
  };
  useEffect(() => () => window.clearTimeout(pendingTimer.current), []);
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (paused) return;
    const key = e.key.toLowerCase();
    if (['arrowright', 'arrowdown'].includes(key)) { e.preventDefault(); goTo(activeRef.current === COUNT - 1 ? 0 : activeRef.current + 1); }
    else if (['arrowleft', 'arrowup'].includes(key)) { e.preventDefault(); goTo(activeRef.current - 1); }
    else if (key === 'e' && !e.repeat) { e.preventDefault(); openLevel(activeRef.current); }
  };
  // Keyboard focus follows the level at the front (a roving tab stop).
  useEffect(() => {
    if (stage.current?.contains(document.activeElement) && document.activeElement?.classList.contains('dial-item')) items.current[active]?.focus({ preventScroll: true });
  }, [active]);

  return <section ref={section} id="world" className="world-section dial-section" aria-labelledby="world-title" data-chapter="World">
    <div ref={track} className="dial-track" style={{ '--levels': COUNT } as CSSProperties}>
      <div className="dial-sticky">
        <div className="section-bar"><div><h2 id="world-title" className="code-title">World.exe</h2></div></div>
        <div className="dial-shell">
          <p className="sr-only" aria-live="polite">{visited.size} / 8 rooms explored</p>
          {/* Explored levels: a filled dot for each one visited, an outline for the rest. */}
          <ol className="dial-dots" aria-label="Levels explored">{levels.map(l => <li key={l.id} className={visited.has(l.id) ? 'is-done' : undefined} title={names[l.id]}>
            <span className="sr-only">{names[l.id]}: {visited.has(l.id) ? 'explored' : 'not explored yet'}</span>
          </li>)}</ol>
          <div ref={stage} className={`dial-stage${openEntry ? ' is-reading' : ''}${planetReady ? ' has-planet' : ''}`} role="group" aria-roledescription="dial" aria-label="World wheel. Scroll, or use the arrow keys, to turn it; Enter opens the level at the front."
            style={{ '--room': level.color } as CSSProperties} onKeyDown={onKeyDown}>
            <svg className="dial-ring" aria-hidden="true" width="100%" height="100%"><ellipse ref={orbit} className="dial-orbit"/></svg>
            <canvas ref={canvas} className="dial-planet" aria-hidden="true"/>
            {levels.map((l, i) => {
              const here = i === active;
              return <button key={l.id} ref={el => { items.current[i] = el; }} type="button" className={`dial-item${here ? ' is-front' : ''}${visited.has(l.id) ? ' is-visited' : ''}`}
                style={{ '--room': l.color } as CSSProperties} tabIndex={here ? 0 : -1} data-here={here ? 'true' : undefined}
                aria-label={`Explore ${l.label}`} aria-current={here ? 'true' : undefined} onClick={() => choose(i)}>
                <span className="dial-art">
                  {pictures[l.id] ? <>
                    <img src={pictures[l.id]} alt="" draggable={false}/>
                    <span className="dial-silhouette" style={{ maskImage: `url(${pictures[l.id]})`, WebkitMaskImage: `url(${pictures[l.id]})` } as CSSProperties}/>
                  </> : <span className="dial-disc"><svg viewBox="0 0 64 64">{icons[l.id]}</svg></span>}
                </span>
                {completed.has(l.id) && <span className="dial-star" aria-hidden="true">★</span>}
              </button>;
            })}
            {/* At the last level, a way to spin the whole wheel back round to the first. */}
            {active === COUNT - 1 && !openEntry && <button type="button" className="dial-again" aria-label="Turn the wheel back to the first level" onClick={() => goTo(0)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4 3.5v4.5h4.5"/></svg>
              <span>Back to start</span>
            </button>}
            <p className="dial-caption" aria-live="polite">{names[openEntry?.id ?? level.id]}</p>
            {allClear && <p className="world-banner" role="status">World clear! Every level is done.</p>}
            {celebrate && <div className="world-confetti" aria-hidden="true">{confetti.map((piece, i) => <span key={i} style={{ left: `${piece.left}%`, animationDelay: `${piece.delay}s`, background: piece.color, '--spin': piece.spin } as CSSProperties}/>)}</div>}
          </div>
          {openEntry && <div ref={reader} key={openEntry.id} className="dial-reader" style={{ '--room': rooms.find(r => r.id === openEntry.id)?.color } as CSSProperties}
            onKeyDown={e => { if (e.key === 'Escape' && !(e.target as HTMLElement).closest('dialog')) { e.stopPropagation(); close(); } }}>
            <button type="button" className="dial-panel-close" aria-label="Close details" onClick={close}>Close</button>
            <div ref={panel} className={`dial-panel${openEntry.id === 'llm' ? ' playground-dialog' : openEntry.id === 'art' ? ' studio-dialog' : ''}`}
              role="region" aria-label={worldTitles[openEntry.id] ?? names[openEntry.id]} tabIndex={-1} data-lenis-prevent>
              <div className="room-sheet-body"><WorldPanel entry={openEntry} completed={completed} onComplete={onComplete}/></div>
            </div>
            <div ref={bar} className="dial-scrollbar" aria-hidden="true" onPointerDown={onBarDown}><span ref={thumb}/></div>
          </div>}
        </div>
      </div>
    </div>
  </section>;
}
