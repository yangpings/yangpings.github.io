export const asset = (name: string) => `${import.meta.env.BASE_URL}images/${name}`;
export type Entry = {
  id: string; category: string; title: string; subtitle: string;
  description: string; details: string[]; tags: string[];
  links?: { label: string; href: string }[];
  image?: string; imageAlt?: string;
  status?: 'Coming soon';
};
export const links = {
  apha: 'https://apha.confex.com/apha/2026/meetingapp.cgi/Paper/595449',
  youtube: 'https://www.youtube.com/@takinouob_b/videos',
  vtuberYoutube: 'https://www.youtube.com/@yp1786',
  bolero: 'https://bolero.tokyo/',
  github: 'https://github.com/yangpings', linkedin: 'https://www.linkedin.com/in/eyangucsf/',
  pixiv: 'https://www.pixiv.net/users/63676153', pittan: 'https://www.pittan.life/lang/en', cv: asset('eric_cv.pdf'),
};
export const timeADLinks = [
  { label: 'TIME AD Projects', href: 'https://www.time-ad.org/projects' },
  { label: 'TIME AD Team', href: 'https://www.time-ad.org/leadership-1' },
  { label: 'Research Abstract', href: 'https://docs.google.com/document/d/11eGrURvvL8WGgiO9oDmD2h_Cb47VtLhjsPz2RPUrBOw/edit?usp=sharing' },
  { label: 'Full-resolution Poster', href: asset('limits.png') },
];
export const entries: Entry[] = [
  {
    id: 'annie', category: 'UPCOMING / RESEARCH', title: 'Project ANNIE: Retinal Biomarkers and AI for Alzheimer’s Disease',
    subtitle: 'Planned research · Retinal biomarkers · Multimodal and agentic AI',
    status: 'Coming soon',
    description: 'A planned research program investigating retinal biomarkers before Alzheimer’s diagnosis, external population validation, improved retinal AI methods, and human-guided versus autonomous multimodal AI.',
    details: ['The proposed program extends the existing retinal imaging research through clinical and epidemiologic validation alongside AI methodology development. Work and results are forthcoming.'],
    tags: ['Retinal biomarkers', 'Multimodal AI', 'Agentic AI'],
  },
  {
    id: 'odir', category: 'PROJECT / COMPUTER VISION', title: 'ODIR-5K: Deep Learning Benchmarks for Retinal Disease Detection',
    subtitle: 'Retinal disease detection · Architecture benchmarking',
    description: 'Built a unified training and evaluation framework comparing multiple deep-learning architectures on ODIR-5K for retinal disease detection.',
    details: ['The original portfolio describes this project as a framework for comparing deep-learning architectures and establishing retinal disease detection baselines.', 'This is a separate project from the RETFound-based Alzheimer’s disease study using UK Biobank images and clinical data. The repository below contains the ODIR-5K implementation.'],
    tags: ['Computer vision', 'Retinal imaging', 'Model evaluation'],
    links: [{ label: 'ODIR-5K on GitHub ↗', href: 'https://github.com/yangpings/ODIR-5K' }],
  },
  {
    id: 'nlp', category: 'RESEARCH / NLP', title: 'Nicotine Pouch Discourse: Topic Modeling and Sentiment Analysis',
    subtitle: 'Nicotine-pouch discourse · Public health',
    description: "Analyzed 37,797 Reddit posts using topic modeling and sentiment analysis to study nicotine-pouch use, product endorsement, availability, and competing narratives about health effects.",
    details: ["Used latent Dirichlet allocation (LDA) and VADER sentiment analysis to identify discussion themes and quantify sentiment across 37,797 Reddit posts.", "Found 53.6% positive sentiment alongside competing narratives about harm reduction, addiction, withdrawal, and adverse health effects.", "Conducted at UCSF Hswen Lab. The manuscript, \u201cThemes of Online Discussions of Nicotine Pouch Use,\u201d is under revision following peer review at Social Influence."],
    tags: ['NLP', 'Public health'],
    links: [{ label: 'Reddit / NLP project ↗', href: 'https://github.com/yangpings/Reddit-Nicotine-Sentiment' }, { label: 'APHA 2026 Conference Abstract', href: links.apha }],
  },
  {
    id: 'llm', category: 'AI / RESEARCH LAB', title: 'Clinical LLM Evaluation Against Physician Judgment',
    subtitle: 'LLM evaluation · Clinical reasoning',
    description: "Benchmarked GPT-5 Pro, GPT-4.1, and GPT-3.5 against four physician evaluators across approximately 500 medical-student OSCE encounters, examining agreement and where model feedback diverged from clinical judgment.",
    details: ["Designed a cross-model evaluation framework using structured scoring, Cohen\u2019s kappa, semantic similarity, and natural language inference. Under the same protocol, agreement was 0.67 for GPT-5 Pro, 0.62 for GPT-4.1, and 0.60 for GPT-3.5.", "Identified clinical organization and presentation structure as a major source of disagreement: models over-credited coherent responses that physicians penalized for not following clinically actionable presentation conventions.", "Built reproducible Python evaluation pipelines and translated failure analyses into rubric refinements for an AI-assisted medical simulation and feedback platform.", "Presented this work at the 2026 UCSF AI & Education Symposium as \u201cSimulating the Expert Evaluator: Immediate AI-Driven Feedback for Medical Student Oral Presentations and Written Documentation.\u201d"],
    tags: ['LLM evaluation', 'Reliable AI', 'Healthcare'],
    links: [{ label: 'Clinical LLM Evaluation on GitHub', href: 'https://github.com/yangpings/Clinical-LLM-Evaluation' }, { label: 'MedSim AI Website', href: 'https://medsimai.com/about?tab=team' }, { label: '2026 UCSF AI and Education Symposium', href: 'https://educationandstudentaffairs.ucsf.edu/2026-ucsf-ai-and-education-symposium' }],
  },
  {
    id: 'retina', category: 'VISION LAB', title: 'TIME AD: Retinal Foundation Models for Alzheimer’s Disease Prediction',
    subtitle: 'Retinal imaging · Alzheimer’s disease',
    description: "Led first-author research benchmarking retinal foundation models on 156,724 fundus images from 78,349 UK Biobank participants, testing how much imaging added beyond demographic and OCT-derived clinical measures.",
    details: ["Evaluated 156,724 fundus images from 78,349 participants, including 535 Alzheimer\u2019s disease cases, with consistent participant-level splits.", "Compared RETFound, ViT-B16, ResNet-50, EfficientNet-B3, demographic baselines, multimodal fusion, and OCT-derived clinical models. Built PyTorch pipelines for image quality control, preprocessing, class imbalance, training, inference, and evaluation.", "Tested anatomical ablations: RETFound achieved AUROC 0.671 on full-fundus images, 0.658 on central-retinal representations, and 0.608 on vessel-enhanced representations.", "Fundus features added little discrimination beyond demographics in this benchmark (AUROC 0.710 to 0.714); OCT-derived measures increased AUROC to 0.795.", "Presented first-author findings at AAIC 2026 in London. The manuscript, \u201cLimits of Fundus-Based Deep Learning for Alzheimer\u2019s Disease Classification: Anatomical Ablation and Clinical Benchmarking,\u201d is in peer review at npj Digital Medicine."],
    tags: ['Computer vision', 'Foundation models', 'Multimodal AI'],
    links: timeADLinks,
  },
  {
    id: 'music', category: 'MUSIC / ON AND OFF THE CLOCK', title: 'The music room.',
    subtitle: 'BOLERO · Tokyo · Lead Data Scientist',
    description: "Led a six-person AI/data engineering team building a music analytics platform for 100,000+ multilingual tracks. Delivered the initial production demo in three weeks and reduced analytical reporting from about two days to minutes.",
    details: ["Built multimodal pipelines combining librosa-derived audio features with metadata, behavioral, streaming, time-series, social-platform, and popularity signals across 100,000+ tracks.", "Developed PyTorch multimodal neural networks for track similarity, streaming, engagement, and longitudinal popularity modeling. Used 10-fold cross-validation on the 70% training partition and evaluated final models on a held-out 15% test set.", "Built representation-learning and cosine-similarity retrieval against a reference database refreshed weekly with song-performance data.", "Developed a Llama 4 conversational assistant and web application used by 12+ employees and four music-group clients to upload tracks, retrieve comparable songs, inspect forecasts, and query results in natural language.", "Containerized and deployed the platform with Docker and Microsoft Azure, integrating ML pipelines, databases, APIs, and backend services. Supported investor diligence and live demonstrations ahead of the company\u2019s JPY 20M seed round."],
    tags: ['Audio ML', 'Data systems', 'Drums', 'Singing', 'Listening'],
    links: [{ label: 'BOLERO Website', href: links.bolero }],
  },
  {
    id: 'sweat', category: 'RESEARCH / BIOMARKERS', title: 'Sweat Amino Acid Biomarkers for Noninvasive Skin Assessment',
    subtitle: 'UCLA & PITTAN · Undergraduate honors thesis',
    description: 'Designed and executed a study of sweat amino-acid biomarkers for non-invasive skin assessment, using 500+ clinical samples collected with Kobe University.',
    details: ['Designed experimental workflows, coordinated international sample collection, and statistically analyzed biochemical measurements.', 'Developed and evaluated random forest and multimodal neural-network models integrating biochemical measurements for dermatological outcome prediction.', 'Evaluated diagnostic performance, clinical feasibility, and translational potential relative to biopsy-based assessment.', 'Completed as an undergraduate honors thesis from June 2023 to June 2024. Presented at the UCLA Quantitative Biosciences Research Symposium in May 2024.'],
    tags: ['Biomarkers', 'Multimodal ML', 'Clinical research'],
    links: [{ label: 'PITTAN Website', href: links.pittan }],
  },
  {
    id: 'art', category: 'ART STUDIO', title: 'Another way of seeing.',
    subtitle: 'Digital illustration · Original characters',
    description: 'Research asks me to look carefully. Art gives me another reason to. This is Concept Code 02: Flora, created using Procreate and edited with Adobe Illustrator.',
    details: ['Explore original characters and fan art in my illustration archive.'],
    tags: ['Digital art', 'Procreate', 'Illustration'],
    image: asset('optimized/pro.webp'), imageAlt: 'Concept Code 02: Flora, a digital illustration by Eric Yang',
    links: [{ label: 'View Flora on Pixiv ↗', href: 'https://www.pixiv.net/artworks/128093526' }, { label: 'Visit my art archive ↗', href: links.pixiv }],
  },
  {
    id: 'arcade', category: 'ARCADE', title: 'One more round?', subtitle: 'Side quest unlocked',
    description: 'I play games. Rhythm games have a particularly convincing definition of “just five more minutes.”',
    details: ['You found the arcade. No leaderboard, no productivity score. Just a reminder that making things can be play.', 'The rhythm cabinet is ready: follow a short four-lane chart with keys or touch. The memory cabinet is here as a bonus. There is also a very suspicious plant somewhere in this world.'],
    tags: ['Games', 'Side quests'],
    links: [{ label: 'Watch my rhythm-game channel on YouTube', href: links.youtube }],
  },
  {
    id: 'library', category: 'LIBRARY / ARCHIVE', title: 'The longer story.', subtitle: 'Education · Research archive · CV',
    description: 'M.S. in Health Data Science, UCSF. B.S. in Computational and Systems Biology, UCLA.',
    details: ["My research spans LLM-to-physician benchmarking, retinal foundation models, nicotine-pouch discourse analysis, and sweat biomarkers for skin assessment.", "My CV includes manuscripts in peer review at npj Digital Medicine and under revision at Social Influence, presentations at AAIC 2026 and the UCSF AI & Education Symposium, and 2026 AAIC Conference Fellowship and UCSF AGSD Summer Travel Award honors."],
    tags: ['UCSF', 'UCLA', 'Research'],
    links: [{ label: 'Open CV ↗', href: links.cv }, { label: 'Reddit / NLP project ↗', href: 'https://github.com/yangpings/Reddit-Nicotine-Sentiment' }],
  },
  {
    id: 'home', category: 'HOME / WHOAMI', title: 'Hi, I’m Eric.', subtitle: 'Researcher / Engineer / Artist',
    image: asset('optimized/aboutme.webp'), imageAlt: 'Eric Yang outdoors among green plants',
    description: "I am a machine learning researcher and engineer specializing in AI evaluation, foundation models, and multimodal learning. I combine experimental design and failure analysis with end-to-end Python, SQL, and PyTorch implementation.",
    details: ['I also make digital art, sing, play games, and enjoy creative writing. I speak Mandarin Chinese and intermediate Japanese.', 'Current quests: ✓ Survive grad school. ✓ Train questionable amounts of neural networks. ✓ Present research in London.', 'Still open: figure out what neural networks are actually looking at. Make this website unnecessarily interactive.'],
    tags: ['Curiosity first', 'Many tabs open'],
    links: [{ label: 'GitHub ↗', href: links.github }, { label: 'LinkedIn ↗', href: links.linkedin }],
  },
  {
    id: 'travel', category: 'TRAVEL MAP', title: 'Ideas get to travel, too.', subtitle: 'London · AAIC 2026',
    description: 'Presented retinal imaging / Alzheimer’s disease research at AAIC 2026 in London.',
    details: ['Conference photos, presentation figures, and further details will be added here when available.'], tags: ['Conferences', 'Research presentations'],
  },
  {
    id: 'plant', category: 'SECRET DISCOVERED', title: 'The only model with zero parameters.', subtitle: 'Achievement: peer-reviewed by a plant',
    description: 'It has reviewed your work. It recommends more sunlight and fewer midnight debugging sessions.',
    details: ['This fictional office plant is doing its best. So are you.'], tags: ['Easter egg', 'Photosynthesis'],
  },
];
export const research = ['llm', 'retina', 'odir', 'nlp', 'sweat', 'annie'].map(id => entries.find(entry => entry.id === id)!);
export const findEntry = (id: string) => entries.find(entry => entry.id === id);
