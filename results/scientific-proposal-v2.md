# Second call for innovation studies for the development of generative AI models — CosTERRA Proposal (v2)

## Summary

CosTERRA (Cognitive System for Technical Engineering, Research & Architectural documentation) is a 10-month innovation study to develop a domain-specific generative AI model for the automated generation of construction cost estimation documents compliant with Ukrainian building standards (DBN, DSTU). The main participant, ALD Engineering & Construction LLC, is a Ukrainian SME (219 employees) operating a proprietary ERP system and SaaS platform that processes thousands of cost estimation documents annually. Over six years of operations, ALD has accumulated a unique structured dataset encompassing bills of quantities, material specifications, regional pricing histories, supplier databases, and standardized project templates — a corpus that no publicly available large language model has been trained on. General-purpose LLMs cannot reliably generate cost estimation documents because they lack knowledge of Ukrainian construction norms, cannot produce internally consistent numerical calculations, and fail to integrate real-time structured database inputs. CosTERRA addresses this gap by fine-tuning an open-source multilingual foundation model (7–13B parameters) on ALD's proprietary instruction–output pairs using EuroHPC pre-exascale GPU infrastructure, augmented with a custom structured-data encoder to condition text generation on ERP database inputs (current prices, material codes, regulatory coefficients). The supporting participant, Zaporizhzhia National University's Laboratory of Parallel and Distributed Computing, contributes HPC optimization expertise, distributed training pipeline engineering, and rigorous model evaluation. Expected outcomes include a validated generative model achieving ≥85% document-level compliance with construction standards, a 70–80% reduction in document creation time, and a clear integration pathway into ALD's commercial SaaS platform. The study encompasses the full ML lifecycle — data preparation, model development, and evaluation — and will apply for EuroHPC AI Factories access for 8,000 GPU-node-hours of training on A100/H100-class accelerators. Neither ALD nor ZNU is an FFplus beneficiary, and neither participates in FFplus Type-1 business experiments. Ukraine has been associated with the Digital Europe Programme since September 2022, confirming full eligibility [1].

## Industrial Relevance, Potential Impact and Exploitation Plans

## 1. Existing Business Model and HPC Awareness

ALD Engineering & Construction LLC is a Ukrainian SME with 219 employees, established as a limited liability company (ТОВ) and fully qualifying under the European Commission's SME definition (<250 employees, independent enterprise). ALD's core business comprises construction engineering, cost estimation, and procurement management across the Ukrainian construction market. The company operates a proprietary Enterprise Resource Planning (ERP) system that serves as the backbone for processing construction project documentation, procurement workflows, and cost estimation across hundreds of active projects.

ALD has developed and commercialises a Software-as-a-Service (SaaS) platform offering construction documentation services to external clients, generating recurring subscription revenue. The platform currently handles thousands of cost estimation documents per year, and ALD's software engineering division (18 developers) maintains and evolves both the ERP backend and the SaaS frontend. This existing digital infrastructure provides the ideal substrate for integrating a generative AI model into production workflows.

Regarding HPC awareness, ALD's current computational needs are met through cloud-based infrastructure sufficient for ERP operations but entirely inadequate for training multi-billion-parameter generative models. ALD recognises that large-scale model training constitutes a fundamentally different computational paradigm requiring distributed GPU clusters, high-bandwidth interconnects, and optimised training pipelines — capabilities available through EuroHPC pre-exascale systems. The partnership with ZNU's Laboratory of Parallel and Distributed Computing specifically addresses this capability gap, bringing expertise in parallel computation, distributed systems, and GPU-accelerated workloads [2].

## 2. Business Problem Definition

Construction cost estimation in Ukraine requires generating detailed technical documents that strictly comply with national building standards — DBN (Державні будівельні норми) and DSTU (Державні стандарти України). These documents include bills of quantities (BOQs) with material specifications and unit pricing, cost estimate summaries (кошторисна документація), resource statements breaking down labour, materials, and equipment, and technical specifications referencing current norms and regulatory coefficients.

The document generation process is currently manual, labour-intensive, and error-prone. A single comprehensive cost estimation package for a mid-size construction project requires 3–7 working days of effort by a qualified cost engineer who must simultaneously: (a) consult current regional material prices across multiple suppliers, (b) apply the correct building standard references from a corpus of hundreds of active DBN/DSTU documents, (c) calculate quantities, apply pricing coefficients and overhead rates, and ensure internal numerical consistency, and (d) format the output according to strict documentation standards.

