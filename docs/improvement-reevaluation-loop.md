# Improvement & Re-Evaluation Loop

This framework treats evaluation as a continuous QA feedback loop across prompt revisions, context updates, tool-schema changes, and model upgrades.

## Structured Before-and-After Workflow

For every logged failure:
1. **Identify Failure & Severity:** Record `FAIL-XX` code and operational severity.
2. **Trace Evidence:** Link exact prompt, source passage, or simulated tool JSON payload.
3. **Formulate Hypothesis (Labelled as Hypothesis):** Propose likely cause without claiming certainty prior to code/prompt inspection.
4. **Recommend Corrective Action:** Specify concrete change (gateway RBAC binding, schema update, prompt rule, context tagging).
5. **Define Expected Post-Fix Behaviour:** State observable pass condition and minimum dimension scores.
6. **Execute Retest & Compare:** Run targeted + regression scenarios on the updated version (`v1.1`) and record actual before/after deltas—never fabricating improvement percentages prior to retesting.
