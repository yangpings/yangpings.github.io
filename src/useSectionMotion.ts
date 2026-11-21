import { useEffect, useRef } from 'react';

const targets = {
  projects: '.research-section > .section-bar, .research-card, .section-timeline > header, .timeline-year, .research-media > h2, .research-media .media-card',
  world: '.section-bar, .section-intro, .world-shell, .world-caption',
};

export default function useSectionMotion(kind: keyof typeof targets) {
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = section.current;
    if (!root || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const elements = Array.from(root.querySelectorAll<HTMLElement>(targets[kind]));
    // Once the arrival animation has played, mark the element done so it never replays
    // (for example when focus leaves the map for a popup and :focus-within stops applying).
    const settle = (event: AnimationEvent) => {
      const element = event.currentTarget as HTMLElement;
      if (event.target !== element) return; // an animation inside it, not its own arrival
      element.dataset.reveal = 'done'; element.removeEventListener('animationend', settle);
    };
    const reveal = (element: HTMLElement) => {
      if (element.dataset.reveal !== 'pending') return;
      element.dataset.reveal = 'visible'; observer.unobserve(element);
      element.addEventListener('animationend', settle);
    };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) reveal(entry.target as HTMLElement); });
    }, { threshold: .06 });
    elements.forEach(element => {
      element.dataset.reveal = 'pending';
      // Only the card grid staggers; timeline rows appear as visitors reach them.
      if (element.classList.contains('research-card')) {
        const index = Array.from(element.parentElement!.children).indexOf(element);
        element.style.setProperty('--reveal-delay', `${index % 3 * 70}ms`);
      }
      observer.observe(element);
    });
    const focus = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      elements.forEach(element => { if (element.contains(target)) reveal(element); });
    };
    root.addEventListener('focusin', focus);
    return () => {
      observer.disconnect(); root.removeEventListener('focusin', focus);
      elements.forEach(element => { delete element.dataset.reveal; element.style.removeProperty('--reveal-delay'); element.removeEventListener('animationend', settle); });
    };
  }, [kind]);
  return section;
}
