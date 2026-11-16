import React from "react";
import {
  ArrowRight,
  ShieldCheck,
  Database,
  Cpu,
  BarChart3,
  ClipboardCheck,
  FileText
} from "lucide-react";

const LIFECYCLE_STEPS = [
  "Define evaluation objectives",
  "Establish measurable criteria",
  "Design test scenarios & datasets",
  "Evaluate model responses",
  "Score outputs via transparent rubrics",
  "Classify failures & severity risks",
  "Analyse recurring failure patterns",
  "Produce evidence-backed findings",
  "Recommend corrective actions",
  "Re-evaluate to verify improvements"
];

export default function HomeView({ onNavigate, totalScenarios, totalFailures, totalRecords }) {
  return (
    <div className="stack-lg">
      <section className="hero-box">
        <span className="badge badge-teal" style={{ marginBottom: 10 }}>
          AI Quality Engineering Portfolio Project
        </span>
        <h2
          style={{
            margin: "0 0 10px",
            fontSize: "30px",
            lineHeight: 1.18,
            color: "var(--accent-green)",
            letterSpacing: "-0.02em"
          }}
        >
          AI Model &amp; Agent Reliability Evaluation Framework
        </h2>
        <p style={{ margin: "0 0 16px", fontSize: "16px", color: "var(--text-secondary)", maxWidth: 820 }}>
          An evidence-first framework for evaluating model accuracy, instruction-following,
          tool-use reliability, and AI agent performance.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            alignItems: "center",
            marginBottom: 18
          }}
        >
          <span className="badge badge-pass">Author: Cynthia Agwaraonye</span>
          <span className="badge badge-neutral">
            Senior QA Engineer | AI Model Evaluation &amp; Training | Prompt &amp; Context Engineering | Data Quality
          </span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <button type="button" className="btn btn-primary" onClick={() => onNavigate("dashboard")}>
            <BarChart3 size={16} />
            Explore Evaluation Dashboard
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => onNavigate("rubrics")}>
            <ClipboardCheck size={16} />
            Interactive Rubric &amp; Overrides
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => onNavigate("dataset")}>
            <Database size={16} />
            Browse {totalScenarios} Test Scenarios
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => onNavigate("case-study")}>
            <FileText size={16} />
            Read HeliosOps Case Study
          </button>
        </div>
      </section>

      <section className="grid-4">
        <div className="kpi-card green">
          <div className="kpi-label">Evaluation Dimensions</div>
          <div className="kpi-value">7</div>
          <div className="kpi-note">0–4 custom-defined scales + Critical Overrides</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Test Scenarios</div>
          <div className="kpi-value">{totalScenarios}</div>
          <div className="kpi-note">12 risk categories • JSON &amp; CSV ready</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Failure Taxonomy</div>
          <div className="kpi-value">{totalFailures}</div>
          <div className="kpi-note">Classified by detection method &amp; severity</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Case Study Records</div>
          <div className="kpi-value">{totalRecords}</div>
          <div className="kpi-note">Illustrative Strong, Partial &amp; Failing runs</div>
        </div>
      </section>

      <section className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">What This Framework Evaluates</h3>
            <ShieldCheck size={18} color="var(--accent-teal)" />
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, color: "var(--text-secondary)" }}>
            <li>
              <strong>Evidence Grounding:</strong> Classifies every claim as <em>Supported</em>,{" "}
              <em>Contradicted</em>, or <em>Not verifiable</em>—never rewarding fluent speculation.
            </li>
            <li>
              <strong>Instruction &amp; Constraint Adherence:</strong> Verifies negative constraints,
              deliverables, and strict output schemas (JSON, tables, limits).
            </li>
            <li>
              <strong>Uncertainty &amp; Conflict Handling:</strong> Rewards honest abstention and targeted
              clarifying questions when inputs are missing or contradictory.
            </li>
            <li>
              <strong>Tool-Use &amp; Agent Reliability:</strong> Audits tool selection, schema/argument
              grounding, simulated error recovery (404/422/503), post-action verification, and RBAC safety.
            </li>
          </ul>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Author Background</h3>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => onNavigate("author")}
            >
              Full Profile <ArrowRight size={14} />
            </button>
          </div>
          <p style={{ margin: "0 0 10px", color: "var(--text-secondary)", fontSize: "14px" }}>
            <strong>Cynthia Agwaraonye</strong> is a Quality Assurance Engineer with 4+ years of
            experience across healthcare, fintech, edtech, and marketplace platforms—specialising in
            manual, API, security, performance testing, and CI/CD release gates.
          </p>
          <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "14px" }}>
            She pairs software QA discipline with AI evaluation and training expertise, including{" "}
            <strong>1,000+ annotated videos at 97% accuracy</strong> and{" "}
            <strong>HNG curriculum &amp; rubric-based assessment supporting 10,000+ learners</strong>.
          </p>
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <h3 className="card-title">End-to-End 10-Step Evaluation Lifecycle</h3>
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={() => onNavigate("methodology")}
          >
            Methodology Details <ArrowRight size={14} />
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: 10
          }}
        >
          {LIFECYCLE_STEPS.map((step, i) => (
            <div
              key={step}
              style={{
                padding: "10px 12px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-color)",
                background: "var(--bg-page)"
              }}
            >
              <span
                className="mono"
                style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-teal)" }}
              >
                STEP {String(i + 1).padStart(2, "0")}
              </span>
              <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-primary)" }}>
                {step}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid-3">
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 6 }}>
            <Cpu size={16} style={{ verticalAlign: "text-bottom", marginRight: 6 }} />
            Simulated Agent Traces
          </h3>
          <p style={{ margin: "0 0 12px", fontSize: "13.5px", color: "var(--text-secondary)" }}>
            Inspect expected vs. defective multi-step traces across 11 agent failure modes without
            claiming live external integrations.
          </p>
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={() => onNavigate("agent-reliability")}
          >
            Open Agent Reliability <ArrowRight size={14} />
          </button>
        </div>

        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 6 }}>
            Failure Taxonomy &amp; Fixes
          </h3>
          <p style={{ margin: "0 0 12px", fontSize: "13.5px", color: "var(--text-secondary)" }}>
            Explore all 15 failure classifications (`FAIL-01`–`FAIL-15`), Severity vs. Rubric Score
            rules, and concrete corrective actions.
          </p>
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={() => onNavigate("failure-analysis")}
          >
            Open Failure Analysis <ArrowRight size={14} />
          </button>
        </div>

        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 6 }}>
            Downloadable Artefacts
          </h3>
          <p style={{ margin: "0 0 12px", fontSize: "13.5px", color: "var(--text-secondary)" }}>
            Preview or download the Rubric, 48-scenario Dataset (JSON/CSV), Record Template, Sample
            Report, and Project QA Report.
          </p>
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={() => onNavigate("reports")}
          >
            Open Reports &amp; Resources <ArrowRight size={14} />
          </button>
        </div>
      </section>
    </div>
  );
}
