import { useEffect, useRef } from 'react';
import { preview } from '../media';

export default function Portrait() {
  const card = useRef<HTMLElement>(null);
  const bounce = useRef<Animation | null>(null);
  useEffect(() => () => bounce.current?.cancel(), []);
  function hop() {
    if (!card.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    bounce.current?.cancel();
    const resting = window.matchMedia('(max-width: 760px)').matches ? 0 : 2;
    bounce.current = card.current.animate([
      { transform: `translateY(0) rotate(${resting}deg) scale(1)`, offset: 0 },
      { transform: 'translateY(4px) rotate(-4deg) scale(1.03,.95)', offset: .18 },
      { transform: 'translateY(-18px) rotate(7deg) scale(.98,1.03)', offset: .45 },
      { transform: 'translateY(2px) rotate(-3deg) scale(1.02,.98)', offset: .72 },
      { transform: `translateY(0) rotate(${resting}deg) scale(1)`, offset: 1 },
    ], { duration: 650, easing: 'ease-in-out' });
  }
  return <aside ref={card} className="portrait-card">
    <button className="portrait-image portrait-play" onClick={hop} aria-label="Make Eric's photo bounce">
      <img src={preview('aboutme.jpg')} alt="Eric Yang outdoors among green plants" width="933" height="1400" fetchPriority="high"/>
      <span className="portrait-badge">NICE TO MEET YOU</span>
    </button>
    <div className="portrait-caption"><strong>Eric Yang</strong><span>Researcher / Engineer / Artist</span></div>
  </aside>;
}
