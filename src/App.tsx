import { useEffect, useLayoutEffect, useState, type CSSProperties } from 'react';
import useSectionMotion from './useSectionMotion';
import { findEntry, links } from './content';
import Icon from './components/Icon';
import SplitStage from './components/SplitStage';
import DragRow from './components/DragRow';
import World from './components/World';
import { rooms } from './world';
import EntryDialog from './components/EntryDialog';
import MediaGallery from './components/MediaGallery';
import { artworks, preview, visualArchive } from './media';
import Background from './components/Background';
import ExperienceTabs from './components/ExperienceTabs';
import Roadmap from './components/Roadmap';
import HeroDrift from './components/HeroDrift';
import VantaBackdrop from './components/VantaBackdrop';
import useGsapMotion from './useGsapMotion';
import useSmoothScroll from './useSmoothScroll';
import ClickSpark from './components/reactbits/ClickSpark';
import CometTrail from './components/CometTrail';
import CardSpotlight from './components/CardSpotlight';
import Skills from './components/Skills';
import ProjectIndex from './components/ProjectIndex';
import Band from './components/Band';
import { applyMotionPaused, storedMotionPaused } from './motionPause';

// Vanta scene settings, kept outside the component so their identity never changes.
const heroNet = { color: 0xff7868, points: 11, maxDistance: 21, spacing: 17, showDots: true };
const contactGlobe = { color: 0x280d15, color2: 0xfff1db, backgroundColor: 0xff7868, size: .9, points: 9, maxDistance: 19, spacing: 16 };

const sections = [['#about', 'About'], ['#world', 'World.exe'], ['#research', 'Research'], ['#skills', 'Skills'], ['#background', 'Background'], ['#creative', 'Art'], ['#roadmap', 'Roadmap'], ['#contact', 'Contact']];

