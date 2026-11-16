import React from "react";
import {
  Home,
  Compass,
  ClipboardCheck,
  Database,
  Cpu,
  AlertTriangle,
  BarChart3,
  BookOpen,
  FileDown,
  UserCheck,
  Menu,
  X
} from "lucide-react";

export const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home },
  { id: "methodology", label: "Evaluation Methodology", icon: Compass },
  { id: "rubrics", label: "Evaluation Rubrics", icon: ClipboardCheck },
  { id: "dataset", label: "Test Dataset (48)", icon: Database },
  { id: "agent-reliability", label: "Agent Reliability", icon: Cpu },
  { id: "failure-analysis", label: "Failure Analysis", icon: AlertTriangle },
  { id: "dashboard", label: "Evaluation Dashboard", icon: BarChart3 },
  { id: "case-study", label: "Case Study", icon: BookOpen },
  { id: "reports", label: "Reports & Resources", icon: FileDown },
  { id: "author", label: "About the Author", icon: UserCheck }
];

export default function Navbar({ activePage, onNavigate, mobileOpen, setMobileOpen }) {
  const handleSelect = (id) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <>
      <header className="mobile-topbar">
        <div>
          <strong style={{ color: "var(--accent-green)", fontSize: "14px" }}>
            AI Reliability Framework
          </strong>
          <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
            Cynthia Agwaraonye
          </div>
        </div>
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          Menu
        </button>
      </header>

      <div
        className={`mobile-overlay ${mobileOpen ? "open" : ""}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      <aside className={`sidebar ${mobileOpen ? "open" : ""}`} aria-label="Primary navigation">
        <div className="sidebar-brand">
          <span className="brand-eyebrow">Portfolio Framework v1.0</span>
          <h1 className="brand-title">AI Model &amp; Agent Reliability Evaluation</h1>
          <p className="brand-author">By Cynthia Agwaraonye</p>
        </div>

        <nav className="nav-list">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => handleSelect(item.id)}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={16} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div>Evidence-First AI Quality Engineering</div>
          <div style={{ marginTop: 4 }}>Static SPA • Zero Secrets • GitHub Pages Ready</div>
        </div>
      </aside>
    </>
  );
}
