// One switch that stops everything that moves on its own (WCAG 2.2.2 Pause, Stop, Hide):
// the rolling roles, the bands, the Vanta scenes and looping CSS animations.
// Motion the visitor drives (scrolling, the comet trail, dragging) is left alone.
// The choice is remembered per browser; storage can be blocked, so every access is guarded.
const KEY = 'eric-world-motion-paused';
export const PAUSE_EVENT = 'motion:pause';

export function storedMotionPaused() {
  try { return localStorage.getItem(KEY) === '1'; } catch { return false; }
}

export function isMotionPaused() {
  return document.documentElement.classList.contains('motion-paused');
}

export function applyMotionPaused(paused: boolean) {
  document.documentElement.classList.toggle('motion-paused', paused);
  try { localStorage.setItem(KEY, paused ? '1' : '0'); } catch { /* storage blocked */ }
  window.dispatchEvent(new CustomEvent(PAUSE_EVENT, { detail: paused }));
}
