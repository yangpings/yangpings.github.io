import { useEffect, useRef, useState, type ReactNode } from 'react';

export type StagePicture = { src: string; alt: string };

// Half the screen never moves: a fixed picture on one side while the column beside it scrolls.
// Each block in the column marked data-stage="<n>" brings picture n forward as it reaches the middle
// of the screen. The pictures crossfade; with reduced motion they simply swap.
export default function SplitStage({ pictures, children, className = '', side = 'left' }: {
  pictures: StagePicture[]; children: ReactNode; className?: string; side?: 'left' | 'right';
}) {
  const column = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const blocks = column.current?.querySelectorAll<HTMLElement>('[data-stage]');
    // Below 901px the picture sits above the column instead of beside it, so it keeps the first one.
    if (!blocks?.length || !('IntersectionObserver' in window) || !window.matchMedia('(min-width: 901px)').matches) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.stage) || 0);
    }), { rootMargin: '-45% 0px -45% 0px' });
    blocks.forEach(block => observer.observe(block));
    return () => observer.disconnect();
  }, []);

  return <div className={`split-stage is-${side} ${className}`}>
    <div className="stage-media">
      {pictures.map((picture, index) => <img key={picture.src} src={picture.src} alt={index === active ? picture.alt : ''}
        aria-hidden={index === active ? undefined : true} data-active={index === active ? 'true' : undefined}
        width="1200" height="1500" loading={index === 0 ? 'eager' : 'lazy'}/>)}
    </div>
    <div ref={column} className="stage-column">{children}</div>
  </div>;
}
