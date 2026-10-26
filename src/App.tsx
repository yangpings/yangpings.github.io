import { useState } from 'react';
import useSectionMotion from './useSectionMotion';
import { findEntry, links, research } from './content';
import Icon from './components/Icon';
import Portrait from './components/Portrait';
import World from './components/World';
import { rooms } from './world';
import EntryDialog from './components/EntryDialog';
import MediaGallery from './components/MediaGallery';
import { artworks, posters, preview, visualArchive } from './media';
import Background, { ProjectTimeline, PositionTimeline } from './components/Background';
import Roadmap from './components/Roadmap';

export default function App() {
  const projectsRef = useSectionMotion('projects');
  const [interactive, setInteractive] = useState(true);
  const [selected, setSelected] = useState<string>();
  const [visited, setVisited] = useState(new Set<string>());
  const [completed, setCompleted] = useState(new Set<string>());
  const [secret, setSecret] = useState(false);
  const [artVisits, setArtVisits] = useState(0);
  const featuredArt = artworks[Math.max(0, artVisits - 1) % artworks.length];
  const selectedEntry = selected ? findEntry(selected) : undefined;
  const displayedEntry = selectedEntry?.id === 'art' ? {
    ...selectedEntry,
    subtitle: featuredArt.title,
    description: 'Browse my digital illustrations and original characters.',
    image: preview(featuredArt.file), imageAlt: featuredArt.alt,
    links: [{ label: 'View this artwork on Pixiv ↗', href: featuredArt.href! }, { label: 'Visit my art archive ↗', href: links.pixiv }],
  } : selectedEntry;
  function open(id: string, withActivity = id !== 'llm') {
    setInteractive(withActivity);
    if (id === 'art') setArtVisits(visits => visits + 1);
    setSelected(id);
    if (id === 'plant') setSecret(true);
    else if (withActivity && rooms.some(room => room.id === id)) setVisited(previous => new Set([...previous, id]));
  }
  return <>
    <a className="skip-link" href="#research">Skip to research</a>
    <header className="site-header"><a className="wordmark" href="#"><img className="brand-logo" src={preview('logo.png')} alt="" width="36" height="36"/>Eric Yang<span className="wordmark-dot">.</span></a><nav aria-label="Main navigation"><a href="#about">About</a><a href="#background">Background</a><a href="#research">Research</a><a href="#projects">Projects</a><a href="#creative">Art</a><a href="#roadmap">Roadmap</a><a href="#contact">Contact</a><a href={links.cv} target="_blank" rel="noreferrer"><Icon name="cv"/>CV ↗</a><span className="nav-divider"/><a href={links.github} target="_blank" rel="noreferrer"><Icon name="github"/>GitHub ↗</a><a href={links.linkedin} target="_blank" rel="noreferrer"><Icon name="linkedin"/>LinkedIn ↗</a></nav></header>
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy"><p className="eyebrow"><span className="status-dot"/> RESEARCH. ML. SIDE QUESTS.</p><h1 id="hero-title">One curious <strong className="hero-keyword keyword-mind">mind</strong>,<br/><span>One <strong className="hero-keyword keyword-world">world</strong> to find,</span><br/>One <strong className="hero-keyword keyword-step">step</strong> at a time.</h1><p className="hero-description">I’m Eric, a machine learning researcher and AI engineer working across healthcare and music. I specialize in AI evaluation, foundation models, and multimodal learning. In my free time, I draw, sing, and design!</p><div className="hero-actions"><a className="button primary" href="#world">Step into my world <span>↓</span></a><a className="text-link" href="#research">Here for the research? <span>↗</span></a></div><div className="credentials"><a href="https://epibiostatlearning.ucsf.edu/master-science-degree-health-data-science" target="_blank" rel="noreferrer">UCSF <small>M.S. Health Data Science</small></a><span className="credential-dot">·</span><a href="https://casb.ucla.edu" target="_blank" rel="noreferrer">UCLA <small>B.S. Computational & Systems Biology</small></a></div></div>
        <Portrait/>
      </section>
      <World completed={completed} onOpen={id => open(id, true)} visited={visited} paused={!!selected} artwork={preview(featuredArt.file)}/>
      <section id="about" className="about-section" aria-labelledby="about-title"><div><span className="eyebrow">02 / THE PERSON AT THE KEYBOARD</span><h2 id="about-title">My journey</h2><div className="about-links"><a className="text-link" href={links.linkedin} target="_blank" rel="noreferrer"><Icon name="linkedin"/>Let’s connect on LinkedIn</a><a className="text-link" href="mailto:eric.yang2@ucsf.edu"><Icon name="email"/>eric.yang2@ucsf.edu</a></div></div><div><p>I studied Computational and Systems Biology at UCLA and earned my M.S. in Health Data Science at UCSF. My work connects careful experiments with practical engineering: benchmarking LLMs against physicians, testing retinal foundation models, and building health technology in Kobe. At BOLERO, I led a six-person team creating music analytics tools for employees and clients.</p><p>Art has been part of that journey too, through cover illustration and video editing. I also do drawing, singing, playing drums, traveling, or playing rhythm games as well.</p></div><Background/><PositionTimeline/></section>
      <section ref={projectsRef} id="projects" className="work-section" aria-label="Research and projects">
      <section id="research" className="research-section" aria-labelledby="research-title"><div className="section-bar"><div><span className="eyebrow">03 / THE WORK BEHIND THE WORLD</span><h2 id="research-title">Projects.</h2></div><a href={links.github} target="_blank" rel="noreferrer" className="text-link"><Icon name="github"/>More on GitHub ↗</a></div><div className="research-grid">{research.map((entry,i) => <article className="research-card" key={entry.id}><div className="card-meta"><span>0{i+1} / {entry.category}</span><Icon className="research-icon" name={entry.id === 'llm' || entry.id === 'annie' ? 'brain' : entry.id === 'retina' || entry.id === 'odir' ? 'eye' : entry.id === 'sweat' ? 'flask' : 'reddit'}/></div>{entry.status && <span className="project-status">{entry.status}</span>}<h3>{entry.title}</h3><p>{entry.description}</p><div className="tags">{entry.tags.slice(0,2).map(tag => <span key={tag}>{tag}</span>)}</div><button className="card-link" onClick={() => open(entry.id, false)}>Explore this work <span>↗</span></button></article>)}</div></section>
        <ProjectTimeline/>
        <div className="research-media"><span className="eyebrow">FROM THE RESEARCH ARCHIVE</span><h2>Example work</h2><MediaGallery items={posters.slice(0, 1)} label="Research posters"/></div>
      </section>
      <section id="creative" className="creative-section" aria-label="Art and hobbies"><div className="creative-copy"><span className="eyebrow">04 / STILL MAKING THINGS</span><button className="text-link" onClick={() => open('art')}><Icon name="pixiv"/>Visit the art studio ↗</button></div><div className="art-preview"><img src={preview(featuredArt.file)} alt={featuredArt.alt} loading="lazy"/><span>FROM THE STUDIO <b>{featuredArt.title}</b></span></div><div className="side-quests"><span className="eyebrow">CURRENT SIDE QUESTS</span><a className="text-link rhythm-channel-link" href={links.youtube} target="_blank" rel="noreferrer"><Icon name="youtube"/>My rhythm-game channel ↗</a><a className="text-link rhythm-channel-link" href={links.vtuberYoutube} target="_blank" rel="noreferrer"><Icon name="youtube"/>My VTuber clipping channel ↗</a></div></section>


      <section className="image-archive" aria-labelledby="art-archive-title">
        <div className="section-bar"><div><span id="art-archive-title" className="eyebrow">THE ART STUDIO / OPEN GALLERY</span></div></div>
        
        <MediaGallery items={artworks.filter(artwork => artwork.file !== 'pro.png')} label="Digital artwork gallery"/>

        <div className="visual-archive"><span className="eyebrow">SKETCHES & TEXTURES.</span><MediaGallery items={visualArchive} label="Visual archive"/></div>
        <div className="archive-texture" aria-hidden="true"><picture><source media="(max-width: 760px)" srcSet={preview('background2.png')}/><img src={preview('background_top.png')} alt="" loading="lazy"/></picture><img src={preview('background_bottom.png')} alt="" loading="lazy"/></div>
      </section>

      <Roadmap/>

      <section id="contact" className="contact-section" aria-labelledby="contact-title"><div><span className="eyebrow">06 / KEEP THE CONVERSATION GOING</span><h2 id="contact-title">Connect with me.</h2></div><div className="contact-links"><a className="text-link" href="mailto:eric.yang2@ucsf.edu"><Icon name="email"/>eric.yang2@ucsf.edu ↗</a><a className="text-link" href={links.linkedin} target="_blank" rel="noreferrer"><Icon name="linkedin"/>LinkedIn ↗</a><a className="text-link" href={links.github} target="_blank" rel="noreferrer"><Icon name="github"/>GitHub ↗</a></div></section>
    </main>
    <footer><a className="wordmark" href="#">Eric Yang.</a><div className="built-with"><span className="eyebrow">BUILT WITH</span><ul aria-label="Technologies used to build this website">{['TypeScript', 'HTML', 'CSS', 'Python', 'React', 'Vite', 'Playwright', 'GitHub Actions'].map(tech => <li key={tech}>{tech}</li>)}</ul></div><span>{secret?'You found the hidden plant.':'© 2026 Eric Yang'}</span></footer>
    <EntryDialog interactive={interactive} completed={completed} onComplete={id => setCompleted(previous => new Set([...previous, id]))} entry={displayedEntry} onClose={() => setSelected(undefined)}/>
  </>;
}
