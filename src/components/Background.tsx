import { education, experience, experienceDetails, projectTimeline } from '../background';
import { findEntry, links } from '../content';

type TimelineItem = { title: string; dates: string; category: string; summary: string; organization?: string; entry?: string; details?: string[]; context?: string; links?: { label: string; href: string }[] };

function TimelineCard({ item, project = false }: { item: TimelineItem; project?: boolean }) {
  const details = item.details ?? (project ? findEntry(item.entry ?? '')?.details : experienceDetails[item.organization ?? '']);
  return <article className={`branch-card ${item.category.toLowerCase()}`}>
    <div className="timeline-meta"><span>{item.dates}</span><span className={`experience-category ${item.category.toLowerCase()}`}>{item.category}</span></div>
    <h4>{item.title}</h4>{item.organization && <p className="timeline-organization">{item.organization}</p>}<p className="timeline-description">{item.summary}</p>
    {item.context && <p className="timeline-context">{item.context}</p>}
    {details && <details className="timeline-role-details"><summary>{project ? 'Project details' : 'Full role description'}<span aria-hidden="true"> +</span></summary><ul>{details.map(detail => <li key={detail}>{detail}</li>)}</ul></details>}
    {item.links?.map(link => <a key={link.href} className="text-link" href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a>)}
  </article>;
}

export function ProjectTimeline() {
  return <section className="individual-timeline section-timeline sided-timeline" aria-labelledby="project-timeline-title"><header><span className="eyebrow">WHAT I’VE WORKED ON</span><h3 id="project-timeline-title">Project timelines</h3></header><SidedTimeline items={projectTimeline} label="Project timeline" project/></section>;
}

export function PositionTimeline() {
  const positions = experience.filter(item => item.title !== 'Undergraduate Honors Thesis');
  return <section className="individual-timeline section-timeline sided-timeline" aria-labelledby="positions-timeline-title"><header><span className="eyebrow">WHERE I’VE WORKED</span><h3 id="positions-timeline-title">Research and work experience</h3><p>Research, industry, and creative roles, by start date.</p></header><SidedTimeline items={positions} label="Positions and experience timeline"/></section>;
}

function SidedTimeline({ items, label, project = false }: { items: TimelineItem[]; label: string; project?: boolean }) {
  const yearOf = (item: TimelineItem) => { const year = item.dates.match(/\d{4}/); return year ? Number(year[0]) : Infinity; };
  const years = [...new Set(items.map(yearOf))].sort((a, b) => b - a);
  return <><div className="timeline-lanes" aria-hidden="true"><div>Research</div><span/><div>Industry & Creative</div></div>
    <ol className="branch-timeline" aria-label={label}>{years.map(year => <li className="timeline-year" key={year}><h4 className="year-marker">{year === Infinity ? 'Next' : year}</h4>
      <div className="research-branch">{items.filter(item => yearOf(item) === year && item.category === 'Research').map(item => <TimelineCard key={`${item.title}-${item.organization}`} item={item} project={project}/>)}</div>
      <div className="other-branch">{items.filter(item => yearOf(item) === year && item.category !== 'Research').map(item => <TimelineCard key={`${item.title}-${item.organization}`} item={item} project={project}/>)}</div>
    </li>)}</ol></>;
}

export default function Background() {
  return <section id="background" className="background-section about-background" aria-labelledby="background-title">
    <div className="section-bar"><h3 id="background-title">Education</h3><a className="text-link" href={links.cv} target="_blank" rel="noreferrer">Full CV ↗</a></div>
    <div className="education-overview"><div className="education-pair">{education.map(item => <article className="education-card" key={item.short}><div className="education-top"><span>{item.short}</span><span>{item.date}</span></div><h4>{item.degree}</h4><p className="institution">{item.institution}</p><p>{item.detail}</p>{(item.concentration || item.honors) && <p>{[item.concentration, item.honors].filter(Boolean).join(' · ')}</p>}</article>)}</div></div>
  </section>;
}
