import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";

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

        <Route element={<DashboardLayout />}>

          <Route path="/" element={<Dashboard />} />

          <Route
            path="/projects"
            element={<Projects />}
          />

          <Route
            path="/monitoring"
            element={<Placeholder title="Monitoring" />}
          />

          <Route
            path="/ai-risk"
            element={<Placeholder title="AI Risk Prediction" />}
          />

          <Route
            path="/alerts"
            element={<Placeholder title="Early Warnings" />}
          />

          <Route
            path="/analytics"
            element={<Placeholder title="Analytics" />}
          />

          <Route
            path="/map"
            element={<Placeholder title="Project Map" />}
          />

          <Route
            path="/reports"
            element={<Placeholder title="Reports" />}
          />

          <Route
            path="/settings"
            element={<Placeholder title="Settings" />}
          />

          <Route
            path="/profile"
            element={<Placeholder title="Profile" />}
          />

          

        </Route>

      </Routes>
    </BrowserRouter>
  );
}