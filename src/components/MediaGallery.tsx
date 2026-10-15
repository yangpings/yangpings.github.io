import { useEffect, useRef, useState } from 'react';
import { asset } from '../content';
import { preview, type Media } from '../media';

export default function MediaGallery({ items, label }: { items: Media[]; label: string }) {
  const [selected, setSelected] = useState<Media>();
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!selected) return;
    const trigger = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    dialog.current?.showModal();
    document.body.style.overflow = 'hidden';
    return () => { dialog.current?.close(); document.body.style.overflow = previousOverflow; trigger?.focus(); };
  }, [selected]);
  return <>
    <div className="media-grid" role="group" aria-label={label}>{items.map(item => <button className="media-card" key={item.file} onClick={() => setSelected(item)} aria-label={`Enlarge ${item.title}`}><div className="media-image"><img src={preview(item.file)} alt={item.alt} loading="lazy" width={item.width} height={item.height}/></div><span>{item.title}<b aria-hidden="true">↗</b></span></button>)}</div>
    <dialog ref={dialog} className="media-dialog entry-dialog" aria-label={selected?.title ?? 'Image preview'} onCancel={e => { e.stopPropagation(); setSelected(undefined); }} onClick={e => { if (e.target === e.currentTarget) setSelected(undefined); }}>
      {selected && <article><div className="dialog-top"><h3>{selected.title}</h3><button autoFocus className="close-button" aria-label="Close image preview" onClick={() => setSelected(undefined)}>✕</button></div><img className="expanded-image" src={preview(selected.file)} alt={selected.alt}/><div className="entry-links"><a href={asset(selected.file)} target="_blank" rel="noreferrer">Open original image ↗</a>{selected.href && <a href={selected.href} target="_blank" rel="noreferrer">View on Pixiv ↗</a>}</div></article>}
    </dialog>
  </>;
}
