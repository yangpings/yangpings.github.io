import type { Entry } from '../content';
import RoomActivity from './RoomActivity';
import { CityMap } from './TravelActivity';
import LibraryShelf from './LibraryShelf';

export const worldTitles: Record<string, string> = {
  llm: 'AI / ML Playground', retina: 'Vision lab', music: 'Music room',
  art: 'Art studio', arcade: 'Arcade', travel: 'Travel desk', library: 'Library', home: 'Home, sweet San Francisco', plant: 'A suspicious plant',
};
export default function WorldPanel({ entry, completed, onComplete }: { entry: Entry; completed: Set<string>; onComplete: (id: string) => void }) {
  if (entry.id === 'plant') return <p className="entry-description">{entry.description}</p>;
  if (entry.id === 'library') return <LibraryShelf complete={() => onComplete('library')}/>;
  if (entry.id === 'home') return <><p>San Francisco: hills, fog, cable cars, and the bay. Explore a little closer.</p><CityMap name="San Francisco" query="San Francisco, California"/><div className="entry-links"><a href="https://www.google.com/maps/search/?api=1&query=Golden+Gate+Bridge" target="_blank" rel="noreferrer">Golden Gate Bridge</a><a href="https://www.google.com/maps/search/?api=1&query=Golden+Gate+Park" target="_blank" rel="noreferrer">Golden Gate Park</a><a href="https://www.google.com/maps/search/?api=1&query=Ferry+Building+San+Francisco" target="_blank" rel="noreferrer">Ferry Building</a></div></>;
  return <RoomActivity id={entry.id} completed={completed.has(entry.id)} onComplete={onComplete}/>;
}
