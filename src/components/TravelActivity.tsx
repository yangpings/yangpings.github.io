import { useState } from 'react';
const stops = [
  { name: 'London', country: 'United Kingdom' },
  { name: 'Tokyo', country: 'Japan' },
  { name: 'Kobe', country: 'Japan' },
];
export default function TravelActivity({ complete }: { complete: () => void }) {
  const [stop, setStop] = useState(0);
  const destination = stops[stop];
  return <><p>Choose a city and explore its map.</p><div className="corner-picker" aria-label="Travel destinations">{stops.map((place, i) => <button key={place.name} aria-pressed={stop === i} onClick={() => { setStop(i); complete(); }}>{place.name}</button>)}</div><CityMap name={destination.name} query={`${destination.name}, ${destination.country}`}/></>;
}
export function CityMap({ name, query }: { name: string; query: string }) {
  const encoded = encodeURIComponent(query);
  return <div className="city-map"><iframe key={query} title={`Map of ${name}`} src={`https://maps.google.com/maps?q=${encoded}&z=12&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen/><a className="text-link" href={`https://www.google.com/maps/search/?api=1&query=${encoded}`} target="_blank" rel="noreferrer">Explore {name} in Google Maps</a></div>;
}
