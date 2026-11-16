import React from "react";
import { Compass, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";

const PRINCIPLES = [
  {
    title: "Evidence over fluency",
    detail: "An eloquent, well-formatted response never receives a high accuracy score unless its claims are verified against supplied context or tool outputs."
  },
  {
    title: "Accuracy over confidence",
    detail: "Confident fabrication is penalised more severely than an honest, well-scoped refusal."
  },
  {
    title: "Instruction-following over superficial relevance",
    detail: "Addressing the general topic while violating explicit negative constraints or output schemas is scored as an instruction failure."
  },
  {
    title: "Explicit uncertainty over fabricated information",
    detail: "When context is missing or ambiguous, models must disclose gaps and ask targeted clarifying questions rather than guessing."
  },
  {
    title: "Reproducible evaluation over subjective judgment",
    detail: "Every 0–4 score maps to dimension-specific criteria, explicit weights, and deterministic Critical-Failure Override rules."
  },
  {
    title: "Traceable findings over unsupported conclusions",
    detail: "Evaluators must cite the exact context passage, prompt constraint, or simulated tool JSON payload backing each score."
  },
  {
    title: "Measurable improvements over vague recommendations",
    detail: "Each failure triggers a hypothesis, targeted fix, expected post-fix behavior, and explicit retest gate—never invented improvement percentages."
  }
];

const TEN_STEPS = [
  { step: "01", title: "Define evaluation objectives", desc: "Tie evaluation scope to concrete deployment risks (grounding, format compliance, tool safety, RBAC)." },
  { step: "02", title: "Establish measurable criteria", desc: "Select use-case-appropriate dimension weights (A–G) and Critical-Failure Override triggers." },
  { step: "03", title: "Design test scenarios & datasets", desc: "Author non-repetitive scenarios with ground-truth evidence, expected behaviour, and failure traps." },
  { step: "04", title: "Evaluate model responses", desc: "Record verbatim outputs and complete simulated tool-call sequences without altering payloads." },
  { step: "05", title: "Classify claims by evidence", desc: "Assign Supported, Contradicted, or Not verifiable per material claim before scoring." },
  { step: "06", title: "Score outputs via transparent rubrics", desc: "Apply bespoke 0–4 scale definitions for every active dimension." },
  { step: "07", title: "Classify failures & risks", desc: "Tag FAIL-01 to FAIL-15 codes and operational Severity (Critical, High, Medium, Low)." },
  { step: "08", title: "Analyse recurring failure patterns", desc: "Compute dimension means, failure frequencies, and pass/override rates directly from records." },
  { step: "09", title: "Produce evidence-backed findings", desc: "Deliver structured reports clearly separating confirmed observations from root-cause hypotheses." },
  { step: "10", title: "Recommend actions & re-evaluate", desc: "Implement targeted fixes and re-run regression benchmarks to verify genuine improvement." }
];

export default function MethodologyView({ rubric }) {
  return (
    <div className="stack-lg">
      <div className="page-header">
        <div className="page-kicker">
          <Compass size={14} /> Evaluation Methodology
        </div>
        <h2 className="page-title">Evidence-First Evaluation Philosophy &amp; Lifecycle</h2>
        <p className="page-subtitle">
          Applying software quality engineering discipline—traceability, risk-based prioritisation,
          deterministic assertions, and release gating—to AI models and tool-using agents.
        </p>
      </div>

      <section className="stack-md">
        <h3 className="card-title" style={{ fontSize: "18px" }}>
          1. Three Explicit Evidence Classifications
        </h3>
        <div className="grid-3">
          {rubric.evidence_classifications.map((ev) => {
            const isSup = ev.label === "Supported";
            const isCon = ev.label === "Contradicted";
            const Icon = isSup ? CheckCircle2 : isCon ? AlertCircle : HelpCircle;
            const badgeCls = isSup ? "badge-pass" : isCon ? "badge-crit" : "badge-warn";
            return (
              <div className="card" key={ev.label}>
                <div style={{ marginBottom: 10 }}>
                  <span className={`badge ${badgeCls}`}>
                    <Icon size={13} /> {ev.label}
                  </span>
                </div>
                <p style={{ margin: "0 0 8px", fontSize: "14px", color: "var(--text-primary)", fontWeight: 500 }}>
                  {ev.definition}
                </p>
                <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>
                  <strong>Evaluator Rule:</strong> {ev.evaluator_guidance}
                </p>
              </div>
            );
          })}
        </div>
        <div className="banner banner-info">
          <strong>Key Principle:</strong> Never treat a <em>Not verifiable</em> claim as automatically
          false. Instead, score Dimension D (Uncertainty handling) on whether the model clearly disclosed
          the missing evidence rather than presenting a guess as fact.
        </div>
      </section>

      <section className="stack-md">
        <h3 className="card-title" style={{ fontSize: "18px" }}>
          2. Seven Core Evaluation Principles
        </h3>
        <div className="grid-2">
          {PRINCIPLES.map((p, idx) => (
            <div className="card" key={p.title}>
              <div className="mono" style={{ fontSize: "11.5px", color: "var(--accent-teal)", fontWeight: 700 }}>
                PRINCIPLE {idx + 1}
              </div>
              <h4 style={{ margin: "4px 0 6px", fontSize: "15.5px", color: "var(--text-primary)" }}>
                {p.title}
              </h4>
              <p style={{ margin: 0, fontSize: "13.5px", color: "var(--text-secondary)" }}>
                {p.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h3 className="card-title" style={{ marginBottom: 14, fontSize: "18px" }}>
          3. Complete 10-Step Evaluation Lifecycle
        </h3>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Step</th>
                <th>Stage</th>
                <th>Operational Activity</th>
              </tr>
            </thead>
            <tbody>
              {TEN_STEPS.map((s) => (
                <tr key={s.step}>
                  <td className="mono" style={{ fontWeight: 700, color: "var(--accent-green)" }}>
                    {s.step}
                  </td>
                  <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{s.title}</td>
                  <td>{s.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
