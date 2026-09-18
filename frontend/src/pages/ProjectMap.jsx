import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  MapPin,
  RefreshCw,
  Search,
  Building2,
  ShieldAlert,
  Activity,
  IndianRupee,
} from "lucide-react";
import { motion } from "framer-motion";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

const API_URL = "http://localhost:5000/api";

const getAuthConfig = () => {
  const token = localStorage.getItem("infrawatch_token");

  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};
};

// ==========================================
// STATE COORDINATES
// ==========================================

const STATE_COORDINATES = {
  Rajasthan: [27.0238, 74.2179],
  Bihar: [25.0961, 85.3131],

  "Uttar Pradesh": [26.8467, 80.9462],
  Maharashtra: [19.7515, 75.7139],
  Gujarat: [22.2587, 71.1924],

  "Madhya Pradesh": [22.9734, 78.6569],

  Karnataka: [15.3173, 75.7139],
  "Tamil Nadu": [11.1271, 78.6569],
  Kerala: [10.8505, 76.2711],
  Punjab: [31.1471, 75.3412],
  Haryana: [29.0588, 76.0856],
  Delhi: [28.7041, 77.1025],

  "West Bengal": [22.9868, 87.855],
  Odisha: [20.9517, 85.0985],
  Jharkhand: [23.6102, 85.2799],

  Chhattisgarh: [21.2787, 81.8661],
  Telangana: [18.1124, 79.0193],

  "Andhra Pradesh": [15.9129, 79.7400],

  Uttarakhand: [30.0668, 79.0193],

  "Himachal Pradesh": [31.1048, 77.1734],

  Assam: [26.2006, 92.9376],
  Goa: [15.2993, 74.1240],
};

// ==========================================
// DEFAULT INDIA LOCATION
// ==========================================

const INDIA_CENTER = [22.5937, 78.9629];

// ==========================================
// RISK COLORS
// ==========================================

const RISK_COLORS = {
  Low: "#22c55e",
  Medium: "#f59e0b",
  High: "#f97316",
  Critical: "#ef4444",
};

// ==========================================
// CUSTOM MARKER
// ==========================================

