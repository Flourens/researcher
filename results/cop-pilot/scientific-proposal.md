# SmartLoop — Closed-Loop Building Automation Service for Municipal Facility Management

**Cluster**: CL2 — Smart Sustainable IoT Solutions (Valencia)
**Challenge**: OC#2.4 — Municipal Buildings Management
**Consortium**: ALD Engineering & Construction LLC (Lead SME) + Zaporizhzhia National University (Research Partner)
**Duration**: 8 months + 2 months reporting | **Budget**: EUR 200,000

---

## Project Summary

**Project Title:** SmartLoop — Closed-Loop Building Automation Service for Municipal Facility Management
**Acronym:** SmartLoop
**Target Cluster:** CL2 — Smart Sustainable IoT Solutions (Valencia)
**Target Challenge:** OC#2.4 — Municipal Buildings Management

Municipal buildings in Valencia are equipped with IoT sensors feeding data into the FIWARE Thinking Cities platform, yet facility managers lack an automation layer that converts sensor telemetry into energy-saving actions. COP-PILOT's own assessment confirms: "What is still missing is the closed-loop automation layer that turns insights into direct operational impact." SmartLoop addresses this gap with a containerized, config-driven edge service providing two automation levels. **Level 1** (fully automated) executes deterministic rules—lighting off when unoccupied, ventilation reduction below CO₂ thresholds, automated schedule switching—delivering 10–15% energy savings from day one without ML training data. **Level 2** (human-in-the-loop) layers ML-driven recommendations—HVAC optimization, anomaly detection, predictive pre-conditioning—where facility managers approve or reject actions via a purpose-built dashboard. SmartLoop subscribes to and publishes through the Orion Context Broker using NGSI-LD, integrates with COP-PILOT's ESO for lifecycle orchestration and SIF for zero-trust networking, and is deployed as Helm charts on the CL2 Kubernetes cluster. A YAML configuration file per building makes the service universally replicable to any FIWARE-connected facility. The consortium—ALD Engineering (Ukrainian SME, 18 developers, building domain expertise) and ZNU (AI/ML research laboratory)—targets progression from TRL 6 to TRL 7 within 8 months. Expected outcomes: ≥15% energy reduction in the pilot building, <30-second anomaly detection latency, ≥90% detection accuracy, two open-access publications, and a fully open-source reference implementation on GitHub (Apache 2.0).

---

## 1. Excellence

### 1.1.1 Concept and Objectives

## 1.1.1 Concept and Objectives

### Problem Statement
Valencia's municipal buildings consume significant energy yet remain manually managed. COP-PILOT Cluster 2 has deployed IoT sensors and the FIWARE Thinking Cities platform (Orion Context Broker, IoT Agents) in facilities such as La Harinera, generating rich telemetry streams for temperature, humidity, CO₂, occupancy, and energy consumption. However, OC#2.4 explicitly identifies the missing piece: a **closed-loop automation layer** that translates building analytics into direct operational impact—HVAC control, equipment scheduling, and anomaly-triggered maintenance. Without this layer, sensor data remains informational rather than actionable, and energy waste persists.

### Methodology: Two-Level Automation
SmartLoop introduces a **progressive automation architecture** that de-risks deployment while maximizing impact:

**Level 1 — Deterministic Rule Engine (fully automated, no ML required):**
A config-driven rule engine executes predefined actions based on real-time NGSI-LD entity states. Rules are expressed in YAML per building and evaluated every 30 seconds against Context Broker subscriptions. Examples: (i) lighting off when occupancy = 0 for >15 min; (ii) ventilation reduced when CO₂ < 600 ppm AND occupancy = 0; (iii) automatic night/weekend mode switching. Level 1 is functional from deployment day, requiring zero historical data.

**Level 2 — ML-Driven Recommendations (human-in-the-loop):**
After 4–6 weeks of Level 1 data collection, ML models trained by ZNU generate recommendations displayed on the Facility Manager Dashboard: (i) HVAC setpoint optimization with estimated savings; (ii) anomaly alerts with probable root cause; (iii) predictive pre-conditioning based on weather forecasts and learned occupancy patterns. Facility managers approve, modify, or reject each recommendation, creating a feedback loop that improves model accuracy over time.

**Data Flow:** IoT sensors → FIWARE IoT Agents (MQTT/HTTP) → Orion Context Broker (NGSI-LD) → SmartLoop subscription → Rule/ML Engine → actuation commands published as NGSI-LD entities → IoT Agents → building actuators (HVAC, lighting, ventilation).

