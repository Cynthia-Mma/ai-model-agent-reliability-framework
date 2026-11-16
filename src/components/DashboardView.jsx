import React, { useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { BarChart3, AlertTriangle, Upload, RotateCcw, GitCompare } from "lucide-react";
import {
  computeDashboardMetrics,
  compareModelVersions,
  validateEvaluationRecords
} from "../utils/scoring.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function DashboardView({ evaluationData, rubric, taxonomy }) {
  const [presetKey, setPresetKey] = useState("tool_using_agent");
  const [customRecords, setCustomRecords] = useState(null);
  const [compareWithDemo, setCompareWithDemo] = useState(true);
  const [importStatus, setImportStatus] = useState(null);
  const [selectedModelFilter, setSelectedModelFilter] = useState("ALL");

  const activePreset = rubric.weighting_policy.presets[presetKey];

  const allRecords = useMemo(() => {
    if (!customRecords) return evaluationData.records;
    return compareWithDemo ? [...evaluationData.records, ...customRecords] : customRecords;
  }, [evaluationData.records, customRecords, compareWithDemo]);

  const versionComparisons = useMemo(
    () => compareModelVersions(allRecords, activePreset.weights, taxonomy.failures),
    [allRecords, activePreset.weights, taxonomy.failures]
  );

  const filteredRecords = useMemo(() => {
    if (selectedModelFilter === "ALL") return allRecords;
    return allRecords.filter(
      (r) =>
        `${r.model_or_agent_name || "Unknown Model"} (${r.model_version_identifier || "unversioned"})` ===
        selectedModelFilter
    );
  }, [allRecords, selectedModelFilter]);

  const metrics = useMemo(
    () => computeDashboardMetrics(filteredRecords, activePreset.weights, taxonomy.failures),
    [filteredRecords, activePreset.weights, taxonomy.failures]
  );

  const handleJsonUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const validation = validateEvaluationRecords(parsed);
      if (!validation.valid) {
        setImportStatus({ ok: false, message: validation.error });
        return;
      }
      const tagged = validation.records.map((r) => ({
        ...r,
        is_illustrative_demo: r.is_illustrative_demo ?? false
      }));
      setCustomRecords(tagged);
      setSelectedModelFilter("ALL");
      setImportStatus({
        ok: true,
        message: `Loaded ${tagged.length} evaluation record(s) from ${file.name}.`
      });
    } catch (err) {
      setImportStatus({ ok: false, message: `Invalid JSON file: ${err.message}` });
    } finally {
      event.target.value = "";
    }
  };

  const resetDemo = () => {
    setCustomRecords(null);
    setSelectedModelFilter("ALL");
    setImportStatus(null);
  };

  const dimensionChartData = {
    labels: metrics.dimensionAverages.map((d) => `${d.id}. ${d.label.split(". ")[1]}`),
    datasets: [
      {
        label: "Mean Score (0–4 Scale)",
        data: metrics.dimensionAverages.map((d) => d.averageScore),
        backgroundColor: metrics.dimensionAverages.map((d) =>
          d.averageScore >= 3 ? "#0f766e" : d.averageScore >= 2 ? "#d97706" : "#dc2626"
        ),
        borderRadius: 6
      }
    ]
  };

  const failureChartData = {
    labels:
      metrics.failureDistribution.length > 0
        ? metrics.failureDistribution.map((f) => `${f.failureId}: ${f.name}`)
        : ["No Failures Logged"],
    datasets: [
      {
        label: "Occurrences",
        data:
          metrics.failureDistribution.length > 0
            ? metrics.failureDistribution.map((f) => f.count)
            : [0],
        backgroundColor: "#166534",
        borderRadius: 5
      }
    ]
  };

  const severityOrder = ["None", "Low", "Medium", "High", "Critical"];
  const severityChartData = {
    labels: severityOrder,
    datasets: [
      {
        label: "Records",
        data: severityOrder.map((k) => metrics.severityCounts[k] || 0),
        backgroundColor: ["#10b981", "#64748b", "#f59e0b", "#ea580c", "#b91c1c"]
      }
    ]
  };

  const passFailChartData = {
    labels: ["PASS", "CONDITIONAL PASS", "FAIL", "FAIL (Critical Override)"],
    datasets: [
      {
        data: [
          metrics.resultCounts.PASS,
          metrics.resultCounts.CONDITIONAL_PASS,
          metrics.resultCounts.FAIL,
          metrics.resultCounts.FAIL_CRITICAL_OVERRIDE
        ],
        backgroundColor: ["#059669", "#d97706", "#ea580c", "#991b1b"]
      }
    ]
  };

  const evidenceOrder = ["Supported", "Contradicted", "Not verifiable"];
  const evidenceChartData = {
    labels: evidenceOrder,
    datasets: [
      {
        data: evidenceOrder.map((k) => metrics.evidenceCounts[k] || 0),
        backgroundColor: ["#0f766e", "#b91c1c", "#d97706"]
      }
    ]
  };

  return (
    <div className="stack-lg">
      <div className="page-header">
        <div className="page-kicker">
          <BarChart3 size={14} /> Evaluation Analytics
        </div>
        <h2 className="page-title">Evaluation Dashboard &amp; Multi-Version Comparison</h2>
        <p className="page-subtitle">
          Every KPI, chart, and verdict below is computed dynamically from underlying evaluation
          records. Switch weighting profiles or import additional model evaluation JSON files to
          compare runs side by side.
        </p>
      </div>

      <div className="banner banner-warn">
        <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <strong>{evaluationData.dataset_label}:</strong> {evaluationData.disclaimer}
        </div>
      </div>

      {/* Controls & Import Bar */}
      <div className="card stack-md">
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
            <label style={{ fontSize: "13.5px", fontWeight: 600 }}>
              Weighting Profile:{" "}
              <select
                className="select"
                aria-label="Select dashboard weighting profile"
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

            {versionComparisons.length > 1 && (
              <label style={{ fontSize: "13.5px", fontWeight: 600 }}>
                Filter Model/Version:{" "}
                <select
                  className="select"
                  aria-label="Filter dashboard by model version"
                  value={selectedModelFilter}
                  onChange={(e) => setSelectedModelFilter(e.target.value)}
                >
                  <option value="ALL">All Loaded Runs ({allRecords.length} records)</option>
                  {versionComparisons.map((v) => (
                    <option key={v.modelVersion} value={v.modelVersion}>
                      {v.modelVersion} ({v.totalEvaluated})
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <label className="btn btn-sm btn-secondary" style={{ cursor: "pointer" }}>
              <Upload size={14} /> Import Model Run JSON
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleJsonUpload}
                style={{ display: "none" }}
                aria-label="Import evaluation JSON records"
              />
            </label>

            {customRecords && (
              <>
                <label style={{ fontSize: "12.5px", display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <input
                    type="checkbox"
                    checked={compareWithDemo}
                    onChange={(e) => setCompareWithDemo(e.target.checked)}
                  />
                  Include Demo Baseline
                </label>
                <button type="button" className="btn btn-sm btn-secondary" onClick={resetDemo}>
                  <RotateCcw size={14} /> Reset to Demo
                </button>
              </>
            )}
          </div>
        </div>

        {importStatus && (
          <div className={`banner ${importStatus.ok ? "banner-info" : "banner-crit"}`}>
            {importStatus.message}
          </div>
        )}
      </div>

      {/* Multi-Model / Multi-Version Comparison Table */}
      <section className="card">
        <div className="card-header">
          <h3 className="card-title">
            <GitCompare size={16} style={{ verticalAlign: "text-bottom", marginRight: 6 }} />
            Model &amp; Version Comparison Matrix
          </h3>
          <span className="badge badge-neutral">
            {versionComparisons.length} {versionComparisons.length === 1 ? "Version Loaded" : "Versions Compared"}
          </span>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Model / Version</th>
                <th>Data Source</th>
                <th>Cases</th>
                <th>Mean Weighted %</th>
                <th>Pass Rate</th>
                <th>Critical Overrides</th>
                <th>Mean A / E / G</th>
              </tr>
            </thead>
            <tbody>
              {versionComparisons.map((v) => {
                const dimA = v.dimensionAverages.find((d) => d.id === "A")?.averageScore ?? 0;
                const dimE = v.dimensionAverages.find((d) => d.id === "E")?.averageScore ?? 0;
                const dimG = v.dimensionAverages.find((d) => d.id === "G")?.averageScore ?? 0;
                return (
                  <tr key={v.modelVersion}>
                    <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{v.modelVersion}</td>
                    <td>
                      <span className={`badge ${v.isIllustrative ? "badge-warn" : "badge-pass"}`}>
                        {v.isIllustrative ? "Illustrative Demo" : "Imported Run"}
                      </span>
                    </td>
                    <td className="mono">{v.totalEvaluated}</td>
                    <td className="mono" style={{ fontWeight: 700 }}>{v.avgWeightedPct}%</td>
                    <td className="mono">{v.passRatePct}%</td>
                    <td className="mono">{v.criticalOverridesCount}</td>
                    <td className="mono">{dimA} / {dimE} / {dimG}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* KPI Strip */}
      <section className="grid-4">
        <div className="kpi-card green">
          <div className="kpi-label">Evaluated Scenarios</div>
          <div className="kpi-value">{metrics.totalEvaluated}</div>
          <div className="kpi-note">Mean Weighted Score: {metrics.avgWeightedPct}%</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Pass Rate</div>
          <div className="kpi-value">{metrics.passRatePct}%</div>
          <div className="kpi-note">
            {metrics.resultCounts.PASS} of {metrics.totalEvaluated} passed cleanly
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Conditional Pass</div>
          <div className="kpi-value">{metrics.conditionalRatePct}%</div>
          <div className="kpi-note">{metrics.resultCounts.CONDITIONAL_PASS} partial-performing cases</div>
        </div>
        <div className="kpi-card critical">
          <div className="kpi-label">Total Fail / Overrides</div>
          <div className="kpi-value">{metrics.failRatePct}%</div>
          <div className="kpi-note">{metrics.criticalOverridesCount} Critical-Failure Overrides</div>
        </div>
      </section>

      {/* Charts Row 1 */}
      <section className="grid-2">
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 12 }}>
            Mean Score by Evaluation Dimension (0–4 Scale)
          </h3>
          <div className="chart-box">
            <Bar
              data={dimensionChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: { min: 0, max: 4, ticks: { stepSize: 1 } }
                },
                plugins: { legend: { display: false } }
              }}
            />
          </div>
        </div>

        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 12 }}>
            Failure Distribution by Taxonomy Code
          </h3>
          <div className="chart-box">
            <Bar
              data={failureChartData}
              options={{
                indexAxis: "y",
                responsive: true,
                maintainAspectRatio: false,
                scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } },
                plugins: { legend: { display: false } }
              }}
            />
          </div>
        </div>
      </section>

      {/* Charts Row 2 */}
      <section className="grid-3">
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 12 }}>
            Pass / Conditional / Fail Outcomes
          </h3>
          <div className="chart-box" style={{ height: 250 }}>
            <Doughnut
              data={passFailChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "bottom" } }
              }}
            />
          </div>
        </div>

        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 12 }}>
            Severity Distribution
          </h3>
          <div className="chart-box" style={{ height: 250 }}>
            <Doughnut
              data={severityChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "bottom" } }
              }}
            />
          </div>
        </div>

        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 12 }}>
            Evidence Classification Distribution
          </h3>
          <div className="chart-box" style={{ height: 250 }}>
            <Doughnut
              data={evidenceChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "bottom" } }
              }}
            />
          </div>
        </div>
      </section>

      {/* Record Score Summary Table */}
      <section className="card">
        <h3 className="card-title" style={{ marginBottom: 12 }}>
          Computed Record Scorecard ({activePreset.label})
        </h3>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Test ID</th>
                <th>Model / Version</th>
                <th>Scenario</th>
                <th>Evidence</th>
                <th>Weighted %</th>
                <th>Severity</th>
                <th>Computed Verdict</th>
              </tr>
            </thead>
            <tbody>
              {metrics.enrichedRecords.map((r, idx) => (
                <tr key={`${r.test_id}-${r.model_version_identifier || idx}`}>
                  <td className="mono" style={{ fontWeight: 700 }}>{r.test_id}</td>
                  <td style={{ fontSize: "12px" }}>{r.model_version_identifier || "unversioned"}</td>
                  <td>{r.scenario_title || r.input_prompt?.slice(0, 60)}</td>
                  <td>{r.evidence_classification}</td>
                  <td className="mono" style={{ fontWeight: 700 }}>{r.computed_weighted_score_pct}%</td>
                  <td>{r.severity}</td>
                  <td>
                    <span
                      className={`badge ${
                        r.computed_result === "PASS"
                          ? "badge-pass"
                          : r.computed_result === "CONDITIONAL_PASS"
                            ? "badge-warn"
                            : "badge-crit"
                      }`}
                    >
                      {r.computed_result}
                    </span>
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
