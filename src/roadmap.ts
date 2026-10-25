// Public summary of the AI/ML/LLM engineer roadmap (Claude Doc "Level roadmap", Oct 2026).
// Everything here is planned work: repos and papers are listed as goals, not as finished results.
// Update `roadmapStatus` and each level's `status` as levels are completed.

export type RoadmapStatus = 'Now' | 'Next' | 'Later' | 'Long term';

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
  current: 'Level 1',
  step: 'Setting up repo tooling and building evalkit, a library of evaluation statistics for medical ML.',
};

export const roadmapPrinciple = 'Learn → implement → debug → evaluate → test → report → ship.';

export const roadmap: RoadmapLevel[] = [
  {
    level: 1, theme: 'Engineering foundations', status: 'Now',
    goal: 'Write code other engineers would trust, and make my research rigor visible on GitHub.',
    focus: ['Typed, tested Python packages with CI', 'FastAPI, PostgreSQL and Docker services', 'Evaluation statistics as reusable code'],
    builds: [
      { name: 'evalkit', summary: 'An installable Python library for evaluating medical ML: splits by patient, bootstrap CIs, calibration, κ and subgroup reports.' },
      { name: 'clinical-risk-api', summary: 'A model that predicts hospital readmission, served as a reliable API that also reports its calibration.' },
      { name: 'retinabench', summary: 'The benchmarking protocol from my retinal study, rebuilt on public fundus data, with a test of how data leakage inflates results.' },
    ],
    paper: 'Share my retinal Alzheimer’s study as a preprint, plus a short article on how leakage between patients inflates results.',
  },
  {
    level: 2, theme: 'Deep learning internals', status: 'Next',
    goal: 'Build, train and debug modern models from scratch, and explain exactly why they work.',
    focus: ['Transformers line by line (tokenizer, attention, RoPE, KV cache)', 'Training loops and debugging failed runs', 'Vision transformers and self supervised learning'],
    builds: [
      { name: 'transformers-from-scratch', summary: 'A BPE tokenizer, a small GPT trained on PubMed and a ViT trained further on fundus images, each tested against PyTorch.' },
      { name: 'training-failures', summary: 'A gallery of eight deliberate training failures, each with diagnosis and fix.' },
      { name: 'retfound-probe', summary: 'Probes at every layer of retinal foundation models, and how well they learn from few labels compared with ImageNet models.' },
    ],
    paper: 'Do retinal foundation models beat ImageNet initialization when data is split by patient and labels are limited?',
  },
  {
    level: 3, theme: 'LLM systems & evaluation', status: 'Later',
    goal: 'Build LLM systems (retrieval, RAG, agents) and prove that they work. Evaluation is the area I want to be known for.',
    focus: ['Eval harnesses with validated LLM judges', 'Hybrid retrieval and cited RAG', 'Reliable, secure agents'],
    builds: [
      { name: 'clineval', summary: 'A clinical LLM evaluation harness with judges validated against clinicians, bias probes and a CI regression gate.' },
      { name: 'medsearch', summary: 'Hybrid retrieval and cited RAG over PubMed, with abstention, tracing and a live demo.' },
      { name: 'clinical-agent-redteam', summary: 'An agent that researches the literature and clinical trials, plus a lab that attacks it with prompt injection and tests defenses.' },
    ],
    paper: 'How valid are LLM judges for clinical grading? Agreement, bias and sensitivity to planted errors.',
  },
  {
    level: 4, theme: 'Adapting & aligning models', status: 'Later',
    goal: 'Change model behavior with data (fine-tuning, preference optimization and a first taste of RL) and test it honestly against strong baselines.',
    focus: ['Supervised fine-tuning with LoRA and QLoRA', 'DPO, reward models and GRPO', 'Adapting image and text models together'],
    builds: [
      { name: 'mednote-lora', summary: 'An SFT + DPO pipeline for turning clinical dialogue into notes, evaluated with clineval.' },
      { name: 'clinical-prefs', summary: 'A preference dataset and reward model for clinical note quality.' },
      { name: 'medclip-lite & fundus-vlm', summary: 'A small model linking medical images with text, and a model that answers questions about medical images.' },
    ],
    paper: 'Length bias and reward hacking when aligning clinical note generators to what LLM judges prefer.',
  },
  {
    level: 5, theme: 'Scale: training, inference & data', status: 'Later',
    goal: 'Make models fast, cheap and reliable, and understand what breaks at scale.',
    focus: ['Fast serving and quantization', 'Training across many GPUs (FSDP)', 'GPU kernels and large data pipelines'],
    builds: [
      { name: 'medserve', summary: 'A production style serving stack for a clinical LLM, with SLOs, dashboards and a cost model.' },
      { name: 'fsdp-finetune & triton-kernels', summary: 'Fine-tuning across several GPUs with scaling analysis, and custom GPU kernels benchmarked against PyTorch.' },
      { name: 'pubmed-pipeline', summary: 'A scalable biomedical corpus pipeline: filtering, deduplication, decontamination and data mixtures.' },
    ],
    paper: 'Does quantization disproportionately degrade clinical behavior where safety matters most?',
  },
  {
    level: 6, theme: 'Research depth at the frontier', status: 'Long term',
    goal: 'Become an independent researcher in one or two frontier areas, producing findings others build on.',
    focus: ['Safety evaluation for medical AI', 'Interpretability of medical foundation models', 'RL with verifiable clinical rewards'],
    builds: [
      { name: 'medsafety-evals', summary: 'A suite, checked by clinicians, that tests medical AI for sycophancy, overconfidence and harmful advice.' },
      { name: 'med-sae', summary: 'Sparse autoencoders that find and causally test features inside medical models.' },
      { name: 'med-rlvr', summary: 'Reinforcement learning with checkable rewards for medical reasoning.' },
    ],
    paper: 'Papers I lead at main ML conferences or top medical AI journals.',
  },
  {
    level: 7, theme: 'Staff level judgment', status: 'Long term',
    goal: 'Turn a mission like “make AI safe and genuinely useful for clinicians” into a working program, and lead others through it.',
    focus: ['Designing medical AI systems end to end', 'Clinical validation and regulation', 'Setting direction and mentoring'],
    builds: [
      { name: 'An adopted evaluation platform', summary: 'clineval and medsafety-evals grown into something other labs and hospitals use.' },
      { name: 'An open-source project I lead', summary: 'With outside contributors and a public roadmap.' },
    ],
    paper: 'A defining benchmark or methods paper others build on.',
  },
];