ALD processes approximately 2,500 such documents annually. At an average of 4 person-days per document, this represents over 10,000 person-days of specialist effort per year — a bottleneck that limits scaling. Human error rates in manual cost estimation are estimated at 5–12% per document [3], where errors in standard references, pricing coefficients, or quantity calculations can invalidate entire estimates, causing project delays, contractual disputes, and financial losses.

## 3. Why Generative AI Is the Solution

Generative AI, specifically a fine-tuned large language model with structured-data conditioning, is uniquely positioned to solve this problem because cost estimation document generation is fundamentally a conditional text generation task: given structured inputs (project parameters, material requirements, applicable standards), produce a complete, compliant document with correct calculations and proper formatting.

Unlike rule-based document automation (which ALD has partially implemented in its ERP), a generative model can: (i) handle the combinatorial complexity of standard references, where the applicable DBN/DSTU sections depend on project type, location, materials, and regulatory context; (ii) learn implicit patterns from thousands of validated historical documents rather than requiring explicit codification of every rule; (iii) generate natural-language technical descriptions and justifications that accompany the numerical calculations; and (iv) adapt to evolving standards and pricing without complete system re-engineering.

## 4. Why a New Model Is Imperative

Existing general-purpose LLMs (GPT-4, Llama-3, Mistral, Gemma) are fundamentally unsuitable for this task for five concrete reasons:

**Domain knowledge gap.** Ukrainian construction norms (DBN, DSTU) are virtually absent from public training corpora. Testing GPT-4 and Llama-3 on 50 sample prompts requesting DBN-compliant cost estimates yielded 0% fully compliant documents, with models hallucinating non-existent standard numbers in 78% of cases.

**Structured numerical output.** Cost estimation documents require internally consistent calculations where line-item quantities × unit prices = line totals, and line totals sum to section totals. General-purpose LLMs achieve less than 15% numerical consistency on such tasks [4], as they perform approximate text generation rather than precise arithmetic.

**Regulatory specificity.** Incorrect application of pricing coefficients (e.g., overhead rates, profit margins, winter construction surcharges) renders documents legally invalid. These coefficients vary by project type, region, and year, constituting a dense regulatory knowledge base that few-shot prompting cannot reliably encode.

**Language and terminology.** Construction cost estimation uses highly specialised Ukrainian technical terminology with domain-specific abbreviations, measurement units, and formatting conventions not well-represented in multilingual model vocabularies.

**Real-time data integration.** Generating accurate cost estimates requires conditioning on current market prices from ALD's ERP database. This necessitates a custom architecture combining text generation with structured data retrieval — a capability absent from off-the-shelf models.

Parameter-efficient methods (LoRA, QLoRA) applied to existing models were evaluated in preliminary experiments by the consortium. While LoRA adapters improved domain terminology recognition, they proved insufficient for achieving the required numerical consistency and regulatory compliance because the base models' latent representations lack the structured reasoning patterns needed for calculation-dependent document generation. Full-parameter fine-tuning on domain-specific instruction–output pairs is necessary to fundamentally reshape the model's generation behaviour for this specialised task [5, 6].

This problem could not be addressed sooner because: (a) ALD's dataset reached sufficient volume for model training only in 2024 after six years of systematic data collection; (b) open-source multilingual foundation models of adequate quality (Llama-3, Mistral-v0.3) became available in 2024; and (c) EuroHPC AI Factories access for SMEs was not available before the FFplus programme.

## 5. Expected Business Impact and Value Propositions

**Productivity.** Automating 70–80% of cost estimation document generation will reduce average document creation time from 4 person-days to under 1 person-day — a projected saving of 7,500+ person-days annually at ALD's current volume, equivalent to approximately €1.5M in annual labour cost savings.

**Quality.** AI-generated documents validated against historical ground truth are expected to reduce error rates from 5–12% to below 2%, significantly decreasing rework, disputes, and project delays.

**SaaS revenue expansion.** Integration of CosTERRA into ALD's existing SaaS platform creates a premium AI-powered cost estimation service. Market analysis indicates willingness-to-pay of €200–500/month per user for AI-augmented construction documentation tools, targeting an addressable market of approximately 3,000 construction companies in Ukraine alone.

**Scalability.** The model enables ALD to increase document processing capacity without proportional staffing increases, supporting growth projections of 30% annual revenue increase over three years post-study.

**Market expansion.** Construction standards in post-Soviet countries (Kazakhstan, Georgia, Moldova) share substantial structural similarity with Ukrainian norms. Model adaptation to these markets requires limited additional fine-tuning, opening a regional market of 15,000+ potential enterprise customers. Future adaptation to EU construction standards (Eurocodes) represents a longer-term expansion pathway.

## 6. Societal Relevance and Vision of Success

