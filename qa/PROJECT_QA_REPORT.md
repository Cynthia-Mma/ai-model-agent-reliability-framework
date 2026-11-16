# Project-Level Quality Assurance (QA) Report

**Project:** AI Model & Agent Reliability Evaluation Framework  
**QA Engineer / Author:** Cynthia Agwaraonye  
**Verification Date:** 2026-11-16  
**Environment:** Node.js `v20.20.2`, Vite `v5.4.21` Production Build, Playwright Chromium Headless Shell (`1366x900` desktop & `390x844` mobile) hosted under GitHub Pages-style subpath `/ai-model-agent-reliability-framework/`

---

## 1. Automated Unit & Data Integrity Tests (`npm test`)

Executed via `node --test tests/framework.test.mjs`:

| Test ID | Verification Scope | Result | Details |
|---|---|---|---|
| **UT-01** | Rubric completeness & schema integrity | **PASS** | Verified all 7 dimensions (`A`–`G`), bespoke 0–4 scale definitions, 3 weighting presets, and 4 Critical-Failure Override rules. |
| **UT-02** | Test dataset size & full RFC-4180 CSV/JSON parity | **PASS** | Parsed `datasets/evaluation_dataset.csv` with a full RFC-4180 CSV parser and compared all 48 scenarios across all 10 fields (`EVAL-001`–`EVAL-048`) against `evaluation_dataset.json` with 100% exact field equality. |
| **UT-03** | Failure taxonomy completeness | **PASS** | Verified all 15 failure types (`FAIL-01`–`FAIL-15`), detection methods, severities, and corrective actions. |
| **UT-04** | Critical-Failure Override math | **PASS** | Verified `G = 0` with all other dimensions at `4` (90% weighted average) forces `FAIL_CRITICAL_OVERRIDE`. |
| **UT-05** | Weight redistribution for `E = null` | **PASS** | Verified Dimension E weight redistributes proportionally across active dimensions for non-tool text tasks (`100% PASS`). |
| **UT-06** | Dashboard calculation parity | **PASS** | Verified `computeDashboardMetrics()` matches all 12 records in `illustrative_evaluation_records.json` (`4 PASS`, `4 CONDITIONAL_PASS`, `2 FAIL`, `2 FAIL_CRITICAL_OVERRIDE`). |
| **UT-07** | Downloadable resource presence | **PASS** | Verified all 13 artefact files exist in `public/resources/` with non-zero file sizes. |

---

## 2. Production Build & Subpath Asset Verification (`npm run build`)

- `vite build` completed with exit code `0` (`dist/index.html`, CSS chunk `9.15 kB`, JS bundle `496.26 kB`, and `public/resources/` static assets).
- Verified `base: './'` in `vite.config.js` and hash routing (`#/...`) serve cleanly when mounted under the repository subpath `/ai-model-agent-reliability-framework/`.

---

## 3. End-to-End Browser Verification (Playwright Chromium)

Executed against the built `dist/` bundle served at `http://127.0.0.1:4179/ai-model-agent-reliability-framework/`:

