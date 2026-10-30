import { useEffect, useRef, useState } from 'react';

import WorldPlayer from './WorldPlayer';
import useSectionMotion from '../useSectionMotion';
import { interactionPoint, move, rooms, type Point } from '../world';

function Furniture({ kind, artwork }: { kind: string; artwork: string }) {
  if (kind === 'terminal') return <g>
    <rect x="42" y="96" width="136" height="12" rx="3" fill="#816d56"/><path d="M52 108v24m116-24v24" stroke="#4a4640" strokeWidth="7"/>
    <rect x="59" y="40" width="101" height="60" rx="5" fill="#161f26" stroke="#536b6b" strokeWidth="4"/><rect x="66" y="47" width="87" height="44" fill="#243e3e"/>
    <text x="74" y="63" fill="#9ed2b3" fontSize="10" fontFamily="inherit">&gt; WHOAMI_</text><path d="M75 72h51m-51 7h32" stroke="#69a78d" strokeWidth="3"/>
    <rect x="84" y="100" width="55" height="5" fill="#b2b5a4"/><rect x="163" y="80" width="12" height="16" rx="2" fill="#cfb680"/>
  </g>;
  if (kind === 'eye') return <g>
    <rect x="48" y="95" width="130" height="14" rx="3" fill="#657e83"/><path d="M60 109v20m105-20v20" stroke="#3e515b" strokeWidth="7"/>
    <rect x="61" y="44" width="58" height="49" rx="6" fill="#c5cdbe"/><circle cx="91" cy="67" r="18" fill="#283b4b"/><circle cx="91" cy="67" r="10" fill="#91c8bb"/><circle cx="91" cy="67" r="5" fill="#233541"/>
    <rect x="130" y="57" width="44" height="34" fill="#223641" stroke="#758b8d" strokeWidth="3"/><path d="m135 78 8-9 7 11 8-15 10 8" fill="none" stroke="#a4cdb7" strokeWidth="2"/><path d="M151 91v7" stroke="#92a6a2" strokeWidth="4"/>
  </g>;
  if (kind === 'art') return <g>
    <path d="m78 132 29-106 31 106m-57-20h54" stroke="#aa8259" strokeWidth="7" fill="none"/><rect x="77" y="37" width="62" height="73" fill="#d2b78f"/>
    <image href={artwork} x="82" y="42" width="52" height="63" preserveAspectRatio="xMidYMid slice"/>
    <ellipse cx="166" cy="107" rx="17" ry="9" fill="#c49b72"/><circle cx="158" cy="105" r="3" fill="#ba7374"/><circle cx="169" cy="102" r="3" fill="#81a69a"/><path d="M166 114v20" stroke="#9a785b" strokeWidth="5"/>
    <rect x="42" y="60" width="20" height="28" fill="#d6c4a4"/><path d="m45 82 8-14 7 11" fill="#8da99c"/>
  </g>;
  if (kind === 'music') return <g>
    <rect x="43" y="69" width="112" height="39" rx="3" fill="#363746"/><rect x="48" y="86" width="102" height="16" fill="#dfdcc7"/>
    {Array.from({length: 11}, (_, i) => <path key={i} d={`M${53+i*9} 86v16`} stroke="#53515a" strokeWidth="2"/>)}
    {Array.from({length: 7}, (_, i) => <rect key={i} x={56+i*13} y="85" width="5" height="10" fill="#292e38"/>)}
    <path d="M53 108v23m92-23v23M179 68v59m-13 0h26" stroke="#8a8894" strokeWidth="4"/><rect x="173" y="48" width="12" height="24" rx="6" fill="#c0bdbe"/>
    <g transform="translate(40,112)"><ellipse cx="0" cy="0" rx="15" ry="5" fill="#ffd078"/><path d="M0 5v22" stroke="#ccc0b5" strokeWidth="3"/><circle cx="38" cy="8" r="18" fill="#ff7868" stroke="#fff0df" strokeWidth="3"/><ellipse cx="67" cy="1" rx="12" ry="5" fill="#ffd078"/><path d="M67 6v19" stroke="#ccc0b5" strokeWidth="3"/></g>
    <text x="92" y="52" fill="#b5a9cb" fontSize="24">♫</text>
  </g>;
  if (kind === 'books') return <g>
    <rect x="46" y="32" width="130" height="97" rx="3" fill="#786852"/>
    {[0,1,2].map(row => <g key={row}>{Array.from({length: 10}, (_, i) => <rect key={i} x={54+i*11} y={40+row*29} width="8" height={20-(i%3)*3} fill={['#98ac9b','#c9a17f','#9c9eaf','#d3bd8b'][i%4]}/>)}<path d={`M50 ${64+row*29}h122`} stroke="#b0946c" strokeWidth="5"/></g>)}
  </g>;
  if (kind === 'home') return <g>
    <rect x="56" y="67" width="111" height="55" rx="9" fill="#a19370"/><rect x="61" y="60" width="46" height="34" rx="6" fill="#b6a581"/><rect x="112" y="60" width="48" height="34" rx="6" fill="#b6a581"/><path d="M64 121v10m96-10v10" stroke="#494b40" strokeWidth="6"/>

    <path d="M185 54v64m-12 0h24" stroke="#baa27b" strokeWidth="4"/><path d="m171 54 7-25h15l7 25Z" fill="#e2c58d"/>
  </g>;
  if (kind === 'arcade') return <g>
    <path d="M76 31h70l-3 68 13 31H65l13-31Z" fill="#5b536b" stroke="#9f8aaf" strokeWidth="3"/><rect x="81" y="35" width="60" height="14" fill="#d4b5bf"/><text x="86" y="45" fontFamily="inherit" fontSize="9" fill="#343344">ONE MORE</text>
    <rect x="83" y="55" width="55" height="37" fill="#1d3039"/><path d="m88 80 11-13 11 8 15-15 8 10" fill="none" stroke="#c2a5c4" strokeWidth="3"/>
    <path d="M78 99h66" stroke="#bbb1c5" strokeWidth="7"/><circle cx="127" cy="99" r="4" fill="#cf8e86"/><path d="M91 99v-8" stroke="#a8c3b8" strokeWidth="3"/>
  </g>;
  return <g>
    <rect x="49" y="31" width="129" height="80" fill="#b9bd9d" stroke="#8a8269" strokeWidth="5"/><path d="m63 50 19-9 20 17-10 15 14 17-17 9-12-25-18-6Zm66-5 30 12-9 16 8 18-21 9-12-19 7-16-14-10Z" fill="#6e9082"/>
    <path d="m90 59 51 13" stroke="#bc795f" strokeWidth="2" strokeDasharray="4 3"/><circle cx="90" cy="59" r="4" fill="#b76e5b"/><circle cx="141" cy="72" r="4" fill="#b76e5b"/>
    <rect x="75" y="117" width="65" height="18" rx="3" fill="#9d8969"/><path d="M96 117v-6h20v6" stroke="#c6b28c" strokeWidth="3" fill="none"/>
  </g>;
}

