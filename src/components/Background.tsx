import { useState } from 'react';
import { education, experience, experienceDetails, projectTimeline } from '../background';
import { findEntry, links } from '../content';

type TimelineItem = { title: string; dates: string; category: string; summary: string; organization?: string; entry?: string; details?: string[]; context?: string; links?: { label: string; href: string }[] };

const categories = ['Research', 'Industry', 'Creative'] as const;

function LedgerEntry({ item, project = false }: { item: TimelineItem; project?: boolean }) {
  const details = item.details ?? (project ? findEntry(item.entry ?? '')?.details : experienceDetails[item.organization ?? '']);
  return <article className="ledger-entry" data-category={item.category.toLowerCase()}>
    <p className="ledger-meta"><span className="ledger-dot" aria-hidden="true"/><span className="ledger-category">{item.category}</span><span className="ledger-dates">{item.dates}</span></p>
    <h4>{item.title}</h4>
    {item.organization && <p className="ledger-org">{item.organization}</p>}
    <p className="ledger-summary">{item.summary}</p>
    {item.context && <p className="ledger-context">{item.context}</p>}
    {details && <details className="ledger-details"><summary>{project ? 'Project details' : 'Full role description'}</summary><ul>{details.map(detail => <li key={detail}>{detail}</li>)}</ul></details>}
    {item.links && <p className="ledger-links">{item.links.map(link => <a key={link.href} className="text-link" href={link.href} target="_blank" rel="noreferrer">{link.label}</a>)}</p>}
  </article>;
}

// A ledger: each year is a large pinned numeral beside that year's entries.
// Filter buttons show one kind of work at a time; years with nothing left are hidden.
function Ledger({ items, label, project = false }: { items: TimelineItem[]; label: string; project?: boolean }) {
  const [filter, setFilter] = useState<string>('All');
  const yearOf = (item: TimelineItem) => { const year = item.dates.match(/\d{4}/); return year ? Number(year[0]) : Infinity; };
  const shown = items.filter(item => filter === 'All' || item.category === filter);
  const years = [...new Set(shown.map(yearOf))].sort((a, b) => b - a);
  const present = categories.filter(category => items.some(item => item.category === category));

  return <>
    {present.length > 1 && <div className="ledger-filters" role="group" aria-label={`Filter ${label.toLowerCase()}`}>
      {['All', ...present].map(name => {
        const count = name === 'All' ? items.length : items.filter(item => item.category === name).length;
        return <button key={name} className="ledger-filter" data-category={name.toLowerCase()} aria-pressed={filter === name} onClick={() => setFilter(name)}>
          {name !== 'All' && <span className="ledger-dot" aria-hidden="true"/>}{name}<span className="ledger-count">{count}</span>
        </button>;
      })}
    </div>}
    <ol className="ledger" aria-label={label}>{years.map(year => <li className="ledger-year" key={year}>
      <h4 className="ledger-numeral">{year === Infinity ? 'Next' : year}</h4>
      <div className="ledger-entries">{shown.filter(item => yearOf(item) === year).map(item => <LedgerEntry key={`${item.title}-${item.organization}`} item={item} project={project}/>)}</div>
    </li>)}</ol>
  </>;
}

export function ProjectTimeline() {
  return <section className="ledger-section" aria-labelledby="project-timeline-title"><header className="ledger-head"><h3 id="project-timeline-title">Project timeline</h3></header><Ledger items={projectTimeline} label="Project timeline" project/></section>;
}

export function PositionTimeline() {
  const positions = experience.filter(item => item.title !== 'Undergraduate Honors Thesis');
  return <section className="ledger-section" aria-labelledby="positions-timeline-title"><header className="ledger-head"><h3 id="positions-timeline-title">Research and work experience</h3></header><Ledger items={positions} label="Positions and experience timeline"/></section>;
}

// Education as two diploma rows: the school set large, the degree and its details beside it.
export default function Background() {
  return <section id="background" className="background-section education-section" aria-labelledby="background-title">
    <header className="ledger-head"><h3 id="background-title">Education</h3><a className="text-link" href={links.cv} target="_blank" rel="noreferrer">Full CV</a></header>
    <div className="education-overview">{education.map(item => <article className="diploma" key={item.short}>
      <a className="diploma-school" href={item.href} target="_blank" rel="noreferrer" aria-label={`${item.short} program page (opens in a new tab)`}>{item.short}</a>
      <div className="diploma-body">
        <h4>{item.degree}</h4>
        <p className="diploma-institution">{item.institution}</p>
        <p className="diploma-place">{item.detail}</p>
        {(item.concentration || item.honors) && <ul className="diploma-notes">{[item.concentration, item.honors].filter(Boolean).map(note => <li key={note}>{note}</li>)}</ul>}
      </div>
      <p className="diploma-date">{item.date}</p>
    </article>)}</div>
  </section>;
}
