import { useEffect, useRef } from 'react';
import type { Entry } from '../content';
import { projectNarratives } from '../projectNarratives';
import { displayFor, nextProject } from '../projectDisplay';
import MediaGallery from './MediaGallery';
import { posters } from '../media';

// A project read as a case study: a pinned column with the title, what kind of work it is and its
// topics, beside a reading column with the poster (when there is one) and the story.
// "Next project" moves straight on without closing, so all six can be read in a row.
export default function ProjectSheet({ entry, onClose, onNavigate }: { entry: Entry; onClose: () => void; onNavigate?: (id: string) => void }) {
  const info = displayFor(entry.id, entry.title, entry.category);
  const story = projectNarratives[entry.id] ?? entry.details;
  const next = nextProject(entry.id);
  const poster = entry.id === 'retina' ? posters.slice(0, 1) : entry.id === 'sweat' ? posters.slice(1) : [];
  const sheet = useRef<HTMLElement>(null);
  // A new project starts at the top of the sheet.
  useEffect(() => { sheet.current?.closest('dialog')?.scrollTo({ top: 0 }); }, [entry.id]);

  return <article ref={sheet} className="project-sheet">
    <div className="sheet-bar">
      <p className="sheet-crumb">Projects <span aria-hidden="true">/</span> {info.name}</p>
      <button autoFocus className="close-button sheet-close" onClick={onClose} aria-label="Close details">Close</button>
    </div>
    <div className="sheet-grid">
      <header className="sheet-side">
        <p className="sheet-label">{info.label}{entry.status ? `, ${entry.status.toLowerCase()}` : ''}</p>
        <h2 id="entry-title">{entry.title}</h2>
        <ul className="sheet-topics" aria-label="Topics">{entry.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
        {entry.links && <div className="entry-links">{entry.links.map(link => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label}</a>)}</div>}
      </header>
      <div className="sheet-main">
        {poster.length > 0 && <MediaGallery items={poster} label={`${info.name} poster`}/>}
        <div className="entry-details">{story.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
        {next && onNavigate && <button className="sheet-next" onClick={() => onNavigate(next.id)}>
          <span className="sheet-next-label">Next project</span>
          <span className="sheet-next-name">{displayFor(next.id, next.title, next.category).name}</span>
        </button>}
      </div>
    </div>
  </article>;
}
