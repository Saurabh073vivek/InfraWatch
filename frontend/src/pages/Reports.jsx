import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FileText,
  Download,
  RefreshCw,
  Search,
  Building2,
  IndianRupee,
  ShieldAlert,
  TrendingUp,
  Clock3,
  CalendarDays,
} from "lucide-react";
import { motion } from "framer-motion";

const API_URL = "http://localhost:5000/api";

const RISK_COLORS = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-amber-100 text-amber-700",
  High: "bg-orange-100 text-orange-700",
  Critical: "bg-red-100 text-red-700",
};

const STATUS_COLORS = {
  "On Track": "bg-green-100 text-green-700",
  "At Risk": "bg-amber-100 text-amber-700",
  Delayed: "bg-red-100 text-red-700",
  Completed: "bg-blue-100 text-blue-700",
};

const formatCurrency = (value) =>
  `₹${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 1,
  }).format(Number(value || 0))} Cr`;

const formatNumber = (value) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 1,
  }).format(Number(value || 0));

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  bg,
  color,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg}`}
        >
          <Icon size={21} className={color} />
        </div>
      </div>
    </div>
  );
}

function Badge({ children, type }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        type === "risk"
          ? RISK_COLORS[children] ||
            "bg-slate-100 text-slate-600"
          : STATUS_COLORS[children] ||
            "bg-slate-100 text-slate-600"
      }`}
    >
      {children || "N/A"}
    </span>
  );
}

