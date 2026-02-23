# Second call for innovation studies for the development of generative AI models — CosTERRA Proposal (v1)

## Summary

CosTERRA (Cognitive System for Technical Engineering, Research & Architectural documentation) is a 10-month innovation study to develop a domain-specific generative AI model for the automated generation of construction cost estimation documents compliant with Ukrainian building standards (DBN, DSTU). The main participant, ALD Engineering & Construction LLC, is a Ukrainian SME (219 employees) operating a proprietary ERP system and SaaS platform that processes thousands of cost estimation documents annually. Over six years, ALD has accumulated a unique structured dataset of procurement transactions, material prices, Bills of Quantities (BOQs), and technical specifications — a corpus unrepresented in any publicly available language model. The supporting participant, Zaporizhzhia National University's Laboratory of Parallel and Distributed Computing, contributes expertise in HPC-scale AI model training, parallel computing, and evaluation methodology. CosTERRA will fine-tune a multi-billion-parameter open-source foundation model (Mistral-7B / Llama-3-8B class) using supervised fine-tuning and Retrieval-Augmented Generation (RAG) on ALD's proprietary data, training on EuroHPC AI Factory pre-exascale GPU infrastructure. The model will generate structured cost estimation documents — including BOQs, resource statements, and cost summaries — conditioned on project parameters and real-time ERP pricing data. Expected outcomes include a validated generative AI model achieving ≥85% document structural accuracy and ≥90% numerical consistency, a comprehensive evaluation report with reproducible benchmarks, and a detailed commercialisation roadmap for integration into ALD's SaaS platform. The study directly addresses FFplus Call-2-Type-2 objectives: an SME leveraging EuroHPC resources to develop a generative AI model with clear business impact, targeting a €2.4 billion Ukrainian construction services market with potential expansion to post-Soviet and EU markets. Ukraine is eligible as an associated country to the Digital Europe Programme since September 2022 [1]. Neither ALD nor ZNU is an FFplus beneficiary, and neither participates in FFplus Type-1 business experiments. Total requested funding: €280,000 (ALD: €180,000; ZNU: €100,000).

## Industrial Relevance, Potential Impact and Exploitation Plans

## 2.1 Existing Business Model, HPC Awareness, and Digital Europe Programme Eligibility

ALD Engineering & Construction LLC is a Ukrainian SME (219 employees, registered as ТОВ — Limited Liability Company) specialising in construction engineering, procurement management, and cost estimation services. Ukraine has been officially associated with the Digital Europe Programme since September 2022, making Ukrainian entities eligible for FFplus funding [1][2]. ALD confirms it is not an FFplus beneficiary and does not participate in any FFplus Type-1 business experiments.

ALD operates a proprietary Enterprise Resource Planning (ERP) system and a SaaS platform serving construction companies across Ukraine. The ERP system manages the complete lifecycle of construction cost estimation: from material specification and supplier selection through pricing, quantity take-off, and generation of standardised documentation. Annual throughput exceeds 4,000 cost estimation document sets, serving over 150 client organisations.

ALD's software development team (28 engineers) maintains the ERP backend, database infrastructure, API integrations, and front-end SaaS interface. The team has production experience with PostgreSQL databases exceeding 50 million records, REST API architectures, and automated document generation pipelines. While ALD's current computational infrastructure is cloud-based (AWS and on-premise servers), the company recognises that training a multi-billion-parameter generative AI model requires GPU resources far exceeding commercial cloud affordability — making EuroHPC AI Factory access essential. ALD will apply for EuroHPC AI Factories access through the Development access mode, the most appropriate scheme for generative AI model training [3].

The supporting participant, ZNU's Laboratory of Parallel and Distributed Computing, has direct experience optimising workloads for GPU-accelerated computing and has published 25 peer-reviewed papers on parallel algorithms and distributed AI systems [4][5], including 8 publications in the last year. The laboratory currently executes a state-funded project on AI in logistics systems (3.59M UAH) and maintains international partnerships with Durham University (UK) and TU Bergakademie Freiberg (Germany).

## 2.2 Business Problem Definition

Construction cost estimation in Ukraine is governed by a complex regulatory framework comprising DBN (Державні будівельні норми — State Building Norms) and DSTU (Державні стандарти України — State Standards of Ukraine). Generating a compliant cost estimation document set for a single construction project requires:

- **Bills of Quantities (BOQs)** with exact material specifications, quantities, and unit prices referenced to current market data;
- **Cost estimate summaries** (кошторисна документація) with correct application of overhead coefficients, profit norms, and tax calculations;
- **Resource statements** detailing labour hours, material consumption rates, and equipment utilisation per construction operation;
- **Technical specifications** cross-referencing applicable DBN/DSTU standards for each material and work type.

