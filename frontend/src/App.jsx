import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Monitoring from "./pages/Monitoring";
import AIRisk from "./pages/AIRisk";
import Alerts from "./pages/Alerts";
import Analytics from "./pages/Analytics";
import ProjectMap from "./pages/ProjectMap";
import Reports from "./pages/Reports";

function Placeholder({ title }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10">
      <h1 className="text-2xl font-bold text-slate-900">
        {title}
      </h1>

      <p className="mt-2 text-slate-500">
        This module will be developed in the upcoming phase.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =================================
            DASHBOARD LAYOUT
        ================================== */}

        <Route element={<DashboardLayout />}>

          {/* Dashboard */}
          <Route
            path="/"
            element={<Dashboard />}
          />

          {/* Projects */}
          <Route
            path="/projects"
            element={<Projects />}
          />

          {/* Monitoring */}
          <Route
            path="/monitoring"
            element={<Monitoring />}
          />

          {/* AI Risk Prediction */}
          <Route
            path="/ai-risk"
            element={<AIRisk />}
          />

          {/* Alerts */}
          <Route
            path="/alerts"
            element={<Alerts />}
          />

          {/* Analytics */}
          <Route
            path="/analytics"
            element={<Analytics />}
          />

          {/* Project Map */}
          <Route
            path="/map"
            element={<ProjectMap />}
          />

          {/* Reports */}
          <Route
            path="/reports"
            element={<Reports />}
          />

          {/* Settings */}
          <Route
            path="/settings"
            element={
              <Placeholder title="Settings" />
            }
          />

          {/* Profile */}
          <Route
            path="/profile"
            element={
              <Placeholder title="Profile" />
            }
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}