export default function App() {
  const projectsRef = useSectionMotion('projects');
  useSmoothScroll();
  useGsapMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [motionPaused, setMotionPaused] = useState(storedMotionPaused);
  // The navigation link of the section under the middle of the screen is marked as current.
  const [activeSection, setActiveSection] = useState<string>();
  useEffect(() => {
    const targets = sections.map(([href]) => document.querySelector<HTMLElement>(href)).filter((el): el is HTMLElement => !!el);
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) setActiveSection(`#${entry.target.id}`);
    }), { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach(target => observer.observe(target));
    return () => observer.disconnect();
  }, []);  useLayoutEffect(() => applyMotionPaused(motionPaused), [motionPaused]);
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
    description: 'Drawn in Procreate and enhanced in Illustrator.',
    image: preview(featuredArt.file), imageAlt: featuredArt.alt,
    links: [{ label: 'View this artwork on Pixiv', href: featuredArt.href! }, { label: 'Visit my art archive', href: links.pixiv }],
  } : selectedEntry;
  function open(id: string, withActivity = id !== 'llm') {
    setInteractive(withActivity);
    if (id === 'art') setArtVisits(visits => visits + 1);
    setSelected(id);
    if (id === 'plant') setSecret(true);
    else if (withActivity && rooms.some(room => room.id === id)) setVisited(previous => new Set([...previous, id]));
  }
  return <>
    <CometTrail/>
    <CardSpotlight/>
    <div className="scroll-progress" aria-hidden="true"/>
    <div className="chapter-rail" aria-hidden="true"><span className="rail-percent">0%</span><span className="rail-track"><span className="rail-fill"/></span><span className="rail-label">Hello</span></div>
    <a className="skip-link" href="#research">Skip to research</a>
    {/* Click sparks anywhere on the site. Burgundy is in the mix so bursts show on the coral and gold chapters too. */}
    <ClickSpark className="site-sparks" sparkColor={['#ffd078', '#ff7868', '#fff1db', '#280d15']} sparkCount={10} sparkRadius={34} sparkSize={12} duration={550} glow={.5}>
    <header className="site-header"><a className="wordmark" href="#" aria-label="Eric Yang, back to top"><img className="brand-logo" src={preview('logo.png')} alt="" width="40" height="40"/></a><button className="menu-toggle" aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen(open => !open)}><span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span><span className="menu-bars" aria-hidden="true"/></button><nav id="main-nav" className={menuOpen ? 'is-open' : undefined} aria-label="Main navigation" onClick={event => { if ((event.target as HTMLElement).closest('a')) setMenuOpen(false); }} onKeyDown={event => { if (event.key === 'Escape') setMenuOpen(false); }}>{sections.map(([href, label], index) => <a key={href} href={href} className="nav-link" aria-current={activeSection === href ? 'true' : undefined} style={{ '--item': index } as CSSProperties}>{label}</a>)}<span className="nav-actions"><a className="nav-cv" href={links.cv} target="_blank" rel="noreferrer"><Icon name="cv"/>CV</a><a className="nav-icon" href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Icon name="github"/></a><a className="nav-icon" href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Icon name="linkedin"/></a></span></nav><button className="motion-toggle" data-motion-toggle aria-pressed={motionPaused} aria-label={motionPaused ? 'Play motion' : 'Pause motion'} title={motionPaused ? 'Play motion' : 'Pause motion'} onClick={() => setMotionPaused(paused => !paused)}><span className={`motion-glyph${motionPaused ? ' is-paused' : ''}`} aria-hidden="true"/></button></header>
    <main>
      <SplitStage className="field-ground opening" pictures={[
        { src: preview('aboutme.jpg'), alt: 'Eric Yang outdoors among green plants' },
        { src: preview('IMG_4752.jpeg'), alt: 'Eric in a black beanie at a cafe window, about to try a tart' },
      ]}>
        <section className="hero" aria-labelledby="hero-title" data-chapter="About" data-stage="0">
          <VantaBackdrop effect="net" options={heroNet} className="hero-net"/>
          <HeroDrift/>
          <p className="giant-name" aria-hidden="true">eric yang</p>
        </section>
        <section id="about" className="about-section" aria-labelledby="about-title" data-chapter="About" data-stage="1"><div className="about-head"><h2 id="about-title" className="code-title">About</h2></div><div className="about-story"><p className="about-statement">I'm Eric, a machine learning researcher and AI engineer working across healthcare and music. I studied Computational and Systems Biology at UCLA and earned my M.S. in Health Data Science at UCSF. I specialize in AI evaluation, foundation models, and multimodal learning. In my free time, I draw, sing, and design!</p><div className="about-links"><a className="text-link" href={links.linkedin} target="_blank" rel="noreferrer"><Icon name="linkedin"/>Connect with me on LinkedIn</a><a className="text-link" href="mailto:eric.yang2@ucsf.edu"><Icon name="email"/>eric.yang2@ucsf.edu</a></div></div></section>
      </SplitStage>
      <Band paused={motionPaused} items={['AI safety', 'Model evaluation', 'LLM pretraining', 'Post-training', 'Medical imaging', 'Multimodal learning', 'Health data science']}/>
      <div className="field-gold play-field">
        <World completed={completed} onOpen={id => open(id, true)} visited={visited} paused={!!selected} artwork={preview(featuredArt.file)}/>
      </div>
      <section ref={projectsRef} id="projects" className="work-section field-coral" aria-label="Research and projects" data-chapter="Research">
        <section id="research" className="research-section" aria-labelledby="research-title"><div className="section-bar"><div><h2 id="research-title" className="code-title">Projects</h2></div><a href={links.github} target="_blank" rel="noreferrer" className="text-link"><Icon name="github"/>More on GitHub</a></div><ProjectIndex onOpen={id => open(id, false)}/></section>
      </section>
      <Skills/>
      <section id="experience" className="experience-section field-plum" aria-label="Education and experience" data-chapter="Background">
        <Background/><ExperienceTabs/>
      </section>
      <SplitStage className="field-gold art-split" side="right" pictures={[
        { src: preview(featuredArt.file), alt: featuredArt.alt },
        { src: preview('minami.png'), alt: 'Black and white close-up character illustration of Minami' },
      ]}>
        <section id="creative" className="creative-section" aria-labelledby="creative-title" data-chapter="Art" data-stage="0"><div className="creative-copy"><h2 id="creative-title" className="code-title">Art</h2><p className="art-lead">Drawn in Procreate and enhanced in Illustrator.</p><p className="art-now">On the wall now: <b>{featuredArt.title}</b></p></div></section>
        <div className="side-quests" data-stage="1" data-chapter="Art"><h3>Side quests</h3><p>Rhythm games, drums and singing, and clips from the VTubers I follow.</p><a className="text-link rhythm-channel-link" href={links.youtube} target="_blank" rel="noreferrer"><Icon name="youtube"/>My rhythm-game channel</a><a className="text-link rhythm-channel-link" href={links.vtuberYoutube} target="_blank" rel="noreferrer"><Icon name="youtube"/>My VTuber clipping channel</a></div>
      </SplitStage>
      <section className="image-archive" aria-labelledby="art-archive-title" data-chapter="Art">
        <div className="section-bar"><div><h2 id="art-archive-title" className="code-title">Gallery</h2></div><a href={links.pixiv} target="_blank" rel="noreferrer" className="text-link"><Icon name="pixiv"/>Full archive on Pixiv</a></div>
        <DragRow label="Artwork, scrolls sideways">
          <MediaGallery items={artworks.filter(artwork => artwork.file !== 'pro.png')} label="Digital artwork gallery" linkOut/>
          <MediaGallery items={visualArchive} label="Visual archive" linkOut/>
        </DragRow>
      </section>
      <div className="field-plum roadmap-field"><Roadmap/></div>
      <Band paused={motionPaused} reverse items={['Illustration', 'Original characters', 'Singing', 'Drums', 'Rhythm games', 'Travel']}/>
      <section id="contact" className="contact-section field-coral" aria-labelledby="contact-title" data-chapter="Contact"><VantaBackdrop effect="globe" options={contactGlobe}/>
        <div className="contact-sentence"><h2 id="contact-title" className="code-title">Contact</h2><p className="contact-lead">Research collaborations, machine learning opportunities, or anything.</p></div>
        <img className="contact-portrait" src={preview('IMG_5050.jpeg')} alt="Eric in a black beanie, grinning up at the camera" width="160" height="160" loading="lazy"/>
        <div className="contact-links"><a className="text-link" href="mailto:eric.yang2@ucsf.edu"><Icon name="email"/>eric.yang2@ucsf.edu</a><a className="text-link" href={links.linkedin} target="_blank" rel="noreferrer"><Icon name="linkedin"/>LinkedIn</a><a className="text-link" href={links.github} target="_blank" rel="noreferrer"><Icon name="github"/>GitHub</a><p className="contact-place">San Francisco, California</p></div>
      </section>
    </main>
    <footer><p className="footer-name" aria-hidden="true">eric yang</p><div className="footer-row"><div className="credits-line"><a className="wordmark" href="#">Eric Yang.</a><div className="built-with"><span className="eyebrow">Built with</span><ul aria-label="Technologies used to build this website">{['TypeScript', 'HTML', 'CSS', 'Python', 'React', 'Vite', 'GSAP', 'Lenis', 'Vanta.js', 'three.js', 'React Bits', 'Playwright'].map(tech => <li key={tech}>{tech}</li>)}</ul></div><span>{secret?'You found the hidden plant.':'© 2026 Eric Yang'}</span></div></div></footer>
    </ClickSpark>
    <EntryDialog onNavigate={id => open(id, false)} interactive={interactive} completed={completed} onComplete={id => setCompleted(previous => new Set([...previous, id]))} entry={displayedEntry} onClose={() => setSelected(undefined)}/>
  </>;
}
