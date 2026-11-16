import React from "react";
import { UserCheck, ExternalLink, Award, CheckCircle2 } from "lucide-react";

export default function AuthorView() {
  return (
    <div className="stack-lg">
      <div className="page-header">
        <div className="page-kicker">
          <UserCheck size={14} /> About the Author
        </div>
        <h2 className="page-title">Cynthia Agwaraonye</h2>
        <p className="page-subtitle">
          Senior QA Engineer | AI Model Evaluation &amp; Training | Prompt &amp; Context Engineering | Data Quality
        </p>
      </div>

      <section className="card">
        <h3 className="card-title" style={{ marginBottom: 10 }}>
          Professional Profile
        </h3>
        <p style={{ margin: "0 0 12px", color: "var(--text-secondary)" }}>
          Cynthia Agwaraonye is a Quality Assurance Engineer with over four years of experience
          ensuring software quality, security, and reliability across healthcare, fintech, edtech,
          and marketplace products.
        </p>
        <p style={{ margin: "0 0 12px", color: "var(--text-secondary)" }}>
          Her software engineering expertise spans manual and automated testing, API and integration
          testing, security testing (identifying JWT, IDOR, SSRF, XSS, and SQLi vulnerabilities),
          performance and load testing, risk-based test strategy, and CI/CD release validation using
          Cypress, Postman/Newman, Puppeteer, and JMeter.
        </p>
        <p style={{ margin: 0, color: "var(--text-secondary)" }}>
          Alongside core software QA, she brings practical experience in AI data annotation, model
          evaluation, rubric-based assessment, prompt engineering, context engineering, and technical
          mentorship—demonstrating through this project how rigorous software quality engineering
          principles translate directly to trustworthy AI model and agent evaluation.
        </p>
      </section>

      <section className="grid-2">
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 10 }}>
            <Award size={16} style={{ verticalAlign: "text-bottom", marginRight: 6 }} />
            Verified Highlights Across QA &amp; AI Evaluation
          </h3>
          <ul style={{ margin: 0, paddingLeft: 18, color: "var(--text-secondary)" }}>
            <li style={{ marginBottom: 6 }}>
              <strong>Multimodal Data Quality (Outlier):</strong> Annotated over 1,000 videos with
              97% annotation accuracy against strict guideline standards.
            </li>
            <li style={{ marginBottom: 6 }}>
              <strong>Curriculum &amp; Rubric Assessment (HNG Tech):</strong> Designed curriculum and
              assessment materials supporting over 10,000 learners, applying rubric-based evaluation
              and structured written/verbal feedback.
            </li>
            <li style={{ marginBottom: 6 }}>
              <strong>AI Evaluation &amp; Context Engineering (Mercor Academy &amp; Capstone):</strong>{" "}
              Completed <em>Introduction to Agents</em> and <em>Mastering Model Mechanics</em>, and
              executed a four-run comparative Claude prompt/context engineering study.
            </li>
            <li>
              <strong>Senior QA Delivery:</strong> Reduced manual regression effort by 40% via
              automation, executed 782 test cases uncovering 199 defects in healthcare marketplace
              audits, and validated WebRTC systems for up to 100 concurrent interactive users.
            </li>
          </ul>
        </div>

        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 10 }}>
            Core QA &amp; AI Evaluation Capabilities
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {[
              "Manual & Functional QA",
              "API Testing (Postman/Newman)",
              "Cypress & Puppeteer",
              "JMeter Load Testing",
              "Security Testing",
              "CI/CD Quality Gates",
              "AI Model Evaluation",
              "Prompt Engineering",
              "Context Engineering",
              "Rubric-Based Assessment",
              "Multimodal Annotation",
              "Failure Analysis"
            ].map((skill) => (
              <span className="badge badge-teal" key={skill}>
                <CheckCircle2 size={12} /> {skill}
              </span>
            ))}
          </div>

          <h4 style={{ margin: "0 0 8px", fontSize: "14px" }}>Verified Links</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <a
              className="btn btn-sm btn-secondary"
              href="https://linkedin.com/in/cynthia-agwaraonye-45b649284"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn <ExternalLink size={13} />
            </a>
            <a
              className="btn btn-sm btn-secondary"
              href="https://qa-portfolio-site-six.vercel.app"
              target="_blank"
              rel="noreferrer"
            >
              QA Portfolio <ExternalLink size={13} />
            </a>
            <a
              className="btn btn-sm btn-secondary"
              href="https://github.com/Cynthia-Mma"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