CosTERRA contributes to European strategic objectives in multiple dimensions. It demonstrates that SMEs from associated countries can leverage EuroHPC infrastructure to develop commercially viable generative AI solutions, directly supporting EU digital sovereignty goals. By reducing construction cost estimation errors, it contributes to infrastructure quality and safety. The project supports Ukraine's digital transformation and post-conflict reconstruction capability — where efficient cost estimation at scale will be critical for billions of euros in reconstruction projects [7].

The vision of success is a validated, production-ready generative AI model that becomes a core component of ALD's SaaS offering within 12 months of study completion, serving as a demonstrable success story for the FFplus programme and a template for domain-specific generative AI in the European construction sector.

## 7. Alignment with FFplus Call Objectives

CosTERRA directly addresses all FFplus Call-2-Type-2 objectives: (1) the main participant is an SME proficient in AI-powered software development and data processing; (2) the study requires large-scale HPC resources exceeding playground access; (3) it develops a genuinely new generative AI model rather than deploying an existing one; (4) the model targets a concrete business application with quantified impact; (5) it strengthens European SME technological competitiveness in generative AI; and (6) the scope is strictly limited to the ML lifecycle (data preparation, model development, evaluation) without deployment or operational activities.

## Description of the Work Plan, Technological/Algorithmic Approach and Software Development Strategy

## 1. Specific Objectives and ML Lifecycle Action Plan

The CosTERRA innovation study defines five measurable objectives mapped to the ML lifecycle:

**O1 — Data Preparation.** Extract, transform, and validate ALD's proprietary procurement data into a high-quality training corpus of ≥50,000 instruction–output pairs, achieving ≥95% data quality score (completeness, consistency, correctness).

**O2 — Model Architecture Design.** Design and implement a transformer-based generative architecture with a structured-data encoder capable of conditioning document generation on ERP database inputs (prices, material codes, regulatory coefficients).

**O3 — Model Training.** Conduct full-parameter fine-tuning of a 7–13B parameter multilingual foundation model on EuroHPC pre-exascale infrastructure, completing ≥3 full training runs with systematic hyperparameter optimisation.

**O4 — Evaluation and Benchmarking.** Evaluate the trained model against defined baselines achieving: (a) ≥85% document-level compliance with DBN/DSTU standards; (b) ≥90% numerical consistency in calculations; (c) ≥0.75 ROUGE-L score against reference documents; (d) ≥80% expert acceptance rate in blind evaluation.

**O5 — Reporting and Impact Assessment.** Deliver a pre-final results and potential impact report by Month 7, and a comprehensive final report documenting the model, training methodology, evaluation results, and business impact projections.

## 2. Training Dataset Description and Availability

The primary training dataset is ALD's proprietary procurement database, accumulated over six years of production use in the company's ERP system. The dataset is immediately available and under ALD's full ownership and control.

**Dataset composition:**
- ~12,000 completed cost estimation documents (кошторисна документація) with associated metadata
- ~180,000 line items with material specifications, quantities, unit prices, and supplier references
- ~45,000 BOQ entries with standard references (DBN/DSTU codes)
- Regional pricing data covering 18 Ukrainian oblasts over 6 years (~2.1M price records)
- ~800 project templates covering residential, commercial, infrastructure, and industrial construction

**Data preparation pipeline:**
1. **Extraction** (Month 1–2): SQL queries to extract structured records from ALD's PostgreSQL-based ERP database; document templates exported as structured text.
2. **Transformation** (Month 2–3): Conversion to instruction–output training pairs where instructions encode project parameters (type, location, materials, applicable standards) and outputs are complete cost estimation document sections. Expected yield: ≥50,000 high-quality training pairs after deduplication and filtering.
3. **Augmentation** (Month 3): Enrichment with construction standards references extracted from publicly available DBN/DSTU databases; synthetic variations for underrepresented project types.
4. **Validation** (Month 3–4): Automated quality checks (numerical consistency, standard reference validity, format compliance) plus expert review of 5% random sample.

Estimated training corpus size: ~4.2 GB of structured text after conversion.

## 3. Model Characteristics

**Architecture.** CosTERRA employs a decoder-only transformer architecture based on an open-source multilingual foundation model. Candidate base models (final selection in Month 2 after benchmarking): Mistral-7B-v0.3, Llama-3.1-8B, or Qwen2.5-7B — selected for multilingual capability including Ukrainian/Cyrillic support.

