import React, { useState } from "react";
import { Cpu, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function AgentReliabilityView({ traces }) {
  const [selectedTraceId, setSelectedTraceId] = useState(traces.simulated_traces[0]?.trace_id || "");

  const activeTrace =
    traces.simulated_traces.find((t) => t.trace_id === selectedTraceId) || traces.simulated_traces[0];

  return (
    <div className="stack-lg">
      <div className="page-header">
        <div className="page-kicker">
          <Cpu size={14} /> Agent &amp; Tool-Use Reliability
        </div>
        <h2 className="page-title">Evaluating Tool-Using AI Agents &amp; Execution Traces</h2>
        <p className="page-subtitle">
          Structured verification of tool selection, schema grounding, error recovery, causal
          ordering, outcome verification, and authorization compliance.
        </p>
      </div>

      <div className="banner banner-warn">
        <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <strong>Simulated Tool-Use Notice:</strong> {traces.simulation_notice}
        </div>
      </div>

      {/* 8-Step Agent Lifecycle */}
      <section className="card">
        <h3 className="card-title" style={{ marginBottom: 12 }}>
          8-Step Multi-Step Agent Evaluation Checklist
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: 10
          }}
        >
          {traces.eight_step_agent_lifecycle.map((s) => (
            <div
              key={s.step}
              style={{
                padding: 12,
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-color)",
                background: "var(--bg-page)"
              }}
            >
              <div className="mono" style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-teal)" }}>
                STEP {s.step}
              </div>
              <div style={{ fontWeight: 700, fontSize: "14px", margin: "2px 0 4px" }}>{s.name}</div>
              <div style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>{s.check}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Simulated Execution Trace Viewer */}
      <section className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Interactive Simulated Tool-Call Trace Viewer</h3>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-secondary)" }}>
              Select a multi-step scenario to inspect expected execution steps vs. observed demo defects.
            </p>
          </div>
          <span className="badge badge-warn">{activeTrace.simulation_type}</span>
        </div>

        <div className="filter-bar">
          {traces.simulated_traces.map((t) => (
            <button
              key={t.trace_id}
              type="button"
              className={`btn btn-sm ${t.trace_id === activeTrace.trace_id ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setSelectedTraceId(t.trace_id)}
            >
              {t.test_id}: {t.trace_id}
            </button>
          ))}
        </div>

        <div className="stack-md">
          <div>
            <strong style={{ fontSize: "15px" }}>{activeTrace.title}</strong>
            <div className="code-box" style={{ marginTop: 6 }}>
              Prompt: {activeTrace.prompt}
            </div>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Step</th>
                  <th>Tool / Action</th>
                  <th>Arguments</th>
                  <th>Simulated Tool Response</th>
                  <th>QA Assertion</th>
                </tr>
              </thead>
              <tbody>
                {activeTrace.expected_trace.map((row) => (
                  <tr key={row.step}>
                    <td className="mono" style={{ fontWeight: 700 }}>{row.step}</td>
                    <td className="mono" style={{ fontWeight: 600, color: "var(--accent-green)" }}>
                      {row.action}
                    </td>
                    <td className="mono" style={{ fontSize: "12px" }}>{row.args}</td>
                    <td className="mono" style={{ fontSize: "12px" }}>{row.simulated_response}</td>
                    <td>
                      <CheckCircle2
                        size={13}
                        color="var(--accent-teal)"
                        style={{ verticalAlign: "text-bottom", marginRight: 5 }}
                      />
                      {row.check}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="banner banner-info">
            <strong>Case Study Comparison Note:</strong> {activeTrace.observed_demo_defect}
          </div>
        </div>
      </section>

      {/* 11 Required Agent Failure Checks */}
      <section className="card">
        <h3 className="card-title" style={{ marginBottom: 12 }}>
          11 Agent &amp; Tool-Use Reliability Checks
        </h3>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Check ID</th>
                <th>Agent Capability Tested</th>
                <th>Linked Scenarios</th>
                <th>Verification Objective</th>
              </tr>
            </thead>
            <tbody>
              {traces.eleven_agent_checks.map((chk) => (
                <tr key={chk.check_id}>
                  <td className="mono" style={{ fontWeight: 700, color: "var(--accent-green)" }}>
                    {chk.check_id}
                  </td>
                  <td style={{ fontWeight: 600 }}>{chk.capability}</td>
                  <td className="mono" style={{ fontSize: "12px" }}>
                    {chk.linked_scenarios.join(", ")}
                  </td>
                  <td>{chk.what_is_tested}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
