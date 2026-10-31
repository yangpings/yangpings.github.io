// Project stories use supplied portfolio, CV, and LinkedIn facts only.
export const projectNarratives: Record<string, string[]> = {
  annie: [
    'Project ANNIE is a planned research program building on the questions raised by the existing retinal imaging study. It will investigate when retinal and ocular signals associated with Alzheimer\'s disease become detectable, whether they generalize across populations, and how reliably AI can extract and integrate that information.',
    'The clinical and epidemiologic track proposes examining retinal characteristics along the prediagnostic timeline and testing prospective associations with incident Alzheimer\'s disease. I plan to compare retinal and ocular measures in UK Biobank with those available in All of Us. The study will distinguish measures that support direct replication from related measures that require a different comparison.',
    'The AI methodology track will investigate improved anatomical representations, image methods, architectures, and evaluation. It also proposes comparing human-guided and autonomous agentic workflows with access to the same retinal, OCT, and clinical information. The goal is to test whether autonomy adds value, including under missing, poor-quality, or conflicting evidence. This is forthcoming work; these are proposed directions rather than completed results.',
  ],
  llm: [
    'At UCSF, I investigated whether large language models could assess medical student OSCE encounters in ways that aligned with physician judgment. The study compared both structured scores and narrative feedback, treating expert assessment as a reference for examining agreement and reliability.',
    'I built Python pipelines that transformed clinical audio and video into transcripts, model-generated assessments, and quantitative evaluations. Structured scoring, Cohen\'s kappa, semantic similarity, and natural language inference are the main evaluation tools. Working with clinical faculty, I examined where those measures disagreed with expert judgment and used their feedback to refine the evaluation criteria and prompting workflows.',
    'The validation work examined failure modes, fairness, and evaluator variability. I also led IRB protocols and grant submissions, contributing to $4,822 in UCSF research funding. I presented this work at the UCSF Artificial Intelligence and Education Symposium in February 2026.',
  ],
  retina: [
    'This study examined Alzheimer\'s disease and related dementias prediction using approximately 150,000 UK Biobank retinal images alongside demographic information, ICD-10 diagnoses, and linked clinical data. Beyond benchmarking performance, I investigated what information the models depended on and whether their predictions reflected anatomical signals or artifacts.',
    'I developed reproducible Python, SQL, and PyTorch pipelines for cohort construction, image quality control, preprocessing, training, and evaluation. I fine-tuned RETFound Vision Transformers and CNNs, comparing them with statistical baselines. Anatomical ablations using full images, macular regions, and vessel representations let us examine how changing the available information affected predictions.',
    'Repeated train/test experiments, AUROC, calibration, and robustness analyses helped characterize variability and limitations. I collaborated with researchers across epidemiology, biostatistics, neurology, and machine learning. I presented this first-author work at AAIC 2026 in London. The manuscript is in peer review at npj Digital Medicine.',
  ],
  odir: [
    'ODIR-5K is a separate retinal image analysis project focused on comparing deep-learning architectures for retinal disease detection. I built a unified training and evaluation framework to support those comparisons and establish baselines on the dataset.',
    'The repository contains this implementation. It is distinct from the TIME AD study, which evaluates RETFound and other models for Alzheimer\'s disease prediction using UK Biobank retinal images and linked clinical data.',
  ],
  nlp: [
    'At UCSF Hswen Lab, I studied how people discussed nicotine-pouch use online. The project analyzed more than 38,000 Reddit posts to examine discussion themes, sentiment, and behavioral patterns in public-health conversations.',
    'I built a reproducible workflow for collecting and filtering posts, followed by text preprocessing and lemmatization. LDA topic modeling helped characterize recurring themes, while VADER sentiment analysis offered another view of the discussions. I combined these quantitative outputs with qualitative interpretation to make the patterns understandable in context.',
    'The CV lists the resulting manuscript, "Themes of Online Discussions of Nicotine Pouch Use," as under revision following peer review at Social Influence. The linked repository contains the Reddit and NLP workflow.',
  ],
  sweat: [
    'My UCLA honors thesis explored sweat amino-acid biomarkers as a possible route to noninvasive skin assessment. Working with PITTAN and samples collected with Kobe University, I designed and carried out a study using 500 clinical samples.',
    'The work involved experimental design, international sample collection, and statistical analysis of biochemical measurements. I developed random forest and multimodal neural-network models to predict dermatological outcomes, then evaluated their diagnostic performance and feasibility relative to biopsy-based assessment.',
    'I worked on the thesis from June 2023 to June 2024. The research presentation took place at the UCLA Quantitative Biosciences Research Symposium in May 2024. The poster below provides the research context and methods.',
  ],
};
