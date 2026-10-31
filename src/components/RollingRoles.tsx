import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { isMotionPaused, PAUSE_EVENT } from '../motionPause';

gsap.registerPlugin(useGSAP);

const roles = ['machine learning researcher', 'AI engineer', 'illustrator', 'singer and drummer'];

// Each role's letters roll up into place like a flip board, hold, then roll out upward as the
// next role rolls in. Without motion (or JavaScript) the first role simply shows.
// Screen readers get the full list once.
export default function RollingRoles() {
  const scope = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const words = gsap.utils.toArray<HTMLElement>('.rolling-role');
    const letters = words.map(word => gsap.utils.toArray<HTMLElement>(word.querySelectorAll('.rolling-letter')));
    gsap.set(letters.slice(1).flat(), { yPercent: 110 });
    gsap.set(words, { visibility: 'visible' });

    const timeline = gsap.timeline({ repeat: -1, delay: 2.6 });
    letters.forEach((current, index) => {
      const next = letters[(index + 1) % letters.length];
      timeline
        .to(current, { yPercent: -110, filter: 'blur(3px)', duration: .45, ease: 'power2.in', stagger: .018 }, '+=1.9')
        // immediateRender: false, or the loop's last step (rolling the first role back in)
        // would hide the first role as soon as the timeline is built.
        .fromTo(next, { yPercent: 110, filter: 'blur(3px)' }, { yPercent: 0, filter: 'blur(0px)', duration: .6, ease: 'back.out(1.7)', stagger: .025, immediateRender: false }, '-=.3');
    });

    // The site-wide "Pause motion" switch holds the roll wherever it is.
    const follow = (event: Event) => ((event as CustomEvent<boolean>).detail ? timeline.pause() : timeline.resume());
    if (isMotionPaused()) timeline.pause();
    window.addEventListener(PAUSE_EVENT, follow);
    return () => window.removeEventListener(PAUSE_EVENT, follow);
  }, { scope });

  return <p ref={scope} className="rolling-roles">
    <span className="sr-only">{roles.join(', ')}</span>
    <span className="rolling-prompt" aria-hidden="true">&gt;</span>
    <span className="rolling-window" aria-hidden="true">
      {roles.map(role => <span className="rolling-role" key={role}>
        {[...role].map((letter, index) => <span className="rolling-letter" key={index}>{letter === ' ' ? ' ' : letter}</span>)}
      </span>)}
    </span>
  </p>;
}
