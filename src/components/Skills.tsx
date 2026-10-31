import VantaBackdrop from './VantaBackdrop';

const waves = { color: 0x3b1420, shininess: 34, waveHeight: 14, waveSpeed: .55, zoom: .9 };

const groups = [
  { id: 'research', label: 'What I study', items: ['AI safety', 'Evaluation', 'LLM pretraining / post‑training', 'Medical imaging', 'Multimodal learning'] },
  { id: 'tools', label: 'What I build with', items: ['PyTorch', 'FastAPI', 'Docker', 'APIs', 'Llama 4'] },
  { id: 'languages', label: 'Languages', items: ['Python', 'SQL', 'R', 'C/C++', 'Java', 'JavaScript'] },
];

// A type specimen: each group is a run of large words that wraps like a poster, the research
// topics solid and the tools in outline (the same lettering as the hero), joined by the band's star.
export default function Skills() {
  return <section id="skills" className="skills-section" aria-labelledby="skills-title" data-chapter="Skills">
    <VantaBackdrop effect="waves" options={waves}/>
    <h2 id="skills-title" className="code-title">Skills</h2>
    <p className="skills-intro">I train, evaluate, and ship models end to end, from LLM pretraining and post-training to medical imaging and multimodal systems, with AI safety as the through-line.</p>
    <div className="skills-specimen">
      {groups.map(group => <div key={group.id} className={`skills-group is-${group.id}`}>
        <h3>{group.label}</h3>
        <ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul>
      </div>)}
    </div>
  </section>;
}
