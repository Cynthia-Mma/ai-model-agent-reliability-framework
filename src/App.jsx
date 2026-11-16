import React, { useEffect, useState } from "react";
import Navbar, { NAV_ITEMS } from "./components/Navbar.jsx";
import HomeView from "./components/HomeView.jsx";
import MethodologyView from "./components/MethodologyView.jsx";
import RubricsView from "./components/RubricsView.jsx";
import DatasetView from "./components/DatasetView.jsx";
import AgentReliabilityView from "./components/AgentReliabilityView.jsx";
import FailureAnalysisView from "./components/FailureAnalysisView.jsx";
import DashboardView from "./components/DashboardView.jsx";
import CaseStudyView from "./components/CaseStudyView.jsx";
import ReportsView from "./components/ReportsView.jsx";
import AuthorView from "./components/AuthorView.jsx";

import rubricData from "../rubrics/evaluation_rubric.json";
import datasetData from "../datasets/evaluation_dataset.json";
import taxonomyData from "../taxonomy/failure_taxonomy.json";
import evaluationRecordsData from "../case-study/illustrative_evaluation_records.json";
import agentTracesData from "../case-study/agent_execution_traces.json";

const VALID_PAGES = new Set(NAV_ITEMS.map((n) => n.id));

function readPageFromHash() {
  const clean = window.location.hash.replace(/^#\/?/, "").trim();
  return VALID_PAGES.has(clean) ? clean : "home";
}

export default function App() {
  const [activePage, setActivePage] = useState(readPageFromHash);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onHashChange = () => setActivePage(readPageFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = (pageId) => {
    const target = VALID_PAGES.has(pageId) ? pageId : "home";
    window.location.hash = `#/${target}`;
    setActivePage(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app-shell">
      <Navbar
        activePage={activePage}
        onNavigate={navigate}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className="main-area">
        <div className="page-container">
          {activePage === "home" && (
            <HomeView
              onNavigate={navigate}
              totalScenarios={datasetData.scenarios.length}
              totalFailures={taxonomyData.failures.length}
              totalRecords={evaluationRecordsData.records.length}
            />
          )}
          {activePage === "methodology" && <MethodologyView rubric={rubricData} />}
          {activePage === "rubrics" && <RubricsView rubric={rubricData} />}
          {activePage === "dataset" && <DatasetView dataset={datasetData} />}
          {activePage === "agent-reliability" && <AgentReliabilityView traces={agentTracesData} />}
          {activePage === "failure-analysis" && (
            <FailureAnalysisView taxonomy={taxonomyData} records={evaluationRecordsData.records} />
          )}
          {activePage === "dashboard" && (
            <DashboardView
              evaluationData={evaluationRecordsData}
              rubric={rubricData}
              taxonomy={taxonomyData}
            />
          )}
          {activePage === "case-study" && <CaseStudyView evaluationData={evaluationRecordsData} />}
          {activePage === "reports" && <ReportsView />}
          {activePage === "author" && <AuthorView />}
        </div>
      </main>
    </div>
  );
}
