import React, { useState } from "react";
import { FileDown, Download, Eye, X } from "lucide-react";

const RESOURCES = [
  {
    title: "Evaluation Rubric (JSON)",
    file: "evaluation_rubric.json",
    category: "Rubric",
    desc: "Machine-readable 7-dimension rubric, bespoke 0–4 scales, weighting presets, and Critical-Failure Override rules."
  },
  {
    title: "Evaluation Rubric (Markdown)",
    file: "evaluation_rubric.md",
    category: "Rubric",
    desc: "Complete printable/readable rubric specification with good and poor examples per dimension."
  },
  {
    title: "48-Scenario Test Dataset (JSON)",
    file: "evaluation_dataset.json",
    category: "Dataset",
    desc: "Full 48-scenario evaluation benchmark across 12 categories with expected behaviours and failure patterns."
  },
  {
    title: "48-Scenario Test Dataset (CSV)",
    file: "evaluation_dataset.csv",
    category: "Dataset",
    desc: "Spreadsheet-ready CSV export matching the JSON dataset 1:1 for Excel, Google Sheets, or Python pipelines."
  },
  {
    title: "Evaluation Record Template (JSON)",
    file: "evaluation_record_template.json",
    category: "Template",
    desc: "Structured JSON schema for logging individual scenario evaluations, traces, scores, and overrides."
  },
  {
    title: "Evaluation Record Template (Markdown)",
    file: "evaluation_record_template.md",
    category: "Template",
    desc: "Human-friendly table template for manual QA evaluation logging."
  },
  {
    title: "Failure Taxonomy (JSON)",
    file: "failure_taxonomy.json",
    category: "Taxonomy",
    desc: "15 structured failure types (FAIL-01 to FAIL-15) with detection methods, severities, and corrective actions."
  },
  {
    title: "Failure Taxonomy (Markdown)",
    file: "failure_taxonomy.md",
    category: "Taxonomy",
    desc: "Failure classification catalogue and Severity vs. Rubric Score distinction guide."
  },
  {
    title: "Sample Evaluation Report (Markdown)",
    file: "sample_evaluation_report.md",
    category: "Report",
    desc: "14-section illustrative evaluation report for HeliosOps Assistant matching all dashboard calculations."
  },
  {
    title: "Practical Case Study (Markdown)",
    file: "case_study.md",
    category: "Case Study",
    desc: "Walkthrough of 4 Strong, 4 Partial, and 4 Failing scenarios plus Before/After retest loop."
  },
  {
    title: "Illustrative Evaluation Records (JSON)",
    file: "illustrative_evaluation_records.json",
    category: "Data",
    desc: "Underlying 12 demonstration evaluation records powering every chart on the Evaluation Dashboard."
  },
  {
    title: "Simulated Agent Execution Traces (JSON)",
    file: "agent_execution_traces.json",
    category: "Data",
    desc: "8-step lifecycle checks, 11 agent failure checks, and simulated multi-step tool traces."
  },
  {
    title: "Project QA Verification Report (Markdown)",
    file: "PROJECT_QA_REPORT.md",
    category: "QA",
    desc: "Automated and manual QA verification log testing data parity, scoring math, builds, and responsiveness."
  },
  {
    title: "Independent AI Evaluation Audit Report (Markdown)",
    file: "INDEPENDENT_AUDIT_REPORT.md",
    category: "Audit",
    desc: "Adversarial QA audit assessing scoring math, override edge cases, severity consistency, and multi-version comparison."
  }
];

export default function ReportsView() {
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewContent, setPreviewContent] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);

  const openPreview = async (item) => {
    setPreviewTitle(item.title);
    setPreviewLoading(true);
    setPreviewContent("");
    try {
      const resp = await fetch(`./resources/${item.file}`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const text = await resp.text();
      setPreviewContent(text);
    } catch (err) {
      setPreviewContent(`Unable to load preview for ${item.file}: ${err.message}`);
    } finally {
      setPreviewLoading(false);
    }
  };

  return (
    <div className="stack-lg">
      <div className="page-header">
        <div className="page-kicker">
          <FileDown size={14} /> Reports &amp; Resources
        </div>
        <h2 className="page-title">Downloadable Framework Artefacts &amp; Documentation</h2>
        <p className="page-subtitle">
          Every rubric, dataset, template, taxonomy, report, and QA verification log is bundled as a
          reusable static file—ready to preview online or download for immediate team adoption.
        </p>
      </div>

      <div className="grid-2">
        {RESOURCES.map((item) => (
          <div className="card" key={item.file} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 12 }}>
            <div>
              <span className="badge badge-teal" style={{ marginBottom: 8 }}>
                {item.category}
              </span>
              <h3 className="card-title" style={{ marginBottom: 6 }}>
                {item.title}
              </h3>
              <p style={{ margin: 0, fontSize: "13.5px", color: "var(--text-secondary)" }}>
                {item.desc}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={() => openPreview(item)}
              >
                <Eye size={14} /> Preview
              </button>
              <a
                className="btn btn-sm btn-primary"
                href={`./resources/${item.file}`}
                download={item.file}
              >
                <Download size={14} /> Download ({item.file})
              </a>
            </div>
          </div>
        ))}
      </div>

      {previewTitle && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`Preview ${previewTitle}`}
          onClick={() => setPreviewTitle("")}
        >
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <h3 className="card-title">{previewTitle}</h3>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={() => setPreviewTitle("")}
                aria-label="Close preview"
              >
                <X size={16} />
              </button>
            </div>
            <div className="code-box" style={{ maxHeight: "65vh", overflowY: "auto" }}>
              {previewLoading ? "Loading resource..." : previewContent}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
