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

import UserManagement from "./pages/UserManagement";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================================
            PUBLIC ROUTES
        ========================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =========================================
            PROTECTED ROUTES
        ========================================= */}

        <Route element={<ProtectedRoute />}>

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

            {/* AI Risk */}
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

            {/* =====================================
                SETTINGS
            ===================================== */}

            <Route
              path="/settings"
              element={<Settings />}
            />

            {/* =====================================
                ADMIN USER MANAGEMENT
            ===================================== */}

            <Route
              path="/user-management"
              element={<UserManagement />}
            />

            {/* =====================================
                PROFILE
            ===================================== */}

            <Route
              path="/profile"
              element={<Profile />}
            />

          </Route>

        </Route>

        {/* =========================================
            UNKNOWN ROUTE
        ========================================= */}

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