import { useEffect, useRef, useState } from 'react';
import type { Point } from '../world';
type Direction = 'down' | 'up' | 'left' | 'right';
export default function WorldPlayer({ position, paused, decorative = false }: { position: Point; paused: boolean; decorative?: boolean }) {
  const previous = useRef(position);
  const [direction, setDirection] = useState<Direction>('down');
  const [moving, setMoving] = useState(false);
  useEffect(() => {
    const dx = position.x - previous.current.x;
    const dy = position.y - previous.current.y;
    previous.current = position;
    if (!dx && !dy) return;
    setDirection(Math.abs(dx) > Math.abs(dy) ? dx < 0 ? 'left' : 'right' : dy < 0 ? 'up' : 'down');
    setMoving(true);
    const timer = setTimeout(() => setMoving(false), 100);
    return () => clearTimeout(timer);
  }, [position.x, position.y]);
  const walking = moving && !paused;
  const side = direction === 'left' || direction === 'right';
  return <g transform={`translate(${position.x},${position.y})`} data-testid={decorative ? undefined : "player"} data-x={position.x.toFixed(1)} data-y={position.y.toFixed(1)} data-facing={direction} data-moving={walking} className={`world-player ${walking ? 'is-walking' : 'is-idle'}${paused ? ' is-paused' : ''}`} aria-hidden="true">
    <ellipse className="player-shadow" cy="10" rx="11" ry="4" fill="#130c19" opacity=".5"/>
    <g className="player-body"><g transform={direction === 'left' ? 'scale(-1,1)' : undefined}>
      <g className="player-leg player-leg-back"><path d={side ? 'M-3 2v8' : 'M-5 2v8'} stroke="#607180" strokeWidth="5"/><path d={side ? 'M-5 11h6' : 'M-7 11h5'} stroke="#ead9b9" strokeWidth="3"/></g>
      <g className="player-arm player-arm-back"><path d={side ? 'M-5-8v10' : 'M-11-8v9'} stroke="#c85051" strokeWidth="4"/><circle cx={side ? -5 : -11} cy="3" r="2" fill="#ffd09c"/></g>
      <path d={side ? 'M-7-12H6L8 4H-7Z' : 'M-8-12H8L10 4H-10Z'} fill="#ff7868"/><path d={side ? 'M-7 1H7' : 'M-9 1H9'} stroke="#d45c59" strokeWidth="2"/>
      {direction === 'up' && <path d="M-6-9H6v11H-6Z" fill="#c05c50" stroke="#edaa79" strokeWidth="1"/>}
      <g className="player-leg player-leg-front"><path d={side ? 'M3 3v7' : 'M5 3v7'} stroke="#7e91a0" strokeWidth="5"/><path d={side ? 'M1 11h7' : 'M3 11h6'} stroke="#f4e3c4" strokeWidth="3"/></g>
      <g className="player-head"><rect x="-8" y="-26" width="16" height="15" rx="4" fill="#ffd09c"/>
        {direction === 'up' ? <path d="M-8-13v-13H8v13l-4 3H-4Z" fill="#3b2533"/> : side ? <><path d="M-8-16v-10H7v5H1v5H-3v3Z" fill="#3b2533"/><path d="M8-20l3 4H7" fill="#ffd09c"/><rect className="player-eyes" x="5" y="-21" width="2" height="3" fill="#3b2533"/><path d="M5-13h3" stroke="#d18a72"/></> : <><path d="M-8-17v-10H8v7H3v-3H-3v6Z" fill="#3b2533"/><g className="player-eyes"><path d="M-4-19v3m8-3v3" stroke="#3b2533" strokeWidth="2"/></g><path d="M-2-13h4" stroke="#c77e69" strokeWidth="1.3"/></>}
      </g>
      <g className="player-arm player-arm-front"><path d={side ? 'M1-8v10' : 'M11-8v9'} stroke="#ff8b75" strokeWidth="4"/><circle cx={side ? 1 : 11} cy="3" r="2" fill="#ffd09c"/></g>
    </g></g>
    <path className="player-marker" d="m-3-37 3 4 3-4" fill="#ffe0a1"/>
  </g>;
}
