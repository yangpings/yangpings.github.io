import { useEffect, useRef } from 'react';

const POINTS = 22;
const HEAD_WIDTH = 9;

// A tapered coral-to-gold ribbon that whips after the pointer. The head springs toward the pointer
// and every other point eases toward the one ahead of it. The loop sleeps once the ribbon settles.
export default function CometTrail() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext('2d');
    if (!element || !context || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const points = Array.from({ length: POINTS }, () => ({ x: -100, y: -100 }));
    const target = { x: -100, y: -100 };
    const velocity = { x: 0, y: 0 };
    let frame = 0, started = false;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      element.width = innerWidth * ratio; element.height = innerHeight * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = () => {
      context.clearRect(0, 0, innerWidth, innerHeight);
      const left: number[][] = [], right: number[][] = [];
      for (let i = 0; i < POINTS; i++) {
        const a = points[Math.max(0, i - 1)], b = points[Math.min(POINTS - 1, i + 1)];
        const dx = b.x - a.x, dy = b.y - a.y, length = Math.hypot(dx, dy) || 1;
        const width = HEAD_WIDTH * Math.pow(1 - i / (POINTS - 1), 1.3) / 2;
        left.push([points[i].x - dy / length * width, points[i].y + dx / length * width]);
        right.push([points[i].x + dy / length * width, points[i].y - dx / length * width]);
      }
      const head = points[0], tail = points[POINTS - 1];
      const gradient = context.createLinearGradient(head.x, head.y, tail.x, tail.y);
      gradient.addColorStop(0, '#ffd078');
      gradient.addColorStop(.45, '#ff7868');
      gradient.addColorStop(1, '#ff786800');
      context.beginPath();
      context.moveTo(left[0][0], left[0][1]);
      left.forEach(([x, y]) => context.lineTo(x, y));
      [...right].reverse().forEach(([x, y]) => context.lineTo(x, y));
      context.closePath();
      context.shadowColor = '#ff7868';
      context.shadowBlur = 14;
      context.fillStyle = gradient;
      context.fill();
    };

    const step = () => {
      velocity.x = (velocity.x + (target.x - points[0].x) * .2) * .6;
      velocity.y = (velocity.y + (target.y - points[0].y) * .2) * .6;
      points[0].x += velocity.x; points[0].y += velocity.y;
      let spread = Math.abs(target.x - points[0].x) + Math.abs(target.y - points[0].y);
      for (let i = 1; i < POINTS; i++) {
        points[i].x += (points[i - 1].x - points[i].x) * .5;
        points[i].y += (points[i - 1].y - points[i].y) * .5;
        spread += Math.abs(points[i - 1].x - points[i].x) + Math.abs(points[i - 1].y - points[i].y);
      }
      if (spread < .5) { context.clearRect(0, 0, innerWidth, innerHeight); frame = 0; return; }
      draw();
      frame = requestAnimationFrame(step);
    };

    const move = (event: PointerEvent) => {
      target.x = event.clientX; target.y = event.clientY;
      if (!started) { points.forEach(point => { point.x = target.x; point.y = target.y; }); started = true; }
      if (!frame) frame = requestAnimationFrame(step);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', move, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', move);
    };
  }, []);
  return <canvas ref={canvas} className="comet-trail" aria-hidden="true"/>;
}
