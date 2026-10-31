import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HEADER_OFFSET = -96;

// Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger animations stay in step.
// Not created at all for reduced motion, so those visitors keep native scrolling. Dialogs keep native scrolling.
export default function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ prevent: node => !!node.closest('dialog') });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Lazy images above a section can load mid-glide and push it down, so the first glide can
    // stop short. On arrival, check the section really sits under the header; if it moved, glide
    // again. Then move focus there so keyboard and screen-reader users land where they asked to go.
    let gliding = false;
    const glideTo = (target: HTMLElement, triesLeft: number) => {
      gliding = true;
      lenis.scrollTo(target, { offset: HEADER_OFFSET, onComplete: () => arrive(target, triesLeft) });
    };
    const arrive = (target: HTMLElement, triesLeft: number) => {
        if (!gliding) return;
        const miss = target.getBoundingClientRect().top + HEADER_OFFSET;
        const atBottom = innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
        if (Math.abs(miss) > 4 && !atBottom && triesLeft > 1) { glideTo(target, triesLeft - 1); return; }
        gliding = false;
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
    };

    // A glide gives way to any scroll it didn't cause (Tab moving focus, scrollIntoView, a
    // find-in-page jump): otherwise it would drag the page back on the next frame.
    const yieldToOtherScroll = () => {
      if (!gliding || Math.abs(window.scrollY - lenis.animatedScroll) <= 3) return;
      gliding = false;
      lenis.stop();
      lenis.start();
    };
    window.addEventListener('scroll', yieldToOtherScroll, { passive: true });

    // In-page links glide to their section (Lenis' own anchor handling only scrolls, without focus).
    const glide = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
      const hash = link.getAttribute('href')!;
      const target = hash === '#' ? document.body : document.getElementById(hash.slice(1));
      if (!target) return;
      event.preventDefault();
      if (hash === '#') lenis.scrollTo(0);
      else glideTo(target, 3);
      history.pushState(null, '', hash === '#' ? location.pathname + location.search : hash);
    };
    document.addEventListener('click', glide);

    return () => {
      document.removeEventListener('click', glide);
      window.removeEventListener('scroll', yieldToOtherScroll);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
}