const createMarkerIcon = (riskLevel) => {
  const color =
    RISK_COLORS[riskLevel] || "#2563eb";

  return L.divIcon({
    className: "custom-project-marker",
    html: `
      <div style="
        width: 34px;
        height: 34px;
        border-radius: 50% 50% 50% 0;
        background: ${color};
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 9px;
          height: 9px;
          background: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -32],
  });
};

// ==========================================
// MAP VIEW CONTROLLER
// ==========================================

function MapViewController({ project }) {
  const map = useMap();

  useEffect(() => {
    if (project) {
      map.flyTo(project.coordinates, 6, {
        duration: 1.2,
      });
    }
  }, [project, map]);

  return null;
}

// ==========================================
// FORMATTERS
// ==========================================

const formatCurrency = (value) => {
  return `₹${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 1,
  }).format(Number(value || 0))} Cr`;
};

const getCoordinates = (project) => {
  // If future backend has latitude/longitude,
  // use those first.

  if (
    project.latitude !== undefined &&
    project.longitude !== undefined &&
    project.latitude !== null &&
    project.longitude !== null
  ) {
    return [
      Number(project.latitude),
      Number(project.longitude),
    ];
  }

  const state =
    project.state ||
    project.location ||
    "";

  return (
    STATE_COORDINATES[state] ||
    INDIA_CENTER
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function ProjectMap() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] =
    useState(null);

  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] =
    useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // FETCH PROJECTS
  // ========================================

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/projects`
      ,
        getAuthConfig()
      );

      const projectList =
        response.data?.projects || [];

      const mappedProjects = projectList.map(
        (project) => ({
          ...project,
          coordinates:
            getCoordinates(project),
        })
      );

      setProjects(mappedProjects);

      if (mappedProjects.length > 0) {
        setSelectedProject(
          mappedProjects[0]
        );
      }
    } catch (err) {
      console.error(
        "Project Map Error:",
        err
      );

      setError(
        "Unable to load project locations."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ========================================
  // FILTER PROJECTS
  // ========================================

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const searchText =
        `${project.name || ""} ${
          project.projectCode || ""
        } ${project.state || ""} ${
          project.location || ""
        }`.toLowerCase();

      const matchesSearch =
        searchText.includes(
          search.toLowerCase()
        );

      const matchesRisk =
        riskFilter === "All" ||
        project.riskLevel === riskFilter;

      return (
        matchesSearch &&
        matchesRisk
      );
    });
  }, [projects, search, riskFilter]);

  // ========================================
  // RISK COUNTS
  // ========================================

  const riskCounts = useMemo(() => {
    return {
      Low: projects.filter(
        (p) => p.riskLevel === "Low"
      ).length,

      Medium: projects.filter(
        (p) => p.riskLevel === "Medium"
      ).length,

      High: projects.filter(
        (p) => p.riskLevel === "High"
      ).length,

      Critical: projects.filter(
        (p) => p.riskLevel === "Critical"
      ).length,
    };
  }, [projects]);

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading project map...
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
        <MapPin
          size={42}
          className="mx-auto text-red-500"
        />

        <h2 className="mt-3 text-xl font-bold text-red-700">
          Map Loading Error
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>

        <button
          onClick={fetchProjects}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">

      {/* ====================================
          HEADER
      ===================================== */}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-900 p-7 text-white shadow-xl">

        <div className="relative z-10 flex flex-col justify-between gap-5 md:flex-row md:items-center">

          <div>
            <div className="mb-2 flex items-center gap-2">
              <MapPin size={21} />

              <span className="text-sm font-medium text-blue-200">
                Geographic Intelligence
              </span>
            </div>

            <h1 className="text-3xl font-bold">
              Project Map
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              View infrastructure projects
              across India with their current
              risk level and implementation status.
            </p>
          </div>

          <button
            onClick={fetchProjects}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur hover:bg-white/20"
          >
            <RefreshCw size={17} />
            Refresh Map
          </button>

        </div>

        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      {/* ====================================
          SUMMARY
      ===================================== */}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">

        <SummaryCard
          title="Total"
          value={projects.length}
          icon={Building2}
          bg="bg-blue-50"
          color="text-blue-600"
        />

        <SummaryCard
          title="Low"
          value={riskCounts.Low}
          icon={Activity}
          bg="bg-green-50"
          color="text-green-600"
        />

        <SummaryCard
          title="Medium"
          value={riskCounts.Medium}
          icon={ShieldAlert}
          bg="bg-amber-50"
          color="text-amber-600"
        />

        <SummaryCard
          title="High"
          value={riskCounts.High}
          icon={ShieldAlert}
          bg="bg-orange-50"
          color="text-orange-600"
        />

        <SummaryCard
          title="Critical"
          value={riskCounts.Critical}
          icon={ShieldAlert}
          bg="bg-red-50"
          color="text-red-600"
        />

      </div>

      {/* ====================================
          SEARCH + FILTER
      ===================================== */}

      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row">

        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search project, code or state..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <select
          value={riskFilter}
          onChange={(e) =>
            setRiskFilter(e.target.value)
          }
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500"
        >
          <option value="All">
            All Risk Levels
          </option>

          <option value="Low">Low Risk</option>
          <option value="Medium">
            Medium Risk
          </option>
          <option value="High">
            High Risk
          </option>
          <option value="Critical">
            Critical Risk
          </option>
        </select>

      </div>

      {/* ====================================
          MAP + PROJECT LIST
      ===================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_350px]">

        {/* MAP */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-bold text-slate-900">
              Infrastructure Projects
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredProjects.length} project
              {filteredProjects.length !== 1
                ? "s"
                : ""}{" "}
              displayed on map
            </p>
          </div>

          <div className="h-[620px]">

            <MapContainer
              center={INDIA_CENTER}
              zoom={5}
              minZoom={4}
              maxZoom={12}
              scrollWheelZoom={true}
              className="h-full w-full"
            >

              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {selectedProject && (
                <MapViewController
                  project={selectedProject}
                />
              )}

              {filteredProjects.map(
                (project) => (
                  <Marker
                    key={project._id}
                    position={
                      project.coordinates
                    }
                    icon={createMarkerIcon(
                      project.riskLevel
                    )}
                    eventHandlers={{
                      click: () =>
                        setSelectedProject(
                          project
                        ),
                    }}
                  >
                    <Popup>

                      <div className="min-w-[230px]">

                        <h3 className="text-base font-bold text-slate-900">
                          {project.name ||
                            "Unnamed Project"}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {project.projectCode ||
                            "No project code"}
                        </p>

                        <div className="mt-3 space-y-2 text-sm">

                          <div className="flex justify-between">
                            <span className="text-slate-500">
                              Location
                            </span>

                            <strong>
                              {project.state ||
                                project.location ||
                                "India"}
                            </strong>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-slate-500">
                              Risk
                            </span>

                            <strong
                              style={{
                                color:
                                  RISK_COLORS[
                                    project.riskLevel
                                  ],
                              }}
                            >
                              {project.riskLevel ||
                                "Low"}
                            </strong>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-slate-500">
                              Score
                            </span>

                            <strong>
                              {project.riskScore ||
                                0}
                              /100
                            </strong>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-slate-500">
                              Progress
                            </span>

                            <strong>
                              {project.physicalProgress ||
                                0}
                              %
                            </strong>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-slate-500">
                              Status
                            </span>

                            <strong>
                              {project.status ||
                                "On Track"}
                            </strong>
                          </div>

                        </div>

                      </div>

                    </Popup>
                  </Marker>
                )
              )}

            </MapContainer>

          </div>
        </div>

        {/* PROJECT LIST */}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-bold text-slate-900">
              Project Locations
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Select a project to locate it
              on the map.
            </p>
          </div>

          <div className="max-h-[620px] overflow-y-auto p-3">

            {filteredProjects.length === 0 ? (
              <div className="px-4 py-12 text-center">

                <MapPin
                  size={35}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 text-sm text-slate-500">
                  No projects found.
                </p>

              </div>
            ) : (
              <div className="space-y-2">

                {filteredProjects.map(
                  (project) => {

                    const active =
                      selectedProject?._id ===
                      project._id;

                    return (
                      <motion.button
                        key={project._id}
                        whileHover={{
                          scale: 1.01,
                        }}
                        onClick={() =>
                          setSelectedProject(
                            project
                          )
                        }
                        className={`w-full rounded-xl border p-4 text-left transition ${
                          active
                            ? "border-blue-300 bg-blue-50"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >

                        <div className="flex items-start gap-3">

                          <div
                            className="mt-1 h-3 w-3 shrink-0 rounded-full"
                            style={{
                              background:
                                RISK_COLORS[
                                  project.riskLevel
                                ] ||
                                "#2563eb",
                            }}
                          />

                          <div className="min-w-0 flex-1">

                            <h3 className="truncate text-sm font-bold text-slate-900">
                              {project.name ||
                                "Unnamed Project"}
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                              {project.projectCode ||
                                "No Code"}
                            </p>

                            <div className="mt-3 flex items-center justify-between">

                              <span className="text-xs text-slate-500">
                                📍{" "}
                                {project.state ||
                                  project.location ||
                                  "India"}
                              </span>

                              <span
                                className="text-xs font-bold"
                                style={{
                                  color:
                                    RISK_COLORS[
                                      project.riskLevel
                                    ] ||
                                    "#2563eb",
                                }}
                              >
                                {project.riskLevel ||
                                  "Low"}
                              </span>

                            </div>

                            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">

                              <div
                                className="h-full rounded-full bg-blue-600"
                                style={{
                                  width: `${Math.min(
                                    Number(
                                      project.physicalProgress ||
                                        0
                                    ),
                                    100
                                  )}%`,
                                }}
                              />

                            </div>

                            <div className="mt-1 flex justify-between text-[11px] text-slate-400">

                              <span>
                                Progress
                              </span>

                              <span>
                                {project.physicalProgress ||
                                  0}
                                %
                              </span>

                            </div>

                          </div>

                        </div>

                      </motion.button>
                    );
                  }
                )}

              </div>
            )}

          </div>
        </div>

      </div>

      {/* ====================================
          SELECTED PROJECT DETAILS
      ===================================== */}

      {selectedProject && (
        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6"
        >

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Selected Project
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                {selectedProject.name}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {selectedProject.projectCode} •{" "}
                {selectedProject.state ||
                  selectedProject.location ||
                  "India"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

              <MiniStat
                label="Risk Score"
                value={`${selectedProject.riskScore || 0}/100`}
              />

              <MiniStat
                label="Risk Level"
                value={
                  selectedProject.riskLevel ||
                  "Low"
                }
              />

              <MiniStat
                label="Progress"
                value={`${selectedProject.physicalProgress || 0}%`}
              />

              <MiniStat
                label="Cost"
                value={formatCurrency(
                  selectedProject.approvedCost
                )}
              />

            </div>

          </div>

        </motion.div>
      )}

      {/* ====================================
          LEGEND
      ===================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <h3 className="text-sm font-bold text-slate-900">
          Risk Legend
        </h3>

        <div className="mt-4 flex flex-wrap gap-6">

          {Object.entries(RISK_COLORS).map(
            ([level, color]) => (
              <div
                key={level}
                className="flex items-center gap-2"
              >
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    background: color,
                  }}
                />

                <span className="text-sm text-slate-600">
                  {level}
                </span>
              </div>
            )
          )}

        </div>

      </div>

    </div>
  );
}

// ==========================================
// SUMMARY CARD
// ==========================================

function SummaryCard({
  title,
  value,
  icon: Icon,
  bg,
  color,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-1 text-xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg}`}
        >
          <Icon
            size={18}
            className={color}
          />
        </div>

      </div>
    </div>
  );
}

// ==========================================
// MINI STAT
// ==========================================

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl bg-white/80 px-4 py-3 shadow-sm">

      <p className="text-[11px] text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}