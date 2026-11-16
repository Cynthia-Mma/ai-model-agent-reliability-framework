# AI Model & Agent Reliability Evaluation Framework

**An evidence-first framework for evaluating model accuracy, instruction-following, tool-use reliability, and AI agent performance.**

**Author:** Cynthia Agwaraonye  
**Positioning:** Senior QA Engineer | AI Model Evaluation & Training | Prompt & Context Engineering | Data Quality

---

## Project Purpose

This repository demonstrates how software quality engineering discipline—test strategy, risk-based testing, traceable assertions, defect taxonomy, and release gating—translates end to end into structured evaluation for LLMs and tool-using AI agents. Link: https://cynthia-mma.github.io/ai-model-agent-reliability-framework/

It implements the complete 10-step evaluation lifecycle:
1. Define evaluation objectives
2. Establish measurable evaluation criteria
3. Design test scenarios and datasets
4. Evaluate model responses
5. Score outputs using transparent rubrics
6. Classify failures and risks
7. Analyse recurring failure patterns
8. Produce evidence-backed findings
9. Recommend corrective actions
10. Re-evaluate to verify whether improvements occurred

---

## Key Features

- **Evidence-First Methodology:** Explicit `Supported`, `Contradicted`, and `Not verifiable` claim classifications (`Not verifiable` is never auto-scored as false; uncertainty handling is scored directly).
- **7-Dimension 0–4 Rubric (`A`–`G`):** Dimension-specific scale definitions, configurable use-case weights, and **Critical-Failure Overrides** so safety or authorization breaches cannot be masked by high averages.
- **48-Scenario Reusable Dataset (`JSON` & `CSV`):** Covers 12 categories including missing information, conflicting context, hallucination traps, tool selection/arguments, tool failure recovery, multi-step verification, authorization, and safety constraints.
- **Agent & Tool-Use Reliability Module:** 11 agent checks, 8-step lifecycle, and simulated execution traces clearly distinguished from live external integrations.
- **15-Type Failure Taxonomy (`FAIL-01`–`FAIL-15`):** Explicit separation between **Operational Severity** (`Critical`–`Low`) and **Rubric Score** (`0`–`4`).
- **Illustrative Case Study & Data-Driven Dashboard:** 12 demonstration records (4 Strong, 4 Partial, 4 Failing) for the fictional **HeliosOps Assistant**, with every Chart.js metric calculated dynamically from the underlying JSON records.
- **Interactive Portfolio Web App:** Responsive React + Vite static site ready for GitHub Pages subpath hosting with inline resource previews and file downloads.

---

## Repository Structure

```text
ai-model-agent-reliability-framework/
├── .github/workflows/deploy.yml        # Automated GitHub Pages build & deploy workflow
├── case-study/
│   ├── agent_execution_traces.json     # Simulated multi-step agent traces & 11 checks
│   ├── case_study.md                   # HeliosOps case study & before/after loop
│   └── illustrative_evaluation_records.json
├── datasets/
│   ├── evaluation_dataset.csv          # 48 scenarios (CSV export)
│   └── evaluation_dataset.json         # 48 scenarios (JSON export)
├── docs/
│   ├── agent-evaluation-guide.md
│   ├── deployment-guide.md
│   ├── improvement-reevaluation-loop.md
│   └── methodology.md
├── public/resources/                   # Static downloadable copies for web app
├── qa/
│   └── PROJECT_QA_REPORT.md            # Project-level QA execution & verification log
├── reports/
│   └── sample_evaluation_report.md     # 14-section illustrative evaluation report
├── rubrics/
│   ├── evaluation_rubric.json
│   └── evaluation_rubric.md
├── src/
│   ├── components/                     # 10 interactive views + navigation
│   ├── styles/theme.css
│   ├── utils/scoring.js                # Weighted scoring, overrides, & dashboard math
│   ├── App.jsx
│   └── main.jsx
├── taxonomy/
│   ├── failure_taxonomy.json
│   └── failure_taxonomy.md
├── templates/
│   ├── evaluation_record_template.json
│   └── evaluation_record_template.md
├── tests/
│   └── framework.test.mjs              # Automated Node test suite
├── CONTRIBUTING.md
├── LICENSE                             # MIT License (recommended)
├── package.json
└── vite.config.js                      # Configured with base: './' for GitHub Pages
```

---

## Evaluation Methodology

See [`docs/methodology.md`](docs/methodology.md) and [`rubrics/evaluation_rubric.md`](rubrics/evaluation_rubric.md) for full details on:
- Seven evidence-first principles
- Explicit evidence classification (`Supported`, `Contradicted`, `Not verifiable`)
- Configurable dimension weights (`Knowledge QA`, `Tool-Using Agent`, `High-Risk / Regulated`)
- Critical-Failure Override rules (`CFO-01` through `CFO-04`)

---

## How to Run Locally

**Prerequisites:** Node.js `>= 18` and `npm`.

```bash
# 1. Install dependencies
npm install

# 2. Run automated QA & scoring unit tests
npm test

# 3. Start local development server
npm run dev

# 4. Build production static bundle and preview locally
npm run build
npm run preview
```

---

## How to Use the Evaluation Dataset & Add Scenarios

1. Load `datasets/evaluation_dataset.json` or `datasets/evaluation_dataset.csv` into your evaluation runner or spreadsheet.
2. To add a new scenario, append a sequential `EVAL-XXX` record containing all 10 required schema fields (`test_id`, `category`, `scenario_description`, `input_prompt`, `available_context_or_evidence`, `expected_behavior`, `evaluation_criteria`, `expected_evidence_classification`, `failure_severity`, `failure_patterns_to_watch`), sync the CSV and `public/resources/` copies, and run `npm test`.

---

## How to Conduct an Evaluation & Generate a Report

1. Copy `templates/evaluation_record_template.json` (or `.md`) for each scenario run.
2. Record verbatim model output and any simulated tool traces.
3. Classify claims (`Supported`, `Contradicted`, `Not verifiable`) and score active dimensions (`0`–`4`).
4. Tag any failures using `taxonomy/failure_taxonomy.json` (`FAIL-01`–`FAIL-15`) and apply Critical-Failure Override checks.
5. Pass your evaluation records array into `computeDashboardMetrics()` in `src/utils/scoring.js` to calculate dimension means, failure distributions, severity distributions, and pass/fail rates, then summarise findings using the 14-section structure in `reports/sample_evaluation_report.md`.

---

## How to Deploy to GitHub Pages

1. Push this directory to a GitHub repository (`main` branch).
2. `vite.config.js` sets `base: './'` and `App.jsx` uses hash routing (`#/...`), so all assets, charts, and `./resources/*` downloads work seamlessly under `https://<username>.github.io/<repo-name>/`.
3. Enable **GitHub Actions** under **Repository Settings -> Pages -> Source**.
4. The included workflow `.github/workflows/deploy.yml` automatically runs `npm test`, executes `npm run build`, and deploys `./dist` to GitHub Pages.

See [`docs/deployment-guide.md`](docs/deployment-guide.md) for manual `gh-pages` deployment instructions.

---

## License

Recommended license: **MIT License** (see [`LICENSE`](LICENSE)).