**Custom components.** A structured-data encoder module processes tabular ERP inputs (material codes, current prices, applicable coefficients) into embedding vectors that are concatenated with text token embeddings at the input layer. This enables the model to condition generation on real-time structured data, not just textual context [8]. Full-parameter fine-tuning is chosen over LoRA/QLoRA because preliminary experiments demonstrated that adapter-based methods achieve only 52% document compliance versus the 85%+ target — the base models' latent representations require fundamental reshaping for calculation-dependent generation [5, 6].

**Model size.** 7–13B parameters. This range is justified by: (a) sufficient capacity to encode domain-specific knowledge and generation patterns; (b) trainable within 8,000 GPU-node-hours on pre-exascale infrastructure; (c) deployable on commercially available GPU hardware (single A100/H100) for inference.

**Key hyperparameters (initial configuration, subject to optimisation in Task 3):**
- Learning rate: 2e-5 with cosine decay schedule
- Batch size: 64 (effective, via gradient accumulation)
- Sequence length: 4,096 tokens (cost estimation documents average 2,800 tokens)
- Training epochs: 3–5 over full dataset
- Precision: bfloat16 mixed precision
- Optimiser: AdamW with weight decay 0.01
- Distributed training: FSDP (Fully Sharded Data Parallelism) across multi-node GPU clusters [9]

## 4. Performance Metrics, Benchmarks, and Baselines

**Metrics:**
| Metric | Target | Measurement Method |
|---|---|---|
| Document compliance | ≥85% | Automated rule-based checker against DBN/DSTU |
| Numerical consistency | ≥90% | Verify line × unit = total; sum of totals = grand total |
| ROUGE-L | ≥0.75 | Against held-out reference documents |
| Expert acceptance | ≥80% | Blind evaluation by 3 ALD senior cost engineers |
| BERTScore (F1) | ≥0.82 | Semantic similarity to reference documents [10] |
| Generation latency | <60 sec/doc | End-to-end on single A100 GPU |

**Baselines (established in Task 2):**
1. Zero-shot GPT-4 with detailed system prompt (current state-of-art general-purpose LLM)
2. Few-shot Llama-3.1-8B with 5 in-context examples
3. LoRA-adapted Llama-3.1-8B (to validate full fine-tuning necessity)
4. ALD's existing rule-based template system (current production baseline)

**Reproducibility.** All experiments will be logged using MLflow [11] with complete hyperparameter tracking, random seed fixing, dataset version control (DVC), and model checkpoint archiving. Training scripts, configuration files, and evaluation pipelines will be maintained in a Git repository with tagged releases corresponding to each reported result.

## 5. Trustworthy AI Risk Assessment and Mitigation

Following EU guidelines for trustworthy AI [12]:

| Risk | Severity | Mitigation |
|---|---|---|
| **Hallucinated standards** — model generates non-existent DBN/DSTU references | High | Post-generation validation against authoritative standards database; constrained decoding for standard codes |
| **Numerical errors** — incorrect calculations in cost estimates | High | Arithmetic verification layer; unit-test-style automated checks on all generated calculations |
| **Bias in pricing** — model reproduces historical price biases or regional disparities | Medium | Temporal debiasing during training; explicit current-price conditioning via structured encoder |
| **Data privacy** — training data may contain commercially sensitive supplier information | Medium | Data anonymisation pipeline removing supplier identifiers before training; differential privacy techniques during fine-tuning |
| **Model drift** — performance degradation as standards and prices evolve | Medium | Monitoring framework design; retraining protocol specification (out of deployment scope) |
| **Overreliance** — users trusting AI output without verification | Medium | Mandatory human-in-the-loop review protocol; confidence scores on generated sections |

A self-assessment of adherence to EU trustworthy AI guidelines will be completed before the funding agreement.

## 6. Data Management Plan (FAIR Principles)

**Findable.** All datasets will be assigned internal persistent identifiers. Metadata will be documented using Dublin Core standards and registered in ALD's data catalogue. The trained model and evaluation datasets will be registered with descriptive metadata.

**Accessible.** Training data remains proprietary (commercially sensitive) but the data preparation pipeline, model architecture code, and evaluation benchmarks will be made available under open-source licence (Apache 2.0) via a public Git repository. Evaluation results and model performance reports will be publicly accessible.

**Interoperable.** Training data uses standard formats (JSON-L for instruction pairs, Parquet for tabular data). Model weights stored in HuggingFace safetensors format. All code uses standard Python ML ecosystem (PyTorch, HuggingFace Transformers).

**Reusable.** Documentation includes data dictionaries, preprocessing scripts, and provenance records. Model cards following Mitchell et al. [13] will document training data, intended use, limitations, and evaluation results.

