import React, { useMemo, useState } from "react";
import { AlertTriangle, ShieldAlert } from "lucide-react";

function sevClass(s) {
  if (s === "Critical") return "badge-crit";
  if (s === "High") return "badge-high";
  if (s === "Medium") return "badge-warn";
  return "badge-neutral";
}

export default function FailureAnalysisView({ taxonomy, records }) {
  const [sevFilter, setSevFilter] = useState("ALL");

  const filteredFailures = useMemo(() => {
    if (sevFilter === "ALL") return taxonomy.failures;
    return taxonomy.failures.filter((f) => f.default_severity === sevFilter);
  }, [taxonomy.failures, sevFilter]);

  const imperfectRecords = useMemo(
    () => records.filter((r) => (r.failure_classification || []).length > 0),
    [records]
  );

  return (
    <div className="stack-lg">
      <div className="page-header">
        <div className="page-kicker">
          <AlertTriangle size={14} /> Failure Analysis
        </div>
        <h2 className="page-title">Failure Taxonomy, Severity Model &amp; Corrective Actions</h2>
        <p className="page-subtitle">
          Structured defect classification separating operational severity from rubric score so
          high-impact security and truthfulness defects never go unnoticed.
        </p>
      </div>

      {/* Severity vs Rubric Score explanation */}
      <section className="card">
        <h3 className="card-title" style={{ marginBottom: 8 }}>
          <ShieldAlert size={16} style={{ verticalAlign: "text-bottom", marginRight: 6 }} />
          Why Severity and Rubric Score Are Not Interchangeable
        </h3>
        <p style={{ margin: "0 0 12px", fontSize: "14px", color: "var(--text-secondary)" }}>
          {taxonomy.severity_vs_rubric_score.why_distinct}
        </p>
        <div className="grid-4">
          {taxonomy.severity_levels.map((lvl) => (
            <div
              key={lvl.level}
              style={{
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                padding: 12,
                background: "var(--bg-page)"
              }}
            >
              <span className={`badge ${sevClass(lvl.level)}`} style={{ marginBottom: 6 }}>
                {lvl.level}
              </span>
              <div style={{ fontSize: "12.5px", color: "var(--text-primary)", marginBottom: 6 }}>
                {lvl.definition}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                <strong>Gate:</strong> {lvl.release_action}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 15-Item Failure Taxonomy */}
      <section className="card">
        <div className="card-header">
          <h3 className="card-title">Failure Classification Catalogue ({filteredFailures.length} of {taxonomy.failures.length})</h3>
          <select
            className="select"
            aria-label="Filter failure taxonomy by severity"
            value={sevFilter}
            onChange={(e) => setSevFilter(e.target.value)}
          >
            <option value="ALL">All Default Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Failure ID</th>
                <th>Type</th>
                <th>Severity</th>
                <th>Description &amp; Example</th>
                <th>Detection Method</th>
                <th>Recommended Corrective Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredFailures.map((f) => (
                <tr key={f.failure_id}>
                  <td className="mono" style={{ fontWeight: 700, color: "var(--accent-green)" }}>
                    {f.failure_id}
                  </td>
                  <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{f.name}</td>
                  <td>
                    <span className={`badge ${sevClass(f.default_severity)}`}>
                      {f.default_severity}
                    </span>
                  </td>
                  <td>
                    <div>{f.description}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: 4 }}>
                      <strong>Example:</strong> {f.example}
                    </div>
                  </td>
                  <td style={{ fontSize: "12.5px" }}>{f.detection_method}</td>
                  <td style={{ fontSize: "12.5px" }}>{f.recommended_corrective_action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Sample Failure Records from Case Study */}
      <section className="card">
        <div className="card-header">
          <h3 className="card-title">Illustrative Sample Failure Records (HeliosOps Demo)</h3>
          <span className="badge badge-warn">Illustrative Demo Data</span>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Test ID</th>
                <th>Failure Tags</th>
                <th>Severity</th>
                <th>Verdict</th>
                <th>Evaluator Observation &amp; Corrective Action</th>
              </tr>
            </thead>
            <tbody>
              {imperfectRecords.map((r) => (
                <tr key={r.test_id}>
                  <td className="mono" style={{ fontWeight: 700 }}>{r.test_id}</td>
                  <td className="mono" style={{ fontSize: "12px" }}>
                    {r.failure_classification.join(", ")}
                  </td>
                  <td>
                    <span className={`badge ${sevClass(r.severity)}`}>{r.severity}</span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        r.overall_result === "CONDITIONAL_PASS" ? "badge-warn" : "badge-crit"
                      }`}
                    >
                      {r.overall_result}
                    </span>
                  </td>
                  <td>
                    <div>{r.evaluator_notes}</div>
                    <div style={{ fontSize: "12.5px", color: "var(--accent-green)", marginTop: 4 }}>
                      <strong>Fix:</strong> {r.recommended_action}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
