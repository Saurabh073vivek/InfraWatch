import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import html2pdf from "html2pdf.js";
import {
  FolderKanban,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  TrendingUp,
  Clock3,
  IndianRupee,
  BellRing,
  MapPin,
  CalendarDays,
  Download,
  Building2,
  MapPinned,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import StatCard from "../components/StatCard";
import RiskBadge from "../components/RiskBadge";

const API = "http://localhost:5000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("infrawatch_token");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

function normalizeProject(project) {
  return {
    ...project,
    id: project._id || project.id,
    name: project.name || "Unnamed Project",
    code: project.projectCode || project.code || "N/A",
    location: project.location || project.state || "N/A",
    progress: Number(project.physicalProgress ?? project.progress ?? 0),
    risk: project.riskLevel || project.risk || "Low",
    riskScore: Number(project.riskScore ?? 0),
    status: project.status || "On Track",
    approvedCost: Number(project.approvedCost ?? 0),
    revisedCost: Number(
      project.revisedCost ?? project.approvedCost ?? 0
    ),
    ministry: project.ministry || "N/A",
    sector: project.sector || "N/A",
  };
}

function getMonthLabel(value) {
  if (!value) return "Unknown";

  const text = String(value).trim();

  const parsed = new Date(`${text} 1`);

  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleString("en-US", {
      month: "short",
    });
  }

  return text.slice(0, 3);
}