export default function World({ onOpen, visited, paused, artwork, completed }: { completed: Set<string>; onOpen: (id: string) => void; visited: Set<string>; paused: boolean; artwork: string }) {
  const section = useSectionMotion('world');
  const [position, setPosition] = useState<Point>({ x: 500, y: 320 });
  const [active, setActive] = useState(false);
  const keys = useRef(new Set<string>());
  const world = useRef<HTMLDivElement>(null);
  const nearest = rooms.find(room => { const point = interactionPoint(room); return Math.hypot(position.x - point.x, position.y - point.y) < 70; });
  useEffect(() => {
    if (!active || paused) { keys.current.clear(); return; }
    let frame = 0;
    let last = 0;
    const tick = (time: number) => {
      const dt = last ? Math.min((time-last)/1000, .035) : 0;
      last = time;
      const held = keys.current;
      let x = Number(held.has('d') || held.has('arrowright')) - Number(held.has('a') || held.has('arrowleft'));
      let y = Number(held.has('s') || held.has('arrowdown')) - Number(held.has('w') || held.has('arrowup'));
      const length = Math.hypot(x,y);
      if (length) { x /= length; y /= length; setPosition(p => move(p, x * dt * 145, y * dt * 145)); }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const clear = () => keys.current.clear();
    window.addEventListener('blur', clear);
    document.addEventListener('visibilitychange', clear);
    return () => { cancelAnimationFrame(frame); clear(); window.removeEventListener('blur', clear); document.removeEventListener('visibilitychange', clear); };
  }, [active, paused]);
  return <section ref={section} id="world" className="world-section" aria-labelledby="world-title">
    <div className="section-bar"><div><h2 id="world-title">Welcome to Eric's home.</h2></div></div>
    <p className="section-intro">Walk into a room, pick up an instrument, draw something, chase a beat, or investigate a model.</p>
    <div className="world-shell">
      <div className="world-toolbar"><span><span className="tiny-square"/> ERIC’S LITTLE WORLD</span><span>{visited.size} / 8 rooms explored</span><button className="world-walk" onClick={() => world.current?.focus()}>Walk around</button></div>
      <div ref={world} className={`world-stage ${active ? 'playing' : ''}`} tabIndex={0} role="group" aria-label="Interactive world. Use arrow keys or WASD to walk, E to interact, Escape to release controls. Or select any room button."
        onFocus={() => setActive(true)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) { setActive(false); keys.current.clear(); } }}
        onKeyDown={e => {
          if (paused) return;
          const key = e.key.toLowerCase();
          if (['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(key)) { e.preventDefault(); keys.current.add(key); }
          if (key === 'e' && nearest && !e.repeat) { e.preventDefault(); onOpen(nearest.id); }
          if (key === 'escape') { keys.current.clear(); world.current?.blur(); }
        }} onKeyUp={e => keys.current.delete(e.key.toLowerCase())}>
        <svg viewBox="0 0 1000 610" role="img" aria-label="A miniature nighttime workspace with eight connected rooms" className="world-art">
          <defs>
            <pattern id="floor" width="22" height="22" patternUnits="userSpaceOnUse"><rect width="22" height="22" fill="#44212b"/><path d="M0 22h22V0" fill="none" stroke="#63313d" strokeWidth=".8"/></pattern>
            <pattern id="wood" width="44" height="20" patternUnits="userSpaceOnUse"><rect width="44" height="20" fill="#46242d"/><path d="M0 20h44M22 0v20" fill="none" stroke="#653441" strokeWidth="1"/></pattern>
            <radialGradient id="lamp"><stop stopColor="#e3c88c" stopOpacity=".15"/><stop offset="1" stopColor="#e3c88c" stopOpacity="0"/></radialGradient>
          </defs>
          <rect width="1000" height="610" fill="#421622"/>
          
          <rect x="24" y="62" width="952" height="521" rx="8" fill="#250e17"/>
          <rect x="30" y="275" width="940" height="90" fill="url(#floor)"/>
          <path d="M55 320h375m140 0h375" stroke="#b9aa7a" strokeOpacity=".25" strokeDasharray="3 9"/>
          <text x="500" y="348" fill="#87948e" fontSize="8" textAnchor="middle" letterSpacing="3">FOLLOW YOUR CURIOSITY</text>
          {rooms.map(room => <g key={room.id} transform={`translate(${room.x},${room.y})`}>
            <rect x="0" y="5" width="220" height="210" fill="#250e17"/>
            <rect x="6" y="12" width="208" height="193" fill={['art','music','home','library'].includes(room.id)?'url(#wood)':'url(#floor)'}/>
            <rect x="6" y="12" width="208" height="193" fill={room.color} opacity=".16"/>
            <rect x="13" y="17" width="194" height="23" fill={room.color} opacity=".23"/>
            <path d="M3 207V6m214 0v201" stroke="#a55b67" strokeWidth="4" fill="none"/>
            {room.y===60 ? <><path d="M3 6h214" stroke="#a55b67" strokeWidth="4"/><path d="M0 210h83m54 0h83" stroke="#a55b67" strokeWidth="4"/></> : <><path d="M0 7h83m54 0h83" stroke="#a55b67" strokeWidth="4"/><path d="M0 210h220" stroke="#a55b67" strokeWidth="4"/></>}
            <ellipse cx="111" cy="95" rx="99" ry="83" fill="url(#lamp)"/>
            <circle cx="195" cy="29" r="4" fill={completed.has(room.id) ? "#ffe34d" : room.color}/><g transform={room.y === 60 ? undefined : "translate(0,60)"}><Furniture kind={room.icon} artwork={artwork}/></g>
            <ellipse cx="110" cy={room.y === 60 ? 155 : 65} rx="38" ry="12" fill={room.color} opacity={nearest?.id === room.id ? ".22" : ".08"}/>
            <text x="110" y="32" fill="#fff0df" textAnchor="middle" fontFamily="inherit" fontSize="12" letterSpacing=".6">{room.short}</text>
            <rect x="89" y={room.y===60?204:4} width="43" height="5" fill={room.color} opacity=".65"/>
          </g>)}
          <g transform="translate(939,318)"><path d="m-9-2 3 15h12l3-15Z" fill="#b38c6a"/><path d="M0-2v-22m0 14q-17-17-14-4Q-8-3 0-4m0-9q15-21 14-7Q10-9 0-9" stroke="#86a88c" strokeWidth="4" fill="none"/></g>
          <WorldPlayer position={position} paused={paused || !active}/>
          <text x="30" y="37" fontFamily="inherit" fontSize="10" letterSpacing="2" fill="#94a69c">THE LIGHTS ARE ON.</text>
          <text x="970" y="597" textAnchor="end" fontFamily="inherit" fontSize="9" letterSpacing="2" fill="#7f928b">NO WRONG TURNS HERE.</text>
        </svg>
        {rooms.map(room => <button key={room.id} className={`room-hit ${nearest?.id === room.id ? 'nearby' : ''}`} style={{left:`${(room.x+34)/10}%`,top:`${(room.y+(room.y === 60 ? 132 : 42))/6.1}%`,width:'15.2%',height:'7%'}} onClick={() => onOpen(room.id)} aria-label={`Explore ${room.label}`}><span>{visited.has(room.id)?'✓':'↗'}</span><span className="sr-only">{room.label}</span></button>)}
        <button className="plant-hit" style={{left:'92%',top:'48%'}} aria-label="Inspect the suspicious plant" onClick={() => onOpen('plant')}>?</button>
      </div>
      <div className="world-bottom"><div className="world-control-copy"><span><kbd>WASD</kbd> / <kbd>Arrow keys</kbd> to walk · <kbd>E</kbd> to enter</span><span aria-live="polite">{nearest ? `At ${nearest.label}` : 'Follow the hallway to an open doorway.'}</span></div><div className="world-touch-controls" aria-label="Movement controls">{[{ label: 'Move up', key: 'w', icon: '↑', x: 0, y: -1 }, { label: 'Move left', key: 'a', icon: '←', x: -1, y: 0 }, { label: 'Move down', key: 's', icon: '↓', x: 0, y: 1 }, { label: 'Move right', key: 'd', icon: '→', x: 1, y: 0 }].map(control => <button key={control.key} aria-label={control.label} onPointerDown={e => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); world.current?.focus(); keys.current.add(control.key); }} onPointerUp={() => keys.current.clear()} onPointerCancel={() => keys.current.clear()} onLostPointerCapture={() => keys.current.clear()} onClick={e => { if (e.detail === 0) setPosition(p => move(p, control.x * 14, control.y * 14)); }}>{control.icon}</button>)}</div><button className="world-enter" disabled={!nearest} onClick={() => { if (nearest) onOpen(nearest.id); }}>Enter room <span aria-hidden="true">↗</span></button></div>
    </div>
    <div className="mobile-room-directory" aria-label="Room shortcuts">{rooms.map(room => <button key={room.id} onClick={() => onOpen(room.id)}>{room.label}<span>↗</span></button>)}</div>
    <div className="world-caption"><span>Click a room to jump in, or walk through the open doorways.</span><span>Keyboard, mouse, and touch.</span></div>
  </section>;
}
