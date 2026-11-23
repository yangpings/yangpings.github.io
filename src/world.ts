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
// The order of the levels around the World.exe dial, starting from Home.
export const levelOrder = ['home', 'library', 'llm', 'retina', 'art', 'music', 'arcade', 'travel'];