const pdfStyles = `
  .pdf-section {
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;

export default function Dashboard() {
  useEffect(() => {
    const styleId = "infrawatch-pdf-styles";

    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = pdfStyles;
      document.head.appendChild(style);
    }

    return () => {
      const style = document.getElementById(styleId);
      if (style) style.remove();
    };
  }, []);

  const [projects, setProjects] = useState([]);
  const [progressRows, setProgressRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API}/projects`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();

      const projectList = (
        data.projects ||
        data.data ||
        []
      ).map(normalizeProject);

      setProjects(projectList);

      const progressResponses = await Promise.all(
        projectList.map(async (project) => {
          try {
            const progressResponse = await fetch(
              `${API}/projects/${project.id}/progress`,
              {
                headers: getAuthHeaders(),
              }
            );

            if (!progressResponse.ok) {
              return [];
            }

            const progressData = await progressResponse.json();

            return (progressData.progress || []).map((row) => ({
              ...row,
              projectId: project.id,
              projectName: project.name,
            }));
          } catch {
            return [];
          }
        })
      );

      setProgressRows(progressResponses.flat());
    } catch (err) {
      console.error("Dashboard API Error:", err);

      setError(
        "Unable to load dashboard data. Make sure the backend is running on port 5000."
      );

      setProjects([]);
      setProgressRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = useMemo(() => {
    const total = projects.length;

    const onTrack = projects.filter(
      (project) => project.status === "On Track"
    ).length;

    const delayed = projects.filter(
      (project) => project.status === "Delayed"
    ).length;

    const low = projects.filter(
      (project) => project.risk === "Low"
    ).length;

    const medium = projects.filter(
      (project) => project.risk === "Medium"
    ).length;

    const high = projects.filter(
      (project) => project.risk === "High"
    ).length;

    const critical = projects.filter(
      (project) => project.risk === "Critical"
    ).length;

    const atRisk =
      medium +
      high +
      critical;

    const approvedCost = projects.reduce(
      (sum, project) => sum + project.approvedCost,
      0
    );

    const revisedCost = projects.reduce(
      (sum, project) => sum + project.revisedCost,
      0
    );

    const costEscalation =
      approvedCost > 0
        ? ((revisedCost - approvedCost) / approvedCost) * 100
        : 0;

    const averageProgress =
      total > 0
        ? projects.reduce(
            (sum, project) => sum + project.progress,
            0
          ) / total
        : 0;

    return {
      total,
      onTrack,
      delayed,
      low,
      medium,
      high,
      critical,
      atRisk,
      approvedCost,
      revisedCost,
      costEscalation,
      averageProgress,
    };
  }, [projects]);

  const progressData = useMemo(() => {
    if (!progressRows.length) {
      return [];
    }

    const grouped = {};

    progressRows.forEach((row) => {
      const key = row.month || "Unknown";

      if (!grouped[key]) {
        grouped[key] = {
          month: key,
          plannedTotal: 0,
          actualTotal: 0,
          expenditure: 0,
          count: 0,
        };
      }

      grouped[key].plannedTotal += Number(
        row.plannedProgress || 0
      );

      grouped[key].actualTotal += Number(
        row.actualProgress || 0
      );

      grouped[key].expenditure += Number(
        row.expenditure || 0
      );

      grouped[key].count += 1;
    });

    return Object.values(grouped)
      .map((row) => ({
        month: getMonthLabel(row.month),
        planned: Math.round(
          row.plannedTotal / row.count
        ),
        actual: Math.round(
          row.actualTotal / row.count
        ),
        expenditure: row.expenditure,
        sortDate:
          new Date(`${row.month} 1`).getTime() || 0,
      }))
      .sort((a, b) => a.sortDate - b.sortDate)
      .map(({ sortDate, ...row }) => row);
  }, [progressRows]);

  const highRiskProjects = useMemo(() => {
    return projects
      .filter(
        (project) =>
          ["Medium", "High", "Critical"].includes(
            project.risk
          ) ||
          project.status === "Delayed"
      )
      .sort(
        (a, b) =>
          b.riskScore - a.riskScore
      )
      .slice(0, 5);
  }, [projects]);

  const recentAlerts = useMemo(() => {
    const alerts = [];

    projects
      .filter(
        (project) =>
          project.risk === "Critical" ||
          project.risk === "High"
      )
      .sort(
        (a, b) =>
          b.riskScore - a.riskScore
      )
      .slice(0, 3)
      .forEach((project) => {
        alerts.push({
          title:
            project.status === "Delayed"
              ? "Project delay detected"
              : "High risk project",
          project: project.name,
          time: "Current",
          icon:
            project.status === "Delayed"
              ? Clock3
              : AlertTriangle,
          type:
            project.risk === "Critical"
              ? "red"
              : "orange",
        });
      });

    projects
      .filter(
        (project) => project.risk === "Medium"
      )
      .slice(
        0,
        Math.max(0, 5 - alerts.length)
      )
      .forEach((project) => {
        alerts.push({
          title: "Risk requires monitoring",
          project: project.name,
          time: "Current",
          icon: BellRing,
          type: "yellow",
        });
      });

    return alerts.slice(0, 5);
  }, [projects]);

  const handleExportPDF = async () => {
    if (exporting) return;

    setExporting(true);

    const element = document.getElementById(
      "infrawatch-dashboard-content"
    );

    if (!element) {
      alert("Dashboard content not found.");
      setExporting(false);
      return;
    }

    let cloneWrapper = null;

    try {
      /*
       * html2canvas used by html2pdf.js does not understand modern
       * oklab()/oklch() CSS colors. Convert those colors to browser-
       * generated RGB values before html2canvas sees the clone.
       */
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const convertModernColors = (value) => {
        if (
          !value ||
          typeof value !== "string" ||
          !/(oklch|oklab)\(/i.test(value)
        ) {
          return value;
        }

        return value.replace(
          /(?:oklch|oklab)\([^)]*\)/gi,
          (color) => {
            try {
              ctx.fillStyle = "#000000";
              ctx.fillStyle = color;

              // Unsupported values remain unchanged.
              if (
                !ctx.fillStyle ||
                /oklch|oklab/i.test(ctx.fillStyle)
              ) {
                return "rgb(0, 0, 0)";
              }

              return ctx.fillStyle;
            } catch {
              return "rgb(0, 0, 0)";
            }
          }
        );
      };

      cloneWrapper = document.createElement("div");
      cloneWrapper.style.position = "fixed";
      cloneWrapper.style.left = "-100000px";
      cloneWrapper.style.top = "0";
      cloneWrapper.style.width = "1400px";
      cloneWrapper.style.background = "#0f172a";
      cloneWrapper.style.zIndex = "-1";
      cloneWrapper.style.overflow = "visible";

      const clone = element.cloneNode(true);

      clone.id = "infrawatch-pdf-clone";
      clone.style.width = "1400px";
      clone.style.maxWidth = "1400px";
      clone.style.background = "#0f172a";
      clone.style.overflow = "visible";

      cloneWrapper.appendChild(clone);
      document.body.appendChild(cloneWrapper);

      /*
       * Convert every computed CSS property containing oklab/oklch.
       * This is more reliable than changing only background/color.
       */
      const originalElements = [
        element,
        ...Array.from(element.querySelectorAll("*")),
      ];

      const clonedElements = [
        clone,
        ...Array.from(clone.querySelectorAll("*")),
      ];

      originalElements.forEach((original, index) => {
        const target = clonedElements[index];

        if (!target) return;

        const computed = window.getComputedStyle(original);

        for (let i = 0; i < computed.length; i++) {
          const property = computed[i];

          try {
            let value = computed.getPropertyValue(property);

            if (!value) return;

            value = convertModernColors(value);

            target.style.setProperty(
              property,
              value,
              computed.getPropertyPriority(property)
            );
          } catch {
            // Ignore a CSS property that cannot be copied.
          }
        }

        // Tailwind classes can reintroduce modern color functions.
        target.removeAttribute("class");
      });

      /*
       * Remove buttons only AFTER style mapping. Removing them before
       * mapping changes the element indexes and causes styles to land
       * on the wrong elements, producing black/blank PDF sections.
       */
      clone.querySelectorAll("button").forEach((button) => {
        button.remove();
      });

      /*
       * Remove any remaining stylesheet/custom-property colors from
       * the cloned document. Only the cloned dashboard is affected.
       */
      clone.querySelectorAll("style, link[rel='stylesheet']").forEach(
        (node) => node.remove()
      );

      /*
       * Make SVG charts stable for capture.
       */
      clone.querySelectorAll("svg").forEach((svg) => {
        const rect = svg.getBoundingClientRect();

        if (rect.width > 0) {
          svg.setAttribute("width", String(rect.width));
        }

        if (rect.height > 0) {
          svg.setAttribute("height", String(rect.height));
        }

        svg.style.display = "block";
      });

      /*
       * Wait for images.
       */
      const images = Array.from(clone.querySelectorAll("img"));

      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve();

          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

      await new Promise((resolve) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(resolve)
        )
      );

      const options = {
        margin: 5,
        filename: "InfraWatch_Dashboard_Report.pdf",

        image: {
          type: "jpeg",
          quality: 0.98,
        },

        html2canvas: {
          scale: 1.5,
          useCORS: true,
          allowTaint: false,
          backgroundColor: "#0f172a",
          logging: false,
          imageTimeout: 20000,
          scrollX: 0,
          scrollY: 0,
          windowWidth: 1400,
          windowHeight: clone.scrollHeight,
          foreignObjectRendering: false,
        },

        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "landscape",
          compress: true,
        },

        pagebreak: {
          mode: ["css", "legacy"],
          avoid: [".pdf-section"],
        },
      };

      await html2pdf()
        .set(options)
        .from(clone)
        .save();

    } catch (error) {
      console.error("InfraWatch PDF Export Error:", error);

      alert(
        `PDF export failed: ${
          error?.message || "Unknown error"
        }`
      );
    } finally {
      if (cloneWrapper && cloneWrapper.parentNode) {
        cloneWrapper.parentNode.removeChild(cloneWrapper);
      }

      setExporting(false);
    }
  };

  const today = new Date().toLocaleDateString(
    "en-IN",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  const formatCr = (value) =>
    `₹${Number(value || 0).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2,
      }
    )} Cr`;

  const riskTotal =
    stats.low +
    stats.medium +
    stats.high +
    stats.critical;

  const riskPercent = (count) =>
    riskTotal > 0
      ? Math.round(
          (count / riskTotal) * 100
        )
      : 0;

  const riskChart = {
    low: riskPercent(stats.low),
    medium: riskPercent(stats.medium),
    high: riskPercent(stats.high),
    critical: riskPercent(stats.critical),
  };

  const lowEnd = riskChart.low * 3.6;
  const mediumEnd =
    lowEnd + riskChart.medium * 3.6;
  const highEnd =
    mediumEnd + riskChart.high * 3.6;

  const riskGradient =
    riskTotal > 0
      ? `conic-gradient(
          #10b981 0deg ${lowEnd}deg,
          #fbbf24 ${lowEnd}deg ${mediumEnd}deg,
          #f97316 ${mediumEnd}deg ${highEnd}deg,
          #ef4444 ${highEnd}deg 360deg
        )`
      : "#e2e8f0";

  const atRiskPercentage =
    stats.total > 0
      ? Math.round(
          (stats.atRisk / stats.total) * 100
        )
      : 0;

  return (
    <div id="infrawatch-dashboard-content" className="space-y-5 overflow-visible bg-slate-950 p-4 pb-6">

      {/* ================= HERO ================= */}

      <motion.section
        initial={{
          opacity: 0,
          y: -15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="pdf-section relative min-h-[175px] overflow-hidden rounded-2xl shadow-lg"
      >
        <img
          src="/infrastructure-banner.png"
          alt="Infrastructure"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-blue-700/95 via-blue-600/70 to-violet-600/30" />

        <div className="relative z-10 flex min-h-[175px] flex-col justify-between p-6">

          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-blue-100">
              Infrastructure for a Better Tomorrow
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
              Good Morning, Saurabh 👋
            </h1>

            <p className="mt-1.5 text-sm text-blue-50">
              Here's what's happening with your infrastructure projects today.
            </p>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <HeroTag
              icon={MapPinned}
              text="Safer Roads"
            />

            <HeroTag
              icon={Building2}
              text="Smarter Cities"
            />

            <HeroTag
              icon={ShieldAlert}
              text="Sustainable Growth"
            />

            <HeroTag
              icon={MapPin}
              text="Connected India"
            />
          </div>

          <div className="absolute bottom-5 right-5 flex items-center gap-2">

            <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/15 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md">
              <CalendarDays size={14} />
              {today}
            </div>

            <button
              type="button"
              onClick={handleExportPDF}
              disabled={exporting}
              title="Download dashboard as PDF"
              aria-label="Download dashboard as PDF"
              className={`flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-blue-700 shadow-lg transition ${
                exporting
                  ? "cursor-not-allowed opacity-70"
                  : "hover:-translate-y-0.5 hover:bg-blue-50"
              }`}
            >
              <Download size={14} />
              {exporting ? "Generating..." : "Export Report"}
            </button>

          </div>
        </div>
      </motion.section>

      {/* ================= ERROR ================= */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ================= KPI CARDS ================= */}

      <section className="pdf-section grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Projects"
          value={
            loading
              ? "..."
              : stats.total
          }
          subtitle="Projects under monitoring"
          trend=""
          icon={FolderKanban}
          type="blue"
        />

        <StatCard
          title="Projects On Track"
          value={
            loading
              ? "..."
              : stats.onTrack
          }
          subtitle="Projects progressing normally"
          trend=""
          icon={CheckCircle2}
          type="green"
        />

        <StatCard
          title="Projects At Risk"
          value={
            loading
              ? "..."
              : stats.atRisk
          }
          subtitle="Requires attention"
          trend=""
          icon={AlertTriangle}
          type="orange"
        />

        <StatCard
          title="Critical Projects"
          value={
            loading
              ? "..."
              : stats.critical
          }
          subtitle="Immediate action required"
          trend=""
          icon={ShieldAlert}
          type="red"
        />

      </section>

      {/* ================= PERFORMANCE / RISK / ALERTS ================= */}

      <section className="pdf-section grid grid-cols-1 gap-5 xl:grid-cols-12">

        {/* Project Performance */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-6"
        >

          <SectionHeader
            icon={TrendingUp}
            iconClass="bg-violet-100 text-violet-600"
            title="Project Performance"
            subtitle="Planned vs actual progress from monthly monitoring data"
          />

          <div className="mt-5 h-[250px] w-full">

            {progressData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart data={progressData}>

                  <defs>
                    <linearGradient
                      id="planned"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#3b82f6"
                        stopOpacity={0.22}
                      />

                      <stop
                        offset="100%"
                        stopColor="#3b82f6"
                        stopOpacity={0}
                      />
                    </linearGradient>

                    <linearGradient
                      id="actual"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#7c3aed"
                        stopOpacity={0.28}
                      />

                      <stop
                        offset="100%"
                        stopColor="#7c3aed"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    stroke="#e2e8f0"
                    strokeDasharray="4 4"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 10,
                      fill: "#94a3b8",
                    }}
                  />

                  <YAxis
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 10,
                      fill: "#94a3b8",
                    }}
                    tickFormatter={(value) =>
                      `${value}%`
                    }
                  />

                  <Tooltip
                    formatter={(value) =>
                      `${value}%`
                    }
                  />

                  <Area
                    type="monotone"
                    dataKey="planned"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    fill="url(#planned)"
                    name="Planned"
                  />

                  <Area
                    type="monotone"
                    dataKey="actual"
                    stroke="#7c3aed"
                    strokeWidth={2.5}
                    fill="url(#actual)"
                    name="Actual"
                  />

                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart
                text={
                  loading
                    ? "Loading project performance..."
                    : "Add monthly progress updates to show the performance trend."
                }
              />
            )}

          </div>

          <div className="mt-2 flex justify-center gap-6">
            <Legend
              color="bg-blue-600"
              text="Planned"
            />

            <Legend
              color="bg-violet-600"
              text="Actual"
            />
          </div>

        </motion.div>

        {/* Risk Overview */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-3"
        >

          <SectionHeader
            icon={ShieldAlert}
            iconClass="bg-emerald-100 text-emerald-600"
            title="Risk Overview"
            subtitle="Current project risk distribution"
          />

          <div className="relative mx-auto mt-5 h-36 w-36">

            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: riskGradient,
              }}
            />

            <div className="absolute inset-[13px] flex items-center justify-center rounded-full bg-white">

              <div className="text-center">

                <p className="text-3xl font-bold text-slate-950">
                  {atRiskPercentage}%
                </p>

                <p className="text-[10px] text-slate-400">
                  At Risk
                </p>

              </div>

            </div>
          </div>

          <div className="mt-5 space-y-2.5">

            <RiskRow
              label="Low Risk"
              count={stats.low}
              percentage={`${riskChart.low}%`}
              dot="bg-emerald-500"
            />

            <RiskRow
              label="Medium Risk"
              count={stats.medium}
              percentage={`${riskChart.medium}%`}
              dot="bg-amber-400"
            />

            <RiskRow
              label="High Risk"
              count={stats.high}
              percentage={`${riskChart.high}%`}
              dot="bg-orange-500"
            />

            <RiskRow
              label="Critical"
              count={stats.critical}
              percentage={`${riskChart.critical}%`}
              dot="bg-red-500"
            />

          </div>

        </motion.div>

        {/* Recent Alerts */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.15,
          }}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-3"
        >

          <div className="flex items-center justify-between border-b border-slate-100 p-4">

            <div>
              <h2 className="text-sm font-bold text-slate-950">
                Recent Alerts
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Latest project warnings
              </p>
            </div>

          </div>

          <div>

            {recentAlerts.length > 0 ? (
              recentAlerts.map(
                (alert, index) => (
                  <AlertItem
                    key={`${alert.project}-${index}`}
                    {...alert}
                  />
                )
              )
            ) : (
              <div className="p-6 text-center text-xs text-slate-400">
                No active warnings.
              </div>
            )}

          </div>

        </motion.div>

      </section>

      {/* ================= BOTTOM SECTION ================= */}

      <section className="pdf-section grid grid-cols-1 gap-5 xl:grid-cols-12">

        {/* High Risk Projects */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-6"
        >

          <div className="flex items-center justify-between border-b border-slate-100 p-4">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <AlertTriangle size={17} />
              </div>

              <div>

                <h2 className="text-sm font-bold text-slate-950">
                  High Risk Projects
                </h2>

                <p className="text-[10px] text-slate-400">
                  Projects requiring attention
                </p>

              </div>

            </div>

          </div>

          <div className="overflow-x-auto">

            {highRiskProjects.length > 0 ? (
              <table className="w-full min-w-[650px]">

                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="tableHead">
                      #
                    </th>

                    <th className="tableHead">
                      Project Name
                    </th>

                    <th className="tableHead">
                      Location
                    </th>

                    <th className="tableHead">
                      Progress
                    </th>

                    <th className="tableHead">
                      Risk Score
                    </th>

                    <th className="tableHead">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {highRiskProjects.map(
                    (project, index) => (
                      <tr
                        key={
                          project.id ||
                          project.code
                        }
                        className="border-t border-slate-100 hover:bg-blue-50/40"
                      >

                        <td className="tableCell font-bold">
                          {String(
                            index + 1
                          ).padStart(2, "0")}
                        </td>

                        <td className="tableCell font-semibold text-slate-800">
                          {project.name}
                        </td>

                        <td className="tableCell">
                          {project.location}
                        </td>

                        <td className="tableCell">

                          <div className="flex items-center gap-2">

                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">

                              <motion.div
                                initial={{
                                  width: 0,
                                }}
                                animate={{
                                  width: `${Math.min(
                                    project.progress,
                                    100
                                  )}%`,
                                }}
                                transition={{
                                  duration: 0.8,
                                }}
                                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
                              />

                            </div>

                            <span className="text-[10px] font-semibold">
                              {project.progress}%
                            </span>

                          </div>

                        </td>

                        <td className="tableCell font-bold text-slate-800">
                          {project.riskScore}/100
                        </td>

                        <td className="tableCell">
                          <RiskBadge
                            level={
                              project.risk
                            }
                          />
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>
            ) : (
              <div className="p-8 text-center text-sm text-slate-400">
                No medium, high, critical or delayed projects.
              </div>
            )}

          </div>

        </motion.div>

        {/* Key Insights */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-3"
        >

          <SectionHeader
            icon={TrendingUp}
            iconClass="bg-violet-100 text-violet-600"
            title="Key Insights"
            subtitle="Live project intelligence"
          />

          <div className="mt-4 grid grid-cols-1 gap-3">

            <Insight
              icon={TrendingUp}
              title="Average Progress"
              value={`${stats.averageProgress.toFixed(
                1
              )}%`}
              text={`${stats.total} project${
                stats.total === 1
                  ? ""
                  : "s"
              } currently monitored`}
              type="purple"
            />

            <Insight
              icon={IndianRupee}
              title="Cost Variance"
              value={formatCr(
                stats.revisedCost -
                  stats.approvedCost
              )}
              text={`${stats.costEscalation.toFixed(
                1
              )}% overall escalation`}
              type="green"
            />

            <Insight
              icon={Clock3}
              title="Delay Exposure"
              value={`${stats.delayed} Project${
                stats.delayed === 1
                  ? ""
                  : "s"
              }`}
              text="Projects currently marked delayed"
              type="blue"
            />

          </div>

        </motion.div>

        {/* Project Locations */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.15,
          }}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-3"
        >

          <div className="flex items-center justify-between border-b border-slate-100 p-4">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <MapPinned size={17} />
              </div>

              <div>

                <h2 className="text-sm font-bold text-slate-950">
                  Project Locations
                </h2>

                <p className="text-[10px] text-slate-400">
                  Live project locations
                </p>

              </div>

            </div>

          </div>

          <div className="max-h-[185px] overflow-y-auto p-3">

            {projects.length > 0 ? (
              <div className="space-y-2">

                {projects
                  .slice(0, 6)
                  .map((project) => (
                    <div
                      key={
                        project.id ||
                        project.code
                      }
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"
                    >

                      <div className="flex min-w-0 items-center gap-2">

                        <MapPin
                          size={13}
                          className="shrink-0 text-blue-500"
                        />

                        <div className="min-w-0">

                          <p className="truncate text-[10px] font-bold text-slate-800">
                            {project.name}
                          </p>

                          <p className="text-[9px] text-slate-400">
                            {project.location}
                          </p>

                        </div>

                      </div>

                      <RiskBadge
                        level={
                          project.risk
                        }
                      />

                    </div>
                  ))}

              </div>
            ) : (
              <div className="py-10 text-center text-xs text-slate-400">
                No projects available.
              </div>
            )}

          </div>

        </motion.div>

      </section>

      {/* ================= FOOTER ================= */}

      <div className="flex items-center justify-between px-1 pt-1 text-[10px] text-slate-400">

        <span>
          © 2026 InfraWatch. AI Monitoring Infrastructure for a Better Tomorrow.
        </span>

        <div className="hidden gap-4 sm:flex">
          <span>Help</span>
          <span>Privacy</span>
          <span>Terms</span>
        </div>

      </div>

    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function HeroTag({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold backdrop-blur-md">
      <Icon size={13} />
      {text}
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  iconClass,
  title,
  subtitle,
}) {
  return (
    <div className="flex items-center gap-3">

      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconClass}`}
      >
        <Icon size={17} />
      </div>

      <div>

        <h2 className="text-sm font-bold text-slate-950">
          {title}
        </h2>

        <p className="mt-0.5 text-[10px] text-slate-400">
          {subtitle}
        </p>

      </div>

    </div>
  );
}

function Legend({ color, text }) {
  return (
    <span className="flex items-center gap-2 text-[10px] text-slate-500">

      <span
        className={`h-2 w-2 rounded-full ${color}`}
      />

      {text}

    </span>
  );
}

function RiskRow({
  label,
  count,
  percentage,
  dot,
}) {
  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-2">

        <span
          className={`h-2 w-2 rounded-full ${dot}`}
        />

        <span className="text-[10px] text-slate-500">
          {label}
        </span>

      </div>

      <div className="flex items-center gap-4">

        <span className="text-[10px] font-bold text-slate-800">
          {count}
        </span>

        <span className="w-7 text-right text-[9px] text-slate-400">
          {percentage}
        </span>

      </div>

    </div>
  );
}

function AlertItem({
  title,
  project,
  time,
  icon: Icon,
  type,
}) {
  const styles = {
    red: "bg-red-100 text-red-600",
    orange:
      "bg-orange-100 text-orange-600",
    yellow:
      "bg-amber-100 text-amber-600",
    blue: "bg-blue-100 text-blue-600",
    purple:
      "bg-violet-100 text-violet-600",
  };

  return (
    <div className="flex items-center gap-2.5 border-b border-slate-100 px-4 py-2.5 transition hover:bg-slate-50">

      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${styles[type]}`}
      >
        <Icon size={14} />
      </div>

      <div className="min-w-0 flex-1">

        <p className="truncate text-[10px] font-bold text-slate-800">
          {title}
        </p>

        <p className="truncate text-[9px] text-slate-400">
          {project}
        </p>

      </div>

      <span className="shrink-0 text-[9px] text-slate-400">
        {time}
      </span>

    </div>
  );
}

function Insight({
  icon: Icon,
  title,
  value,
  text,
  type,
}) {
  const styles = {
    purple:
      "bg-violet-100 text-violet-600",
    green:
      "bg-emerald-100 text-emerald-600",
    blue:
      "bg-blue-100 text-blue-600",
  };

  return (
    <motion.div
      whileHover={{
        y: -2,
      }}
      className="rounded-xl border border-slate-100 bg-slate-50/70 p-3"
    >

      <div className="flex items-center gap-2.5">

        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${styles[type]}`}
        >
          <Icon size={15} />
        </div>

        <div>

          <p className="text-[9px] text-slate-400">
            {title}
          </p>

          <p className="text-base font-bold text-slate-950">
            {value}
          </p>

        </div>

      </div>

      <p className="mt-2 text-[9px] font-medium text-slate-500">
        {text}
      </p>

    </motion.div>
  );
}

function EmptyChart({ text }) {
  return (
    <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 text-center text-xs text-slate-400">
      {text}
    </div>
  );
}
