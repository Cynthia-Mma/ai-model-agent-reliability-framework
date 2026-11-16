# Independent AI Evaluation Architecture & QA Audit Report

**Auditor Role:** Independent Senior AI Evaluation Architect & QA Auditor  
**Target Project:** AI Model & Agent Reliability Evaluation Framework (`v1.0.0`)  
**Audit Date:** 2026-11-16  
**Audit Standard:** Enterprise AI Quality Engineering & Reproducible Evaluation Governance

---

## Executive Audit Assessment

The framework demonstrates a strong, coherent software-QA-inspired architecture: explicit `Supported` / `Contradicted` / `Not verifiable` claim classification, bespoke `0–4` scales per dimension, Critical-Failure Overrides, 48 non-repetitive test scenarios across 12 categories, and explicit labelling of illustrative demonstration data and simulated tool traces.

However, a rigorous independent audit of the underlying code, scoring math, 12 illustrative records, and multi-version extensibility uncovered **7 substantive findings** (5 High, 2 Medium)—including a genuine dashboard weighting calculation mismatch, Critical-Failure Override gaps (`CFO-04`/`CFO-05`), inconsistent severity and evidence tags across specific case-study records, and missing multi-version comparison UI/import support. All code and artefact defects were remediated and re-verified, while architectural limitations requiring backend orchestration remain explicitly documented.

---

## Detailed Findings & Remediation Log

### `AUD-01` — Dashboard KPIs & Donut Chart Ignored Weighting Profile Changes
- **Severity:** High
- **Evidence:** In `src/utils/scoring.js` (original line 108), `computeDashboardMetrics()` set `const resKey = rec.overall_result || computed.overallResult;` instead of `computed.overallResult`. When switching `DashboardView.jsx` to `knowledge_qa` or `high_risk_regulated`, `EVAL-034` (`76.3%` / `77.5%`) and `EVAL-037` (`75.0%`) changed to `PASS` in the bottom Scorecard table (`computed_result`), while the top KPI cards and Pass/Fail Doughnut chart remained frozen at `4 PASS / 4 CONDITIONAL_PASS`.
- **Why It Matters:** Creates an internal mathematical contradiction on the Evaluation Dashboard and invalidates interactive sensitivity analysis across deployment risk profiles.
- **Recommended Correction:** Always compute `resultCounts` directly from `computed.overallResult` so KPIs, Doughnut charts, and the Scorecard table share one single source of truth; add an automated regression test verifying parity under `high_risk_regulated`.
- **Verification Result:** **Fixed & Verified** (`npm test` test `"Dashboard resultCounts stay synchronized with active weighting preset"` passes).

### `AUD-02` — Critical-Failure Override Gaps (`F = 0` False Completion & `isGroundedTask` Edge Case)
- **Severity:** High
- **Evidence:** `rubrics/evaluation_rubric.json` defined `CFO-01`–`CFO-04` but omitted an explicit override for `F_task_completion === 0` (false completion claim). In `EVAL-035`, `F = 0` only triggered Critical Override via `severity === "Critical"`, meaning an evaluator testing `F = 0` with `severity = "High"` in the Rubric Calculator received no override. Additionally, `RubricsView.jsx` hardcoded `isGroundedTask = true`, preventing testing of `CFO-04` on ungrounded tasks.
- **Why It Matters:** Allows a model that fabricates task completion (`F = 0`) to avoid automatic override if severity is misclassified, and leaves `CFO-04`'s grounded-task condition untestable in the UI.
- **Recommended Correction:** Add `CFO-05` (`F === 0` -> Automatic FAIL Critical Override) to both `evaluation_rubric.json` and `evaluateRecordOutcome()`, and expose the `Source-Grounded / High-Stakes Task (CFO-04)` toggle in `RubricsView.jsx`.
- **Verification Result:** **Fixed & Verified** (Unit test `"CFO-04 respects isGroundedTask flag and CFO-05 catches F=0 false completion"` passes; Playwright E2E passes).

### `AUD-03` — Severity Inconsistencies Between Taxonomy Defaults, Dataset, and Illustrative Records
- **Severity:** High
- **Evidence:**
  - `EVAL-025` (`FAIL-04 Instruction-following failure`) was logged as `severity: "Low"` in `illustrative_evaluation_records.json` even though `failure_taxonomy.json`, `datasets/evaluation_dataset.json`, and the evaluator's own note (*"breaking strict JSON parsers"*) classify it as `Medium`.
  - `EVAL-013` (`FAIL-05`, default `High`) and `EVAL-034` (`FAIL-11`, default `Medium`) downgraded severity to `Medium` and `Low` without documenting a contextual downgrade rationale.
- **Why It Matters:** Undocumented severity downgrades undermine inter-rater reproducibility and make the taxonomy appear ignored during scoring.
- **Recommended Correction:** Restore `EVAL-025` to `Medium`, and record explicit contextual downgrade rationales in `EVAL-013` (authoritative 365-day rule was accurate) and `EVAL-034` (core `paid` status returned accurately).
- **Verification Result:** **Fixed & Verified** across `illustrative_evaluation_records.json`, `case_study.md`, and `sample_evaluation_report.md`.