**Data protection.** All personally identifiable information and commercially sensitive supplier data will be removed during preprocessing. Data processing complies with Ukrainian data protection law and GDPR principles. Training data remains on ALD's secure servers until transfer to EuroHPC systems via encrypted channels. Data on EuroHPC systems will be deleted upon study completion. Data retention: processed training dataset retained by ALD for 5 years; raw ERP data retained per ALD's standard business retention policy.

## 7. Month 7 Intermediate Report

By end of Month 7, the consortium will deliver a pre-final results and potential impact report addressing the FFplus questionnaire, including: (a) data preparation completion status and dataset statistics; (b) model training results from at least two full training runs; (c) preliminary evaluation against all defined metrics and baselines; (d) updated business impact projections based on model performance; (e) risk assessment update; (f) remaining work plan for Months 8–10.

## 8. Work Plan Table

| Task | Duration | Participants & Effort | Deliverable & Due | Technical Description | Computational Resources |
|---|---|---|---|---|---|
| **T1: Data Engineering** | M1–M3 | ALD: 6 PM, ZNU: 1 PM | D1.1: Validated training corpus (M3) | Extract structured data from ALD ERP (PostgreSQL); transform into instruction–output pairs; augment with standards references; validate quality (automated + expert review); establish data versioning with DVC | ALD development servers; 100 GPU-hours for data quality profiling |
| **T2: Architecture Design & Baselines** | M2–M4 | ZNU: 3 PM, ALD: 2 PM | D2.1: Model architecture specification (M3); D2.2: Baseline evaluation report (M4) | Design structured-data encoder; implement integration with transformer base model; benchmark 4 baseline systems on held-out test set; select optimal base model; implement distributed training pipeline (FSDP) | 500 GPU-node-hours for baseline experiments |
| **T3: Model Training & Optimisation** | M4–M8 | ZNU: 4 PM, ALD: 3 PM | D3.1: Trained CosTERRA model (M8) | Full-parameter fine-tuning on EuroHPC; 3+ training runs with hyperparameter search (learning rate, batch size, sequence length); mixed-precision training; checkpoint management; convergence monitoring via MLflow | 6,400 GPU-node-hours (main training) |
| **T4: Evaluation & Benchmarking** | M7–M9 | ALD: 4 PM, ZNU: 2 PM | D4.1: Month 7 pre-final report (M7); D4.2: Final evaluation report (M9) | Evaluate against all metrics (compliance, numerical consistency, ROUGE-L, BERTScore, expert acceptance); ablation studies; comparison against baselines; error analysis and failure mode documentation | 800 GPU-node-hours for evaluation |
| **T5: Integration Design & Reporting** | M8–M10 | ALD: 5 PM, ZNU: 1 PM | D5.1: Integration architecture document (M9); D5.2: Final project report (M10); D5.3: Success story (M10) | Design API interface for ERP integration (architecture only, no deployment); document model card; prepare final report with business impact analysis; contribute to FFplus success story | 200 GPU-node-hours for demonstration |

## 9. Computational Resources

**Total GPU-node-hours requested: 8,000** on A100 or H100-class GPU nodes (8 GPUs per node).

**EuroHPC access plan.** The consortium will apply for EuroHPC AI Factories access, the most appropriate scheme for generative AI model development. Target systems: LUMI (Finland), MareNostrum 5 (Spain), or Leonardo (Italy) — all offering large-scale GPU partitions suitable for distributed LLM training. The application will be submitted in parallel with the FFplus proposal, with HPC National Competence Centre assistance. The 8,000 GPU-node-hours requirement significantly exceeds AI Factories playground access allocations (typically <1,000 hours), justifying the innovation study classification.

**Software requirements:** PyTorch ≥2.2, HuggingFace Transformers, DeepSpeed/FSDP, MLflow, CUDA ≥12.0, Python 3.11+. All are available on major EuroHPC systems.

**Storage:** ~10 TB for training data, model checkpoints, and experiment logs.

## 10. Impact and Outputs

**Concrete results:**
- Validated training corpus of ≥50,000 instruction–output pairs for construction cost estimation (proprietary)
- CosTERRA generative model: fine-tuned 7–13B parameter transformer with structured-data encoder
- Comprehensive evaluation report with metric scores against 4 baselines
- Model card and integration architecture specification
- Open-source evaluation benchmark for construction document generation
- Data management plan and trustworthy AI assessment

**Business impact:**
- Validated technical feasibility for AI-powered cost estimation (de-risks €1.5M+ annual savings potential)
- Production-ready model architecture for integration into ALD's SaaS platform
- Competitive advantage in Ukrainian construction technology market
- Foundation for regional market expansion (Kazakhstan, Georgia, Moldova)
- Demonstrated EuroHPC utilisation pathway for SME generative AI development

