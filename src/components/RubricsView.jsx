import React, { useState } from "react";
import { ClipboardCheck, ChevronDown, ChevronUp, ShieldAlert, Sliders } from "lucide-react";
import { DIMENSION_KEYS, evaluateRecordOutcome } from "../utils/scoring.js";

export default function RubricsView({ rubric }) {
  const [expandedDim, setExpandedDim] = useState("A");
  const [presetKey, setPresetKey] = useState("tool_using_agent");
  const [simScores, setSimScores] = useState({
    A_factual_accuracy: 4,
    B_instruction_following: 3,
    C_reasoning_consistency: 3,
    D_uncertainty_handling: 3,
    E_tool_use_reliability: 3,
    F_task_completion: 3,
    G_safety_compliance: 4
  });
  const [simSeverity, setSimSeverity] = useState("None");
  const [isGroundedTask, setIsGroundedTask] = useState(true);

  const activePreset = rubric.weighting_policy.presets[presetKey];
  const simResult = evaluateRecordOutcome(simScores, activePreset.weights, simSeverity, isGroundedTask);

  const toggleDim = (id) => {
    setExpandedDim((prev) => (prev === id ? null : id));
  };

  const resultBadgeClass =
    simResult.overallResult === "PASS"
      ? "badge-pass"
      : simResult.overallResult === "CONDITIONAL_PASS"
        ? "badge-warn"
        : "badge-crit";

  return (
    <div className="stack-lg">
      <div className="page-header">
        <div className="page-kicker">
          <ClipboardCheck size={14} /> Evaluation Rubrics
        </div>
        <h2 className="page-title">7-Dimension Scoring Rubric &amp; Critical-Failure Overrides</h2>
        <p className="page-subtitle">
          Each dimension uses a dimension-specific 0–4 scale. Weights are configurable per deployment
          profile, and Critical-Failure Overrides prevent unsafe outputs from hiding behind high averages.
        </p>
      </div>

      {/* Interactive Weighting & Critical-Override Simulator */}
      <section className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Sliders size={16} style={{ verticalAlign: "text-bottom", marginRight: 6 }} />
              Interactive Rubric Calculator &amp; Critical-Override Tester
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-secondary)" }}>
              Test how configurable weighting profiles and Critical-Failure Overrides compute the final verdict.
              Try setting Dimension G to <code>0</code> while keeping all other dimensions at <code>4</code>.
            </p>
          </div>
          <span className={`badge ${resultBadgeClass}`}>
            {simResult.overallResult} ({simResult.weightedScorePct}%)
          </span>
        </div>

        <div className="filter-bar">
          <label style={{ fontSize: "13px", fontWeight: 600 }}>
            Weighting Profile:{" "}
            <select
              className="select"
              value={presetKey}
              onChange={(e) => setPresetKey(e.target.value)}
            >
              {Object.entries(rubric.weighting_policy.presets).map(([k, p]) => (
                <option key={k} value={k}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>

          <label style={{ fontSize: "13px", fontWeight: 600 }}>
            Logged Failure Severity:{" "}
            <select
              className="select"
              value={simSeverity}
              onChange={(e) => setSimSeverity(e.target.value)}
            >
              <option value="None">None</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </label>

          <label style={{ fontSize: "13px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <input
              type="checkbox"
              checked={isGroundedTask}
              onChange={(e) => setIsGroundedTask(e.target.checked)}
            />
            Source-Grounded / High-Stakes Task (CFO-04)
          </label>
        </div>

        <p style={{ margin: "0 0 12px", fontSize: "13px", color: "var(--text-muted)" }}>
          <strong>Profile Note:</strong> {activePreset.description}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: 10,
            marginBottom: 12
          }}
        >
          {DIMENSION_KEYS.map((d) => {
            const val = simScores[d.key];
            const weight = activePreset.weights[d.id];
            return (
              <div
                key={d.id}
                style={{
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-sm)",
                  padding: "10px 12px",
                  background: "var(--bg-page)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", fontWeight: 600 }}>
                  <span>{d.label}</span>
                  <span className="mono" style={{ color: "var(--accent-teal)" }}>
                    {weight}%
                  </span>
                </div>
                <select
                  className="select"
                  style={{ width: "100%", marginTop: 6 }}
                  aria-label={`Score for ${d.label}`}
                  value={val === null ? "NA" : String(val)}
                  onChange={(e) => {
                    const nextVal = e.target.value === "NA" ? null : Number(e.target.value);
                    setSimScores((prev) => ({ ...prev, [d.key]: nextVal }));
                  }}
                >
                  <option value="4">4 – Excellent</option>
                  <option value="3">3 – Meets expectations</option>
                  <option value="2">2 – Partially meets</option>
                  <option value="1">1 – Poor</option>
                  <option value="0">0 – Critical failure</option>
                  {d.id === "E" && <option value="NA">N/A (Non-tool task)</option>}
                </select>
              </div>
            );
          })}
        </div>

        {simResult.criticalOverride && (
          <div className="banner banner-crit">
            <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>Critical-Failure Override Triggered:</strong> Even though the weighted score
              is <strong>{simResult.weightedScorePct}%</strong>, the final verdict is forced to{" "}
              <code>FAIL_CRITICAL_OVERRIDE</code>:
              <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
                {simResult.overrideReasons.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      {/* Expandable Rubric Dimensions Table */}
      <section className="stack-md">
        <h3 className="card-title" style={{ fontSize: "18px" }}>
          Dimension Definitions &amp; 0–4 Scales (Click any dimension to expand)
        </h3>

        {rubric.dimensions.map((dim) => {
          const isOpen = expandedDim === dim.id;
          return (
            <div className="card" key={dim.id} style={{ padding: 0, overflow: "hidden" }}>
              <button
                type="button"
                onClick={() => toggleDim(dim.id)}
                aria-expanded={isOpen}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  background: isOpen ? "var(--bg-tint-teal)" : "var(--bg-surface)",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit"
                }}
              >
                <div>
                  <span className="badge badge-teal" style={{ marginRight: 10 }}>
                    Dimension {dim.id} • Default {dim.default_weight}%
                  </span>
                  <strong style={{ fontSize: "16px", color: "var(--text-primary)" }}>
                    {dim.name}
                  </strong>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: 4 }}>
                    {dim.definition}
                  </div>
                </div>
                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {isOpen && (
                <div style={{ padding: "18px 20px", borderTop: "1px solid var(--border-color)" }} className="stack-md">
                  <div>
                    <strong style={{ fontSize: "13px", textTransform: "uppercase", color: "var(--accent-green)" }}>
                      Evaluation Questions
                    </strong>
                    <ul style={{ margin: "6px 0 0", paddingLeft: 20, color: "var(--text-secondary)", fontSize: "13.5px" }}>
                      {dim.evaluation_questions.map((q) => (
                        <li key={q}>{q}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="table-wrap">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Score</th>
                          <th>Label</th>
                          <th>Dimension-Specific Criterion</th>
                        </tr>
                      </thead>
                      <tbody>
                        {["4", "3", "2", "1", "0"].map((scoreKey) => (
                          <tr key={scoreKey}>
                            <td className="mono" style={{ fontWeight: 700 }}>{scoreKey}</td>
                            <td style={{ fontWeight: 600 }}>{rubric.scoring_scale[scoreKey]}</td>
                            <td>{dim.scale[scoreKey]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="grid-2">
                    <div
                      style={{
                        padding: 12,
                        borderRadius: "var(--radius-sm)",
                        background: "var(--status-pass-bg)",
                        border: "1px solid var(--status-pass-bd)",
                        fontSize: "13px"
                      }}
                    >
                      <strong style={{ color: "var(--status-pass-fg)" }}>Good Performance Example:</strong>
                      <div style={{ marginTop: 4, color: "var(--text-primary)" }}>{dim.good_example}</div>
                    </div>

                    <div
                      style={{
                        padding: 12,
                        borderRadius: "var(--radius-sm)",
                        background: "var(--status-crit-bg)",
                        border: "1px solid var(--status-crit-bd)",
                        fontSize: "13px"
                      }}
                    >
                      <strong style={{ color: "var(--status-crit-fg)" }}>Poor Performance Example:</strong>
                      <div style={{ marginTop: 4, color: "var(--text-primary)" }}>{dim.poor_example}</div>
                    </div>
                  </div>

                  <div className="grid-2" style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                    <div>
                      <strong>Pass / Fail Conditions:</strong> {dim.pass_condition} | {dim.fail_condition}
                    </div>
                    <div>
                      <strong>Evidence Requirements:</strong> {dim.evidence_requirements}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Critical-Failure Override Rules Table */}
      <section className="card">
        <h3 className="card-title" style={{ marginBottom: 10 }}>
          Critical-Failure Override Rules
        </h3>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Rule ID</th>
                <th>Trigger Condition</th>
                <th>Override Effect</th>
                <th>Rationale</th>
              </tr>
            </thead>
            <tbody>
              {rubric.critical_failure_overrides.map((rule) => (
                <tr key={rule.rule_id}>
                  <td className="mono" style={{ fontWeight: 700, color: "#991b1b" }}>{rule.rule_id}</td>
                  <td style={{ fontWeight: 600 }}>{rule.condition}</td>
                  <td><span className="badge badge-crit">{rule.effect}</span></td>
                  <td>{rule.rationale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
