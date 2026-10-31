import { useEffect } from 'react';

// Moves a soft light under the pointer on project and gallery cards. Fine pointers only.
export default function CardSpotlight() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const move = (event: PointerEvent) => {
      const card = (event.target as HTMLElement).closest<HTMLElement>('.research-card, .media-card');
      if (!card) return;
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`);
      card.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);
  return null;
}
