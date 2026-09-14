import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  BarChart3,
  Building2,
  TrendingUp,
  AlertTriangle,
  IndianRupee,
  Clock3,
  RefreshCw,
  Activity,
  ShieldAlert,
} from "lucide-react";
import { motion } from "framer-motion";

const API_URL = "http://localhost:5000/api";

const RISK_COLORS = {
  Low: "#22c55e",
  Medium: "#f59e0b",
  High: "#f97316",
  Critical: "#ef4444",
};

const STATUS_COLORS = {
  "On Track": "#22c55e",
  "At Risk": "#f59e0b",
  Delayed: "#ef4444",
  Completed: "#3b82f6",
};

const formatNumber = (value) => {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 1,
  }).format(Number(value || 0));
};

const formatCurrency = (value) => {
  return `₹${formatNumber(value)} Cr`;
};

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </h2>

          {subtitle && (
            <p className="mt-1 text-xs text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon size={22} className={iconColor} />
        </div>
      </div>
    </motion.div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>

        {subtitle && (
          <p className="mt-1 text-sm text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}

export default function Analytics() {
  const [projects, setProjects] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const projectResponse = await axios.get(
        `${API_URL}/projects`
      );

      const projectList = projectResponse.data?.projects || [];

      setProjects(projectList);

      // Fetch progress for every project
      const progressResults = await Promise.all(
        projectList.map(async (project) => {
          try {
            const response = await axios.get(
              `${API_URL}/projects/${project._id}/progress`
            );

            return response.data?.progress || [];
          } catch (err) {
            console.warn(
              `Progress unavailable for ${project.name}`
            );

            return [];
          }
        })
      );

      setProgressData(progressResults.flat());
    } catch (err) {
      console.error("Analytics error:", err);

      setError(
        "Unable to load analytics data. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // ==========================================
  // SUMMARY
  // ==========================================

  const summary = useMemo(() => {
    const total = projects.length;

    const onTrack = projects.filter(
      (p) => p.status === "On Track"
    ).length;

    const delayed = projects.filter(
      (p) => p.status === "Delayed"
    ).length;

    const highRisk = projects.filter(
      (p) =>
        p.riskLevel === "High" ||
        p.riskLevel === "Critical"
    ).length;

    const totalApprovedCost = projects.reduce(
      (sum, p) => sum + Number(p.approvedCost || 0),
      0
    );

    const totalRevisedCost = projects.reduce(
      (sum, p) =>
        sum + Number(p.revisedCost || p.approvedCost || 0),
      0
    );

    const escalation =
      totalApprovedCost > 0
        ? ((totalRevisedCost - totalApprovedCost) /
            totalApprovedCost) *
          100
        : 0;

    return {
      total,
      onTrack,
      delayed,
      highRisk,
      totalApprovedCost,
      totalRevisedCost,
      escalation,
    };
  }, [projects]);

  // ==========================================
  // MINISTRY-WISE
  // ==========================================

  const ministryData = useMemo(() => {
    const map = {};

    projects.forEach((project) => {
      const ministry =
        project.ministry || "Unknown";

      map[ministry] = (map[ministry] || 0) + 1;
    });

    return Object.entries(map)
      .map(([name, projects]) => ({
        name,
        projects,
      }))
      .sort((a, b) => b.projects - a.projects);
  }, [projects]);

  // ==========================================
  // SECTOR-WISE
  // ==========================================

  const sectorData = useMemo(() => {
    const map = {};

    projects.forEach((project) => {
      const sector = project.sector || "Other";

      map[sector] = (map[sector] || 0) + 1;
    });

    return Object.entries(map)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [projects]);

  // ==========================================
  // RISK DISTRIBUTION
  // ==========================================

  const riskData = useMemo(() => {
    const levels = [
      "Low",
      "Medium",
      "High",
      "Critical",
    ];

    return levels.map((level) => ({
      name: level,
      value: projects.filter(
        (project) => project.riskLevel === level
      ).length,
    }));
  }, [projects]);

  // ==========================================
  // STATUS DISTRIBUTION
  // ==========================================

  const statusData = useMemo(() => {
    const statuses = [
      "On Track",
      "At Risk",
      "Delayed",
      "Completed",
    ];

    return statuses.map((status) => ({
      name: status,
      value: projects.filter(
        (project) => project.status === status
      ).length,
    }));
  }, [projects]);

  // ==========================================
  // PROGRESS PERFORMANCE
  // ==========================================

  const progressPerformance = useMemo(() => {
    if (!projects.length) return [];

    return projects.map((project) => ({
      name:
        project.projectCode ||
        project.name?.substring(0, 12) ||
        "Project",
      planned: 100,
      actual: Number(project.physicalProgress || 0),
    }));
  }, [projects]);

  // ==========================================
  // COST ESCALATION
  // ==========================================

  const costData = useMemo(() => {
    return projects.map((project) => {
      const approved = Number(
        project.approvedCost || 0
      );

      const revised = Number(
        project.revisedCost || approved
      );

      const escalation =
        approved > 0
          ? ((revised - approved) / approved) * 100
          : 0;

      return {
        name:
          project.projectCode ||
          project.name?.substring(0, 12) ||
          "Project",
        approved,
        revised,
        escalation: Number(
          escalation.toFixed(2)
        ),
      };
    });
  }, [projects]);

  // ==========================================
  // MONTHLY TREND
  // ==========================================

  const monthlyTrend = useMemo(() => {
    const map = {};

    progressData.forEach((item) => {
        const month = item.month || "Unknown";

        if (!map[month]) {
        map[month] = {
            month,
            plannedTotal: 0,
            actualTotal: 0,
            expenditure: 0,
            count: 0,
        };
        }

        map[month].plannedTotal += Number(
        item.plannedProgress || 0
        );

        map[month].actualTotal += Number(
        item.actualProgress || 0
        );

        map[month].expenditure += Number(
        item.expenditure || 0
        );

        map[month].count += 1;
    });

    // Convert data into chart format
    const data = Object.values(map).map((item) => ({
        month: item.month,

        planned:
        item.count > 0
            ? Number(
                (item.plannedTotal / item.count).toFixed(1)
            )
            : 0,

        actual:
        item.count > 0
            ? Number(
                (item.actualTotal / item.count).toFixed(1)
            )
            : 0,

        expenditure: Number(
        item.expenditure.toFixed(1)
        ),
    }));

    // ==========================================
    // CHRONOLOGICAL MONTH SORTING
    // September → October → November → December
    // ==========================================

    data.sort((a, b) => {
        const dateA = new Date(`1 ${a.month}`);
        const dateB = new Date(`1 ${b.month}`);

        return dateA - dateB;
    });

    return data;
    }, [progressData]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading analytics...
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
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <AlertTriangle
          className="mx-auto text-red-500"
          size={40}
        />

        <h2 className="mt-3 text-xl font-bold text-red-700">
          Analytics Error
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>

        <button
          onClick={fetchAnalytics}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">

      {/* ======================================
          HEADER
      ======================================= */}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-900 p-7 text-white shadow-xl">

        <div className="relative z-10 flex flex-col justify-between gap-5 md:flex-row md:items-center">

          <div>
            <div className="mb-2 flex items-center gap-2">
              <BarChart3 size={22} />

              <span className="text-sm font-medium text-blue-200">
                Infrastructure Intelligence
              </span>
            </div>

            <h1 className="text-3xl font-bold">
              Analytics Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Monitor project performance, risk,
              cost escalation and progress trends
              using real-time project data.
            </p>
          </div>

          <button
            onClick={fetchAnalytics}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            <RefreshCw size={17} />
            Refresh Data
          </button>

        </div>

        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      {/* ======================================
          KPI CARDS
      ======================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Projects"
          value={summary.total}
          subtitle="Projects under monitoring"
          icon={Building2}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />

        <StatCard
          title="On Track"
          value={summary.onTrack}
          subtitle="Projects progressing normally"
          icon={TrendingUp}
          iconBg="bg-green-50"
          iconColor="text-green-600"
        />

        <StatCard
          title="High / Critical Risk"
          value={summary.highRisk}
          subtitle="Projects requiring attention"
          icon={ShieldAlert}
          iconBg="bg-red-50"
          iconColor="text-red-600"
        />

        <StatCard
          title="Delayed Projects"
          value={summary.delayed}
          subtitle="Projects marked delayed"
          icon={Clock3}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
        />

      </div>

      {/* ======================================
          COST SUMMARY
      ======================================= */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        <StatCard
          title="Approved Cost"
          value={formatCurrency(
            summary.totalApprovedCost
          )}
          subtitle="Total approved project cost"
          icon={IndianRupee}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
        />

        <StatCard
          title="Revised Cost"
          value={formatCurrency(
            summary.totalRevisedCost
          )}
          subtitle="Total revised project cost"
          icon={IndianRupee}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />

        <StatCard
          title="Cost Escalation"
          value={`${summary.escalation.toFixed(1)}%`}
          subtitle="Overall escalation"
          icon={Activity}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />

      </div>

      {/* ======================================
          MINISTRY + SECTOR
      ======================================= */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        <ChartCard
          title="Ministry-wise Projects"
          subtitle="Number of projects monitored by ministry"
        >
          <div className="h-[330px]">
            {ministryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ministryData}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 20,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                  />

                  <XAxis
                    type="number"
                    allowDecimals={false}
                  />

                  <YAxis
                    dataKey="name"
                    type="category"
                    width={150}
                    tick={{ fontSize: 12 }}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="projects"
                    name="Projects"
                    fill="#2563eb"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart />
            )}
          </div>
        </ChartCard>

        <ChartCard
          title="Sector-wise Distribution"
          subtitle="Project distribution across sectors"
        >
          <div className="h-[330px]">
            {sectorData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={sectorData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={115}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                  >
                    {sectorData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={[
                          "#2563eb",
                          "#7c3aed",
                          "#0891b2",
                          "#16a34a",
                          "#f59e0b",
                          "#ef4444",
                        ][index % 6]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart />
            )}
          </div>
        </ChartCard>

      </div>

      {/* ======================================
          RISK + STATUS
      ======================================= */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        <ChartCard
          title="Risk Distribution"
          subtitle="Current project risk levels"
        >
          <div className="h-[330px]">
            {projects.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    outerRadius={115}
                    dataKey="value"
                    nameKey="name"
                    paddingAngle={3}
                  >
                    {riskData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={
                          RISK_COLORS[entry.name]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart />
            )}
          </div>
        </ChartCard>

        <ChartCard
          title="Project Status"
          subtitle="Overall implementation status"
        >
          <div className="h-[330px]">
            {projects.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart data={statusData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                  />

                  <YAxis
                    allowDecimals={false}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="value"
                    name="Projects"
                    radius={[6, 6, 0, 0]}
                  >
                    {statusData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={
                          STATUS_COLORS[
                            entry.name
                          ]
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart />
            )}
          </div>
        </ChartCard>

      </div>

      {/* ======================================
          PROGRESS PERFORMANCE
      ======================================= */}

      <ChartCard
        title="Progress Performance"
        subtitle="Physical progress of monitored projects"
      >
        <div className="h-[360px]">
          {progressPerformance.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={progressPerformance}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 10,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                />

                <YAxis
                  domain={[0, 100]}
                  unit="%"
                />

                <Tooltip
                  formatter={(value) => [
                    `${value}%`,
                  ]}
                />

                <Legend />

                <Bar
                  dataKey="planned"
                  name="Planned"
                  fill="#94a3b8"
                  radius={[5, 5, 0, 0]}
                />

                <Bar
                  dataKey="actual"
                  name="Actual"
                  fill="#2563eb"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="No project progress data available." />
          )}
        </div>
      </ChartCard>

      {/* ======================================
          COST ESCALATION
      ======================================= */}

      <ChartCard
        title="Cost Escalation Analysis"
        subtitle="Approved cost vs revised cost"
      >
        <div className="h-[360px]">
          {costData.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart data={costData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                />

                <YAxis />

                <Tooltip
                  formatter={(value) => [
                    `₹${formatNumber(value)} Cr`,
                  ]}
                />

                <Legend />

                <Bar
                  dataKey="approved"
                  name="Approved Cost"
                  fill="#6366f1"
                  radius={[5, 5, 0, 0]}
                />

                <Bar
                  dataKey="revised"
                  name="Revised Cost"
                  fill="#f97316"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </div>
      </ChartCard>

      {/* ======================================
          MONTHLY TREND
      ======================================= */}

      <ChartCard
        title="Monthly Progress Trend"
        subtitle="Average planned vs actual progress"
      >
        <div className="h-[360px]">
          {monthlyTrend.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart data={monthlyTrend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis dataKey="month" />

                <YAxis
                  domain={[0, 100]}
                  unit="%"
                />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="planned"
                  name="Planned Progress"
                  stroke="#64748b"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />

                <Line
                  type="monotone"
                  dataKey="actual"
                  name="Actual Progress"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="Add monthly progress data to view trends." />
          )}
        </div>
      </ChartCard>

      {/* ======================================
          EXPENDITURE TREND
      ======================================= */}

      <ChartCard
        title="Monthly Expenditure Trend"
        subtitle="Expenditure recorded in monthly progress updates"
      >
        <div className="h-[320px]">
          {monthlyTrend.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart data={monthlyTrend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip
                  formatter={(value) => [
                    `₹${formatNumber(value)} Cr`,
                  ]}
                />

                <Area
                  type="monotone"
                  dataKey="expenditure"
                  name="Expenditure"
                  stroke="#7c3aed"
                  fill="#ddd6fe"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </div>
      </ChartCard>

      {/* ======================================
          INSIGHTS
      ======================================= */}

      <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">

        <div className="flex items-start gap-4">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Activity size={22} />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Analytics Insights
            </h3>

            <ul className="mt-3 space-y-2 text-sm text-slate-600">

              <li>
                •{" "}
                <strong>
                  {summary.total}
                </strong>{" "}
                projects are currently being
                monitored.
              </li>

              <li>
                •{" "}
                <strong>
                  {summary.highRisk}
                </strong>{" "}
                projects are classified as
                High/Critical risk.
              </li>

              <li>
                •{" "}
                <strong>
                  {summary.delayed}
                </strong>{" "}
                projects are currently marked
                as delayed.
              </li>

              <li>
                • Overall project cost escalation
                is{" "}
                <strong>
                  {summary.escalation.toFixed(1)}%
                </strong>
                .
              </li>

              <li>
                • Monthly progress trends can be
                used to identify emerging delays
                before they become critical.
              </li>

            </ul>
          </div>

        </div>
      </div>

    </div>
  );
}

// ==========================================
// EMPTY CHART
// ==========================================

function EmptyChart({
  message = "No data available.",
}) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <BarChart3
          size={38}
          className="mx-auto text-slate-300"
        />

        <p className="mt-3 text-sm text-slate-400">
          {message}
        </p>
      </div>
    </div>
  );
}