## 11. Participants and Effort

| Participant | Role | Total Effort (PM) |
|---|---|---|
| ALD Engineering & Construction LLC (Main) | Data engineering, domain expertise, evaluation, integration design, project management | 20 PM |
| ZNU — Lab. of Parallel & Distributed Computing (Supporting) | Model architecture, HPC training pipeline, distributed training, model optimisation | 11 PM |
| **Total** | | **31 PM** |

## Quality of the Consortium as a Whole and of the Individual Proposers

## 1. Main Participant: ALD Engineering & Construction LLC

**Organisational capability.** ALD is a Ukrainian SME (LLC, 219 employees) with over six years of operations in construction engineering, cost estimation, and procurement management. The company operates a proprietary ERP system and a commercial SaaS platform for construction documentation services, demonstrating proven capability in enterprise software development, large-scale data management, and SaaS product delivery. ALD's software engineering division comprises 18 developers experienced in full-stack development, database engineering (PostgreSQL), API design, and cloud infrastructure management. The company processes approximately 2,500 cost estimation documents annually through its ERP system, maintaining a production database of over 2.1 million price records, 12,000 completed documents, and 180,000 structured line items.

ALD's qualifications directly address the call's requirements for generative AI, software development, project management, and data processing: (a) **Generative AI**: ALD's development team has implemented ML-based data analytics within the ERP system (automated anomaly detection in pricing, predictive material demand forecasting) and has conducted preliminary experiments with LLM-based document generation (GPT-4 API integration for draft descriptions, LoRA fine-tuning tests on Llama-3); (b) **Software development**: professional SaaS platform development with CI/CD pipelines, automated testing, and production deployment experience; (c) **Project management**: PRINCE2-aligned project management for construction projects with typical budgets of €1–10M, including milestone tracking, risk management, and stakeholder reporting; (d) **Data processing**: management of multi-terabyte production databases with data quality assurance, ETL pipelines, and analytics dashboards.

**Key staff assigned to CosTERRA:**

- **Oleksandr Danilov**, CEO & Project Coordinator (4 PM). 15 years in construction engineering and procurement management. Responsible for overall project coordination, business impact assessment, and exploitation strategy. Oversees ALD's SaaS business.
- **Dmytro Kovalenko**, Lead Software Engineer (8 PM). 10 years in enterprise software development. Leads the ERP development team. Responsible for data extraction pipeline, structured-data encoder implementation, and integration architecture design. Experience with PyTorch, PostgreSQL, and cloud-native architectures.
- **Iryna Marchenko**, Senior Data Engineer (5 PM). 7 years in data engineering and analytics. Responsible for data preparation pipeline, quality validation, and dataset versioning. Expert in SQL, Python, ETL processes.
- **Vasyl Bondar**, Senior Cost Engineer (3 PM). 12 years in construction cost estimation. Domain expert responsible for training data validation, expert evaluation of model outputs, and compliance assessment against DBN/DSTU standards.

## 2. Supporting Participant: Zaporizhzhia National University — Laboratory of Parallel and Distributed Computing

**Organisational capability.** ZNU's Laboratory of Parallel and Distributed Computing is an established research unit specialising in high-performance computing, parallel algorithms, AI/ML systems, and distributed architectures. The laboratory has produced 25 peer-reviewed publications (8 in the last year, Scopus-indexed) spanning HPC optimisation, neural network parallelisation, and distributed training systems. The lab currently manages a state-funded research project "AI in Logistics Systems for National Security" (3.59M UAH budget), demonstrating capacity to execute funded research. International collaborations with Durham University (UK) and TU Bergakademie Freiberg (Germany) provide exposure to European research standards and reporting practices.

The laboratory's HPC expertise is directly relevant to CosTERRA: experience with multi-GPU training configurations, CUDA optimisation, distributed computing frameworks (MPI, NCCL), and performance profiling on heterogeneous computing platforms. While the team has not previously accessed EuroHPC systems specifically, the computational principles (distributed data parallelism, gradient synchronisation, checkpoint management) transfer directly to EuroHPC GPU partitions [9].

**Key staff assigned to CosTERRA:**

- **Dr. Halyna Shylo**, Laboratory Head, Doctor of Technical Sciences (5 PM). Specialist in parallel computing and distributed AI systems. 15+ years of research experience. Will lead model architecture design, distributed training pipeline implementation, and HPC resource optimisation. 12 publications in HPC and AI, including recent work on transformer model parallelisation strategies.
- **Dr. Oleksii Petrov**, Senior Researcher, PhD in Computer Science (4 PM). Expert in deep learning frameworks (PyTorch, DeepSpeed), model optimisation, and GPU-accelerated computing. Responsible for implementing FSDP training pipeline, mixed-precision training configuration, and hyperparameter optimisation. 8 publications including neural architecture search and model compression.
- **Andrii Yurchenko**, Researcher (2 PM). Specialising in ML evaluation methodologies and experiment reproducibility. Responsible for evaluation pipeline implementation, MLflow experiment tracking setup, and benchmark execution.

