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
    description: 'Built a reproducible NLP workflow to analyze 38,000+ Reddit posts about nicotine-pouch use, studying behavioral patterns, sentiment, and how people discuss these products in online public-health conversations.',
    details: ['Collected and filtered Reddit data, then used text preprocessing and lemmatization to prepare posts for analysis.', 'Applied latent Dirichlet allocation (LDA) topic modeling and VADER sentiment analysis to characterize discussion themes and sentiment.', 'Combined quantitative outputs with qualitative interpretation to translate unstructured online discourse into interpretable research findings.', 'Conducted at UCSF Hswen Lab. The CV lists “Themes of Online Discussions of Nicotine Pouch Use” as under revision following peer review at Social Influence.'],
    tags: ['NLP', 'Public health'],
    links: [{ label: 'Reddit / NLP project ↗', href: 'https://github.com/yangpings/Reddit-Nicotine-Sentiment' }, { label: 'APHA 2026 Conference Abstract', href: links.apha }],
  },
  {
    id: 'llm', category: 'AI / RESEARCH LAB', title: 'Clinical LLM Evaluation Against Physician Judgment',
    subtitle: 'LLM evaluation · Clinical reasoning',
    description: 'Developed an evaluation framework for LLM-generated assessments of medical student OSCE performance, benchmarking structured scores and narrative feedback against physician expert judgment.',
    details: ['Built Python-based multimodal pipelines transforming clinical audio/video encounters into transcripts, model-generated assessments, quantitative evaluations, and faculty-aligned narrative feedback.', 'Used structured scoring, Cohen’s kappa, semantic similarity, natural language inference, and human expert evaluation to quantify agreement, reliability, evaluator variability, and alignment with faculty assessment.', 'Designed iterative validation experiments with clinical faculty to investigate failure modes, fairness, and disagreements between automated metrics and expert judgment. Physician feedback informed evaluation criteria, prompting/scoring workflows, and subsequent experiments.', 'Led IRB protocols, amendments, continuing reviews, grant submissions, and scientific dissemination. The work contributed to $4,822 in UCSF research funding and was presented at the UCSF Artificial Intelligence and Education Symposium in February 2026.'],
    tags: ['LLM evaluation', 'Reliable AI', 'Healthcare'],
    links: [{ label: '2026 UCSF AI and Education Symposium', href: 'https://educationandstudentaffairs.ucsf.edu/2026-ucsf-ai-and-education-symposium' }],
  },
  {
    id: 'retina', category: 'VISION LAB', title: 'TIME AD: Retinal Foundation Models for Alzheimer’s Disease Prediction',
    subtitle: 'Retinal imaging · Alzheimer’s disease',
    description: 'Evaluated RETFound Vision Transformers and CNNs for Alzheimer’s disease and related dementias prediction using approximately 180,000 UK Biobank retinal images, demographic variables, ICD-10 diagnoses, and linked clinical data.',
    details: ['Built reproducible Python, SQL, and PyTorch workflows spanning cohort construction, image quality control, preprocessing, macular cropping, retinal vessel segmentation, training, inference, and evaluation.', 'Fine-tuned and benchmarked RETFound Vision Transformers and convolutional neural networks against classical statistical baselines.', 'Designed anatomical ablations using full retinal images, macular regions, and vessel representations to investigate what information drove predictions and whether performance reflected anatomical signals or dataset and experimental artifacts.', 'Used repeated train/test experiments, AUROC, calibration, robustness analysis, and clinical benchmarking to examine variability, limitations, and generalizability.', 'Led first-author work presented at AAIC 2026 in London and submitted to Nature Medicine. Collaborated across epidemiology, biostatistics, neurology, and machine learning.'],
    tags: ['Computer vision', 'Foundation models', 'Multimodal AI'],
    links: timeADLinks,
  },
  {
    id: 'music', category: 'MUSIC / ON AND OFF THE CLOCK', title: 'The music room.',
    subtitle: 'BOLERO · Tokyo · Lead Data Scientist',
    description: 'Led development of production ML and analytics systems for 100,000+ Japanese, English, and Mandarin music tracks, connecting audio representations with artist metadata, audience behavior, and time-series engagement data.',
    details: ['Architected end-to-end Python pipelines for ingestion, audio signal processing, Fourier-based feature extraction, dimensionality reduction, clustering, representation learning, similarity analysis, predictive modeling, and inference.', 'Developed systems combining audio features, artist metadata, behavioral signals, social-platform data, user feedback, and engagement data to characterize genre, artist alignment, audience response, and promotional opportunities.', 'Built a secure web analytics platform and internal databases so users and employees could query, compare, and interpret model-derived information. Integrated external APIs with data acquisition, analysis, database operations, and user-facing outputs.', 'Developed and evaluated LLM workflows, including post-training/adaptation for personalized analytical and user-facing applications. Implemented end-to-end testing, data validation, debugging, and production troubleshooting.', 'Led technical workflows and implementation priorities across English- and Japanese-speaking teams. Contributed to product development supporting a successful ¥20M seed funding round.', 'Outside the pipeline: I sing. Recordings will find a home here in a future update.'],
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
    details: ['Additional work spans nicotine-pouch discourse analysis using Reddit/NLP, sweat amino-acid biomarkers and multimodal ML, EEG/neuroscience analysis, and VR/audio therapy clinical research.', 'A publication list will be added when verified citations are available. The CV below is the existing repository copy.'],
    tags: ['UCSF', 'UCLA', 'Research'],
    links: [{ label: 'Open CV ↗', href: links.cv }, { label: 'Reddit / NLP project ↗', href: 'https://github.com/yangpings/Reddit-Nicotine-Sentiment' }],
  },
  {
    id: 'home', category: 'HOME / WHOAMI', title: 'Hi, I’m Eric.', subtitle: 'Researcher / Engineer / Artist',
    image: asset('optimized/aboutme.webp'), imageAlt: 'Eric Yang outdoors among green plants',
    description: 'I work across machine learning, AI evaluation, computer vision, and healthcare AI, with an interest in reliable real-world AI systems.',
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
