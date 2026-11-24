import { useState, type CSSProperties } from 'react';

// The Library as a reading room of favourite fiction: a walnut bookcase of cloth-bound spines.
// Pull one and it opens on the desk as a two-page spread: a title page, then a short blurb and a
// few things to pack for a trip into that world. Opened books keep a bookmark ribbon.
// Packing everything for one world, or opening three books, finishes the room.
type Book = { id: string; spine: string; title: string; author: string; year: string; cloth: string; width: number; height: number; blurb: string; pack: string[] };
const books: Book[] = [
  { id: 'hp', spine: 'Harry Potter', title: "Harry Potter and the Philosopher's Stone", author: 'J.K. Rowling', year: '1997', cloth: '#7d1e25', width: 68, height: 88,
    blurb: 'A boy living under the stairs learns he is a wizard and boards a train from a platform that should not exist.', pack: ['Wand', 'Invisibility cloak', 'Chocolate frogs'] },
  { id: 'lotr', spine: 'Lord of the Rings', title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', year: '1954', cloth: '#2f4b2c', width: 84, height: 97,
    blurb: 'A hobbit carries a dangerous ring across Middle-earth, with a fellowship that does not stay together for long.', pack: ['Lembas bread', 'Elven cloak', 'A map of Middle-earth'] },
  { id: 'alice', spine: 'Wonderland', title: "Alice's Adventures in Wonderland", author: 'Lewis Carroll', year: '1865', cloth: '#2b5479', width: 58, height: 76,
    blurb: 'A girl follows a hurried rabbit down a hole into a world where size, logic and tea-time all behave strangely.', pack: ['Pocket watch', 'A "Drink me" bottle', 'Jam tarts'] },
  { id: 'dune', spine: 'Dune', title: 'Dune', author: 'Frank Herbert', year: '1965', cloth: '#a2531d', width: 74, height: 90,
    blurb: 'On a desert planet where water is everything, a young heir is drawn into politics, prophecy and giant sandworms.', pack: ['Stillsuit', 'Maker hooks', 'Spice coffee'] },
  { id: 'prince', spine: 'Little Prince', title: 'The Little Prince', author: 'Antoine de Saint-Exupéry', year: '1943', cloth: '#1f3c66', width: 66, height: 76,
    blurb: 'A pilot stranded in the desert meets a small traveller from an asteroid who has a great deal to say about grown-ups.', pack: ['A drawing of a sheep', 'Watering can', 'Glass dome for a rose'] },
  { id: 'west', spine: 'Journey West', title: 'Journey to the West', author: "Wu Cheng'en", year: '16th c.', cloth: '#5e2a54', width: 78, height: 94,
    blurb: 'A monk travels to India for sacred scriptures, guarded by a rebellious Monkey King and two unlikely companions.', pack: ['Golden-banded staff', 'Peaches of immortality', "A monk's alms bowl"] },
  { id: 'hitch', spine: "Hitchhiker's", title: "The Hitchhiker's Guide to the Galaxy", author: 'Douglas Adams', year: '1979', cloth: '#1c5d55', width: 64, height: 81,
    blurb: 'Minutes before Earth is demolished for a bypass, an ordinary man is rescued by a friend who turns out to be an alien.', pack: ['A towel', 'Babel fish', 'The Guide itself'] },
  { id: 'verne', spine: '20,000 Leagues', title: 'Twenty Thousand Leagues Under the Seas', author: 'Jules Verne', year: '1870', cloth: '#3b3060', width: 70, height: 85,
    blurb: 'A professor hunting a sea monster ends up a guest aboard the Nautilus, the secret submarine of the mysterious Captain Nemo.', pack: ['Diving suit', 'Chart of the ocean floor', 'A giant pearl'] },
];

