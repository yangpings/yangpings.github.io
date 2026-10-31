import ScrollVelocity from './reactbits/ScrollVelocity';

const star = <svg className="band-star" viewBox="0 0 20 20" width="0.7em" height="0.7em" aria-hidden="true"><path d="M10 0c.9 5.6 4.4 9.1 10 10-5.6.9-9.1 4.4-10 10-.9-5.6-4.4-9.1-10-10 5.6-.9 9.1-4.4 10-10z" fill="currentColor"/></svg>;

// A tilted, full-bleed band of interests that drifts on its own, speeds up and skews with scrolling,
// and can be dragged. Everything in it is said elsewhere on the page, so it is hidden from screen readers.
// With motion paused the band holds still: no drift, and no push from scrolling.
export default function Band({ items, reverse = false, paused = false }: { items: string[]; reverse?: boolean; paused?: boolean }) {
  return <div className={`band${reverse ? ' is-reverse' : ''}`} aria-hidden="true">
    <ScrollVelocity
      texts={[<span className="band-items">{items.map(item => <span key={item}>{item}{star}</span>)}</span>]}
      velocity={paused ? 0 : reverse ? -38 : 38}
      gap={24}
      numCopies={4}
      skewWithVelocity={8}
      draggable
      parallaxClassName="band-parallax"
      scrollerClassName="band-scroller"
    />
  </div>;
}
