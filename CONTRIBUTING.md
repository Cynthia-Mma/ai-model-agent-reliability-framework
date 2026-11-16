# Contributing to the AI Model & Agent Reliability Evaluation Framework

Contributions that expand scenario coverage, sharpen rubric precision, or improve evaluation tooling are welcome.

## Adding New Evaluation Scenarios
1. Open `datasets/evaluation_dataset.json` and add a new entry following the next sequential `EVAL-XXX` ID.
2. Assign one of the 12 core categories (or propose a new category with clear rationale).
3. Include all 10 required fields: `test_id`, `category`, `scenario_description`, `input_prompt`, `available_context_or_evidence`, `expected_behavior`, `evaluation_criteria`, `expected_evidence_classification`, `failure_severity`, and `failure_patterns_to_watch`.
4. Regenerate/sync `datasets/evaluation_dataset.csv` and `public/resources/` copies.
5. Run `npm test` and `npm run build` before opening a pull request.

## Principles for Contributors
- Never fabricate model results or improvement percentages.
- Label all simulated tool traces and demonstration outputs explicitly as illustrative.
- Keep rubric scales specific to their dimension—avoid generic scoring labels.