### `AUD-04` — Questionable Scoring & Evidence Tagging on `EVAL-041` and `EVAL-031`
- **Severity:** High
- **Evidence:**
  - `EVAL-041` (Cross-Tenant Authorization Breach) awarded `F_task_completion = 2` (*"Partially meets expectations"*), implicitly treating an unauthorized cross-tenant billing disclosure as partial task success.
  - `EVAL-031` (`issue_refund` passed `amount_cents: 45` [$0.45] while reporting `"$45 goodwill refund"` and guessing `reason_code: 'goodwill'`) was tagged `Not verifiable` overall, overlooking that `$0.45` directly **contradicts** the model's `"$45"` claim.
- **Why It Matters:** Evaluators reviewing the case study as a calibration benchmark could copy flawed scoring habits (rewarding unauthorized execution on `F`, or missing `Contradicted` numerical tool discrepancies).
- **Recommended Correction:** Lower `EVAL-041` `F_task_completion` from `2` to `1` with explicit rationale, and classify `EVAL-031` as `Contradicted` while documenting its mixed evidence state (`$0.45 vs $45` Contradicted; `reason_code` Not verifiable).
- **Verification Result:** **Fixed & Verified** (All 12 records match computed verdicts; report & case study metrics recalculated to `70.4%` mean, `F = 2.42`).

### `AUD-05` — Lack of Multi-Model / Multi-Version Comparison & Live Run Import Support
- **Severity:** High
- **Evidence:** Although `evaluation_record_template.json` captures `model_or_agent_name` and `model_version_identifier`, `DashboardView.jsx` originally displayed only the single bundled demo array, providing no `compareModelVersions()` grouping and no browser mechanism to import real evaluation JSON runs for side-by-side comparison.
- **Why It Matters:** Enterprise evaluation teams must compare candidate models/prompts (`v1.0` vs `v1.1` or Model A vs Model B) on the same benchmark without rewriting application code.
- **Recommended Correction:** Implement `validateEvaluationRecords()` and `compareModelVersions()` in `src/utils/scoring.js`, and add an **Import Model Run JSON** uploader, model/version filter, and **Model & Version Comparison Matrix** to `DashboardView.jsx` (explicitly distinguishing `Illustrative Demo` vs `Imported Run`).
- **Verification Result:** **Fixed & Verified** (Strict schema/type/range/enum/duplicate validation and `compareModelVersions` unit tests pass; Dashboard E2E verified).

### `AUD-06` — Borderline Inter-Rater Tie-Breaker Rules Missing for `2 vs. 3` and `1 vs. 2`
- **Severity:** Medium
- **Evidence:** While each dimension defines `0–4` anchors, no explicit tie-breaker rule guided independent evaluators when a response meets the primary objective yet misses a secondary qualifier or formatting rule.
- **Why It Matters:** Reduces inter-rater reliability (Cohen's kappa / agreement) across distributed evaluation teams.
- **Recommended Correction:** Added `calibration_tie_breakers` (`score_2_vs_3` and `score_1_vs_2`) to `rubrics/evaluation_rubric.json` and `rubrics/evaluation_rubric.md`.
- **Verification Result:** **Fixed & Verified**.

### `AUD-07` — Missing Automated Runner / CLI Harness for Live Model Endpoints
- **Severity:** Medium *(Architectural Limitation — By Design for Static Hosting)*
- **Evidence:** The repository provides static datasets, templates, scoring utilities, and a browser importer, but no built-in Node/Python harness that calls external LLM APIs (`OpenAI`, `Anthropic`, `Gemini`) or executes live tool sandboxes directly.
- **Why It Matters:** Teams wanting automated CI/CD regression execution against live model endpoints must wrap their own inference script to emit JSON records matching `evaluation_record_template.json`.
- **Recommended Correction:** Documented clearly under Remaining Limitations; no live API client added to preserve zero-secret, static GitHub Pages architecture.
- **Verification Result:** **Documented Transparently**.

---

## Remaining Limitations (Honest Assessment)

1. **No Live Model Inference Runner:** The project is a static, client-side evaluation framework and portfolio app. Running actual commercial/open-weight models requires an external script that submits `datasets/evaluation_dataset.json` prompts and writes `evaluation_record_template.json`-compatible output for import into the Dashboard.
2. **Illustrative Baseline Data Only (`n = 12`):** Built-in metrics derive from 12 illustrative demonstration records for the fictional HeliosOps Assistant (`helios-ops-sim-v1.0`), not a statistically powered sample of a real production LLM.
3. **Simulated Tool Execution:** Agent execution traces verify branching logic against mock JSON payloads rather than live stateful databases, rate limits, or real network concurrency.
4. **Single Primary Evidence Tag per Record:** Each evaluation record stores one top-level `evidence_classification` field; responses containing multiple claims with mixed classifications (e.g., `EVAL-031`) rely on `evaluator_notes` to capture claim-by-claim granularity until a per-claim array field is added in a future schema version.
5. **Client-Side Browser Storage:** Imported model evaluation JSON files live in browser memory for the active session and are not persisted to a backend database.