### Alignment with COP-PILOT and CL2
SmartLoop directly validates the COP-PILOT platform's ability to orchestrate closed-loop IoT services across edge infrastructure. It leverages four core platform components (Orion CB, ESO, SIF, LLM Portal), deploys on CL2's Kubernetes cluster at UPV Campus, and uses the existing FIWARE Thinking Cities infrastructure. The project demonstrates that COP-PILOT can host third-party building automation services—a key platform validation objective.

### SMART Objectives and KPIs

| ID | Objective | Metric | Target | Timeframe |
|----|-----------|--------|--------|-----------|
| O1 | Deploy Level 1 rule engine on CL2 K8s with live NGSI-LD integration | Successful deployment with ≥5 active rules | Binary (achieved/not) | M5 |
| O2 | Reduce pilot building energy consumption | Measured kWh reduction vs. baseline | ≥15% reduction | M8 |
| O3 | Achieve real-time anomaly detection | Time from anomaly onset to alert | <30 seconds | M7 |
| O4 | Demonstrate ML anomaly detection accuracy | F1-score on labeled test set | ≥0.90 | M8 |
| O5 | Validate facility manager usability | System Usability Scale (SUS) score | ≥70/100 | M8 |
| O6 | Release open-source reference implementation | GitHub repository, Apache 2.0, CI passing | Public release | M8 |
| O7 | Progress TRL from 6 to 7 | Operational validation in Valencia municipal building | TRL 7 confirmed | M8 |

### Success Measurement
Energy savings are measured by comparing metered consumption during SmartLoop operation (M6–M8) against a 4-week baseline (M5). Anomaly detection is evaluated against a labeled dataset of injected and natural anomalies. Usability is assessed through structured interviews and SUS questionnaires with 3–5 facility management staff. All KPIs are reported quantitatively in the M4 intermediate and M9 final reports.

### 1.1.2 State of the Art and Innovation

## 1.1.2 State of the Art and Innovation

### Existing Solutions and Their Limitations

**Commercial BMS platforms** (Siemens Desigo CC, Honeywell Niagara, Johnson Controls Metasys) provide closed-loop control but are proprietary, vendor-locked, and prohibitively expensive for municipal budgets. They use closed protocols (BACnet/IP within vendor ecosystems), resist integration with open IoT platforms, and require specialized commissioning per installation [1].

**FIWARE-based monitoring deployments** in Valencia (Thinking Cities platform) and elsewhere successfully aggregate IoT data via Orion Context Broker but stop at visualization dashboards. The COP-PILOT consortium explicitly identifies this gap: telemetry is collected but not actuated upon. No existing FIWARE component provides building-specific closed-loop automation [2, 3].

**Research prototypes** for ML-driven building optimization (DeepMind/Google [4], BuildSys community [5]) demonstrate energy savings of 20–40% but operate in controlled data-center or single-building environments, require months of training data, and are not designed for multi-building replicability or integration with standardized IoT platforms like FIWARE.

### SmartLoop Innovations Beyond State of the Art

| # | Innovation | Advancement |
|---|-----------|-------------|
| 1 | **Two-level progressive automation** | Unlike commercial BMS (pure control) or research prototypes (pure ML), SmartLoop combines deterministic rules (immediate, zero-data) with ML recommendations (learned, human-approved), ensuring value from day one while building toward intelligent optimization. |
| 2 | **Config-driven universality** | A single YAML file per building parameterizes the entire service (sensors, zones, HVAC type, comfort ranges, rules). No code changes required for new buildings—unprecedented in FIWARE ecosystem where each deployment is custom-coded. |
| 3 | **Native NGSI-LD closed-loop** | SmartLoop is the first building automation service designed end-to-end around NGSI-LD data models (FIWARE Smart Data Models: Building, BuildingSpace, Device), both consuming and producing context entities, enabling any NGSI-LD-aware component to participate in the control loop. |
| 4 | **Human-in-the-loop ML with explainability** | Level 2 presents recommendations with estimated impact ("save €45/week"), confidence scores, and reasoning, enabling facility managers to build trust incrementally rather than requiring blind automation adoption. |
| 5 | **Edge-native containerized deployment** | Packaged as Helm charts for Kubernetes, SmartLoop runs at the edge with sub-second latency, unlike cloud-dependent BMS solutions. This advances the Cloud-Edge-IoT continuum vision of COP-PILOT and ETSI ZSM. |

