import React, { useMemo, useState } from "react";
import { Database, Download, Search, Eye, X } from "lucide-react";

function severityBadge(sev) {
  if (sev === "Critical") return "badge-crit";
  if (sev === "High") return "badge-high";
  if (sev === "Medium") return "badge-warn";
  return "badge-neutral";
}

function evidenceBadge(ev) {
  if (ev === "Supported") return "badge-pass";
  if (ev === "Contradicted") return "badge-crit";
  return "badge-warn";
}

export default function DatasetView({ dataset }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [severity, setSeverity] = useState("ALL");
  const [evidenceFilter, setEvidenceFilter] = useState("ALL");
  const [selectedScenario, setSelectedScenario] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return dataset.scenarios.filter((s) => {
      if (category !== "ALL" && s.category !== category) return false;
      if (severity !== "ALL" && s.failure_severity !== severity) return false;
      if (evidenceFilter !== "ALL" && s.expected_evidence_classification !== evidenceFilter) return false;
      if (!q) return true;
      return (
        s.test_id.toLowerCase().includes(q) ||
        s.scenario_description.toLowerCase().includes(q) ||
        s.input_prompt.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.failure_patterns_to_watch.toLowerCase().includes(q)
      );
    });
  }, [dataset.scenarios, search, category, severity, evidenceFilter]);

  return (
    <div className="stack-lg">
      <div className="page-header">
        <div className="page-kicker">
          <Database size={14} /> Reusable Evaluation Benchmark
        </div>
        <h2 className="page-title">Test Dataset ({dataset.scenarios.length} Scenarios Across 12 Categories)</h2>
        <p className="page-subtitle">
          Searchable, filterable scenario suite designed to be reused across different models and
          tool-using agents. Download directly as JSON or CSV.
        </p>
      </div>

      <section className="card">
        <div className="filter-bar">
          <div style={{ position: "relative" }} className="search-field">
            <Search
              size={15}
              style={{ position: "absolute", left: 10, top: 11, color: "var(--text-muted)" }}
            />
            <input
              type="search"
              className="input"
              style={{ width: "100%", paddingLeft: 32 }}
              placeholder="Search by Test ID, scenario, prompt, or FAIL-XX..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search test scenarios"
            />
          </div>

          <select
            className="select"
            aria-label="Filter by category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="ALL">All Categories (12)</option>
            {dataset.categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            className="select"
            aria-label="Filter by failure severity"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
          >
            <option value="ALL">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            className="select"
            aria-label="Filter by expected evidence"
            value={evidenceFilter}
            onChange={(e) => setEvidenceFilter(e.target.value)}
          >
            <option value="ALL">All Evidence Types</option>
            <option value="Supported">Supported</option>
            <option value="Contradicted">Contradicted</option>
            <option value="Not verifiable">Not verifiable</option>
          </select>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            marginBottom: 14
          }}
        >
          <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 600 }}>
            Showing {filtered.length} of {dataset.scenarios.length} scenarios
          </span>

          <div style={{ display: "flex", gap: 8 }}>
            <a
              className="btn btn-sm btn-secondary"
              href="./resources/evaluation_dataset.json"
              download="evaluation_dataset.json"
            >
              <Download size={14} /> Download JSON
            </a>
            <a
              className="btn btn-sm btn-primary"
              href="./resources/evaluation_dataset.csv"
              download="evaluation_dataset.csv"
            >
              <Download size={14} /> Download CSV
            </a>
          </div>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Test ID</th>
                <th>Category</th>
                <th>Scenario Description</th>
                <th>Evidence</th>
                <th>Severity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 28 }}>
                    No scenarios match your current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.test_id}>
                    <td className="mono" style={{ fontWeight: 700, color: "var(--accent-green)" }}>
                      {s.test_id}
                    </td>
                    <td style={{ fontWeight: 500 }}>{s.category}</td>
                    <td>{s.scenario_description}</td>
                    <td>
                      <span className={`badge ${evidenceBadge(s.expected_evidence_classification)}`}>
                        {s.expected_evidence_classification}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${severityBadge(s.failure_severity)}`}>
                        {s.failure_severity}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={() => setSelectedScenario(s)}
                      >
                        <Eye size={13} /> Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedScenario && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`Scenario ${selectedScenario.test_id}`}
          onClick={() => setSelectedScenario(null)}
        >
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <div>
                <span className="mono" style={{ fontWeight: 700, color: "var(--accent-teal)" }}>
                  {selectedScenario.test_id} • {selectedScenario.category}
                </span>
                <h3 className="card-title" style={{ marginTop: 4 }}>
                  {selectedScenario.scenario_description}
                </h3>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={() => setSelectedScenario(null)}
                aria-label="Close scenario details"
              >
                <X size={16} />
              </button>
            </div>

            <div className="stack-md" style={{ fontSize: "13.5px" }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span className={`badge ${evidenceBadge(selectedScenario.expected_evidence_classification)}`}>
                  Expected Evidence: {selectedScenario.expected_evidence_classification}
                </span>
                <span className={`badge ${severityBadge(selectedScenario.failure_severity)}`}>
                  Failure Severity: {selectedScenario.failure_severity}
                </span>
              </div>

              <div>
                <strong>Input Prompt:</strong>
                <div className="code-box" style={{ marginTop: 4 }}>
                  {selectedScenario.input_prompt}
                </div>
              </div>

              <div>
                <strong>Available Context / Evidence:</strong>
                <div
                  style={{
                    marginTop: 4,
                    padding: 10,
                    background: "var(--bg-subtle)",
                    borderRadius: "var(--radius-sm)"
                  }}
                >
                  {selectedScenario.available_context_or_evidence}
                </div>
              </div>

              <div>
                <strong>Expected Behaviour:</strong>
                <p style={{ margin: "4px 0 0", color: "var(--text-secondary)" }}>
                  {selectedScenario.expected_behavior}
                </p>
              </div>

              <div>
                <strong>Evaluation Criteria:</strong>
                <p style={{ margin: "4px 0 0", color: "var(--text-secondary)" }}>
                  {selectedScenario.evaluation_criteria}
                </p>
              </div>

              <div>
                <strong>Failure Patterns to Watch:</strong>
                <p style={{ margin: "4px 0 0", color: "var(--status-high-fg)", fontWeight: 500 }}>
                  {selectedScenario.failure_patterns_to_watch}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
