import { findEntry, links, timeADLinks } from './content';

// Education and project dates from the updated CV. Position titles, dates,
// work arrangements, and descriptions updated from the supplied LinkedIn text.
export const education = [
  { institution: 'University of California, San Francisco', short: 'UCSF', degree: 'M.S. in Health Data Science', date: 'Sept. 2026', detail: 'San Francisco, California' },
  { institution: 'University of California, Los Angeles', short: 'UCLA', degree: 'B.S. in Computational and Systems Biology', date: 'Jun. 2024', detail: 'Los Angeles, California', concentration: 'Concentration: Biological Data Sciences', honors: 'Departmental Highest Honors' },
];
export type ExperienceCategory = 'Research' | 'Industry' | 'Creative';
// Expanded descriptions combine the updated CV and supplied LinkedIn text.
export const experienceDetails: Record<string, string[]> = {
  'UCSF Department of Medicine': (findEntry('llm')?.details ?? []),
  'BOLERO · Tokyo, Japan': findEntry('music')?.details?.slice(0, -1) ?? [],
  'UCSF Hswen Lab': (findEntry('retina')?.details ?? []).concat(findEntry('nlp')?.details ?? []),
  'UCLA & PITTAN': [
    'Independently designed and executed a study of sweat amino-acid biomarkers using 500+ clinical samples collected with Kobe University.',
    'Designed experimental workflows, coordinated international data collection, and statistically analyzed biochemical measurements.',
    'Developed random forest and multimodal neural-network models for dermatological outcome prediction and evaluated diagnostic performance and feasibility relative to biopsy-based assessment.',
  ],
  'PITTAN · Kobe, Japan': [
    'Led technical development of a health-technology platform translating biochemical research into a user-facing diagnostic system.',
    'Designed Python and Raspberry Pi data-acquisition and workflow-automation systems for sweat analysis.',
    'Developed multimodal ML models combining biochemical and sensor-derived biomarkers for skin-condition prediction, coordinating research, engineering, and product implementation in an international team.',
    'Combined amino-acid profiles, moisture, lipid measurements, and sensor-derived features to generate skin-health metrics.',
    'Directed development and deployment of the PITTAN mobile application. Connected model outputs, cloud infrastructure, and data collection to the application workflows. Contributed to application security.',
  ],
  'UCLA Suthana Lab': [
    'Processed and analyzed 1,000+ EEG recordings using MATLAB for clinical neuroscience research.',
    'Developed automated signal-processing and machine-learning pipelines to improve analytical efficiency, reproducibility, and data quality.',
    'Built reusable MATLAB scripts for large electrophysiological datasets and supported clinical-study design.',
    'Supported IRB-approved human-subjects research through participant coordination, consent documentation, and clinical study operations.',
  ],
  'Institute of Neuro Innovation': [
    'Analyzed clinical-trial data from 500+ participants evaluating virtual-reality audio therapy for depression.',
    'Designed and evaluated three sound-wavefront therapy protocols using statistical modeling to characterize treatment response.',
    'Managed research data and produced quantitative analyses supporting clinical research and treatment evaluation.',
  ],
  'KADOKAWA Corporation': [
    'Worked with a 20-person team of professional novelists, artists, and managers.',
    'Used Adobe Lightroom, Photoshop, and Illustrator for vector drawing and copy editing.',
    'Built graphic-design web applications using C# and JavaScript.',
  ],
  'UCLA Student Media': [
    'Contributed digital artwork and supported a nine-member illustration staff.',
    'Coordinated biweekly, theme-based artwork from section staff.',
    'Worked on layout illustrations and collaborated with other divisions using Adobe Suite, Procreate, and Ibis Paint X.',
  ],
  'Tong Li Publishing': [
    'Translated more than 20 manga books and light novels from Japanese to Mandarin.',
    'Contributed cover illustration and content polishing.',
    'Oversaw the translation process and led a 15-person team.',
  ],
};
export const experience: { title: string; organization: string; dates: string; category: ExperienceCategory; summary: string; entry?: string; context?: string; links?: { label: string; href: string }[] }[] = [
  { title: 'Data Science Specialist', organization: 'UCSF Department of Medicine', dates: 'Apr 2025 – Apr 2026', category: 'Research', context: 'Apprenticeship · San Francisco, California · Hybrid', summary: "Benchmarked three GPT models against four physician evaluators across approximately 500 medical-student OSCE encounters, using disagreement analysis to refine assessment rubrics.", entry: 'llm' },
  { title: 'Lead Data Scientist', organization: 'BOLERO · Tokyo, Japan', dates: 'Apr 2025 – Mar 2026', category: 'Industry', context: 'Full-time · Remote', summary: "Led a six-person team building multimodal music analytics for 100,000+ tracks. Delivered an initial production demo in three weeks and reduced reporting from about two days to minutes.", entry: 'music', links: [{ label: 'BOLERO Website', href: links.bolero }] },
  { title: 'Graduate Student Researcher', organization: 'UCSF Hswen Lab', dates: 'Oct 2024 – Jun 2026', category: 'Research', context: 'Apprenticeship · San Francisco, California · Hybrid', summary: "Benchmarked retinal foundation models on 156,724 fundus images from 78,349 UK Biobank participants. Tested anatomical ablations and the added value of fundus and OCT measures beyond demographics.", entry: 'retina' },
  { title: 'Cover Illustrator', organization: 'KADOKAWA Corporation', dates: 'Apr 2024 – Dec 2024', category: 'Creative', context: 'Contract · Tokyo, Japan · Remote', summary: 'Created artwork, contributed to design and editing, and built graphic-design web applications.', entry: 'art' },
  { title: 'Undergraduate Honors Thesis', organization: 'UCLA & PITTAN', dates: 'Jun 2023 – Jun 2024', category: 'Research', summary: 'Experimental study of sweat amino-acid biomarkers for non-invasive skin assessment.', entry: 'library' },
  { title: 'Assistant Illustrations Editor', organization: 'UCLA Student Media', dates: 'Sep 2023 – Jun 2024', category: 'Creative', context: 'Part-time · Los Angeles, California · On-site', summary: 'Supported a nine-member illustration staff, coordinated biweekly artwork, and collaborated on layout illustrations.', entry: 'art' },
  { title: 'Chief Technology Officer', organization: 'PITTAN · Kobe, Japan', dates: 'Jun 2023 – Sep 2023', category: 'Industry', context: 'Full-time · On-site', summary: 'Built Python/Raspberry Pi pipelines for sweat analysis, collecting 500 measurements in 21 days. Developed neural-network models for skin-condition assessment with AUROC 0.85.', links: [{ label: 'PITTAN Website', href: links.pittan }] },
  { title: 'Clinical Design & Analysis Assistant', organization: 'UCLA Suthana Lab', dates: 'Mar 2023 – Jun 2024', category: 'Research', context: 'David Geffen School of Medicine at UCLA · Santa Monica, California · Hybrid', summary: 'Analyzed 1,000+ patient EEG recordings and built reusable MATLAB and machine-learning workflows for clinical neuroscience.' },
  { title: 'Data Analysis Assistant', organization: 'Institute of Neuro Innovation', dates: 'Aug 2022 – Feb 2023', category: 'Industry', context: 'Internship · Santa Monica, California · Hybrid', summary: 'Supported clinical-trial analysis for 500+ participants and evaluated three VR/audio therapy protocols for depression.' },
  { title: 'Research Assistant', organization: 'UCLA Arisaka Lab', dates: '2021 – 2022', category: 'Research', summary: 'Worked on brain interfaces and UI/UX.' },
  { title: 'Copy Editor', organization: 'Tong Li Publishing', dates: 'Jun 2020 – Mar 2024', category: 'Creative', context: 'Part-time · Taipei, Taiwan · Remote', summary: 'Translated 20+ manga books and light novels from Japanese to Mandarin, with cover illustration, content polishing, and leadership of a 15-person team.' },
  { title: 'Customer Service Representative', organization: 'Milksha', dates: 'Sep 2018 – Jun 2021', category: 'Industry', context: 'Part-time · Taoyuan, Taiwan · On-site', summary: 'Customer service role in Taoyuan, Taiwan.' },
];