### TRL Progression
SmartLoop enters at **TRL 6**: ALD has pre-prototyped the NGSI-LD subscription adapter and rule engine against a local Orion Context Broker instance, and ZNU has validated anomaly detection models on the Building Data Genome 2.0 open dataset [6]. The project targets **TRL 7**: system prototype validated in an operational Valencia municipal building with real sensors, real actuators, and real facility managers over a 3-month pilot.

### 1.1.3 Relevance to COP-PILOT Scope

## 1.1.3 Relevance to COP-PILOT Scope

### Cluster and Challenge Mapping

| OC#2.4 Requirement | SmartLoop Response |
|---------------------|--------------------|
| Closed-loop automation layer | Level 1 rule engine executes automated control; Level 2 provides ML-driven recommendations with human approval |
| Direct operational impact (HVAC, scheduling) | Actuation commands published as NGSI-LD entities routed to building HVAC, lighting, ventilation via IoT Agents |
| Anomaly detection and maintenance triggering | Autoencoder + isolation forest models detect consumption anomalies within <30s; automatic maintenance ticket generation |
| Energy savings in municipal buildings | Targeted ≥15% reduction measured against metered baseline |

### Integration with COP-PILOT Platform Components

**Orion Context Broker (NGSI-LD):** SmartLoop's primary data interface. It creates NGSI-LD subscriptions for sensor entities (temperature, CO₂, occupancy, energy) and publishes actuation entities (SetpointCommand, ScheduleOverride, AnomalyAlert) using FIWARE Smart Data Models. All data exchange complies with ETSI CIM NGSI-LD specification [7].

**Edge Service Orchestrator (ESO):** SmartLoop registers as an orchestrated service via the ESO's git-based CI pipeline. ESO manages the service lifecycle (deploy, scale, update, rollback), monitors SLA compliance (latency <1s, availability >99.5%), and triggers scaling when rule evaluation load increases. SmartLoop exports Prometheus metrics for ESO consumption.

**Secure Interconnection Fabric (SIF):** All communication between SmartLoop containers and the Orion CB traverses the SIF's OpenZiti zero-trust overlay. SmartLoop uses mTLS with X.509 certificates provisioned via CNCF SPIFFE, ensuring no plaintext sensor or actuation data crosses network boundaries.

**LLM Portal:** SmartLoop's API catalog and configuration schema are registered in the LLM Portal, enabling natural-language queries ("What is the energy consumption trend in Building X?") to be routed to SmartLoop's REST endpoints. The portal also surfaces anomaly alerts to operators using conversational interfaces.

**TMForum APIs:** SmartLoop exposes TMF633 (Service Catalog) and TMF641 (Service Ordering) interfaces, enabling standardized onboarding into COP-PILOT's service marketplace.

### New Capabilities Provided to the Platform
- First closed-loop building automation service in the COP-PILOT catalog
- Reference NGSI-LD actuation pattern (subscribe → decide → publish command) reusable by other services
- Config-driven multi-building deployment template (YAML + Helm) as platform blueprint
- Labeled anomaly dataset from Valencia pilot available to the COP-PILOT data commons

### Cross-Sector Replicability
SmartLoop's config-driven architecture is domain-agnostic: the YAML configuration can describe any facility with IoT sensors and actuators. Direct replication targets include CL2 port warehouses (cold-chain HVAC), CL1 industrial facilities (Almussafes), and CL3 smart campus buildings. The NGSI-LD interface ensures compatibility with any FIWARE-connected city platform across Europe.

### 1.1.4 Data Management

## 1.1.4 Data Management

| Data Category | Format | Volume | Source | Personal Data? |
|--------------|--------|--------|--------|----------------|
| Environmental telemetry (temp, humidity, CO₂) | NGSI-LD JSON | ~50 MB/month | Building IoT sensors via Orion CB | No |
| Energy consumption (metered kWh) | NGSI-LD JSON | ~10 MB/month | Smart meters via IoT Agents | No |
| Occupancy counts (aggregated, anonymized) | NGSI-LD JSON | ~5 MB/month | PIR/radar sensors | No (aggregated) |
| Actuation commands and logs | NGSI-LD JSON | ~2 MB/month | SmartLoop rule/ML engine | No |
| ML model artifacts | ONNX, pickle | ~500 MB total | ZNU training pipeline | No |

