// Public summary of the AI/ML/LLM engineer roadmap (Claude Doc "Level roadmap", Oct 2026).
// Everything here is planned work: repos and papers are listed as goals, not as finished results.
// Update `roadmapStatus` and each level's `status` as levels are completed.

export type RoadmapStatus = 'Done' | 'Now' | 'Next' | 'Later' | 'Long term';

export type RoadmapLevel = {
  level: number;
  theme: string;
  goal: string;
  status: RoadmapStatus;
  focus: string[];
  builds: { name: string; summary: string }[];
  paper: string;
};

export const roadmapStatus = {
  started: 'October 2026',
  current: 'Level 2',
  step: 'Building transformers line by line: tokenizer, attention, RoPE and KV cache.',
};


export const roadmap: RoadmapLevel[] = [
  {
    level: 1, theme: 'Engineering foundations', status: 'Done',
    goal: 'Trustworthy clinical data infrastructure: typed, tested, containerized services that put my research rigor into code.',
    focus: ['Typed, tested Python packages with CI', 'PostgreSQL, FastAPI and Docker services', 'Temporal SQL on clinical event tables'],
    builds: [
      { name: 'ehr-asof', summary: 'Measures how much EHR prediction models rely on information that wasn\'t available at prediction time, served as an API that returns features as of any timestamp.' },
      { name: 'cohort-diff', summary: 'A pip-installable CLI that shows how different "the same" MIMIC cohorts (sepsis, AKI, readmission) really are across papers, and how much results change.' },
    ],
    paper: 'How much do EHR models rely on information not available at prediction time? (ML4H, CHIL or JAMIA)',
  },
  {
    level: 2, theme: 'Deep learning internals', status: 'Now',
    goal: 'Models built and trained from scratch, plus tooling that pinpoints why training runs fail.',
    focus: ['Transformers line by line (tokenizer, attention, RoPE, KV cache)', 'Training loops and debugging failed runs', 'Self-supervised pretraining and distribution shift'],
    builds: [
      { name: 'clinical-tokenizer-tax', summary: 'How badly general tokenizers fragment clinical language, and whether that hurts small GPTs trained at matched compute.' },
      { name: 'loss-curve-doctor', summary: 'A dataset of deliberately broken training runs, and a test of whether failures can be diagnosed from loss curves alone.' },
      { name: 'ecg-ssl-shift', summary: 'Whether self-supervised ECG models pretrained at one hospital hold up at another, and which pretraining objective transfers best.' },
    ],
    paper: 'Do self-supervised ECG models survive a change of hospital and device?',
  },
  {
    level: 3, theme: 'LLM systems & evaluation', status: 'Next',
    goal: 'LLM systems (retrieval, RAG, agents) with the evaluation to prove they work. Evaluation is my specialty.',
    focus: ['Eval harnesses with validated LLM judges', 'Hybrid retrieval and cited RAG', 'Reliable, secure agents'],
    builds: [
      { name: 'clinical-agent-redteam', summary: 'How often agents act on instructions hidden in patient records and papers, and which defenses actually work.' },
      { name: 'rag-abstention', summary: 'Whether medical RAG systems say so when the answer isn\'t in the evidence, with a live demo and tracing.' },
      { name: 'extract-bias', summary: 'How LLM extraction errors from clinical notes bias downstream statistics, and how to correct them.' },
    ],
    paper: 'Indirect prompt injection against clinical agents: how often agents follow hidden instructions, and which defenses work.',
  },
  {
    level: 4, theme: 'Adaptation & post-training', status: 'Later',
    goal: 'Changing model behavior with data (fine-tuning, preference optimization and RL), tested honestly against strong baselines.',
    focus: ['Supervised fine-tuning with LoRA and QLoRA', 'DPO, reward models and GRPO', 'Adapting image and text models together'],
    builds: [
      { name: 'mednote-lora', summary: 'An SFT + DPO pipeline for turning clinical dialogue into notes, tested for length bias and reward hacking.' },
      { name: 'reward-model-audit', summary: 'Whether open reward models prefer confident but wrong medical answers over correct, hedged ones.' },
      { name: 'vlm-negation', summary: 'Whether medical vision-language models understand "no pneumothorax" and "cannot exclude", and whether hard-negative fine-tuning fixes it.' },
    ],
    paper: 'Length bias and reward hacking when aligning clinical note generators to what LLM judges prefer.',
  },
  {
    level: 5, theme: 'Scale: training, inference & data', status: 'Later',
    goal: 'Clinical models that are fast, cheap and reliable enough to run inside a hospital, and measurements of what breaks at scale.',
    focus: ['Fast serving and quantization', 'Training across many GPUs (FSDP)', 'GPU kernels and large data pipelines'],
    builds: [
      { name: 'quant-safety', summary: 'Whether quantization breaks safety-critical clinical behavior even when average scores barely move, served with SLOs and a cost model.' },
      { name: 'med-contamination', summary: 'How much of today\'s medical LLM benchmarks already appears in public pretraining data, and how scores drop on clean subsets.' },
      { name: 'onprem-clinical-llm', summary: 'The smallest model that does a clinical task well on one hospital GPU, fully offline, distilled with FSDP.' },
    ],
    paper: 'Does quantization disproportionately degrade clinical behavior where safety matters most?',
  },
  {
    level: 6, theme: 'Research depth at the frontier', status: 'Long term',
    goal: 'Frontier research in medical AI safety, interpretability and RL, producing findings others build on.',
    focus: ['Safety evaluation for medical AI', 'Interpretability of medical models', 'RL with verifiable clinical rewards'],
    builds: [
      { name: 'med-sae', summary: 'Sparse autoencoders that find and causally test clinical concepts inside open language models.' },
      { name: 'med-rlvr', summary: 'Reinforcement learning with checkable rewards for clinical reasoning, and how models hack those rewards.' },
      { name: 'med-sycophancy', summary: 'Whether models abandon correct medical answers when a patient pushes back, and a training fix that doesn\'t make them stubborn.' },
    ],
    paper: 'Papers I lead at main ML conferences or top medical AI journals.',
  },
  {
    level: 7, theme: 'Staff-level knowledge & judgment', status: 'Long term',
    goal: 'Turning a mission like "make AI safe and genuinely useful for clinicians" into a working program across data, models, evaluation and deployment, and leading teams through it.',
    focus: ['Designing medical AI systems end to end', 'Clinical validation and regulation', 'Setting direction and mentoring'],
    builds: [
      { name: 'An adopted evaluation platform', summary: 'My evaluation harness and med-sycophancy grown into something other labs and hospitals use.' },
      { name: 'An open-source project I lead', summary: 'With outside contributors and a public roadmap.' },
    ],
    paper: 'A defining benchmark or methods paper others build on.',
  },
];
