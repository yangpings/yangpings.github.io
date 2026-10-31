import { useEffect, useState } from 'react';

const lines = ['One curious mind,', 'One world to find,', 'One step at a time.'];
const total = lines.reduce((sum, line) => sum + line.length, 0);
const LETTER_MS = 42, LINE_PAUSE_MS = 320;

// The hero headline, typed line by line with a blinking block caret, like a terminal.
// It starts once the boot intro lifts. The untyped rest of each line already takes its space,
// so nothing shifts while typing; screen readers and reduced motion get the whole headline.
export default function TypedHeadline() {
  const [chars, setChars] = useState(total);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setChars(0);
    const start = () => setStarted(true);
    if (document.documentElement.classList.contains('is-booting')) {
      window.addEventListener('boot:done', start, { once: true });
      return () => window.removeEventListener('boot:done', start);
    }
    const delay = window.setTimeout(start, 250);
    return () => window.clearTimeout(delay);
  }, []);

  useEffect(() => {
    if (!started || chars >= total) return;
    let end = 0;
    const atLineEnd = lines.some(line => (end += line.length) === chars && chars > 0);
    const tick = window.setTimeout(() => setChars(count => count + 1), atLineEnd ? LINE_PAUSE_MS : LETTER_MS);
    return () => window.clearTimeout(tick);
  }, [started, chars]);

  let offset = 0;
  return <h1 id="hero-title" className="typed-headline">
    <span className="sr-only">{lines.join(' ')}</span>
    <span aria-hidden="true">{lines.map((line, index) => {
      const shown = Math.max(0, Math.min(line.length, chars - offset));
      const typing = chars >= offset && (shown < line.length || index === lines.length - 1);
      offset += line.length;
      return <span className="typed-line" key={line}>
        {line.slice(0, shown)}
        {typing && <span className={`typed-caret${chars >= total ? ' is-resting' : ''}`}/>}
        <span className="typed-rest">{line.slice(shown)}</span>
      </span>;
    })}</span>
  </h1>;
}