**FAIR Compliance:**
- **Findable:** All datasets registered in Zenodo with DOIs and metadata
- **Accessible:** Open access via GitHub (code, configs), Zenodo (datasets), CKAN (building telemetry)
- **Interoperable:** NGSI-LD format with FIWARE Smart Data Models ensures cross-platform compatibility
- **Reusable:** Apache 2.0 license for code; CC-BY 4.0 for datasets; documentation includes schema definitions

**GDPR:** Only aggregated, non-personal occupancy counts are processed (room-level totals, no individual tracking). A Data Protection Impact Assessment is included in Annex IV. Privacy-by-design: no cameras, no biometric data, no personally identifiable information collected.

### 1.2 Infrastructure Requirements

## 1.2 Infrastructure Requirements

**Table 1: COP-PILOT Infrastructure**

| Component | Requirement | Duration | Access |
|-----------|------------|----------|--------|
| UPV Campus K8s cluster | Deploy SmartLoop Helm charts (3 pods) | M3–M9 | Continuous |
| Orion Context Broker (CL2) | NGSI-LD subscriptions + entity publication | M2–M9 | Continuous |
| ESO | Service registration, lifecycle mgmt, SLA monitoring | M4–M9 | Continuous |
| SIF (OpenZiti) | Zero-trust overlay for all service communication | M3–M9 | Continuous |
| LLM Portal | API catalog registration, conversational interface | M6–M9 | Periodic |
| Pilot building IoT sensors | Temperature, CO₂, occupancy, energy sensors (existing) | M5–M8 | Continuous |
| Pilot building actuators | HVAC setpoint, lighting relay, ventilation damper control | M5–M8 | Continuous |

**Table 2: Compute and Storage**

| Resource | Specification |
|----------|---------------|
| CPU | 4 vCPU (rule engine + API) + 4 vCPU (ML inference) |
| GPU | Not required (inference uses ONNX Runtime on CPU) |
| RAM | 8 GB (rule engine) + 8 GB (ML service) |
| Storage | 50 GB persistent (telemetry buffer, model artifacts, logs) |
| Network | 10 Mbps sustained; <50 ms latency to Orion CB |

**Table 3: Protocols and Standards**

| Standard | Usage |
|----------|-------|
| NGSI-LD (ETSI CIM) | All Context Broker interactions |
| MQTT v3.1.1/v5 | IoT sensor ingestion via FIWARE IoT Agents |
| REST/HTTP | Dashboard API, TMForum API endpoints |
| OAuth 2.0 / OpenID Connect | Authentication via Keycloak |
| TMF633, TMF641 | Service catalog and ordering |
| Helm v3 / Docker OCI | Containerized deployment |
| Prometheus / OpenMetrics | Performance metrics export to ESO |
| CNCF SPIFFE | Workload identity for SIF integration |

**Data Requirements:** SmartLoop requires access to existing CL2 IoT sensor data streams from the pilot municipal building via Orion CB subscriptions. No proprietary datasets are needed. The project will generate a labeled anomaly dataset (~100 MB) shared via CKAN and Zenodo.

---

## 2. Impact

### 2.1 Expected Impact and Sustainability

## 2.1 Expected Impact and Sustainability

### Technical Impact
SmartLoop validates COP-PILOT's core proposition: third-party services can be onboarded, orchestrated, and operated through the platform's open interfaces. It provides the **first closed-loop building automation reference implementation** in the FIWARE ecosystem, demonstrating the NGSI-LD subscribe-decide-actuate pattern. The config-driven YAML + Helm deployment template becomes a reusable platform blueprint for future building services.

### Economic Impact
A typical Valencia municipal building (2,000 m², €40,000/year energy cost) achieving 15% savings yields **€6,000/year per building**. Valencia operates ~120 municipal buildings; city-wide deployment potential: **€720,000/year**. SmartLoop's marginal deployment cost per additional building is <€2,000 (configuration + validation), yielding ROI within 4 months. Post-project, ALD plans to offer SmartLoop as a commercial SaaS product integrated with its existing construction platform, targeting European municipal clients via FIWARE marketplace.

### Scientific Impact
- **Publication 1:** "Config-Driven Closed-Loop Building Automation over NGSI-LD" — targeting *Building and Environment* (IF 7.1) or *IoT Journal* (IEEE)
- **Publication 2:** "Transfer Learning for Building Anomaly Detection with Limited Operational Data" — targeting *Energy and Buildings* (IF 7.2)
- **Open dataset:** Labeled building telemetry + anomaly dataset from Valencia pilot (Zenodo, CC-BY 4.0)