export default function Reports() {
  const [projects, setProjects] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [selectedProject, setSelectedProject] =
    useState(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH DATA
  // ==========================================

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const projectResponse = await axios.get(
        `${API_URL}/projects`
      );

      const projectList =
        projectResponse.data?.projects || [];

      setProjects(projectList);

      const progressResults = await Promise.all(
        projectList.map(async (project) => {
          try {
            const response = await axios.get(
              `${API_URL}/projects/${project._id}/progress`
            );

            return response.data?.progress || [];
          } catch {
            return [];
          }
        })
      );

      setProgressData(progressResults.flat());

      if (
        projectList.length > 0 &&
        !selectedProject
      ) {
        setSelectedProject(projectList[0]);
      }
    } catch (err) {
      console.error("Reports Error:", err);

      setError(
        "Unable to load report data. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // ==========================================
  // FILTER
  // ==========================================

  const filteredProjects = useMemo(() => {
    const text = search.toLowerCase();

    return projects.filter((project) => {
      return `${project.name || ""} ${
        project.projectCode || ""
      } ${project.ministry || ""} ${
        project.state || ""
      } ${project.sector || ""}`
        .toLowerCase()
        .includes(text);
    });
  }, [projects, search]);

  // ==========================================
  // SUMMARY
  // ==========================================

  const summary = useMemo(() => {
    const approved = projects.reduce(
      (sum, project) =>
        sum + Number(project.approvedCost || 0),
      0
    );

    const revised = projects.reduce(
      (sum, project) =>
        sum +
        Number(
          project.revisedCost ||
            project.approvedCost ||
            0
        ),
      0
    );

    const escalation =
      approved > 0
        ? ((revised - approved) / approved) * 100
        : 0;

    return {
      total: projects.length,

      onTrack: projects.filter(
        (p) => p.status === "On Track"
      ).length,

      delayed: projects.filter(
        (p) => p.status === "Delayed"
      ).length,

      highRisk: projects.filter(
        (p) =>
          p.riskLevel === "High" ||
          p.riskLevel === "Critical"
      ).length,

      approved,
      revised,
      escalation,
    };
  }, [projects]);

  // ==========================================
  // SELECTED PROJECT PROGRESS
  // ==========================================

  const selectedProgress = useMemo(() => {
    if (!selectedProject) return [];

    return progressData
      .filter(
        (item) =>
          item.projectId ===
          selectedProject._id
      )
      .sort((a, b) => {
        const dateA = new Date(
          `1 ${a.month}`
        );

        const dateB = new Date(
          `1 ${b.month}`
        );

        return dateA - dateB;
      });
  }, [progressData, selectedProject]);

  // ==========================================
  // COST ESCALATION
  // ==========================================

  const selectedCost = useMemo(() => {
    if (!selectedProject) {
      return {
        approved: 0,
        revised: 0,
        escalation: 0,
      };
    }

    const approved = Number(
      selectedProject.approvedCost || 0
    );

    const revised = Number(
      selectedProject.revisedCost ||
        approved
    );

    const escalation =
      approved > 0
        ? ((revised - approved) / approved) *
          100
        : 0;

    return {
      approved,
      revised,
      escalation,
    };
  }, [selectedProject]);

  // ==========================================
  // PRINT / DOWNLOAD
  // ==========================================

  const downloadReport = () => {
    window.print();
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Preparing reports...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
        <FileText
          size={42}
          className="mx-auto text-red-500"
        />

        <h2 className="mt-3 text-xl font-bold text-red-700">
          Report Error
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>

        <button
          onClick={fetchReports}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="report-page space-y-6 pb-10">

      {/* ======================================
          HEADER
      ======================================= */}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-900 p-7 text-white shadow-xl print:hidden">

        <div className="relative z-10 flex flex-col justify-between gap-5 md:flex-row md:items-center">

          <div>
            <div className="mb-2 flex items-center gap-2">
              <FileText size={21} />

              <span className="text-sm font-medium text-blue-200">
                Project Intelligence
              </span>
            </div>

            <h1 className="text-3xl font-bold">
              Project Reports
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Generate project-wise reports containing
              progress, cost, risk and implementation
              information.
            </p>
          </div>

          <div className="flex gap-3">

            <button
              onClick={fetchReports}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold hover:bg-white/20"
            >
              <RefreshCw size={17} />
              Refresh
            </button>

            <button
              onClick={downloadReport}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-900 hover:bg-blue-50"
            >
              <Download size={17} />
              Download Report
            </button>

          </div>

        </div>

        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
      </div>

      {/* ======================================
          PRINT HEADER
      ======================================= */}

      <div className="hidden print:block">
        <h1 className="text-3xl font-bold">
          InfraWatch AI
        </h1>

        <p className="mt-1 text-lg">
          Infrastructure Project Monitoring Report
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Generated on{" "}
          {new Date().toLocaleDateString("en-IN")}
        </p>
      </div>

      {/* ======================================
          SUMMARY
      ======================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Projects"
          value={summary.total}
          subtitle="Projects monitored"
          icon={Building2}
          bg="bg-blue-50"
          color="text-blue-600"
        />

        <StatCard
          title="On Track"
          value={summary.onTrack}
          subtitle="Projects progressing normally"
          icon={TrendingUp}
          bg="bg-green-50"
          color="text-green-600"
        />

        <StatCard
          title="High / Critical"
          value={summary.highRisk}
          subtitle="Projects requiring attention"
          icon={ShieldAlert}
          bg="bg-red-50"
          color="text-red-600"
        />

        <StatCard
          title="Delayed"
          value={summary.delayed}
          subtitle="Projects marked delayed"
          icon={Clock3}
          bg="bg-orange-50"
          color="text-orange-600"
        />

      </div>

      {/* ======================================
          SEARCH
      ======================================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm print:hidden">

        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search project, ministry, sector or state..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
          />
        </div>

      </div>

      {/* ======================================
          PROJECT SELECTOR
      ======================================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm print:hidden">

        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Select Project
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Choose a project to generate its detailed report.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">

          {filteredProjects.map((project) => (
            <button
              key={project._id}
              onClick={() =>
                setSelectedProject(project)
              }
              className={`rounded-xl border p-4 text-left transition ${
                selectedProject?._id ===
                project._id
                  ? "border-blue-400 bg-blue-50"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">

                <div>
                  <h3 className="font-bold text-slate-900">
                    {project.name}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {project.projectCode}
                  </p>
                </div>

                <Badge type="risk">
                  {project.riskLevel}
                </Badge>

              </div>

              <div className="mt-3 flex justify-between text-xs text-slate-500">
                <span>
                  {project.state ||
                    project.location ||
                    "India"}
                </span>

                <span>
                  {project.physicalProgress || 0}%
                  progress
                </span>
              </div>
            </button>
          ))}

        </div>
      </div>

      {/* ======================================
          SELECTED PROJECT REPORT
      ======================================= */}

      {selectedProject && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >

          {/* PROJECT HEADER */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Project Report
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {selectedProject.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedProject.projectCode}
                </p>
              </div>

              <div className="flex gap-3">

                <Badge type="risk">
                  {selectedProject.riskLevel}
                </Badge>

                <Badge type="status">
                  {selectedProject.status}
                </Badge>

              </div>

            </div>

          </div>

          {/* PROJECT DETAILS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h3 className="text-lg font-bold text-slate-900">
              Project Information
            </h3>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

              <InfoItem
                label="Project Code"
                value={selectedProject.projectCode}
              />

              <InfoItem
                label="Ministry"
                value={selectedProject.ministry}
              />

              <InfoItem
                label="Sector"
                value={selectedProject.sector}
              />

              <InfoItem
                label="State / Location"
                value={
                  selectedProject.state ||
                  selectedProject.location
                }
              />

              <InfoItem
                label="Implementing Agency"
                value={
                  selectedProject.implementingAgency
                }
              />

              <InfoItem
                label="Start Date"
                value={
                  selectedProject.startDate
                    ? new Date(
                        selectedProject.startDate
                      ).toLocaleDateString("en-IN")
                    : "N/A"
                }
              />

              <InfoItem
                label="Expected Completion"
                value={
                  selectedProject.expectedCompletion
                    ? new Date(
                        selectedProject.expectedCompletion
                      ).toLocaleDateString(
                        "en-IN"
                      )
                    : "N/A"
                }
              />

              <InfoItem
                label="Status"
                value={
                  selectedProject.status
                }
              />

              <InfoItem
                label="Risk Level"
                value={
                  selectedProject.riskLevel
                }
              />

            </div>
          </div>

          {/* PERFORMANCE */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">

            <StatCard
              title="Physical Progress"
              value={`${selectedProject.physicalProgress || 0}%`}
              subtitle="Current progress"
              icon={TrendingUp}
              bg="bg-blue-50"
              color="text-blue-600"
            />

            <StatCard
              title="Financial Progress"
              value={`${selectedProject.financialProgress || 0}%`}
              subtitle="Financial completion"
              icon={IndianRupee}
              bg="bg-green-50"
              color="text-green-600"
            />

            <StatCard
              title="Risk Score"
              value={`${selectedProject.riskScore || 0}/100`}
              subtitle="Current risk score"
              icon={ShieldAlert}
              bg="bg-red-50"
              color="text-red-600"
            />

            <StatCard
              title="Cost Escalation"
              value={`${selectedCost.escalation.toFixed(1)}%`}
              subtitle="Approved vs revised"
              icon={IndianRupee}
              bg="bg-amber-50"
              color="text-amber-600"
            />

          </div>

          {/* COST REPORT */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h3 className="text-lg font-bold text-slate-900">
              Cost Summary
            </h3>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">

              <CostBox
                title="Approved Cost"
                value={formatCurrency(
                  selectedCost.approved
                )}
              />

              <CostBox
                title="Revised Cost"
                value={formatCurrency(
                  selectedCost.revised
                )}
              />

              <CostBox
                title="Escalation"
                value={`${selectedCost.escalation.toFixed(
                  1
                )}%`}
              />

            </div>
          </div>

          {/* PROGRESS REPORT */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Monthly Progress
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Planned vs actual project progress.
                </p>
              </div>

              <CalendarDays
                size={22}
                className="text-blue-600"
              />

            </div>

            {selectedProgress.length === 0 ? (
              <div className="mt-6 rounded-xl bg-slate-50 p-8 text-center">
                <p className="text-sm text-slate-500">
                  No monthly progress data available.
                </p>
              </div>
            ) : (
              <div className="mt-5 overflow-x-auto">

                <table className="w-full min-w-[650px] text-left">

                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-4 py-3">
                        Month
                      </th>

                      <th className="px-4 py-3">
                        Planned
                      </th>

                      <th className="px-4 py-3">
                        Actual
                      </th>

                      <th className="px-4 py-3">
                        Gap
                      </th>

                      <th className="px-4 py-3">
                        Expenditure
                      </th>

                      <th className="px-4 py-3">
                        Remarks
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                    {selectedProgress.map(
                      (item) => {

                        const gap =
                          Number(
                            item.plannedProgress ||
                              0
                          ) -
                          Number(
                            item.actualProgress ||
                              0
                          );

                        return (
                          <tr
                            key={item._id}
                            className="border-b border-slate-100"
                          >

                            <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                              {item.month}
                            </td>

                            <td className="px-4 py-4 text-sm">
                              {item.plannedProgress ||
                                0}
                              %
                            </td>

                            <td className="px-4 py-4 text-sm font-semibold text-blue-600">
                              {item.actualProgress ||
                                0}
                              %
                            </td>

                            <td
                              className={`px-4 py-4 text-sm font-semibold ${
                                gap > 0
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}
                            >
                              {gap}%
                            </td>

                            <td className="px-4 py-4 text-sm">
                              {formatCurrency(
                                item.expenditure
                              )}
                            </td>

                            <td className="max-w-[260px] px-4 py-4 text-sm text-slate-500">
                              {item.remarks ||
                                "No remarks"}
                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>
              </div>
            )}
          </div>

          {/* RISK REPORT */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                <ShieldAlert
                  size={20}
                  className="text-red-600"
                />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Risk Assessment
                </h3>

                <p className="text-sm text-slate-500">
                  Current project risk information.
                </p>
              </div>

            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">

              <div className="rounded-xl bg-slate-50 p-5">
                <p className="text-xs text-slate-500">
                  Risk Score
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {selectedProject.riskScore ||
                    0}
                  <span className="text-base text-slate-400">
                    /100
                  </span>
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-5">
                <p className="text-xs text-slate-500">
                  Risk Level
                </p>

                <p className="mt-2 text-2xl font-bold">
                  <span
                    className={`rounded-full px-3 py-1 text-base ${
                      RISK_COLORS[
                        selectedProject.riskLevel
                      ] ||
                      "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {selectedProject.riskLevel ||
                      "Low"}
                  </span>
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-5">
                <p className="text-xs text-slate-500">
                  Project Status
                </p>

                <p className="mt-2 text-xl font-bold text-slate-900">
                  {selectedProject.status ||
                    "N/A"}
                </p>
              </div>

            </div>

          </div>

          {/* FINAL SUMMARY */}

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">

            <h3 className="text-lg font-bold text-slate-900">
              Report Summary
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              The project{" "}
              <strong>
                {selectedProject.name}
              </strong>{" "}
              ({selectedProject.projectCode})
              is currently at{" "}
              <strong>
                {selectedProject.physicalProgress ||
                  0}%
              </strong>{" "}
              physical progress with a risk
              score of{" "}
              <strong>
                {selectedProject.riskScore ||
                  0}/100
              </strong>
              . The current risk level is{" "}
              <strong>
                {selectedProject.riskLevel ||
                  "Low"}
              </strong>{" "}
              and the implementation status is{" "}
              <strong>
                {selectedProject.status ||
                  "N/A"}
              </strong>
              .
            </p>

          </div>

        </motion.div>
      )}

    </div>
  );
}

// ==========================================
// INFO ITEM
// ==========================================

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-900">
        {value || "N/A"}
      </p>
    </div>
  );
}

// ==========================================
// COST BOX
// ==========================================

function CostBox({ title, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}