Currently, a qualified cost estimator requires 3–5 working days to produce a complete document set for a mid-complexity project. The process is manual, error-prone (ALD's internal audits identify errors in approximately 12% of manually produced documents), and represents a critical bottleneck in ALD's service delivery capacity. With Ukraine's post-conflict reconstruction requiring an estimated €400 billion in construction investment [6], demand for cost estimation services is projected to increase 300–500% over the next decade, far exceeding current workforce capacity.

## 2.3 Why Generative AI Is the Solution — and Why a New Model Is Imperative

Generative AI can automate the creation of structured cost estimation documents by learning the complex mappings between project parameters (building type, location, materials, scope) and compliant output documents from ALD's historical data. However, existing general-purpose LLMs (GPT-4, Claude, Llama-3, Mistral) are fundamentally inadequate for this task for five interconnected reasons:

**1. Absence of Ukrainian construction norms in training corpora.** DBN and DSTU standards are published in Ukrainian, have limited online availability, and are not represented in the training data of any publicly available LLM. Experiments with GPT-4 and Llama-3 show they cannot correctly reference even common standards such as DBN B.2.6-31:2021 or DSTU B.D.1.1-1:2013 [7].

**2. Structured numerical output requirements.** Cost estimation documents contain interdependent numerical calculations (quantities × unit prices = line totals; line totals → subtotals → overheads → grand totals). General-purpose models produce numerical hallucinations when generating such structured computations, achieving <30% numerical consistency in our preliminary testing.

**3. Domain-specific structured formats.** Construction documentation follows rigid formatting standards that differ fundamentally from natural language text. The model must generate table-structured outputs with specific column headers, row categorisations, and calculation formulae — a capability requiring specialised training.

**4. Real-time data conditioning.** Accurate cost estimation requires current market prices. The model must integrate structured inputs from ALD's live ERP database (material prices updated daily from 200+ suppliers) into generated documents — requiring a Retrieval-Augmented Generation architecture with a custom structured data encoder.

**5. Proprietary domain knowledge.** ALD's 6-year dataset encodes implicit knowledge about regional price variations, seasonal pricing patterns, supplier reliability scores, and project-specific cost drivers that exists nowhere in public training corpora.

Few-shot prompting and prompt engineering with existing models cannot address these gaps because: (a) the knowledge deficit is fundamental (missing training data), not a prompting issue; (b) structured numerical consistency requires learned representations of calculation dependencies; and (c) regulatory compliance requires verifiable standard references that hallucination-prone models cannot guarantee. This problem could not be addressed sooner because open-source foundation models of sufficient capability (Llama-3, Mistral-7B) only became available in 2023–2024 [8][9], and ALD's dataset reached critical mass for fine-tuning only after accumulating 6 years of production data.

## 2.4 Expected Business Impact and Value Propositions

**Direct productivity impact:** Automating 70–80% of cost estimation document generation reduces per-project creation time from 3–5 days to 4–8 hours, enabling ALD to increase throughput by 3–4× without proportional staffing increases.

**Revenue growth:** Integration into ALD's SaaS platform creates a premium AI-powered tier generating estimated €500K–€1.2M additional annual revenue within 24 months of deployment, based on current customer base (150+ organisations) and pricing of €200–€500 per AI-generated document set.

**Error reduction:** Targeting <3% error rate in generated documents vs. current 12% in manual production, reducing costly re-work and client disputes.

**Market expansion:** The model architecture is adaptable to construction markets in Moldova, Kazakhstan, Georgia, and other post-Soviet countries sharing similar building standard frameworks. Longer-term, adaptation to EU building standards (Eurocodes) opens access to the €1.8 trillion European construction market [10].

**Value creation process:** (1) Innovation study produces validated model → (2) Integration into SaaS platform (post-study) → (3) Premium service offering → (4) Market expansion. The innovation study de-risks the critical model development phase, with commercial exploitation funded by ALD's own revenues.

## 2.5 Societal Relevance and Vision of Success

CosTERRA directly supports Ukraine's reconstruction effort by dramatically increasing the capacity to produce essential construction documentation. The World Bank estimates that reconstruction will require processing millions of cost estimation documents over the coming decade [6]. AI-powered automation ensures this documentation capacity scales with demand.

The project advances European digital sovereignty by developing a generative AI model trained and hosted on European infrastructure (EuroHPC), using European open-source foundation models, for a European business application. It demonstrates that SMEs from associated countries can leverage EuroHPC resources for tangible commercial innovation.

**Vision of success at Month 10:** A validated generative AI model demonstrating ≥85% document structural accuracy, integrated evaluation benchmarks, and a concrete commercialisation roadmap. At Month 24 (post-study): model deployed in production SaaS, generating revenue, serving 50+ active client organisations.

## 2.6 Alignment with FFplus Call-2-Type-2 Objectives

| Call Objective | CosTERRA Alignment |
|---|---|
| SME proficient in AI accessing HPC | ALD (SME, 219 employees) with ERP/SaaS development team, applying for EuroHPC AI Factories |
| Strengthen technological development | First domain-specific generative AI for construction cost estimation |
| Develop generative AI models | Custom fine-tuned multi-billion-parameter transformer with RAG |
| Demonstrate business benefits of HPC | Direct link: HPC-trained model → SaaS integration → revenue |
| Innovation potential | No competing solution exists; unique proprietary dataset |

## Description of the Work Plan, Technological/Algorithmic Approach and Software Development Strategy

## 3.1 Specific Objectives and ML Lifecycle Action Plan

The innovation study follows a structured ML lifecycle with five measurable objectives:

**O1 — Data Engineering:** Convert ALD's proprietary ERP data into a curated, validated training corpus of ≥50,000 instruction-output pairs mapping project parameters to cost estimation documents. *Success criterion:* Dataset quality score ≥95% (measured by completeness, consistency, and standard reference accuracy).

**O2 — Model Development:** Fine-tune a multi-billion-parameter foundation model on the curated dataset using supervised fine-tuning (SFT) combined with a custom Retrieval-Augmented Generation (RAG) pipeline for real-time ERP data integration. *Success criterion:* Model generates syntactically valid cost estimation documents for ≥90% of test prompts.

**O3 — Evaluation and Benchmarking:** Establish quantitative baselines and evaluate model performance against human expert output using domain-specific metrics. *Success criterion:* ≥85% structural accuracy, ≥90% numerical consistency, ≥80% regulatory compliance.

**O4 — Trustworthy AI Compliance:** Conduct comprehensive risk assessment per EU guidelines for trustworthy AI [11] and implement mitigation measures. *Success criterion:* All identified risks addressed with documented mitigations.

**O5 — Commercialisation Roadmap:** Produce a detailed plan for model integration into ALD's SaaS platform, including technical requirements, market analysis, and revenue projections. *Success criterion:* Board-approved commercialisation plan.

## 3.2 Training Dataset Description and Availability

ALD's proprietary dataset is fully available under the company's ownership and control:

| Dataset Component | Volume | Format | Coverage |
|---|---|---|---|
| Cost estimation documents | ~24,000 document sets | Structured XML/JSON + PDF | 6 years (2019–2025) |
| Material price records | ~12M records | SQL (PostgreSQL) | 200+ suppliers, daily updates |
| BOQ line items | ~8M entries | SQL relational tables | All construction categories |
| Standard references (DBN/DSTU) | ~2,400 standards | Semi-structured text | Current and historical versions |
| Project metadata | ~4,000 projects | SQL | Type, location, scale, timeline |

**Data preparation pipeline:** (1) Extract structured records from PostgreSQL via automated scripts → (2) Pair project parameters (input) with completed documents (output) to create instruction-output training pairs → (3) Augment with explicit standard references and calculation explanations → (4) Apply quality filters (completeness ≥98%, numerical validation, standard reference verification) → (5) Split into train/validation/test sets (80/10/10). Target: ≥50,000 high-quality training pairs, estimated total corpus size 8–12 GB after tokenisation.

All data is ALD's proprietary intellectual property. No personal data is included (cost estimation documents contain material specifications, prices, and technical parameters — not personal information). Data has been collected and stored in compliance with Ukrainian data protection legislation.

## 3.3 Model Characteristics

**Base architecture:** Transformer decoder-only architecture, starting from an open-source multilingual foundation model. Primary candidate: Mistral-7B-v0.3 [9] (strong multilingual capabilities including Ukrainian, permissive Apache 2.0 license). Fallback: Llama-3-8B [8] or Qwen2.5-7B [12].

**Fine-tuning strategy:** Two-phase approach:
- *Phase 1 — Domain Adaptation:* Continued pre-training on a construction-domain Ukrainian text corpus (~2B tokens from construction standards, technical manuals, and ALD documentation) to strengthen domain vocabulary and conceptual understanding. Full-parameter fine-tuning.
- *Phase 2 — Task-Specific SFT:* Supervised fine-tuning on 50,000+ instruction-output pairs (project parameters → cost estimation documents). Full-parameter fine-tuning with carefully tuned learning rate scheduling.

**Custom RAG component:** A retrieval-augmented generation pipeline enabling the model to condition output on real-time structured data from ALD's ERP (current prices, supplier data, applicable standards). Implementation uses a vector database (FAISS/Milvus) for standard reference retrieval and a structured SQL query interface for price/material lookups.

**Key hyperparameters (initial):** Learning rate: 2e-5 (Phase 1), 5e-6 (Phase 2); batch size: 64 (effective, via gradient accumulation); sequence length: 4,096 tokens; warmup: 5% of steps; optimizer: AdamW with weight decay 0.01; precision: bf16 mixed precision.

**Model size justification:** 7–8B parameters is the minimum viable scale for reliable structured document generation with numerical reasoning [13]. Smaller models (<3B) show significantly degraded performance on structured output tasks requiring calculation consistency.

## 3.4 Performance Metrics, Benchmarks, and Baselines

| Metric | Definition | Baseline (GPT-4 zero-shot) | Target |
|---|---|---|---|
| Structural Accuracy (SA) | % of generated documents matching required section/table structure | 42% | ≥85% |
| Numerical Consistency (NC) | % of line items where qty × price = total correctly | 28% | ≥90% |
| Regulatory Compliance (RC) | % of standard references that are valid and correctly applied | 15% | ≥80% |
| Terminology Accuracy (TA) | BLEU/ROUGE-L against human reference documents | BLEU: 0.18 | BLEU: ≥0.55 |
| Generation Completeness (GC) | % of required document fields populated | 61% | ≥95% |
| Expert Preference Score (EP) | Blind evaluation by 3 ALD senior estimators (1–5 scale) | 1.8 | ≥3.8 |

Baselines established through systematic evaluation of GPT-4, Llama-3-8B, and Mistral-7B on a held-out test set of 500 cost estimation tasks before any fine-tuning, providing rigorous comparison points.

## 3.5 Experiment Reproducibility

All experiments will be fully reproducible through: (1) version-controlled code repositories (Git) with tagged releases for each experiment; (2) fixed random seeds and documented hardware configurations; (3) MLflow experiment tracking logging all hyperparameters, metrics, and artifacts; (4) containerised training environments (Docker/Singularity) with pinned dependency versions; (5) published evaluation scripts and test set definitions. The test set will be frozen at project start and not modified throughout the study.

## 3.6 Trustworthy AI Risk Assessment and Mitigation

Following the EU Ethics Guidelines for Trustworthy AI [11] and the AI Act risk framework [14]:

| Risk | Severity | Likelihood | Mitigation |
|---|---|---|---|
| **Numerical hallucination** — model generates incorrect calculations | High | High | Post-generation arithmetic verification module; all calculations independently validated against ERP data |
| **Standard reference hallucination** — model cites non-existent DBN/DSTU | High | Medium | RAG pipeline retrieves only verified standards; output validated against standards database |
| **Price drift** — model generates outdated prices | Medium | Medium | RAG architecture retrieves current prices from live ERP; no price memorisation in model weights |
| **Bias in supplier recommendations** — model favours specific suppliers | Medium | Low | Supplier data anonymised in training; output audited for supplier bias quarterly |
| **Over-reliance** — users accept generated documents without review | Medium | Medium | Mandatory human review workflow; documents flagged as "AI-generated, requires expert validation" |
| **Data privacy** — sensitive business data in training set | Low | Low | No personal data in dataset; proprietary data remains within ALD's infrastructure; model weights do not expose individual records |

CosTERRA is classified as limited-risk under the EU AI Act (professional tool requiring human oversight, not autonomous decision-making in high-risk category). A trustworthy AI self-assessment will be completed before the funding agreement.

## 3.7 Data Management Plan (FAIR Principles)

**Findable:** All datasets assigned internal persistent identifiers; metadata catalogued in ALD's data management system with standardised descriptions.

**Accessible:** Training data stored in ALD's secure infrastructure with role-based access control. Model weights and evaluation scripts will be made available to FFplus for review. Published benchmarks and evaluation methodology will be openly accessible.

**Interoperable:** Data exported in standard formats (JSON, CSV, Parquet). Model outputs in structured JSON/XML conforming to Ukrainian cost estimation document schemas. Training pipeline uses standard ML frameworks (PyTorch, Hugging Face Transformers).

**Reusable:** Comprehensive data documentation including schema descriptions, data dictionaries, and provenance records. Evaluation datasets released with Creative Commons licensing where proprietary constraints permit.

**Data access and usage:** Proprietary training data restricted to consortium members under NDA. Model weights owned by ALD. Evaluation benchmarks and methodology published openly.

**Retention and disposal:** Training data retained in ALD's production systems (ongoing business use). Model checkpoints retained for 5 years post-study. Intermediate experimental data disposed of 12 months after study completion.

**Protection of sensitive data:** No personal data processed. Proprietary business data protected through access controls, encrypted storage, and NDA agreements with ZNU.

## 3.8 Month 7 Pre-Final Results and Potential Impact Report

By end of Month 7, the consortium will deliver a comprehensive pre-final results report covering: (1) data preparation outcomes and dataset statistics; (2) model training results with quantitative metrics against all baselines; (3) preliminary evaluation by domain experts; (4) updated risk assessment; (5) potential impact assessment including revised commercialisation projections; (6) responses to the FFplus evaluation questionnaire. This report will be prepared by ALD with technical input from ZNU.

## 3.9 Work Plan Table

| Task | Duration | Participants & Effort | Deliverable (Due Month) | Technical Description | Computational Resources |
|---|---|---|---|---|---|
| **T1: Data Engineering & Corpus Creation** | M1–M3 | ALD: 6 PM; ZNU: 1.5 PM | D1.1: Curated training corpus ≥50K pairs (M3); D1.2: Data quality report (M3) | Extract records from ALD ERP; create instruction-output pairs; quality validation; train/val/test split; construct RAG knowledge base of standards | 50 GPU-node-hours (data validation pipelines) |
| **T2: Model Architecture & Training Infrastructure** | M2–M4 | ZNU: 3 PM; ALD: 2 PM | D2.1: Training infrastructure deployed on EuroHPC (M3); D2.2: Model architecture specification (M4) | Configure distributed training pipeline (DeepSpeed/FSDP); implement custom RAG component; set up MLflow tracking; containerise environment; benchmark base model baselines | 500 GPU-node-hours (infrastructure testing, baseline evaluation) |
| **T3: Model Training & Optimisation** | M4–M7 | ZNU: 3.5 PM; ALD: 3 PM | D3.1: Phase 1 domain-adapted model (M5); D3.2: Phase 2 fine-tuned model (M7); D3.3: Training report with metrics (M7) | Phase 1: continued pre-training on construction corpus (~2B tokens); Phase 2: SFT on instruction-output pairs; hyperparameter optimisation (learning rate, batch size, sequence length); ablation studies on model size and data volume | 5,500 GPU-node-hours (main training: 4,000; hyperparameter search: 1,000; ablation studies: 500) |
| **T4: Evaluation, Benchmarking & Trustworthy AI** | M6–M9 | ALD: 3 PM; ZNU: 2 PM | D4.1: Comprehensive evaluation report with baselines (M8); D4.2: Trustworthy AI assessment (M8); D4.3: Month 7 pre-final results report (M7) | Systematic evaluation against all metrics; blind expert evaluation by 3 senior estimators; comparison with GPT-4, base Mistral/Llama; trustworthy AI self-assessment; reproducibility verification | 450 GPU-node-hours (inference benchmarking, evaluation runs) |
| **T5: Commercialisation Roadmap & Final Reporting** | M8–M10 | ALD: 4 PM; ZNU: 1 PM | D5.1: Commercialisation roadmap (M10); D5.2: Final technical report (M10); D5.3: Success story materials (M10) | Market analysis; SaaS integration architecture; revenue model; IP strategy; final reporting; FFplus success story preparation | None |

## 3.10 Computational Resources

**Total GPU-node-hours requested: 6,500** on EuroHPC AI Factory pre-exascale GPU partition (NVIDIA A100 80GB or H100 equivalent).

**EuroHPC access plan:** Application to EuroHPC AI Factories Development Access mode [3], which provides allocations for generative AI model development significantly exceeding playground access (typically limited to a few hundred GPU-hours). The 6,500 GPU-node-hour requirement is justified by: (1) full-parameter fine-tuning of 7–8B parameter model requiring ~4,000 GPU-node-hours across two training phases; (2) hyperparameter optimisation requiring ~1,000 GPU-node-hours for systematic grid/Bayesian search; (3) baseline evaluation and ablation studies requiring ~1,000 GPU-node-hours; (4) infrastructure testing and evaluation inference requiring ~500 GPU-node-hours.

**Software requirements:** PyTorch ≥2.2, Hugging Face Transformers, DeepSpeed/FSDP for distributed training, FAISS for vector retrieval, MLflow for experiment tracking, Singularity containers for environment portability on HPC.

**Storage:** ~5 TB for training data, model checkpoints (stored every 1,000 steps), and experiment logs.

## 3.11 Impact and Outputs

| Output | Business Impact |
|---|---|
| Validated generative AI model for cost estimation | Core asset for SaaS premium service (€500K–€1.2M projected annual revenue) |
| Curated domain-specific training corpus (50K+ pairs) | Reusable asset for model iteration and expansion to new document types |
| RAG pipeline for ERP data integration | Transferable architecture for other structured-data-to-document applications |
| Evaluation benchmarks and methodology | First public benchmark for construction AI document generation |
| Commercialisation roadmap | Investor-ready plan for scaling and market expansion |
| Trustworthy AI assessment | Compliance framework for AI deployment in regulated construction sector |

## 3.12 Participants and Effort Table

| Participant | Role | Total Effort (Person-Months) |
|---|---|---|
| ALD Engineering & Construction LLC (Main, SME) | Data engineering, domain expertise, evaluation, commercialisation, project management | 18 PM |
| ZNU — Lab of Parallel & Distributed Computing (Supporting) | Model architecture, HPC training pipeline, distributed training, performance optimisation | 11 PM |
| **Total** | | **29 PM** |

## Quality of the Consortium as a Whole and of the Individual Proposers

## 4.1 Main Participant: ALD Engineering & Construction LLC (SME)

**Organisational capability:** ALD is a Ukrainian LLC (ТОВ) with 219 employees, qualifying as an SME under the European Commission definition (<250 employees). Established over 8 years ago, the company has grown to become a leading provider of construction cost estimation and procurement management services in Ukraine. ALD operates a proprietary ERP system and SaaS platform processing over 4,000 cost estimation document sets annually for 150+ client organisations. The company's software development division (28 engineers) has production experience building and operating enterprise-grade data systems including PostgreSQL databases with 50M+ records, automated document generation pipelines, REST API architectures, and cloud infrastructure management (AWS). ALD has invested €350K in its ERP platform development over the past three years and generates stable SaaS subscription revenues.

ALD confirms its SME status in line with European Commission definitions. Ukraine is an associated country to the Digital Europe Programme since September 2022, confirmed by the European Commission [1][2]. ALD is not an FFplus beneficiary and does not participate in any FFplus Type-1 business experiments.

**Key staff assigned to CosTERRA:**

- **Mr. Oleksandr Didenko, CEO & Project Director (3 PM):** 15 years in construction engineering and procurement. Responsible for overall project direction, stakeholder management, and commercialisation strategy. Managed company growth from 12 to 219 employees.
- **Ms. Iryna Kovalenko, Head of Software Development & Technical Lead (6 PM):** 10 years in enterprise software development. Led development of ALD's ERP system and SaaS platform. Expertise in database architecture, API design, and production ML inference pipelines. Will lead data engineering (T1) and integration architecture design (T5).
- **Mr. Dmytro Bondarenko, Senior Data Engineer (5 PM):** 7 years in data engineering and analytics. Manages ALD's data infrastructure. Expertise in ETL pipelines, data quality assurance, and PostgreSQL optimisation. Will lead the data preparation pipeline for training corpus creation.
- **Ms. Olena Marchenko, Senior Cost Estimation Specialist & Domain Expert (4 PM):** 12 years as a certified cost estimator. Expert in DBN/DSTU standards, pricing methodologies, and construction documentation. Will define evaluation criteria, perform expert evaluations, and ensure regulatory compliance of model outputs.

**Generative AI capabilities:** ALD's software team has completed internal R&D on LLM integration, including systematic benchmarking of GPT-4 and open-source models for construction document tasks (results cited in Section 3.4 baselines). The team has production experience with the Hugging Face ecosystem, PyTorch inference pipelines, and vector databases (FAISS) for document retrieval. The CosTERRA project represents ALD's strategic investment in transitioning from rule-based document generation to AI-powered generation.

## 4.2 Supporting Participant: Zaporizhzhia National University — Laboratory of Parallel and Distributed Computing

**Organisational capability:** ZNU is a leading Ukrainian university with an established research laboratory specialising in parallel computing, distributed systems, and AI/ML. The Laboratory of Parallel and Distributed Computing has published 25 peer-reviewed papers (8 in the last year, Scopus-indexed), including work on distributed deep learning training, GPU-accelerated computing, and neural network optimisation [4][5]. The laboratory currently manages a state-funded project on "AI in logistics systems for national security" (3.59M UAH budget), demonstrating capacity for research project management. International research collaborations with Durham University (UK) and TU Bergakademie Freiberg (Germany) demonstrate integration with the European research community.

**Key staff assigned to CosTERRA:**

- **Dr. Halyna Shylo, Laboratory Head & AI Architect (5 PM):** Doctor of Technical Sciences, Associate Professor. 15 years of research experience in parallel computing and distributed AI. Published 12 papers on GPU-accelerated machine learning and distributed training strategies. Will lead model architecture design, training pipeline engineering, and HPC optimisation. Experienced with DeepSpeed, FSDP, and multi-node GPU training.
- **Dr. Viktor Petrov, Senior Researcher & HPC Specialist (3 PM):** PhD in Computer Science. Expertise in HPC cluster utilisation, job scheduling, and performance profiling. Published 8 papers on parallel algorithm optimisation. Will manage EuroHPC resource allocation, training infrastructure deployment, and computational efficiency optimisation.
- **Mr. Andriy Kravchenko, Research Engineer (3 PM):** MSc in Computer Science, 4 years of experience in deep learning implementation. Expertise in PyTorch, Hugging Face Transformers, and MLflow. Hands-on experience fine-tuning transformer models (BERT, GPT-2 class) for Ukrainian NLP tasks. Will implement training scripts, RAG pipeline, and evaluation framework.

ZNU's role is strictly limited to engineering and technical activities: model architecture design, HPC training pipeline development, distributed training execution, and model evaluation — fully compliant with FFplus requirements for supporting participants.

## 4.3 Consortium Complementarity

| Capability | ALD (Main, SME) | ZNU (Supporting) |
|---|---|---|
| Domain expertise (construction) | ✅ Primary | — |
| Proprietary training data | ✅ Owner | — |
| Software development (ERP/SaaS) | ✅ Primary | — |
| Data engineering & preparation | ✅ Primary | Supporting |
| AI model architecture | Supporting | ✅ Primary |
| HPC training pipeline | — | ✅ Primary |
| Distributed training optimisation | — | ✅ Primary |
| Model evaluation methodology | Co-lead | Co-lead |
| Expert evaluation (domain) | ✅ Primary | — |
| Commercialisation & business | ✅ Primary | — |
| Project management | ✅ Primary | — |

The consortium has necessary and sufficient capabilities with clear role separation: ALD provides the business problem, data, domain expertise, and commercialisation pathway; ZNU provides AI/ML engineering and HPC expertise. There is no unnecessary overlap (each capability has a clear primary owner) and no missing capabilities (the full ML lifecycle from data preparation through evaluation is covered). Both partners bring existing infrastructure: ALD's ERP/data systems and ZNU's research computing environment for pre-training experiments.

## Justification of Costs and Resources

## 5.1 HPC Resource Requirements and Justification

CosTERRA requires 6,500 GPU-node-hours on EuroHPC AI Factory pre-exascale systems equipped with NVIDIA A100 80GB or H100 GPUs. This allocation significantly exceeds EuroHPC AI Factories playground access (typically limited to exploratory allocations of a few hundred GPU-hours) because: (1) full-parameter fine-tuning of a 7–8B parameter model requires sustained multi-GPU computation across two training phases spanning ~4,000 GPU-node-hours; (2) rigorous hyperparameter optimisation demands ~1,000 GPU-node-hours for systematic search; (3) comprehensive evaluation including baseline comparisons and ablation studies requires ~1,500 GPU-node-hours.

The consortium will apply for EuroHPC AI Factories Development Access mode [3], the most appropriate scheme for generative AI model development. EuroHPC computing resources are provided free of charge; therefore, HPC compute access does not appear as a direct cost in the budget. Should EuroHPC access experience delays, a contingency budget of €15,000 (included in ALD's other direct costs) covers temporary commercial GPU cloud access (e.g., Lambda Cloud, RunPod) to maintain project timeline. Software requirements (PyTorch, DeepSpeed, Hugging Face Transformers, MLflow, FAISS) are open-source and incur no licensing costs.

## 5.2 Cost Breakdown Narrative

**ALD Engineering & Construction LLC (€180,000):**
- *Personnel (€152,000):* 18 person-months covering Project Director (3 PM), Technical Lead (6 PM), Senior Data Engineer (5 PM), and Domain Expert (4 PM). Average loaded cost €8,444/PM reflects Ukrainian salary levels for senior technical staff.
- *Other direct costs (€28,000):* Travel to FFplus consortium events and EuroHPC coordination meetings (€8,000, 4 trips × 2 persons); specialised software licences for data processing tools — Weights & Biases enterprise for experiment tracking (€3,000); dataset preparation tools and annotation software (€2,000); contingency commercial GPU cloud access (€15,000, used only if EuroHPC access is delayed).

**ZNU — Laboratory of Parallel and Distributed Computing (€100,000):**
- *Personnel (€88,000):* 11 person-months covering Laboratory Head/AI Architect (5 PM), Senior Researcher/HPC Specialist (3 PM), and Research Engineer (3 PM). Average loaded cost €8,000/PM reflects Ukrainian academic rates for doctoral-level researchers.
- *Other direct costs (€12,000):* Travel to EuroHPC system for on-site training pipeline optimisation and FFplus events (€7,000, 3 trips × 2 persons); specialised GPU hardware for local prototyping and pre-training experiments — depreciation cost only for 1× NVIDIA A100 40GB card allocated to project (€5,000 depreciation over project period).

All costs are direct eligible costs. Indirect costs (overheads) are not claimed, consistent with FFplus rules for Third Parties. No sub-contracting costs are included. The expert evaluation of model outputs (Section 3.4, Expert Preference Score) is performed by ALD's own employees (Ms. Marchenko and two additional senior estimators on ALD's payroll), not external sub-contractors.

## 5.3 Cost Breakdown Table

| Participant | Funding Rate | Effort (PM) | Personnel Costs (€) | Other Direct Costs (€) | Total Costs (€) | Requested Funding (€) |
|---|---|---|---|---|---|---|
| ALD Engineering & Construction LLC (Main, SME) | 100% | 18 | 152,000 | 28,000 | 180,000 | 180,000 |
| ZNU — Lab of Parallel & Distributed Computing (Supporting) | 100% | 11 | 88,000 | 12,000 | 100,000 | 100,000 |
| **Total** | **100%** | **29** | **240,000** | **40,000** | **280,000** | **280,000** |

ALD receives 64.3% of total funding (>50% threshold). Total requested funding (€280,000) is within the €300,000 consortium maximum. ALD's allocation (€180,000) is within the €200,000 main participant cap. ZNU's allocation (€100,000) is within the €150,000 supporting participant cap.

## References

1. [1] European Commission, 'Solidarity with Ukraine: Digital Europe Programme open to Ukraine for access to calls for funding,' September 2022. https://digital-strategy.ec.europa.eu/en/news/solidarity-ukraine-digital-europe-programme-open-ukraine-access-calls-funding
2. [2] European Commission, 'Association Agreement with Ukraine under Digital Europe Programme,' Official Journal of the European Union, 2022.
3. [3] EuroHPC JU, 'Supercomputers Access Policy and FAQ,' 2024. https://www.eurohpc-ju.europa.eu/supercomputers/supercomputers-access-policy-and-faq_en
4. [4] H. Shylo, V. Petrov, 'Efficient Distributed Training Strategies for Deep Neural Networks on GPU Clusters,' Proceedings of the International Conference on Parallel and Distributed Computing Systems, 2024.
5. [5] H. Shylo et al., 'GPU-Accelerated Optimization of Neural Network Architectures for Resource-Constrained Environments,' Journal of Parallel and Distributed Computing, vol. 178, pp. 45–58, 2023.
6. [6] World Bank, 'Ukraine Rapid Damage and Needs Assessment,' Washington, DC, 2024. Estimated reconstruction cost: €400+ billion.
7. [7] ALD Engineering & Construction, 'Internal Technical Report: Evaluation of LLMs for Construction Cost Estimation Document Generation,' Unpublished, 2025.
8. [8] Meta AI, 'Llama 3: Open Foundation and Fine-Tuned Chat Models,' Technical Report, 2024.
9. [9] Mistral AI, 'Mistral 7B,' arXiv preprint arXiv:2310.06825, 2023.
10. [10] European Construction Industry Federation (FIEC), 'Annual Statistical Report: European Construction Activity,' 2024.
11. [11] European Commission, 'Ethics Guidelines for Trustworthy AI,' High-Level Expert Group on AI, 2019.
12. [12] Alibaba DAMO Academy, 'Qwen2.5: A Large Language Model Series,' Technical Report, 2024.
13. [13] J. Wei et al., 'Emergent Abilities of Large Language Models,' Transactions on Machine Learning Research, 2022.
14. [14] European Parliament, 'Regulation (EU) 2024/1689 — Artificial Intelligence Act,' Official Journal of the European Union, 2024.
15. [15] E. J. Hu et al., 'LoRA: Low-Rank Adaptation of Large Language Models,' arXiv preprint arXiv:2106.09685, 2021.
16. [16] P. Lewis et al., 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks,' Advances in Neural Information Processing Systems, vol. 33, 2020.
17. [17] S. Rajbhandari et al., 'ZeRO: Memory Optimizations Toward Training Trillion Parameter Models,' Proceedings of SC20, 2020.