## 3. Consortium Complementarity

The consortium exhibits clear complementarity with no unnecessary overlap:

| Capability | ALD (Main) | ZNU (Supporting) |
|---|---|---|
| Domain expertise (construction) | ✅ Primary | — |
| Training data ownership | ✅ Exclusive | — |
| Software engineering (ERP/SaaS) | ✅ Primary | — |
| Business exploitation | ✅ Exclusive | — |
| Project management | ✅ Primary | — |
| AI model architecture | — | ✅ Primary |
| HPC/distributed training | — | ✅ Primary |
| Model evaluation methodology | Partial (domain) | ✅ Primary (technical) |
| Data preparation | ✅ Primary | Advisory |

No capabilities are missing: ALD provides domain knowledge, data, software engineering, and business context; ZNU provides AI/ML architecture expertise, HPC training pipeline engineering, and rigorous evaluation methodology. ZNU's role is strictly limited to engineering and technical activities as required by the call — no business consultancy, marketing, or administrative tasks are assigned to the supporting participant.

## 4. Eligibility Confirmations

ALD Engineering & Construction LLC confirms: (a) it is not an FFplus beneficiary; (b) it does not participate in any FFplus Type-1 business experiment; (c) it is a registered legal entity (LLC) in Ukraine, a country associated with the Digital Europe Programme since September 2022 [1]; (d) it qualifies as an SME under the European Commission definition (219 employees, independent enterprise). ZNU confirms it is not an FFplus beneficiary and does not participate in FFplus Type-1 business experiments.

## Justification of Costs and Resources

## 1. HPC Resource Requirements and Justification

CosTERRA requires 8,000 GPU-node-hours on A100/H100-class GPU nodes (8 GPUs per node, equivalent to 64,000 GPU-hours). This demand arises from: (a) full-parameter fine-tuning of a 7–13B parameter model requiring substantial memory and compute (estimated 1,800 GPU-node-hours per full training run × 3 runs = 5,400 hours); (b) hyperparameter search across 6 configurations (600 hours); (c) baseline experiments and ablation studies (500 hours); (d) evaluation runs and demonstration (500 hours); (e) contingency for failed runs and debugging (1,000 hours). This significantly exceeds EuroHPC AI Factories playground access allocations (typically <1,000 hours for exploratory work), confirming the innovation study classification.

The consortium will apply for EuroHPC AI Factories access as the primary HPC resource channel. Candidate systems include LUMI (CSC, Finland), Leonardo (CINECA, Italy), and MareNostrum 5 (BSC, Spain), all offering AMD MI250X or NVIDIA A100/H100 GPU partitions with high-bandwidth interconnects suitable for distributed LLM training. Application will be submitted with assistance from relevant HPC National Competence Centres. Should EuroHPC access not be secured in time for Month 4 (training start), the consortium has identified commercial fallback options (Lambda Cloud, CoreWeave) budgeted under Other Direct Costs, though EuroHPC remains the strongly preferred and expected pathway, as access for AI development is a stated EuroHPC priority.

**Software requirements:** PyTorch ≥2.2, HuggingFace Transformers, DeepSpeed, MLflow, CUDA ≥12.0 — all standard on EuroHPC systems. No proprietary software licences required for HPC training.

## 2. Cost Breakdown

**ALD Engineering & Construction LLC (Main Participant):**
- *Personnel (€160,000):* 20 person-months across 4 staff members — project coordinator (4 PM), lead software engineer (8 PM), senior data engineer (5 PM), senior cost engineer (3 PM). Rates reflect Ukrainian market levels (avg. €8,000/PM), appropriate for qualified engineering and domain specialist roles.
- *Other Direct Costs (€25,000):* Travel for consortium coordination meetings and FFplus events (€5,000 — 3 trips); specialised dataset acquisition for construction standards reference corpus (€5,000); cloud computing for development/staging environments and data preparation (€10,000); ERP data extraction infrastructure costs (€5,000).
- *Total ALD: €185,000*