// Project milestones are dated separately from job appointments. Conference
// dates identify presentations; they do not imply when a project began.
export const projectTimeline = [
  { title: 'Project ANNIE', dates: 'Coming soon', category: 'Research', summary: 'Planned research on prediagnostic retinal biomarkers, cross-population validation, and whether autonomous AI can integrate retinal, OCT, and clinical evidence more reliably than human-designed workflows.', entry: 'annie' },
  { title: 'Retinal imaging & Alzheimer’s disease', dates: 'July 2026 · AAIC, London', category: 'Research', summary: "Benchmarked retinal foundation models on 156,724 fundus images from 78,349 UK Biobank participants. Tested anatomical ablations and the added value of fundus and OCT measures beyond demographics.", entry: 'retina', links: timeADLinks },
  { title: 'LLM evaluation against physician judgment', dates: 'February 2026 · UCSF AI & Education Symposium', category: 'Research', summary: "Benchmarked three GPT models against four physician evaluators across approximately 500 medical-student OSCE encounters, using disagreement analysis to refine assessment rubrics.", entry: 'llm', links: findEntry('llm')?.links?.slice(0, 2) },
  { title: 'Nicotine-pouch discourse analysis', dates: '2026 · Research documented in CV', category: 'Research', summary: "Analyzed 37,797 Reddit posts with LDA and VADER, finding 53.6% positive sentiment alongside discussion of harm reduction, addiction, withdrawal, and adverse health effects.", entry: 'nlp', links: [{ label: 'APHA 2026 Conference Abstract', href: links.apha }] },
  { title: 'Music ML & production data systems', dates: 'Apr 2025 – Mar 2026 · During BOLERO appointment', category: 'Industry', summary: "Led a six-person team building multimodal music analytics for 100,000+ tracks. Delivered an initial production demo in three weeks and reduced reporting from about two days to minutes.", entry: 'music', links: [{ label: 'BOLERO Website', href: links.bolero }] },
  { title: 'Sweat amino-acid biomarkers', dates: 'Jun 2023 – Jun 2024 · Honors thesis', category: 'Research', summary: 'Designed a non-invasive skin-assessment study using 500+ clinical samples collected with Kobe University. Evaluated random forest and multimodal neural-network models using biochemical measurements and compared diagnostic feasibility with biopsy-based assessment.', entry: 'sweat', links: [{ label: 'PITTAN Website', href: links.pittan }] },
];
