# Evaluation Methodology — Evidence-First Lifecycle

**Author:** Cynthia Agwaraonye  

## 1. The 10-Step Evaluation Lifecycle

1. **Define Evaluation Objectives:** Align scope to real operational risks (knowledge grounding, tool reliability, RBAC compliance).
2. **Establish Measurable Criteria:** Configure dimension weights (`A`–`G`) and Critical-Failure Override rules for the target deployment risk profile.
3. **Design Test Scenarios & Datasets:** Construct non-repetitive scenarios with explicit evidence, failure severity, and failure patterns to watch.
4. **Execute Model / Agent Runs:** Capture verbatim responses and complete tool-call traces (`args` + returned payloads).
5. **Classify Claims by Evidence:** Tag every material claim as `Supported`, `Contradicted`, or `Not verifiable`.
6. **Score Outputs via Rubric (0–4):** Apply dimension-specific 0–4 definitions rather than subjective impressions.
7. **Classify Failures & Severity:** Assign Failure Taxonomy codes (`FAIL-01`–`FAIL-15`) and operational severity (`Critical`–`Low`).
8. **Analyse Recurring Patterns:** Aggregate dimension means, failure frequencies, and severity distributions directly from evaluation records.
9. **Produce Evidence-Backed Findings & Recommendations:** Separate confirmed evidence from root-cause hypotheses and assign concrete corrective actions.
10. **Re-Evaluate & Gate Release:** Retest targeted failures and full regression benchmarks across model/prompt versions to verify real improvements.

## 2. Seven Core Principles

- **Evidence over fluency:** Polished prose never earns high accuracy without source backing.
- **Accuracy over confidence:** Confident speculation is penalised; calibrated abstention is rewarded.
- **Instruction-following over superficial relevance:** Ignoring constraints or schemas fails even if the topic is right.
- **Explicit uncertainty over fabricated information:** `Not verifiable` gaps must be disclosed rather than guessed.
- **Reproducible evaluation over subjective judgment:** Deterministic rubrics, version tags, and traceable notes.
- **Traceable findings over unsupported conclusions:** Every score cites exact input/output/trace evidence.
- **Measurable improvements over vague recommendations:** Every fix maps to a concrete retest scenario and exit gate.
