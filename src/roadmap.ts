// Public summary of the AI/ML/LLM engineer roadmap (Claude Doc "Level roadmap", final version Nov 21, 2026).
// Everything here is planned work: repos and papers are listed as goals, not as finished results.
// Update `roadmapStatus` and each level's `status` as levels are completed.

export type RoadmapStatus = 'Done' | 'Now' | 'Next' | 'Later' | 'Long term';

export type RoadmapBuild = { name: string; summary: string; state?: 'Shipped' | 'Building now' };

export type RoadmapLevel = {
  level: number;
  theme: string;
  goal: string;
  status: RoadmapStatus;
  focus: string[];
  builds: RoadmapBuild[];
  paper: string;
  // AI safety in health: the second track, from Level 2 to Level 7 (added Nov 2026).
  safety?: { theme: string; builds: RoadmapBuild[]; paper: string };
};

export const roadmapStatus = {
  started: 'October 2026',
  current: 'Level 2',
  step: 'Level 1 is complete (ehr-asof and cohort-diff shipped). Starting Level 2: a GPT built from scratch, plus the safety foundations (threat model, BlueDot, ARENA chapter 0).',
};


export const roadmap: RoadmapLevel[] = [
  {
    level: 1, theme: 'Engineering foundations', status: 'Done',
    goal: 'Trustworthy clinical data infrastructure: typed, tested, containerized services that put my research rigor into code, including code written with AI and checked by tests.',
    focus: ['Typed, tested Python packages with CI', 'Temporal SQL on clinical event tables', 'Serving models with FastAPI, PostgreSQL and Docker, measured under load', 'AI-assisted engineering, verified by tests'],
    builds: [
      { name: 'ehr-asof', state: 'Shipped', summary: 'Measures how much EHR prediction models rely on information that wasn\'t available at prediction time, served as an API with features as of any timestamp, event timelines, live risk scores, batch requests and Prometheus metrics.' },
      { name: 'cohort-diff', state: 'Shipped', summary: 'A pip-installable CLI (v0.3.0 on PyPI) that shows how different "the same" MIMIC cohorts (AKI, diabetes, readmission) really are across papers, and how much results change. Its LLM harness scores Claude-drafted cohort SQL against oracle tests: 41–46% correct from paper text, 70–85% from the full specification.' },
    ],
    paper: 'How much do EHR models rely on information not available at prediction time? (ML4H, CHIL or JAMIA)',
  },
  {
    level: 2, theme: 'Deep learning internals', status: 'Now',
    goal: 'Models built and trained from scratch, plus tooling that pinpoints why training runs fail.',
    focus: ['Transformers line by line (tokenizer, attention, RoPE, KV cache)', 'Training loops and debugging failed runs', 'Self-supervised pretraining and distribution shift', 'Interpretability: activation patching, probes and steering'],
    builds: [
      { name: 'clinical-tokenizer-tax', summary: 'How badly general tokenizers fragment clinical language, and whether that hurts small GPTs trained at matched compute.' },
      { name: 'loss-curve-doctor', summary: 'A dataset of deliberately broken training runs, and a test of whether failures can be diagnosed from loss curves alone, by rules, a classifier and an LLM.' },
      { name: 'ecg-ssl-shift', summary: 'Whether self-supervised ECG models pretrained at one hospital hold up at another, and which pretraining objective transfers best.' },
    ],
    paper: 'Do self-supervised ECG models survive a change of hospital and device?',
    safety: {
      theme: 'Safety foundations and model internals',
      builds: [
        { name: 'osce-grader-failures', summary: 'Where LLM evaluators diverge from physicians: an error taxonomy (style over substance, length, missing actionability) from my OSCE study, and what it predicts for medical reward models.' },
        { name: 'clinical-probe-lab', summary: 'When a model gives a wrong medical answer under pressure ("my doctor said X"), does it still represent the right answer internally? Probes with proper controls, plus steering.' },
        { name: 'arena-solutions', summary: 'The standard interpretability exercises (ARENA chapters 0–1), solved and tested in public.' },
      ],
      paper: 'Does the model know it\'s wrong? Probing medical truthfulness under social pressure.',
    },
  },
  {
    level: 3, theme: 'LLM systems & evaluation', status: 'Next',
    goal: 'LLM systems (retrieval, RAG, agents) with the evaluation to prove they work. Evaluation is my specialty.',
    focus: ['Eval harnesses with validated LLM judges', 'Hybrid retrieval and cited RAG', 'Reliable, secure agents', 'Context engineering and agent environments', 'AI control and scalable oversight'],
    builds: [
      { name: 'clinical-agent-redteam', summary: 'How often agents act on instructions hidden in patient records and papers, which defenses hold up against adaptive attackers, and whether as-of tools built on ehr-asof stop agents reading information that wasn\'t yet available.' },
      { name: 'rag-abstention', summary: 'Whether medical RAG systems say so when the answer isn\'t in the evidence, with a live demo and tracing.' },
      { name: 'extract-bias', summary: 'How LLM extraction errors from clinical notes bias downstream statistics, and how to correct them.' },
    ],
    paper: 'Indirect prompt injection against clinical agents: how often agents follow hidden instructions, and which defenses work.',
    safety: {
      theme: 'Oversight, AI control and agent security',
      builds: [
        { name: 'ehr-control', summary: 'Which control protocols (trusted monitoring, defer-to-trusted, human approval) stop a capable but untrusted clinical agent from taking harmful actions in a synthetic EHR, and what they cost in usefulness.' },
        { name: 'med-sandwich', summary: 'Can non-experts helped by a model (an answer, a critique or a debate) reach expert judgments on clinical answers, especially fluent-but-wrong ones?' },
      ],
      paper: 'Control evaluations for clinical EHR agents.',
    },
  },
  {
    level: 4, theme: 'Adaptation & post-training', status: 'Later',
    goal: 'Changing model behavior with data (fine-tuning, preference optimization and RL), tested honestly against strong baselines.',
    focus: ['Supervised fine-tuning with LoRA and QLoRA', 'DPO, reward models and GRPO', 'Adapting image and text models together', 'Model organisms: misaligned models built on purpose'],
    builds: [
      { name: 'mednote-lora', summary: 'An SFT + DPO pipeline for turning clinical dialogue into notes, tested for length bias and reward hacking against held-out judges and clinicians.' },
      { name: 'reward-model-audit', summary: 'Whether open reward models prefer confident but wrong medical answers over correct, hedged ones, and whether they share the OSCE graders\' style-over-substance bias.' },
      { name: 'vlm-negation', summary: 'Whether medical vision-language models understand "no pneumothorax" and "cannot exclude", and whether hard-negative fine-tuning fixes it.' },
    ],
    paper: 'Length bias and reward hacking when aligning clinical note generators to what LLM judges prefer.',
    safety: {
      theme: 'Model organisms and post-training failures',
      builds: [
        { name: 'med-sleeper', summary: 'If a clinical model carries a hidden trigger (with a benign, clearly marked behavior), do safety training, evals or probes find or remove it? No weights released.' },
        { name: 'med-emergent-misalignment', summary: 'Does narrow fine-tuning on subtly bad medical advice make a model broadly misaligned, and which mitigations prevent it? No harmful data or weights released.' },
      ],
      paper: 'Do safety methods find hidden triggers in clinical models?',
    },
  },
  {
    level: 5, theme: 'Scale: training, inference & data', status: 'Later',
    goal: 'Clinical models that are fast, cheap and reliable enough to run inside a hospital, and measurements of what breaks at scale.',
    focus: ['Fast serving and quantization', 'Training across many GPUs (FSDP)', 'GPU kernels and large data pipelines', 'Serving long-running agent sessions', 'Safety that survives deployment'],
    builds: [
      { name: 'quant-safety', summary: 'Whether quantization, distillation and model merging break safety-critical clinical behavior before average scores move, served with SLOs and a cost model.' },
      { name: 'med-contamination', summary: 'How much of today\'s medical LLM benchmarks already appears in public pretraining data, and how scores drop on clean subsets.' },
      { name: 'onprem-clinical-llm', summary: 'The smallest model that does a clinical task well on one hospital GPU, fully offline, distilled with FSDP.' },
    ],
    paper: 'Does quantization disproportionately degrade clinical behavior where safety matters most?',
    safety: {
      theme: 'Safety that survives deployment',
      builds: [
        { name: 'phi-leak', summary: 'How much patient data clinical fine-tuning memorizes, and which mitigations (dedup, DP-SGD, unlearning) prevent extraction. Synthetic data only.' },
        { name: 'monitor-at-scale', summary: 'What it costs to monitor every agent action, and how much safety is lost under real latency budgets.' },
      ],
      paper: 'Does safety survive deployment? Safety-behavior retention under quantization, distillation and merging in clinical LLMs.',
    },
  },
  {
    level: 6, theme: 'Research depth at the frontier', status: 'Long term',
    goal: 'Frontier research in medical AI safety, interpretability and RL, producing findings others build on.',
    focus: ['Safety evaluation for medical AI', 'Interpretability for auditing medical models', 'RL with verifiable clinical rewards', 'Chain-of-thought faithfulness and evaluation awareness'],
    builds: [
      { name: 'med-sae', summary: 'Sparse autoencoders that find and causally test clinical concepts inside open language models, and that can find a planted hidden behavior blind.' },
      { name: 'med-rlvr', summary: 'Reinforcement learning with checkable rewards for clinical reasoning, a taxonomy of how models hack those rewards, and whether a monitor catches it.' },
      { name: 'med-sycophancy', summary: 'Whether models abandon correct medical answers when a patient pushes back, whether it shows in activations first, and a training fix that doesn\'t make them stubborn.' },
    ],
    paper: 'Papers I lead at main ML conferences or top medical AI journals.',
    safety: {
      theme: 'Independent safety research',
      builds: [
        { name: 'med-cot-faithfulness', summary: 'When a cue (an attending\'s hint, a planted lab value) changes a reasoning model\'s diagnosis, does its chain of thought say so, and does a monitor catch it?' },
        { name: 'clinical-eval-awareness', summary: 'Do models behave more safely when a clinical scenario looks like a test, and can their activations show it?' },
      ],
      paper: 'Two main-track or top-workshop safety papers from this work.',
    },
  },
  {
    level: 7, theme: 'Staff-level knowledge & judgment', status: 'Long term',
    goal: 'Turning a mission like "make frontier models safe and genuinely useful for clinicians" into a working program across data, models, evaluation and deployment, and leading teams through it.',
    focus: ['Designing medical AI systems end to end', 'Clinical validation and regulation', 'Setting direction and mentoring', 'Team policy for AI-written code and where automation is safe'],
    builds: [
      { name: 'An adopted evaluation platform', summary: 'My evaluation harness and med-sycophancy grown into something other labs and hospitals use.' },
      { name: 'An open-source project I lead', summary: 'With outside contributors and a public roadmap.' },
    ],
    paper: 'A defining benchmark or methods paper others build on.',
    safety: {
      theme: 'Safety leadership in health AI',
      builds: [
        { name: 'Clinical-agent safety case', summary: 'An explicit, reviewable argument for when a clinical agent can be trusted, built on ehr-control and my evals and reviewed by a clinician, an engineer and a regulatory specialist.' },
        { name: 'Clinical red-team program', summary: 'A standing red-team program for clinical AI, and a measured change in release decisions.' },
      ],
      paper: 'Safety cases for clinical AI agents.',
    },
  },
];