### Environmental Impact
15% energy reduction in the pilot building corresponds to approximately **5–8 tonnes CO₂/year** (assuming Valencia's electricity emission factor of 0.21 kg CO₂/kWh). Scaled to 120 municipal buildings: **600–960 tonnes CO₂/year**, directly supporting Valencia's 2030 carbon neutrality target. The EU Energy Performance of Buildings Directive (EPBD recast, 2024) mandates building automation for non-residential buildings >290 kW—SmartLoop provides a cost-effective compliance pathway [8].

### Dissemination Plan

| Channel | Action | Timeline |
|---------|--------|----------|
| GitHub | Open-source release (Apache 2.0), code + Helm charts + YAML templates | M8 |
| Zenodo | Anomaly dataset + model artifacts (CC-BY 4.0) | M8 |
| Journal papers | 2 submissions to Q1 journals | M8–M10 |
| COP-PILOT events | Presentations at consortium meetings, webinars | M4, M9 |
| FIWARE Summit | Demo + poster at annual FIWARE event | M9–M12 |
| Smart City Expo | Presentation at World Congress (Barcelona) | M10–M14 |
| ALD website + LinkedIn | Blog posts, case study, video demo | M6, M8, M9 |

### Sustainability After Project
ALD will maintain SmartLoop as open-source software with a commercial support tier. The SaaS dashboard integrates into ALD's existing cloud platform, leveraging its 18-developer team for ongoing maintenance. ZNU continues ML model refinement through follow-on research. The YAML-based configuration model enables community-driven expansion to new building types without core development.

### 2.2 Expected Outcomes

## 2.2 Expected Outcomes

### Fit with COP-PILOT Goals

**Platform validation:** SmartLoop validates the full COP-PILOT service lifecycle—onboarding via git-based CI pipeline, orchestration via ESO, secure communication via SIF, and user interaction via LLM Portal—in a real municipal building scenario.

**Ecosystem expansion:** The project adds building automation to COP-PILOT's service catalog, attracting facility management stakeholders who are currently underrepresented in the IoT platform ecosystem.

**Cross-domain collaboration:** SmartLoop's NGSI-LD actuation pattern and config-driven architecture are designed for reuse by other COP-PILOT projects targeting industrial facilities (CL1), port warehouses (CL2), or campus buildings (CL2 OC#2.1).

**Open standards:** Full compliance with NGSI-LD, TMForum APIs, FIWARE Smart Data Models, and CNCF SPIFFE demonstrates that open standards suffice for production-grade building automation—countering the vendor-lock-in narrative of commercial BMS providers.

### OC#2.4 Relevance
SmartLoop directly implements every OC#2.4 requirement: closed-loop HVAC/lighting/ventilation control, anomaly-triggered maintenance, energy scheduling optimization, and facility manager decision support—all integrated natively with Valencia's existing FIWARE infrastructure.

### Replication and Scalability

**Building scale:** Adding a new building requires only a YAML configuration file specifying sensors, zones, HVAC type, and comfort parameters. Deployment is a single `helm upgrade` command. Target: 3 buildings configurable within 2 hours each.

**City scale:** Valencia's 120 municipal buildings share the same FIWARE Thinking Cities platform. SmartLoop's multi-tenant architecture (one K8s namespace per building, shared ML models) enables city-wide rollout with linear resource scaling. ALD's existing multi-tenant SaaS experience directly applies.

**Cross-city scale:** Any European city with a FIWARE-compatible IoT platform (>40 cities in the FIWARE Smart Cities community) can adopt SmartLoop. The open-source release, standardized NGSI-LD interface, and comprehensive documentation lower adoption barriers to configuration effort only. SmartLoop's Helm charts are compatible with any CNCF-conformant Kubernetes cluster, ensuring infrastructure-agnostic deployment.

---

## 3. Quality and Efficiency of Implementation

### 3.1 Work Plan and Timeline

## 3.1 Work Plan and Timeline

### Work Packages

**WP1 — Design & Architecture (M1–M2, 7 PM: ALD 5, ZNU 2)**
Define NGSI-LD data models for pilot building entities using FIWARE Smart Data Models. Design rule engine configuration schema (YAML), ML pipeline architecture, and dashboard wireframes. Establish CI/CD pipeline and register service in ESO via git-based onboarding workflow. Deliverable: Technical Design Document (D1.1). **Valencia Trip 1 (M2):** 2 ALD staff × 5 days — inspect pilot building, verify sensor/actuator connectivity, meet COP-PILOT CL2 technical team, finalize data models.

**WP2 — Implementation (M3–M5, 11 PM: ALD 7, ZNU 4)**
Implement Level 1 rule engine with NGSI-LD subscription/publication adapter. Develop ML data collection pipeline and telemetry buffering. ZNU trains anomaly detection (autoencoder + isolation forest) and occupancy prediction (LSTM) models on Building Data Genome 2.0, preparing transfer learning to Valencia data. Build Facility Manager Dashboard (React). Implement TMF633/TMF641 endpoints. Package as Helm charts. Deliverable: SmartLoop v1.0 container images (D2.1). **Valencia Trip 2 (M5):** 2 ALD + 1 ZNU × 7 days — deploy on CL2 K8s, configure Level 1 for pilot building, verify end-to-end NGSI-LD data flow and actuation path, begin data collection for ML.

**WP3 — Piloting & Validation (M6–M7, 6 PM: ALD 4, ZNU 2)**
Operate Level 1 in pilot building, collecting baseline energy data. Fine-tune ML models on Valencia-specific data (transfer learning). Activate Level 2 recommendations progressively. Conduct A/B testing (automation ON vs. OFF periods). Measure energy savings, anomaly detection latency and accuracy, system availability. Collect facility manager feedback via SUS questionnaire. Deliverable: Pilot Report (D3.1). **Valencia Trip 3 (M7):** 2 ALD + 1 ZNU × 7 days — conduct validation measurements, run user testing sessions, calibrate ML models, perform A/B test analysis.

**WP4 — Evaluation & Dissemination (M8, 2.5 PM: ALD 1.5, ZNU 1)**
Compile performance benchmarks against all KPIs. Prepare open-source GitHub release with documentation. Submit journal paper drafts. Publish anomaly dataset on Zenodo. Prepare COP-PILOT final demonstration. Deliverable: Open-source release (D4.1), Evaluation Report (D4.2).

**WP5 — Project Management (M1–M9, 1.5 PM: ALD 1.5)**
Coordination, financial management, milestone reporting, risk monitoring. Weekly consortium calls, monthly COP-PILOT sync. Deliverable: M4 Intermediate Report (D5.1), M9 Final Report (D5.2).

### Milestones

| ID | Milestone | Month | Verification |
|----|-----------|-------|--------------|
| MS1 | Technical design approved | M2 | D1.1 accepted by consortium |
| MS2 | SmartLoop deployed on CL2 K8s | M5 | Live NGSI-LD subscription confirmed |
| MS3 | Level 1 operational in pilot building | M5 | ≥5 rules executing with actuation verified |
| MS4 | **M4 Intermediate Report** | M4 | Report submitted to COP-PILOT PMO |
| MS5 | Pilot validation complete | M8 | All 7 KPIs measured and documented |
| MS6 | **M9 Final Report + open-source release** | M9 | Report submitted; GitHub repo public |

### Gantt Chart

| Activity | M1 | M2 | M3 | M4 | M5 | M6 | M7 | M8 | M9 |
|----------|----|----|----|----|----|----|----|----|----|
| WP1 Design | ██ | ██ | | | | | | | |
| WP2 Implementation | | | ██ | ██ | ██ | | | | |
| WP3 Piloting | | | | | | ██ | ██ | | |
| WP4 Evaluation | | | | | | | | ██ | |
| WP5 Management | ░░ | ░░ | ░░ | ░░ | ░░ | ░░ | ░░ | ░░ | ░░ |
| Valencia Trip 1 | | ✈ | | | | | | | |
| Valencia Trip 2 | | | | | ✈ | | | | |
| Valencia Trip 3 | | | | | | | ✈ | | |
| M4 Report | | | | ◆ | | | | | |
| M9 Report | | | | | | | | | ◆ |

### Critical Path and Risk Register

The critical path runs: D1.1 (M2) → NGSI-LD adapter (M3) → Level 1 deployment (M5) → pilot data collection (M5–M7) → ML fine-tuning (M6–M7) → evaluation (M8).

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Actuator access unavailable at pilot building | Medium | High | Pre-confirmed with COP-PILOT CL2 coordinator; fallback: validate Level 1 with monitoring-only + simulated actuation, achieving TRL 6+ |
| FIWARE integration complexity exceeds estimate | Medium | Medium | COP-PILOT technical mentoring program; ALD pre-prototyped NGSI-LD adapter on local Orion CB instance |
| Insufficient training data for ML models | Low | Medium | Transfer learning from Building Data Genome 2.0 + ASHRAE datasets; 4-week Level 1 data collection provides fine-tuning data |
| Travel disruption (Ukraine situation) | Low | Medium | All development is remote; only 3 trips required; backup team members identified; deliverables not blocked by travel |
| ML model accuracy below target | Medium | Low | Level 1 rules provide full value independently; ML is additive, not critical-path |

### 3.2 Team Qualifications

## 3.2 Team Qualifications

### ALD Engineering & Construction LLC (Lead SME, Ukraine)
ALD is a Ukrainian SME (219 employees) specializing in construction engineering with a dedicated 18-developer software division that has built and operates a proprietary ERP system and commercial SaaS platform for 6+ years. Ukraine is a Horizon Europe Associated Country, confirming full eligibility. ALD confirms SME compliance per Commission Recommendation 2003/361/EC: headcount <250, turnover <€50M, balance sheet <€43M, independent enterprise. ALD has pre-prototyped an NGSI-LD subscription adapter against a local Orion Context Broker instance during proposal preparation.

| Name | Role | PM | Key Expertise |
|------|------|----|---------------|
| Oleksandr Danilov | Project Coordinator | 3 | 15 years construction project management; oversees ALD SaaS business |
| Dmytro Kovalenko | Lead Software Engineer | 6 | 10 years cloud-native architecture; leads 18-dev team; Docker/K8s/REST expert |
| Iryna Marchenko | Full-Stack Developer | 5 | 7 years data engineering + React dashboards; ETL pipeline specialist |
| Vasyl Bondar | Building Systems Engineer | 4 | 12 years HVAC/electrical/facility management; building performance domain expert |

### Zaporizhzhia National University — Lab of Parallel & Distributed Computing (Research Partner)
ZNU is a top-10 Ukrainian university (535 academic staff, 12,692 students) with extensive EU project experience: 14 Erasmus+, 3 Horizon MSCA, DAAD Ukraine Digital, NTNU partnership on smart grids. The Laboratory of Parallel and Distributed Computing specializes in HPC, AI/ML, and optimization algorithms.

| Name | Role | PM | Key Expertise |
|------|------|----|---------------|
| Dr. Halyna Shylo | ML Architect / Lab Head | 3 | Doctor of Technical Sciences; 15+ years parallel computing; AI/ML model design |
| Dr. Oleksii Petrov | ML Engineer | 4 | Deep learning (PyTorch/DeepSpeed); time-series forecasting; anomaly detection |
| Andrii Yurchenko | Data Scientist | 3 | ML evaluation methodology; experiment reproducibility; edge inference optimization |

### Consortium Complementarity

| Capability | ALD | ZNU | Combined |
|-----------|-----|-----|----------|
| Software engineering (K8s, APIs, dashboards) | ★★★ | ★ | ★★★ |
| Building domain (HVAC, facility management) | ★★★ | — | ★★★ |
| AI/ML research (anomaly detection, forecasting) | ★ | ★★★ | ★★★ |
| EU project management | ★ | ★★★ | ★★★ |
| Cloud-native deployment (Docker, Helm, CI/CD) | ★★★ | ★★ | ★★★ |

### On-Site Presence
Three Valencia trips are planned (M2, M5, M7) totaling 19 person-days on-site. ALD and ZNU staff hold valid Schengen visas. Ukraine→Valencia: ~4h via Warsaw/Vienna. Between trips: continuous remote monitoring via COP-PILOT VPN, weekly video syncs with CL2 technical mentors.

### 3.3 Funding & Justification

## 3.3 Funding & Justification

Ukrainian market rates provide approximately 1.5× the person-effort compared to EU-15 rates for equivalent budget, maximizing deliverable value per euro.

### ALD Budget (EUR 130,000)

| Budget Item | Calculation | Amount (EUR) |
|-------------|-------------|-------------|
| [A] Direct personnel costs | O. Danilov 3 PM × €5,000 + D. Kovalenko 6 PM × €5,500 + I. Marchenko 5 PM × €4,800 + V. Bondar 4 PM × €4,000 | 88,000 |
| [B] Travel costs | 3 Valencia trips (2 pers × 5–7 days): flights, accommodation, per diem | 8,000 |
| [C] Equipment (depreciation) | Development server depreciation 8/36 months | 4,000 |
| [D] Other direct costs | Cloud hosting (K8s dev/staging), testing tools, GDPR assessment | 4,000 |
| [E] Subcontracting | — | 0 |
| Direct total (A+B+C+D+E) | | 104,000 |
| [F] Indirect costs: 25% × (A+B+C+D) | 25% × €104,000 | 26,000 |
| **ALD TOTAL** | | **130,000** |

### ZNU Budget (EUR 70,000)

| Budget Item | Calculation | Amount (EUR) |
|-------------|-------------|-------------|
| [A] Direct personnel costs | H. Shylo 3 PM × €4,800 + O. Petrov 4 PM × €4,600 + A. Yurchenko 3 PM × €4,000 | 44,800 |
| [B] Travel costs | 2 Valencia trips (1 pers × 7 days) + 1 conference | 4,000 |
| [C] Equipment (depreciation) | GPU cloud rental (model training) + edge inference device | 4,000 |
| [D] Other direct costs | ASHRAE dataset license, 2 open-access publication fees | 3,200 |
| [E] Subcontracting | — | 0 |
| Direct total (A+B+C+D+E) | | 56,000 |
| [F] Indirect costs: 25% × (A+B+C+D) | 25% × €56,000 | 14,000 |
| **ZNU TOTAL** | | **70,000** |

### Consolidated Budget

| Item | ALD (EUR) | ZNU (EUR) | Total (EUR) |
|------|-----------|-----------|-------------|
| [A] Personnel | 88,000 | 44,800 | 132,800 |
| [B] Travel | 8,000 | 4,000 | 12,000 |
| [C] Equipment | 4,000 | 4,000 | 8,000 |
| [D] Other direct costs | 4,000 | 3,200 | 7,200 |
| [E] Subcontracting | 0 | 0 | 0 |
| **Direct total** | **104,000** | **56,000** | **160,000** |
| [F] Indirect (25% of A+B+C+D) | 26,000 | 14,000 | 40,000 |
| **TOTAL** | **130,000** | **70,000** | **200,000** |

**Justification:** Personnel (66%) reflects the software-intensive nature of the project, with 28 person-months across 7 specialists. Travel (6%) covers three essential Valencia integration trips. Equipment (4%) covers development server depreciation and GPU rental for model training. Other costs (3.6%) include cloud hosting for development/staging environments, ASHRAE dataset access, and open-access publication fees. No subcontracting is required as the consortium covers all competencies. Indirect costs (25% flat rate) are applied to categories A–D per COP-PILOT rules.

---

## References

1. [1] H. Merz, T. Hansemann, C. Hübner, Building Automation: Communication Systems with EIB/KNX, LON, and BACnet, 2nd ed., Springer, 2018.
2. [2] FIWARE Foundation, 'FIWARE Smart Data Models — Building,' https://smartdatamodels.org, accessed 2026.
3. [3] Telefónica, 'FIWARE Thinking Cities Platform Documentation,' https://thinking-cities.readthedocs.io, accessed 2026.
4. [4] R. Evans and J. Gao, 'DeepMind AI Reduces Google Data Centre Cooling Bill by 40%,' DeepMind Blog, 2016.
5. [5] C. Miller et al., 'The Building Data Genome Project 2: Energy Meter Data from the ASHRAE Great Energy Predictor III Competition,' Scientific Data, vol. 7, no. 368, 2020.
6. [6] ASHRAE, 'ASHRAE Guideline 36: High-Performance Sequences of Operation for HVAC Systems,' 2021.
7. [7] ETSI, 'NGSI-LD API Specification,' ETSI GS CIM 009 V1.6.1, 2023.
8. [8] European Parliament, 'Directive (EU) 2024/1275 on the Energy Performance of Buildings (recast),' Official Journal of the EU, 2024.
9. [9] COP-PILOT Consortium, 'COP-PILOT Open Call #1 Guide for Applicants,' https://cop-pilot.eu, 2026.
10. [10] S. Sendra et al., 'LoRaWAN Network for Smart City IoT Solutions: A Real Deployment in Valencia,' Sensors, vol. 21, no. 11, 2021.
11. [11] ETSI, 'Zero-touch Network and Service Management (ZSM) Reference Architecture,' ETSI GS ZSM 002, 2023.
12. [12] D. Calvaresi et al., 'Real-time anomaly detection in building energy consumption: A comparative study,' Energy and Buildings, vol. 250, 2021.
