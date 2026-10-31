import { useState } from 'react';
import { research } from '../content';
import { preview } from '../media';
import { displayFor } from '../projectDisplay';

// Projects as an index of large names. On wide screens, hovering or focusing a name shows that
// project in the pinned preview beside the list; on phones each name carries its own details.
// Each project name is itself the link that opens its case study, so nothing depends on hover.
export default function ProjectIndex({ onOpen }: { onOpen: (id: string) => void }) {
  const [active, setActive] = useState(0);
  const current = research[active];
  const shown = displayFor(current.id, current.title, current.category);

  return <div className="project-index">
    <ol className="project-list">
      {research.map((entry, index) => {
        const info = displayFor(entry.id, entry.title, entry.category);
        return <li key={entry.id}>
          <article className="research-card" data-active={index === active ? 'true' : undefined}
            onPointerEnter={() => setActive(index)} onFocus={() => setActive(index)}>
            <h3 className="project-name"><button type="button" className="project-open" onClick={() => onOpen(entry.id)} aria-label={`${info.name}: open the case study`}>{info.name}</button></h3>
            <p className="project-label">{info.label}{entry.status ? `, ${entry.status.toLowerCase()}` : ''}</p>
            <div className="project-more">
              <p className="project-title">{entry.title}</p>
              <p>{entry.description}</p>
              <ul className="tags" aria-label="Topics">{entry.tags.slice(0, 3).map(tag => <li key={tag}>{tag}</li>)}</ul>
            </div>
          </article>
        </li>;
      })}
    </ol>
    {/* The same details as the active row, shown large beside the list on wide screens. */}
    <aside className="project-preview" aria-hidden="true">
      <div className="preview-frame" key={current.id}>
        {shown.image
          ? <img src={preview(shown.image)} alt="" width="1200" height="1000" loading="lazy"/>
          : <p className="preview-label">{shown.label}</p>}
        <p className="preview-title">{current.title}</p>
        <p className="preview-text">{current.description}</p>
        <ul className="tags">{current.tags.slice(0, 3).map(tag => <li key={tag}>{tag}</li>)}</ul>
      </div>
    </aside>
  </div>;
}
