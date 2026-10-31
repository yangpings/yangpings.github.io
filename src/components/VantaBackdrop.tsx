import { useEffect, useRef } from 'react';
import { isMotionPaused, PAUSE_EVENT } from '../motionPause';

type VantaEffect = { destroy: () => void };
type VantaFactory = (options: Record<string, unknown>) => VantaEffect;

// Static import paths so Vite can split each effect into its own chunk.
const effects = {
  net: () => import('vanta/dist/vanta.net.min'),
  waves: () => import('vanta/dist/vanta.waves.min'),
  cells: () => import('vanta/dist/vanta.cells.min'),
  globe: () => import('vanta/dist/vanta.globe.min'),
};

const ground = 0x280d15;

// A Vanta three.js scene behind a section. The scene is created shortly before the section
// scrolls into view and destroyed once it is well out of view, so only one or two WebGL
// contexts are alive at a time. Skipped for reduced motion and on touch or small screens,
// where the GPU and battery cost isn't worth it; the flat ground shows instead.
export default function VantaBackdrop({ effect, options, className = '' }: {
  effect: keyof typeof effects;
  options: Record<string, unknown>;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    const capable = window.matchMedia('(pointer: fine) and (min-width: 761px) and (prefers-reduced-motion: no-preference)').matches;
    if (!element || !capable || !('IntersectionObserver' in window)) return;
    let scene: VantaEffect | undefined;
    let wanted = false;
    let loading: Promise<void> | undefined;

    const start = () => {
      wanted = true;
      if (scene || loading) return;
      loading = Promise.all([import('three'), effects[effect]()]).then(([THREE, module]) => {
        loading = undefined;
        if (!wanted || scene) return;
        scene = (module.default as VantaFactory)({
          el: element, THREE, backgroundColor: ground,
          mouseControls: true, touchControls: false, gyroControls: false,
          minHeight: 200, minWidth: 200, scale: 1, scaleMobile: 1,
          ...options,
        });
        element.dataset.ready = 'true';
      }).catch(() => { loading = undefined; /* no WebGL: keep the flat ground */ });
    };
    const stop = () => {
      wanted = false;
      scene?.destroy();
      scene = undefined;
      delete element.dataset.ready;
    };

    // Runs only while near the viewport and while the site-wide motion switch is on.
    let near = false;
    const sync = () => (near && !isMotionPaused() ? start() : stop());
    const observer = new IntersectionObserver(([entry]) => { near = entry.isIntersecting; sync(); }, { rootMargin: '300px 0px' });
    observer.observe(element);
    window.addEventListener(PAUSE_EVENT, sync);
    return () => { observer.disconnect(); window.removeEventListener(PAUSE_EVENT, sync); stop(); };
  }, [effect, options]);
  return <div ref={host} className={`vanta-backdrop is-${effect} ${className}`} aria-hidden="true"/>;
}
