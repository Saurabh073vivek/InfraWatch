import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";

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

        {/* Public Routes */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected Routes */}

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>

            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/projects"
              element={<Projects />}
            />

            <Route
              path="/monitoring"
              element={<Monitoring />}
            />

            <Route
              path="/ai-risk"
              element={<AIRisk />}
            />

            <Route
              path="/alerts"
              element={<Alerts />}
            />

            <Route
              path="/analytics"
              element={<Analytics />}
            />

            <Route
              path="/map"
              element={<ProjectMap />}
            />

            <Route
              path="/reports"
              element={<Reports />}
            />

            <Route
              path="/settings"
              element={
                <Placeholder title="Settings" />
              }
            />

            <Route
              path="/profile"
              element={
                <Placeholder title="Profile" />
              }
            />

          </Route>
        </Route>

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}