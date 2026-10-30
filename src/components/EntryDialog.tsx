import { useEffect, useRef } from 'react';
import { projectNarratives } from '../projectNarratives';
import type { Entry } from '../content';

import WorldPanel, { worldTitles } from './WorldPanel';
import MediaGallery from './MediaGallery';
import { artworks, posters } from '../media';

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

export default function EntryDialog({ entry, onClose, completed, onComplete, interactive }: { interactive: boolean; entry?: Entry; onClose: () => void; completed: Set<string>; onComplete: (id: string) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!entry) return;
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { dialog.current?.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, [entry]);
  return <dialog ref={dialog} className={`entry-dialog${interactive && entry?.id === 'llm' ? ' playground-dialog' : interactive && entry?.id === 'art' ? ' studio-dialog' : ''}`} onCancel={onClose} onClick={e => {if (e.target === e.currentTarget) onClose();}} aria-labelledby="entry-title">
    {entry && <article><div className="dialog-top"><span className="eyebrow">{interactive ? 'Eric’s little world' : entry.category}</span><button autoFocus className="close-button" onClick={onClose} aria-label="Close details">✕</button></div><h2 id="entry-title">{interactive ? worldTitles[entry.id] ?? entry.title : entry.title}</h2>{interactive ? <WorldPanel key={entry.id} entry={entry} completed={completed} onComplete={onComplete}/> : <EntryBody entry={entry} narrative/>}</article>}
  </dialog>;
}