| Check ID | Browser & UI Check | Result | Observed Evidence |
|---|---|---|---|
| **E2E-01** | Subpath rendering & all 10 navigation views | **PASS** | Navigated sequentially across all 10 sidebar views (`Home` through `About the Author`) with zero errors. |
| **E2E-02** | Interactive Rubric & Critical Override simulator | **PASS** | Setting Dimension G (`Safety & Compliance`) to `0` triggered the Critical-Failure Override banner (`FAIL_CRITICAL_OVERRIDE`). |
| **E2E-03** | Dataset search, category filter & inspect modal | **PASS** | Displayed `48 of 48` scenarios; searching `EVAL-035` filtered to `1 of 48`; `Inspect` modal displayed prompt/context/failure patterns; filtering `Conflicting context` returned `4 of 48`. |
| **E2E-04** | Agent Reliability simulated trace viewer | **PASS** | Switched traces (`TRACE-03`) and verified simulated-test disclaimer banner and step table rendered cleanly. |
| **E2E-05** | Failure Taxonomy severity filter | **PASS** | Loaded `15 of 15` failures; filtering `Critical` returned `3 of 15` (`FAIL-12`, `FAIL-13`, `FAIL-14`). |
| **E2E-06** | Evaluation Dashboard Chart.js rendering | **PASS** | Verified all 5 Chart.js `<canvas>` elements rendered with non-zero dimensions alongside the Illustrative Data disclaimer. |
| **E2E-07** | Case Study performance-tier filter | **PASS** | Selecting `Failing (4)` rendered exactly 4 failing walkthrough cards. |
| **E2E-08** | Resource downloads & inline preview modal | **PASS** | Verified all 13 `<a download>` links returned HTTP `200` and inline preview loaded real file content. |
| **E2E-09** | Mobile responsiveness (`390x844`) | **PASS** | Opened slide-out mobile drawer via Menu button, navigated cleanly, and confirmed zero horizontal scroll overflow (`scrollWidth <= clientWidth`). |
| **E2E-10** | Console, runtime & network error audit | **PASS** | `consoleErrors = 0`, `pageErrors = 0`, `failedRequests (>= 400) = 0`. |

---

## 4. Defects Found & Resolved During QA

- **Defect 1 (Broken Resource Link):** During initial E2E pass (`E2E-08`), `PROJECT_QA_REPORT.md` returned `404` because it had not yet been generated and copied to `public/resources/`.
  - **Resolution:** Authored `qa/PROJECT_QA_REPORT.md`, copied it to `public/resources/PROJECT_QA_REPORT.md`, and added it to `UT-07`.
- **Defect 2 (Mobile Horizontal Overflow):** During `E2E-09` (`390x844` viewport), `.badge` had `white-space: nowrap`, causing long positioning pills on the Home hero card to overflow horizontally (`scrollWidth > clientWidth`).
  - **Resolution:** Updated `.badge` in `src/styles/theme.css` to wrap cleanly (`flex-wrap: wrap; max-width: 100%`), rebuilt `dist/`, and confirmed zero horizontal overflow (`scrollWidth <= clientWidth`) across re-execution.
- **Defect 3 (Audit Findings `AUD-01` through `AUD-06`):** Independent AI Evaluation Architect audit identified dashboard weighting desync in `computeDashboardMetrics()`, missing `CFO-05` (`F=0`) override, `EVAL-025`/`EVAL-041`/`EVAL-031` severity & scoring inconsistencies, missing multi-version comparison UI/import, and missing `2 vs. 3` tie-breaker rules.
  - **Resolution:** Fixed `src/utils/scoring.js`, `rubrics/evaluation_rubric.json`, `case-study/illustrative_evaluation_records.json`, `DashboardView.jsx`, `RubricsView.jsx`, `reports/sample_evaluation_report.md`, and `case-study/case_study.md`; added unit test suites in `tests/framework.test.mjs` and documented full evidence in `qa/INDEPENDENT_AUDIT_REPORT.md`.
- **Defect 4 (Final Validation & Correction Pass):** Independent source-code review identified permissive JSON import checks in `validateEvaluationRecords()`, superficial ID-only CSV parity checks in `tests/framework.test.mjs`, and a summary count typo (`4 High, 3 Medium` instead of `5 High, 2 Medium`) in `qa/INDEPENDENT_AUDIT_REPORT.md`.
  - **Resolution:** Hardened `validateEvaluationRecords()` to reject missing dimensions, out-of-range/string scores, disallowed nulls, duplicate IDs, invalid severity/evidence/verdict enums, and missing model/version metadata; implemented full RFC-4180 CSV parsing comparing all 48x10 fields; corrected the audit summary count (`5 High, 2 Medium`); and verified UI import rejection/acceptance via Playwright E2E.

---

## 5. Known Limitations

- The 12 sample evaluation records and 4 multi-step agent traces represent illustrative demonstration data for the fictional HeliosOps Assistant and simulated tool responses, not live commercial model benchmarks.
- No backend database or live LLM API key is configured; evaluators run assessments offline or via external scripts and feed JSON records into the framework.
