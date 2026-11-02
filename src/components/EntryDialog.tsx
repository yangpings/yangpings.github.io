import { useEffect, useRef } from 'react';
import { projectNarratives } from '../projectNarratives';
import type { Entry } from '../content';

import WorldPanel, { worldTitles } from './WorldPanel';
import MediaGallery from './MediaGallery';
import { artworks, posters } from '../media';
import ProjectSheet from './ProjectSheet';
import useLingering from '../useLingering';
import { displayFor, projectDisplay } from '../projectDisplay';
import { placeProjectOrigin, placeRoomOrigin } from '../popupOrigin';
import { levelOrder, rooms } from '../world';

export function EntryBody({ entry, narrative = false }: { entry: Entry; narrative?: boolean }) {
  return <>{entry.status && <p className="project-status">{entry.status}</p>}<p className="entry-subtitle">{entry.subtitle}</p>{!narrative && <p className="entry-description">{entry.description}</p>}
    {entry.image && <img className="dialog-art" src={entry.image} alt={entry.imageAlt} loading="lazy"/>}
    <div className="entry-details">{(narrative ? projectNarratives[entry.id] ?? entry.details : entry.details).map(detail => <p key={detail}>{detail}</p>)}</div>
    <div className="tags">{entry.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
    {entry.id === 'art' && <MediaGallery items={artworks} label="Art studio gallery"/>}
    {entry.id === 'retina' && <MediaGallery items={posters.slice(0, 1)} label="Retinal imaging poster"/>}
    {entry.id === 'sweat' && <MediaGallery items={posters.slice(1)} label="Sweat amino-acid poster"/>}
    {entry.id === 'library' && <MediaGallery items={posters} label="Research archive posters"/>}
    {entry.links && <div className="entry-links">{entry.links.map(link => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label}</a>)}</div>}
  </>;
}

// A level of the island map as a colourful card: a band in the room's colour with a stamp and the
// room's name, then its activity. The bar with Close stays pinned while the card scrolls.
function RoomSheet({ entry, completed, onComplete, onClose }: { entry: Entry; completed: Set<string>; onComplete: (id: string) => void; onClose: () => void }) {
  const room = rooms.find(item => item.id === entry.id);
  const number = room ? levelOrder.indexOf(room.id) + 1 : undefined;
  const done = completed.has(entry.id);
  return <article className="room-sheet" style={{ '--room': room?.color ?? '#ffd078' } as React.CSSProperties}>
    <div className="dialog-top room-sheet-bar">
      <span className="room-sheet-crumb">{number ? "Eric's island" : "Eric's island · Secret area"}</span>
      <button autoFocus className="close-button room-close" onClick={onClose} aria-label="Close details">Close</button>
    </div>
    <header className="room-sheet-head">
      <span className={`room-stamp${done ? ' is-done' : ''}`}>{entry.id === 'plant' ? 'Secret found!' : done ? 'Level clear!' : 'Level unlocked'}</span>
      <h2 id="entry-title">{worldTitles[entry.id] ?? entry.title}</h2>
    </header>
    <div className="room-sheet-body"><WorldPanel key={entry.id} entry={entry} completed={completed} onComplete={onComplete}/></div>
  </article>;
}

export default function EntryDialog({ entry, onClose, completed, onComplete, interactive, onNavigate }: { interactive: boolean; entry?: Entry; onClose: () => void; completed: Set<string>; onComplete: (id: string) => void; onNavigate?: (id: string) => void }) {
  // Research projects opened from the project list read as a full-screen case study.
  const shown = useLingering(entry);
  const caseStudy = !interactive && !!shown && shown.id in projectDisplay;
  const dialog = useRef<HTMLDialogElement>(null);
  // Open and close only when a dialog starts or ends, so moving to the next project keeps it open.
  const isOpen = !!entry;
  // Measure where this popup comes from. "Next project" re-measures, so closing returns to the project being read.
  const place = () => {
    if (!dialog.current || !entry) return;
    if (caseStudy) placeProjectOrigin(dialog.current, displayFor(entry.id, entry.title, entry.category).name);
    else if (interactive) placeRoomOrigin(dialog.current, rooms.find(room => room.id === entry.id)?.color);
  };
  useEffect(() => { if (dialog.current?.open) place(); }, [entry?.id]);
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    // Lock the page first: hiding the scrollbar can shift it, and the origin is measured next.
    document.body.style.overflow = 'hidden';
    place();
    dialog.current?.showModal();
    return () => { dialog.current?.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, [isOpen]);
  return <dialog ref={dialog} className={`entry-dialog${caseStudy ? ' is-project' : ''}${interactive ? ' is-room' : ''}${interactive && shown?.id === 'llm' ? ' playground-dialog' : interactive && shown?.id === 'art' ? ' studio-dialog' : ''}`} onCancel={onClose} onClick={e => {if (e.target === e.currentTarget) onClose();}} aria-labelledby="entry-title">
    {shown && caseStudy && <span className="sheet-ghost" aria-hidden="true">{displayFor(shown.id, shown.title, shown.category).name}</span>}
    {shown && caseStudy && <ProjectSheet key={shown.id} entry={shown} onClose={onClose} onNavigate={onNavigate}/>}{shown && !caseStudy && interactive && <RoomSheet entry={shown} completed={completed} onComplete={onComplete} onClose={onClose}/>}{shown && !caseStudy && !interactive && <article><div className="dialog-top"><span className="eyebrow">{shown.category}</span><button autoFocus className="close-button" onClick={onClose} aria-label="Close details">✕</button></div><h2 id="entry-title">{shown.title}</h2><EntryBody entry={shown} narrative/></article>}
  </dialog>;
}
