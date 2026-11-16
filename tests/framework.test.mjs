import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  computeDashboardMetrics,
  compareModelVersions,
  validateEvaluationRecords,
  evaluateRecordOutcome,
  DEFAULT_WEIGHTS
} from "../src/utils/scoring.js";

const ROOT = process.cwd();

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relPath), "utf8"));
}

test("Rubric contains 7 dimensions (A-G), 0-4 scales, weighting presets, and overrides", () => {
  const rubric = readJson("rubrics/evaluation_rubric.json");
  assert.equal(rubric.dimensions.length, 7);
  assert.deepEqual(
    rubric.dimensions.map((d) => d.id),
    ["A", "B", "C", "D", "E", "F", "G"]
  );
  for (const dim of rubric.dimensions) {
    for (const k of ["0", "1", "2", "3", "4"]) {
      assert.ok(dim.scale[k] && dim.scale[k].length > 10, `Missing scale ${k} on ${dim.id}`);
    }
    assert.ok(dim.evaluation_questions.length >= 3);
    assert.ok(dim.good_example && dim.poor_example && dim.evidence_requirements);
  }
  assert.ok(rubric.critical_failure_overrides.length >= 3);
  assert.ok(Object.keys(rubric.weighting_policy.presets).length >= 3);
});

function parseCsv(csvText) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const ch = csvText[i];
    if (inQuotes) {
      if (ch === '"') {
        if (csvText[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\r" && csvText[i + 1] === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i++;
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += ch;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  if (rows.length === 0) return [];
  const headers = rows[0];
  return rows.slice(1).map((cols) => {
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = cols[j] ?? "";
    }
    return obj;
  });
}

test("RFC-4180 CSV parser handles commas, escaped quotes, and multiline fields", () => {
  const sample = 'id,prompt,notes\r\n1,"Hello, ""world""","Line 1\nLine 2"\r\n';
  const parsed = parseCsv(sample);
  assert.equal(parsed.length, 1);
  assert.deepEqual(parsed[0], {
    id: "1",
    prompt: 'Hello, "world"',
    notes: "Line 1\nLine 2"
  });
});

test("Dataset has at least 40 scenarios across all 12 categories and 100% field-level CSV/JSON parity", () => {
  const dataset = readJson("datasets/evaluation_dataset.json");
  assert.ok(dataset.scenarios.length >= 40, "Must have >= 40 scenarios");
  assert.equal(dataset.scenarios.length, 48);
  assert.equal(dataset.categories.length, 12);

  const requiredFields = [
    "test_id",
    "category",
    "scenario_description",
    "input_prompt",
    "available_context_or_evidence",
    "expected_behavior",
    "evaluation_criteria",
    "expected_evidence_classification",
    "failure_severity",
    "failure_patterns_to_watch"
  ];
  const seenIds = new Set();
  for (const s of dataset.scenarios) {
    assert.ok(!seenIds.has(s.test_id), `Duplicate ID ${s.test_id}`);
    seenIds.add(s.test_id);
    for (const field of requiredFields) {
      assert.ok(s[field] && String(s[field]).trim().length > 0, `Empty ${field} on ${s.test_id}`);
    }
  }

  const csvText = fs.readFileSync(path.join(ROOT, "datasets/evaluation_dataset.csv"), "utf8");
  const csvRows = parseCsv(csvText);
  assert.equal(csvRows.length, dataset.scenarios.length, "CSV row count must equal JSON count");

  for (let i = 0; i < dataset.scenarios.length; i++) {
    const jsonRow = dataset.scenarios[i];
    const csvRow = csvRows[i];
    for (const field of requiredFields) {
      assert.equal(
        csvRow[field],
        jsonRow[field],
        `CSV/JSON mismatch at row ${i} (${jsonRow.test_id}) field '${field}'`
      );
    }
  }
});

test("Failure taxonomy includes all 15 failure classifications", () => {
  const tax = readJson("taxonomy/failure_taxonomy.json");
  assert.equal(tax.failures.length, 15);
  for (const f of tax.failures) {
    assert.ok(f.failure_id.startsWith("FAIL-"));
    assert.ok(["Critical", "High", "Medium", "Low"].includes(f.default_severity));
    assert.ok(f.detection_method && f.recommended_corrective_action);
  }
});

test("Critical-Failure Override blocks PASS even with high weighted average", () => {
  const scores = {
    A_factual_accuracy: 4,
    B_instruction_following: 4,
    C_reasoning_consistency: 4,
    D_uncertainty_handling: 4,
    E_tool_use_reliability: 4,
    F_task_completion: 4,
    G_safety_compliance: 0
  };
  const res = evaluateRecordOutcome(scores, DEFAULT_WEIGHTS, "Critical", true);
  assert.equal(res.weightedScorePct, 90);
  assert.equal(res.criticalOverride, true);
  assert.equal(res.overallResult, "FAIL_CRITICAL_OVERRIDE");
});

test("Null Dimension E redistributes weights accurately for text-only tasks", () => {
  const scores = {
    A_factual_accuracy: 4,
    B_instruction_following: 4,
    C_reasoning_consistency: 4,
    D_uncertainty_handling: 4,
    E_tool_use_reliability: null,
    F_task_completion: 4,
    G_safety_compliance: 4
  };
  const res = evaluateRecordOutcome(scores, DEFAULT_WEIGHTS, "None", true);
  assert.equal(res.weightedScorePct, 100);
  assert.equal(res.overallResult, "PASS");
});

test("Dashboard metrics match illustrative evaluation records 100%", () => {
  const evalData = readJson("case-study/illustrative_evaluation_records.json");
  const tax = readJson("taxonomy/failure_taxonomy.json");
  const m = computeDashboardMetrics(evalData.records, DEFAULT_WEIGHTS, tax.failures);

  assert.equal(m.totalEvaluated, 12);
  assert.equal(m.resultCounts.PASS, 4);
  assert.equal(m.resultCounts.CONDITIONAL_PASS, 4);
  assert.equal(m.resultCounts.FAIL, 2);
  assert.equal(m.resultCounts.FAIL_CRITICAL_OVERRIDE, 2);
  assert.equal(m.criticalOverridesCount, 2);
  assert.equal(
    m.evidenceCounts.Supported + m.evidenceCounts.Contradicted + m.evidenceCounts["Not verifiable"],
    12
  );
  for (const r of m.enrichedRecords) {
    assert.equal(r.computed_result, r.overall_result, `Verdict mismatch on ${r.test_id}`);
  }
});

test("All downloadable resource files exist in public/resources", () => {
  const expectedFiles = [
    "evaluation_rubric.json",
    "evaluation_rubric.md",
    "evaluation_dataset.json",
    "evaluation_dataset.csv",
    "evaluation_record_template.json",
    "evaluation_record_template.md",
    "failure_taxonomy.json",
    "failure_taxonomy.md",
    "sample_evaluation_report.md",
    "case_study.md",
    "illustrative_evaluation_records.json",
    "agent_execution_traces.json",
    "PROJECT_QA_REPORT.md"
  ];
  for (const file of expectedFiles) {
    const p = path.join(ROOT, "public/resources", file);
    assert.ok(fs.existsSync(p) && fs.statSync(p).size > 0, `Missing resource: ${file}`);
  }
});

test("CFO-04 respects isGroundedTask flag and CFO-05 catches F=0 false completion", () => {
  const fZero = {
    A_factual_accuracy: 4,
    B_instruction_following: 4,
    C_reasoning_consistency: 4,
    D_uncertainty_handling: 4,
    E_tool_use_reliability: 4,
    F_task_completion: 0,
    G_safety_compliance: 4
  };
  const rF = evaluateRecordOutcome(fZero, DEFAULT_WEIGHTS, "High", true);
  assert.equal(rF.criticalOverride, true);
  assert.equal(rF.overallResult, "FAIL_CRITICAL_OVERRIDE");

  const aZeroUngrounded = {
    A_factual_accuracy: 0,
    B_instruction_following: 4,
    C_reasoning_consistency: 4,
    D_uncertainty_handling: 4,
    E_tool_use_reliability: null,
    F_task_completion: 4,
    G_safety_compliance: 4
  };
  const rGrounded = evaluateRecordOutcome(aZeroUngrounded, DEFAULT_WEIGHTS, "High", true);
  assert.equal(rGrounded.criticalOverride, true);
  const rUngrounded = evaluateRecordOutcome(aZeroUngrounded, DEFAULT_WEIGHTS, "Low", false);
  assert.equal(rUngrounded.criticalOverride, false);
});

test("Dashboard resultCounts stay synchronized with active weighting preset", () => {
  const rubric = readJson("rubrics/evaluation_rubric.json");
  const evalData = readJson("case-study/illustrative_evaluation_records.json");
  const tax = readJson("taxonomy/failure_taxonomy.json");

  const mHighRisk = computeDashboardMetrics(
    evalData.records,
    rubric.weighting_policy.presets.high_risk_regulated.weights,
    tax.failures
  );
  const tablePassCount = mHighRisk.enrichedRecords.filter((r) => r.computed_result === "PASS").length;
  assert.equal(mHighRisk.resultCounts.PASS, tablePassCount);
});

test("compareModelVersions and validateEvaluationRecords support multi-version comparison", () => {
  const evalData = readJson("case-study/illustrative_evaluation_records.json");
  const tax = readJson("taxonomy/failure_taxonomy.json");

  assert.equal(validateEvaluationRecords({ records: [] }).valid, false);
  assert.equal(validateEvaluationRecords(evalData).valid, true);

  const syntheticCompareSet = [
    ...evalData.records.slice(0, 2),
    {
      ...evalData.records[0],
      model_or_agent_name: "Candidate Model",
      model_version_identifier: "candidate-v2-fixture",
      is_illustrative_demo: false
    }
  ];
  const compared = compareModelVersions(syntheticCompareSet, DEFAULT_WEIGHTS, tax.failures);
  assert.equal(compared.length, 2);
  assert.equal(compared[0].isIllustrative, true);
  assert.equal(compared[1].isIllustrative, false);
});

test("Strict JSON import validation rejects malformed records and accepts valid multi-record imports", () => {
  const baseValid = {
    test_id: "EVAL-001",
    model_or_agent_name: "Audit Test Model",
    model_version_identifier: "audit-v1",
    evaluation_date: "2026-11-16",
    input_prompt: "Test prompt",
    expected_outcome: "Expected outcome",
    actual_response: "Actual response",
    evidence_classification: "Supported",
    severity: "None",
    overall_result: "PASS",
    dimension_scores: {
      A_factual_accuracy: 4,
      B_instruction_following: 4,
      C_reasoning_consistency: 4,
      D_uncertainty_handling: 4,
      E_tool_use_reliability: null,
      F_task_completion: 4,
      G_safety_compliance: 4
    }
  };

  // Valid null E on non-tool task & multi-record import
  const validMulti = validateEvaluationRecords({
    records: [
      baseValid,
      {
        ...baseValid,
        test_id: "EVAL-029",
        dimension_scores: { ...baseValid.dimension_scores, E_tool_use_reliability: 3 }
      }
    ]
  });
  assert.equal(validMulti.valid, true);
  assert.equal(validMulti.records.length, 2);

  // Score above 4
  const above4 = validateEvaluationRecords([
    { ...baseValid, dimension_scores: { ...baseValid.dimension_scores, A_factual_accuracy: 5 } }
  ]);
  assert.equal(above4.valid, false);
  assert.match(above4.error, /A_factual_accuracy/);

  // Score below 0
  const below0 = validateEvaluationRecords([
    { ...baseValid, dimension_scores: { ...baseValid.dimension_scores, G_safety_compliance: -1 } }
  ]);
  assert.equal(below0.valid, false);
  assert.match(below0.error, /G_safety_compliance/);

  // Missing dimension
  const missingDimScores = { ...baseValid.dimension_scores };
  delete missingDimScores.C_reasoning_consistency;
  const missingDim = validateEvaluationRecords([{ ...baseValid, dimension_scores: missingDimScores }]);
  assert.equal(missingDim.valid, false);
  assert.match(missingDim.error, /C_reasoning_consistency/);

  // Invalid string in numerical field (no silent coercion)
  const stringScore = validateEvaluationRecords([
    { ...baseValid, dimension_scores: { ...baseValid.dimension_scores, B_instruction_following: "3" } }
  ]);
  assert.equal(stringScore.valid, false);
  assert.match(stringScore.error, /B_instruction_following/);

  // Null disallowed on non-E dimension
  const nullDisallowed = validateEvaluationRecords([
    { ...baseValid, dimension_scores: { ...baseValid.dimension_scores, A_factual_accuracy: null } }
  ]);
  assert.equal(nullDisallowed.valid, false);
  assert.match(nullDisallowed.error, /cannot be null/);

  // Duplicate test_id within same model/version
  const dupId = validateEvaluationRecords([baseValid, { ...baseValid }]);
  assert.equal(dupId.valid, false);
  assert.match(dupId.error, /duplicate test_id/i);

  // Invalid severity
  const badSev = validateEvaluationRecords([{ ...baseValid, severity: "Severe" }]);
  assert.equal(badSev.valid, false);
  assert.match(badSev.error, /severity/);

  // Invalid evidence classification
  const badEv = validateEvaluationRecords([{ ...baseValid, evidence_classification: "Unverified" }]);
  assert.equal(badEv.valid, false);
  assert.match(badEv.error, /evidence_classification/);

  // Invalid verdict when supplied
  const badVerdict = validateEvaluationRecords([{ ...baseValid, overall_result: "MAYBE" }]);
  assert.equal(badVerdict.valid, false);
  assert.match(badVerdict.error, /overall_result/);

  // Missing model name / version for comparison
  const missingModel = validateEvaluationRecords([{ ...baseValid, model_version_identifier: "" }]);
  assert.equal(missingModel.valid, false);
  assert.match(missingModel.error, /model_version_identifier/);
});
