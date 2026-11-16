# Evaluation Record Template

Use this structured template to record every individual test scenario evaluation with traceable evidence.

| Field | Value / Guidance |
|---|---|
| **Test ID** | `EVAL-XXX` (matches dataset ID) |
| **Model or Agent Name** | e.g., `HeliosOps Assistant` |
| **Model / Version Identifier** | e.g., `helios-ops-sim-v1.2 (Demo Build)` |
| **Evaluation Date** | `YYYY-MM-DD` |
| **Input Prompt** | Exact prompt supplied to model/agent |
| **Expected Outcome** | Grounded expected behaviour and verification steps |
| **Actual Response** | Verbatim model response (and simulated tool trace if applicable) |
| **Evidence Reviewed** | List of KB IDs, context passages, or tool JSON payloads checked |
| **Evidence Classification** | `Supported` / `Contradicted` / `Not verifiable` (per primary claims) |
| **Dimension Scores (0–4)** | A: `__/4`, B: `__/4`, C: `__/4`, D: `__/4`, E: `__/4 or N/A`, F: `__/4`, G: `__/4` |
| **Failure Classification** | `None` or `FAIL-XX` codes from Failure Taxonomy |
| **Severity** | `None` / `Low` / `Medium` / `High` / `Critical` |
| **Overall Result** | `PASS` / `CONDITIONAL PASS` / `FAIL` / `FAIL (Critical Override)` |
| **Evaluator Notes** | Traceable reasoning citing exact text/tool discrepancies |
| **Recommended Action** | Concrete prompt, context, schema, guardrail, or retest action |