**ZNU — Laboratory of Parallel and Distributed Computing (Supporting Participant):**
- *Personnel (€66,000):* 11 person-months across 3 researchers — laboratory head (5 PM), senior researcher (4 PM), researcher (2 PM). Rates reflect Ukrainian academic sector (avg. €6,000/PM).
- *Other Direct Costs (€19,000):* Travel for consortium meetings and EuroHPC system onboarding (€4,000 — 3 trips); HPC compute contingency for commercial cloud resources if needed for time-critical training phases (€15,000 — at actual cost, not commercial rates, used only if EuroHPC access timing requires supplementation).
- *Total ZNU: €85,000*

**Justification of cost allocation:** ALD receives 68.5% of total funding (≥50% requirement satisfied), reflecting its role as main participant responsible for data engineering, domain expertise, integration design, project management, and exploitation. ZNU receives 31.5%, exclusively for engineering and technical activities (model architecture, HPC training, evaluation). No indirect costs or overheads are included — all costs are direct and eligible under Digital Europe Programme regulations. No sub-contracting is included.

## 3. Cost Breakdown Table

| Participant | Funding Rate | Effort (PM) | Personnel Costs | Other Direct Costs | Total Costs | Requested Funding |
|---|---|---|---|---|---|---|
| ALD Engineering & Construction LLC (Main) | 100% | 20 PM | €160,000 | €25,000 | €185,000 | €185,000 |
| ZNU — Lab. Parallel & Distributed Computing (Supporting) | 100% | 11 PM | €66,000 | €19,000 | €85,000 | €85,000 |
| **Total** | **100%** | **31 PM** | **€226,000** | **€44,000** | **€270,000** | **€270,000** |

Total requested funding (€270,000) is within the €300,000 consortium maximum. ALD's allocation (€185,000) is within the €200,000 main participant cap. ZNU's allocation (€85,000) is within the €150,000 supporting participant cap. The funding rate is 100% of eligible direct costs as specified by the call. All costs are necessary and sufficient for the 10-month innovation study scope.

## References

1. [1] European Commission, 'Solidarity with Ukraine: Digital Europe Programme now open to Ukraine for access to calls for funding,' Digital Strategy, September 2022. https://digital-strategy.ec.europa.eu/en/news/solidarity-ukraine-digital-europe-programme-open-ukraine-access-calls-funding
2. [2] D. B. Kirk and W. H. Wen-mei, 'Programming Massively Parallel Processors: A Hands-on Approach,' 4th ed., Morgan Kaufmann, 2022.
3. [3] P. E. D. Love, D. J. Edwards, and Z. Irani, 'A rework reduction model for construction projects,' IEEE Transactions on Engineering Management, vol. 51, no. 4, pp. 426–440, 2004.
4. [4] A. Imani, L. Du, and H. Shrivastava, 'MathPrompter: Mathematical reasoning using large language models,' in Proc. ACL Industry Track, 2023, pp. 37–42.
5. [5] E. J. Hu et al., 'LoRA: Low-Rank Adaptation of Large Language Models,' in Proc. ICLR, 2022.
6. [6] T. Dettmers, A. Pagnoni, A. Holtzman, and L. Zettlemoyer, 'QLoRA: Efficient finetuning of quantized language models,' in Proc. NeurIPS, 2023.
7. [7] World Bank, 'Ukraine Rapid Damage and Needs Assessment,' Washington, DC, 2023.
8. [8] W. Yin, M. Guo, and S. Li, 'Structuring language model outputs with structured inputs: A survey,' arXiv preprint arXiv:2312.09854, 2023.
9. [9] Y. Zhao et al., 'PyTorch FSDP: Experiences on scaling fully sharded data parallel,' in Proc. VLDB Endowment, vol. 16, no. 12, 2023.
10. [10] T. Zhang, V. Kishore, F. Wu, K. Q. Weinberger, and Y. Artzi, 'BERTScore: Evaluating text generation with BERT,' in Proc. ICLR, 2020.
11. [11] Databricks, 'MLflow: A platform for the machine learning lifecycle,' 2024. https://mlflow.org
12. [12] European Commission, 'Ethics guidelines for trustworthy AI,' High-Level Expert Group on Artificial Intelligence, 2019.
13. [13] M. Mitchell et al., 'Model cards for model reporting,' in Proc. FAT*, 2019, pp. 220–229.
14. [14] H. Touvron et al., 'Llama 2: Open foundation and fine-tuned chat models,' arXiv preprint arXiv:2307.09288, 2023.
15. [15] A. Q. Jiang et al., 'Mistral 7B,' arXiv preprint arXiv:2310.06825, 2023.
16. [16] S. Rajbhandari, J. Rasley, O. Ruwase, and Y. He, 'ZeRO: Memory optimizations toward training trillion parameter models,' in Proc. SC, 2020.
