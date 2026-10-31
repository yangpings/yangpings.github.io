const roles = ['machine learning researcher', 'AI engineer', 'illustrator', 'singer and drummer'];
const motto = ['One curious mind,', 'One world to find,', 'One step at a time.'];

// Behind the hero: rows of outlined lettering that drift sideways on their own, the roles in the
// display face and the motto in brush script, alternating direction. Each row holds its text twice
// so the loop is seamless. It is texture, so it is hidden from screen readers; the same words are
// given once in the visually hidden line below. The site's pause switch and reduced motion stop it.
const rows = [
  { kind: 'roles', words: roles, speed: 70 },
  { kind: 'motto', words: motto, speed: 90 },
  { kind: 'roles', words: [...roles].reverse(), speed: 60 },
  { kind: 'motto', words: [motto[2], motto[0], motto[1]], speed: 80 },
];

export default function HeroDrift() {
  return <>
    <p className="sr-only">{motto.join(' ')} Machine learning researcher, AI engineer, illustrator, singer and drummer.</p>
    <div className="hero-drift" aria-hidden="true">
      {rows.map((row, i) => <div key={i} className={`drift-row is-${row.kind}${i % 2 ? ' is-reverse' : ''}`} style={{ animationDuration: `${row.speed}s` }}>
        {[0, 1].map(copy => <span key={copy} className="drift-set">{row.words.map(word => <span key={word} className="drift-word">{word}</span>)}</span>)}
      </div>)}
    </div>
  </>;
}
