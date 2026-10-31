import { useState, type CSSProperties } from 'react';

// The Library as a reading room of favourite fiction: a shelf of book spines. Pull one and it opens
// on the desk with a short blurb, and a bag to pack for a trip into that world. Opened books get a
// bookmark ribbon. Packing everything for one world, or opening three books, finishes the room.
type Book = { id: string; spine: string; title: string; author: string; year: string; color: string; height: number; blurb: string; pack: string[] };
const books: Book[] = [
  { id: 'hp', spine: 'Harry Potter', title: "Harry Potter and the Philosopher's Stone", author: 'J.K. Rowling', year: '1997', color: '#c2413b', height: 90,
    blurb: 'A boy living under the stairs learns he is a wizard and boards a train from a platform that should not exist.', pack: ['Wand', 'Invisibility cloak', 'Chocolate frogs'] },
  { id: 'lotr', spine: 'Lord of the Rings', title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', year: '1954', color: '#5f8f55', height: 98,
    blurb: 'A hobbit carries a dangerous ring across Middle-earth, with a fellowship that does not stay together for long.', pack: ['Lembas bread', 'Elven cloak', 'A map of Middle-earth'] },
  { id: 'alice', spine: 'Wonderland', title: "Alice's Adventures in Wonderland", author: 'Lewis Carroll', year: '1865', color: '#82cfff', height: 78,
    blurb: 'A girl follows a hurried rabbit down a hole into a world where size, logic and tea-time all behave strangely.', pack: ['Pocket watch', 'A "Drink me" bottle', 'Jam tarts'] },
  { id: 'dune', spine: 'Dune', title: 'Dune', author: 'Frank Herbert', year: '1965', color: '#e0873c', height: 88,
    blurb: 'On a desert planet where water is everything, a young heir is drawn into politics, prophecy and giant sandworms.', pack: ['Stillsuit', 'Maker hooks', 'Spice coffee'] },
  { id: 'prince', spine: 'Little Prince', title: 'The Little Prince', author: 'Antoine de Saint-Exupéry', year: '1943', color: '#ffd078', height: 72,
    blurb: 'A pilot stranded in the desert meets a small traveller from an asteroid who has a great deal to say about grown-ups.', pack: ['A drawing of a sheep', 'Watering can', 'Glass dome for a rose'] },
  { id: 'west', spine: 'Journey West', title: 'Journey to the West', author: "Wu Cheng'en", year: '16th c.', color: '#ff8b9e', height: 94,
    blurb: 'A monk travels to India for sacred scriptures, guarded by a rebellious Monkey King and two unlikely companions.', pack: ['Golden-banded staff', 'Peaches of immortality', "A monk's alms bowl"] },
  { id: 'hitch', spine: "Hitchhiker's", title: "The Hitchhiker's Guide to the Galaxy", author: 'Douglas Adams', year: '1979', color: '#9ae7b3', height: 82,
    blurb: 'Minutes before Earth is demolished for a bypass, an ordinary man is rescued by a friend who turns out to be an alien.', pack: ['A towel', 'Babel fish', 'The Guide itself'] },
  { id: 'verne', spine: '20,000 Leagues', title: 'Twenty Thousand Leagues Under the Seas', author: 'Jules Verne', year: '1870', color: '#c9a2ff', height: 86,
    blurb: 'A professor hunting a sea monster ends up a guest aboard the Nautilus, the secret submarine of the mysterious Captain Nemo.', pack: ['Diving suit', 'Chart of the ocean floor', 'A giant pearl'] },
];

export default function LibraryShelf({ complete }: { complete: () => void }) {
  const [open, setOpen] = useState<string | null>(null);
  const [read, setRead] = useState(new Set<string>());
  const [packed, setPacked] = useState<string[]>([]);
  const book = books.find(b => b.id === open);

  function pull(id: string) {
    setOpen(id); setPacked([]);
    const next = new Set(read).add(id); setRead(next);
    if (next.size >= 3) complete();
  }
  function pack(item: string) {
    const next = packed.includes(item) ? packed.filter(i => i !== item) : [...packed, item];
    setPacked(next);
    if (book && next.length === book.pack.length) complete();
  }

  return <div className="library">
    <div className="library-shelf" role="list" aria-label="Bookshelf">
      {books.map(b => <button key={b.id} role="listitem" className={`library-spine${open === b.id ? ' is-out' : ''}${read.has(b.id) ? ' is-read' : ''}`}
        style={{ '--book': b.color, '--h': `${b.height}%` } as CSSProperties} aria-label={`${b.title} by ${b.author}`} aria-pressed={open === b.id} onClick={() => pull(b.id)}>
        <span className="spine-title">{b.spine}</span><span className="spine-year">{b.year}</span>
        {read.has(b.id) && <span className="spine-ribbon" aria-hidden="true"/>}
      </button>)}
      <span className="library-bookend" aria-hidden="true"/>
    </div>
    <div className="library-plank" aria-hidden="true"/>

    <div className="library-desk">
      {book ? <article key={book.id} className="library-book" style={{ '--book': book.color } as CSSProperties}>
        <div className="book-cover"><span className="book-kind">{book.author}</span><h3>{book.title}</h3><span className="book-year">{book.year}</span></div>
        <div className="book-page"><p>{book.blurb}</p>
          <p className="book-venue">Pack for a trip into this world:</p>
          <div className="book-pack">{book.pack.map(item => <button key={item} aria-pressed={packed.includes(item)} onClick={() => pack(item)}>{packed.includes(item) ? '✓ ' : '+ '}{item}</button>)}</div>
        </div>
      </article> : <p className="library-empty">Pull a book from the shelf to open it here.</p>}
    </div>
    <p className="activity-feedback" role="status">{book && packed.length ? `In your bag: ${packed.join(', ')}.${packed.length === book.pack.length ? ' Ready to go.' : ''}`
      : read.size ? `${read.size} of ${books.length} books opened.` : 'Eight novels worth getting lost in. Pick one.'}</p>
  </div>;
}