export default function LibraryShelf({ complete }: { complete: () => void }) {
  const [open, setOpen] = useState<string | null>(null);
  const [read, setRead] = useState(new Set<string>());
  const [packed, setPacked] = useState<string[]>([]);
  const index = books.findIndex(b => b.id === open);
  const book = books[index];

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
  const turn = (by: number) => pull(books[(index + by + books.length) % books.length].id);

  return <div className="library lib">
    <div className="lib-case">
      <div className="lib-shelf" role="list" aria-label="Bookshelf">
        {books.map(b => <button key={b.id} type="button" role="listitem" className={`lib-spine rx${open === b.id ? ' is-out' : ''}${read.has(b.id) ? ' is-read' : ''}`}
          style={{ '--cloth': b.cloth, '--w': `${b.width}px`, '--h': `${b.height}%` } as CSSProperties}
          aria-label={`${b.title} by ${b.author}`} aria-pressed={open === b.id} onClick={() => pull(b.id)}>
          <span className="lib-band" aria-hidden="true"/>
          <span className="lib-spine-title">{b.spine}</span>
          <span className="lib-spine-year">{b.year}</span>
          <span className="lib-band" aria-hidden="true"/>
          {read.has(b.id) && <span className="lib-ribbon" aria-hidden="true"/>}
        </button>)}
        <span className="lib-decor" aria-hidden="true">
          <span className="lib-stack"><i/><i/></span>
          <svg className="lib-plant" viewBox="0 0 60 80"><path d="M30 52 C 18 40 8 38 4 24 C 18 26 26 36 30 52 Z" fill="#5f8f55"/><path d="M30 52 C 40 36 50 34 56 18 C 42 22 34 34 30 52 Z" fill="#79ab69"/><path d="M30 54 C 28 34 30 18 36 4 C 40 22 36 38 30 54 Z" fill="#4c7a45"/><path d="M14 52 H46 L42 78 H18 Z" fill="#c26a4a"/><path d="M12 50 H48 V56 H12 Z" fill="#d98462"/></svg>
        </span>
      </div>
    </div>

    <div className="lib-desk">
      {book ? <article key={book.id} className="lib-book" style={{ '--cloth': book.cloth } as CSSProperties} aria-label={book.title}>
        <div className="lib-page lib-page-left">
          <span className="lib-ornament" aria-hidden="true">❦</span>
          <h3>{book.title}</h3>
          <span className="lib-rule" aria-hidden="true"/>
          <p className="lib-author">{book.author}</p>
          <p className="lib-year">{book.year}</p>
          <span className="lib-folio" aria-hidden="true">{index + 1} / {books.length}</span>
        </div>
        <div className="lib-page lib-page-right">
          <p className="lib-blurb">{book.blurb}</p>
          <div className="lib-pack">
            <p className="lib-pack-title">Pack for a trip into this world <span>{packed.length} / {book.pack.length}</span></p>
            <div className="lib-tags">{book.pack.map(item => <button key={item} type="button" className="rx lib-tag" aria-pressed={packed.includes(item)} onClick={() => pack(item)}>
              <i aria-hidden="true">{packed.includes(item) ? '✓' : '+'}</i>{item}
            </button>)}</div>
          </div>
        </div>
      </article> : <div className="lib-waiting">
        <span className="lib-closed" aria-hidden="true"><i/></span>
        <p><strong>Pull a book from the shelf.</strong> It opens here, on the desk. Open three to finish the room.</p>
      </div>}
    </div>

    <div className="lib-foot">
      <p className="activity-feedback lib-status" role="status">{book && packed.length ? `In your bag: ${packed.join(', ')}.${packed.length === book.pack.length ? ' Ready to go.' : ''}`
        : read.size ? `${read.size} of ${books.length} books opened.` : 'Eight novels worth getting lost in. Pick one.'}</p>
      {book && <div className="lib-turn">
        <button type="button" className="rx lib-turn-btn" onClick={() => turn(-1)} aria-label="Previous book">←</button>
        <button type="button" className="rx lib-turn-btn" onClick={() => turn(1)} aria-label="Next book">→</button>
      </div>}
    </div>
  </div>;
}
