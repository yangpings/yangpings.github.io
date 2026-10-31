export type Point = { x: number; y: number };
export const rooms = [
  { id: 'llm', label: 'AI / Research lab', short: 'AI LAB', x: 30, y: 60, color: '#ff7868', icon: 'terminal' },
  { id: 'retina', label: 'Vision lab', short: 'VISION LAB', x: 270, y: 60, color: '#82cfff', icon: 'eye' },
  { id: 'art', label: 'Art studio', short: 'ART STUDIO', x: 510, y: 60, color: '#ff9254', icon: 'art' },
  { id: 'music', label: 'Music room', short: 'MUSIC ROOM', x: 750, y: 60, color: '#ff8b9e', icon: 'music' },
  { id: 'library', label: 'Library / CV', short: 'THE LIBRARY', x: 30, y: 365, color: '#ffe34d', icon: 'books' },
  { id: 'home', label: 'Home', short: 'HOME, SWEET HOME', x: 270, y: 365, color: '#ffc18d', icon: 'home' },
  { id: 'arcade', label: 'Arcade', short: 'JUST ONE MORE', x: 510, y: 365, color: '#ff746d', icon: 'arcade' },
  { id: 'travel', label: 'Travel / Conferences', short: 'OUT IN THE WORLD', x: 750, y: 365, color: '#9ae7b3', icon: 'map' },
];
export function interactionPoint(room: typeof rooms[number]): Point {
  return { x: room.x + 110, y: room.y + (room.y === 60 ? 155 : 65) };
}
// Room interiors join the central corridor through 52-unit doorways.
export function canWalk({ x, y }: Point) {
  if (x < 40 || x > 960 || y < 76 || y > 558) return false;
  if (y >= 283 && y <= 357) return true;
  return rooms.some(room => {
    const inside = x >= room.x + 12 && x <= room.x + 208 && y >= room.y + 16 && y <= room.y + 193;
    const doorway = Math.abs(x - room.x - 110) <= 26 && (room.y === 60 ? y >= 250 && y <= 290 : y >= 350 && y <= 390);
    // Lower-room furniture belongs against the far wall, clear of the entrance.
    const furniture = inside && x > room.x + 50 && x < room.x + 170 &&
      (room.y === 60 ? y < room.y + 112 : y >= room.y + 105);
    return (inside && !furniture) || doorway;
  });
}
export function move(position: Point, dx: number, dy: number): Point {
  const next = { ...position };
  if (canWalk({ x: next.x + dx, y: next.y })) next.x += dx;
  if (canWalk({ x: next.x, y: next.y + dy })) next.y += dy;
  return next;
}

// The order of the levels on the overworld map, from the start (Home) to the castle (Travel).
export const levelOrder = ['home', 'library', 'llm', 'retina', 'art', 'music', 'arcade', 'travel'];
