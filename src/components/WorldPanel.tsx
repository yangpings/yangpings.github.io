import { useState } from 'react';
import type { Entry } from '../content';
import RoomActivity from './RoomActivity';
import { CityMap } from './TravelActivity';

export const worldTitles: Record<string, string> = {
  llm: 'AI / ML Playground', retina: 'Vision lab', music: 'Music room',
  art: 'Art studio', arcade: 'Arcade', travel: 'Travel desk', library: 'Library', home: 'Home, sweet San Francisco', plant: 'A suspicious plant',
};
const shelves = [
  { name: 'Harry Potter', prompt: 'Pack for a night at Hogwarts.', items: ['Wand', 'Invisibility cloak', 'Chocolate frogs'] },
  { name: 'The Lord of the Rings', prompt: 'Pack for the road to Rivendell.', items: ['Lembas bread', 'Elven cloak', 'A map of Middle-earth'] },
];
function Library() {
  const [shelf, setShelf] = useState(0);
  const [packed, setPacked] = useState<string[]>([]);
  return <><p>Choose a bookshelf and pack a tiny fantasy adventure.</p><div className="corner-picker">{shelves.map((book, i) => <button key={book.name} aria-pressed={shelf === i} onClick={() => { setShelf(i); setPacked([]); }}>{book.name}</button>)}</div><h3>{shelves[shelf].prompt}</h3><div className="activity-options">{shelves[shelf].items.map(item => <button key={item} aria-pressed={packed.includes(item)} onClick={() => setPacked(previous => previous.includes(item) ? previous.filter(value => value !== item) : [...previous, item])}>{packed.includes(item) ? 'Packed: ' : '+ '}{item}</button>)}</div><p role="status">{packed.length ? `In your bag: ${packed.join(', ')}.` : 'Your adventure bag is empty.'}</p></>;
}
export default function WorldPanel({ entry, completed, onComplete }: { entry: Entry; completed: Set<string>; onComplete: (id: string) => void }) {
  if (entry.id === 'plant') return <p className="entry-description">{entry.description}</p>;
  if (entry.id === 'library') return <Library/>;
  if (entry.id === 'home') return <><p>San Francisco: hills, fog, cable cars, and the bay. Explore a little closer.</p><CityMap name="San Francisco" query="San Francisco, California"/><div className="entry-links"><a href="https://www.google.com/maps/search/?api=1&query=Golden+Gate+Bridge" target="_blank" rel="noreferrer">Golden Gate Bridge</a><a href="https://www.google.com/maps/search/?api=1&query=Golden+Gate+Park" target="_blank" rel="noreferrer">Golden Gate Park</a><a href="https://www.google.com/maps/search/?api=1&query=Ferry+Building+San+Francisco" target="_blank" rel="noreferrer">Ferry Building</a></div></>;
  return <RoomActivity id={entry.id} completed={completed.has(entry.id)} onComplete={onComplete}/>;
}
