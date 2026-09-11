import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  IndianRupee,
  Plus,
  RefreshCw,
  Target,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const API_URL = "http://localhost:5000/api";

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function Monitoring() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const [progress, setProgress] = useState([]);

  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(false);

  const [error, setError] = useState("");

  const [showAddProgress, setShowAddProgress] = useState(false);

  // ==========================================
  // LOAD PROJECTS
  // ==========================================

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/projects`
      );

      const data = response.data.projects || [];

      setProjects(data);

      if (data.length > 0) {
        setSelectedProjectId(data[0]._id);
      }
    } catch (error) {
      console.error(
        "Fetch Projects Error:",
        error
      );

      setError(
        "Unable to load projects. Please check the backend server."
      );
    } finally {
      setLoadingProjects(false);
    }
  };

  // ==========================================
  // LOAD PROGRESS
  // ==========================================

  useEffect(() => {
    if (selectedProjectId) {
      fetchProgress(selectedProjectId);
    } else {
      setProgress([]);
    }
  }, [selectedProjectId]);

  const fetchProgress = async (projectId) => {
    try {
      setLoadingProgress(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/projects/${projectId}/progress`
      );

      setProgress(response.data.progress || []);
    } catch (error) {
      console.error(
        "Fetch Progress Error:",
        error
      );

      setError(
        "Unable to load project progress."
      );
    } finally {
      setLoadingProgress(false);
    }
  };

  // ==========================================
  // SELECTED PROJECT
  // ==========================================

  const selectedProject = useMemo(() => {
    return projects.find(
      (project) =>
        project._id === selectedProjectId
    );
  }, [projects, selectedProjectId]);

  // ==========================================
  // CURRENT PROGRESS
  // ==========================================

  const currentActualProgress = useMemo(() => {
    if (!progress.length) {
      return selectedProject?.physicalProgress || 0;
    }

    return progress[progress.length - 1]
      .actualProgress || 0;
  }, [progress, selectedProject]);

  const currentPlannedProgress = useMemo(() => {
    if (!progress.length) return 0;

    return progress[progress.length - 1]
      .plannedProgress || 0;
  }, [progress]);

  const progressGap =
    currentPlannedProgress -
    currentActualProgress;

  const totalExpenditure = useMemo(() => {
    return progress.reduce(
      (total, item) =>
        total + Number(item.expenditure || 0),
      0
    );
  }, [progress]);

  // ==========================================
  // CHART DATA
  // ==========================================

  const chartData = useMemo(() => {
    return [...progress]
      .reverse()
      .map((item) => ({
        month: item.month,
        Planned: Number(
          item.plannedProgress || 0
        ),
        Actual: Number(
          item.actualProgress || 0
        ),
      }));
  }, [progress]);

  // ==========================================
  // ADD PROGRESS
  // ==========================================

  const handleAddProgress = async (formData) => {
    if (!selectedProjectId) {
      alert("Please select a project first.");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/projects/${selectedProjectId}/progress`,
        formData
      );

      setShowAddProgress(false);

      await fetchProgress(
        selectedProjectId
      );

      await fetchProjects();

      alert(
        "Monthly progress added successfully."
      );
    } catch (error) {
      console.error(
        "Add Progress Error:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Failed to add progress."
      );
    }
  };

  // ==========================================
  // REFRESH
  // ==========================================

  const handleRefresh = async () => {
    if (!selectedProjectId) return;

    await fetchProgress(
      selectedProjectId
    );

    await fetchProjects();
  };

  return (
    <div className="space-y-5">

      {/* =====================================
          HEADER
      ====================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: -10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="
          flex flex-col
          justify-between
          gap-4
          md:flex-row
          md:items-center
        "
      >
        <div>
          <p className="
            text-[11px]
            font-bold
            uppercase
            tracking-wider
            text-blue-500
          ">
            Project Monitoring
          </p>

          <h1 className="
            mt-1
            text-2xl
            font-bold
            tracking-tight
            text-slate-950
          ">
            Progress Monitoring
          </h1>

          <p className="
            mt-1
            text-sm
            text-slate-500
          ">
            Track planned vs actual project progress
            and monitor monthly performance.
          </p>
        </div>

        <div className="
          flex
          items-center
          gap-2
        ">

          <button
            onClick={handleRefresh}
            disabled={
              loadingProgress ||
              !selectedProjectId
            }
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-2.5
              text-sm
              font-medium
              text-slate-600
              shadow-sm
              transition
              hover:bg-slate-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <RefreshCw
              size={16}
              className={
                loadingProgress
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

          <button
            onClick={() =>
              setShowAddProgress(true)
            }
            disabled={!selectedProjectId}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              shadow-lg
              shadow-blue-500/20
              transition
              hover:-translate-y-0.5
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <Plus size={17} />

            Add Progress
          </button>
        </div>
      </motion.div>

      {/* =====================================
          PROJECT SELECTOR
      ====================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-4
          shadow-sm
        "
      >
        <div className="
          flex
          flex-col
          gap-3
          lg:flex-row
          lg:items-center
          lg:justify-between
        ">

          <div>
            <p className="
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-slate-400
            ">
              Select Project
            </p>

            <p className="
              mt-1
              text-xs
              text-slate-500
            ">
              Choose a project to view its monthly
              monitoring data.
            </p>
          </div>

          <div className="
            relative
            w-full
            lg:w-[420px]
          ">
            <select
              value={selectedProjectId}
              onChange={(e) =>
                setSelectedProjectId(
                  e.target.value
                )
              }
              disabled={
                loadingProjects ||
                projects.length === 0
              }
              className="
                h-11
                w-full
                appearance-none
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-4
                pr-10
                text-sm
                font-medium
                text-slate-700
                outline-none
                transition
                focus:border-blue-400
                focus:bg-white
              "
            >
              {loadingProjects && (
                <option value="">
                  Loading projects...
                </option>
              )}

              {!loadingProjects &&
                projects.length === 0 && (
                  <option value="">
                    No projects available
                  </option>
                )}

              {projects.map((project) => (
                <option
                  key={project._id}
                  value={project._id}
                >
                  {project.projectCode} —{" "}
                  {project.name}
                </option>
              ))}
            </select>

            <ChevronDown
              size={16}
              className="
                pointer-events-none
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />
          </div>
        </div>
      </motion.div>

      {/* =====================================
          ERROR
      ====================================== */}

      {error && (
        <motion.div
          initial={{
            opacity: 0,
            y: -5,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            flex
            items-center
            gap-3
            rounded-xl
            border
            border-red-100
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-600
          "
        >
          <AlertTriangle size={17} />

          {error}
        </motion.div>
      )}

      {/* =====================================
          PROJECT INFO
      ====================================== */}

      {selectedProject && (
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            rounded-2xl
            bg-gradient-to-r
            from-slate-950
            via-blue-950
            to-indigo-950
            p-5
            text-white
            shadow-xl
          "
        >
          <div className="
            flex
            flex-col
            justify-between
            gap-4
            md:flex-row
            md:items-center
          ">

            <div>
              <p className="
                text-[10px]
                font-bold
                uppercase
                tracking-wider
                text-blue-300
              ">
                Monitoring Project
              </p>

              <h2 className="
                mt-1
                text-xl
                font-bold
              ">
                {selectedProject.name}
              </h2>

              <div className="
                mt-2
                flex
                flex-wrap
                items-center
                gap-3
                text-xs
                text-slate-300
              ">
                <span>
                  {selectedProject.projectCode}
                </span>

                <span>•</span>

                <span>
                  {selectedProject.ministry}
                </span>

                <span>•</span>

                <span>
                  {selectedProject.location}
                </span>
              </div>
            </div>

            <div className="
              rounded-xl
              border
              border-white/10
              bg-white/10
              px-5
              py-3
              backdrop-blur
            ">
              <p className="
                text-[10px]
                text-slate-300
              ">
                Current Progress
              </p>

              <p className="
                mt-1
                text-2xl
                font-bold
              ">
                {currentActualProgress}%
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* =====================================
          KPI CARDS
      ====================================== */}

      <div className="
        grid
        grid-cols-1
        gap-4
        sm:grid-cols-2
        xl:grid-cols-4
      ">

        <MonitorCard
          title="Actual Progress"
          value={`${currentActualProgress}%`}
          subtitle="Latest physical progress"
          icon={Activity}
          type="blue"
        />

        <MonitorCard
          title="Planned Progress"
          value={`${currentPlannedProgress}%`}
          subtitle="Latest planned target"
          icon={Target}
          type="green"
        />

        <MonitorCard
          title="Progress Gap"
          value={`${Math.abs(progressGap)}%`}
          subtitle={
            progressGap > 0
              ? "Behind planned progress"
              : progressGap < 0
              ? "Ahead of planned progress"
              : "On planned target"
          }
          icon={
            progressGap > 0
              ? TrendingDown
              : TrendingUp
          }
          type={
            progressGap > 0
              ? "red"
              : "green"
          }
        />

        <MonitorCard
          title="Total Expenditure"
          value={`₹${totalExpenditure}`}
          subtitle="Recorded monitoring expenditure"
          icon={IndianRupee}
          type="orange"
        />
      </div>

      {/* =====================================
          CHART + CURRENT STATUS
      ====================================== */}

      <div className="
        grid
        grid-cols-1
        gap-5
        xl:grid-cols-[1fr_330px]
      ">

        {/* CHART */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
          "
        >
          <div className="
            flex
            flex-col
            justify-between
            gap-2
            sm:flex-row
            sm:items-center
          ">
            <div>
              <h2 className="
                text-sm
                font-bold
                text-slate-950
              ">
                Planned vs Actual Progress
              </h2>

              <p className="
                mt-1
                text-[11px]
                text-slate-400
              ">
                Monthly physical progress comparison
              </p>
            </div>

            <div className="
              rounded-lg
              bg-blue-50
              px-3
              py-1.5
              text-[10px]
              font-semibold
              text-blue-600
            ">
              {progress.length} Monthly Records
            </div>
          </div>

          <div className="
            mt-5
            h-[330px]
            w-full
          ">
            {loadingProgress ? (
              <LoadingBox />
            ) : chartData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <LineChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    tick={{
                      fontSize: 10,
                    }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    domain={[0, 100]}
                    tick={{
                      fontSize: 10,
                    }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) =>
                      `${value}%`
                    }
                  />

                  <Tooltip
                    formatter={(value) =>
                      `${value}%`
                    }
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      fontSize: "12px",
                    }}
                  />

                  <Legend
                    wrapperStyle={{
                      fontSize: "11px",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="Planned"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="Actual"
                    stroke="#0ea5e9"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState
                icon={Activity}
                title="No progress data"
                text="Add monthly progress to generate the performance chart."
              />
            )}
          </div>
        </motion.div>

        {/* STATUS PANEL */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
          "
        >
          <h2 className="
            text-sm
            font-bold
            text-slate-950
          ">
            Current Performance
          </h2>

          <p className="
            mt-1
            text-[11px]
            text-slate-400
          ">
            Latest project monitoring status
          </p>

          <div className="
            mt-6
            flex
            items-center
            justify-center
          ">
            <ProgressCircle
              value={currentActualProgress}
            />
          </div>

          <div className="
            mt-6
            space-y-3
          ">

            <StatusRow
              label="Planned"
              value={`${currentPlannedProgress}%`}
              type="blue"
            />

            <StatusRow
              label="Actual"
              value={`${currentActualProgress}%`}
              type="green"
            />

            <StatusRow
              label="Gap"
              value={`${Math.abs(progressGap)}%`}
              type={
                progressGap > 0
                  ? "red"
                  : "green"
              }
            />

            <StatusRow
              label="Project Status"
              value={
                selectedProject?.status ||
                "On Track"
              }
              type="orange"
            />
          </div>
        </motion.div>
      </div>

      {/* =====================================
          MONTHLY RECORDS
      ====================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >
        <div className="
          flex
          items-center
          justify-between
          border-b
          border-slate-100
          p-5
        ">
          <div>
            <h2 className="
              text-sm
              font-bold
              text-slate-950
            ">
              Monthly Progress Records
            </h2>

            <p className="
              mt-1
              text-[11px]
              text-slate-400
            ">
              Historical progress and expenditure
            </p>
          </div>

          <span className="
            rounded-full
            bg-blue-50
            px-3
            py-1
            text-[10px]
            font-bold
            text-blue-600
          ">
            {progress.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">

          {loadingProgress ? (
            <div className="p-10">
              <LoadingBox />
            </div>
          ) : progress.length === 0 ? (
            <div className="p-12">
              <EmptyState
                icon={CalendarDays}
                title="No monthly records"
                text="Click Add Progress to record the first monthly update."
              />
            </div>
          ) : (
            <table className="
              w-full
              min-w-[900px]
            ">
              <thead>
                <tr className="bg-slate-50">

                  <TableHead>
                    Month
                  </TableHead>

                  <TableHead>
                    Planned
                  </TableHead>

                  <TableHead>
                    Actual
                  </TableHead>

                  <TableHead>
                    Gap
                  </TableHead>

                  <TableHead>
                    Expenditure
                  </TableHead>

                  <TableHead>
                    Remarks
                  </TableHead>

                  <TableHead>
                    Date Added
                  </TableHead>

                </tr>
              </thead>

              <tbody>
                {progress.map(
                  (item, index) => {
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
                      <motion.tr
                        key={
                          item._id ||
                          index
                        }
                        initial={{
                          opacity: 0,
                          y: 5,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay:
                            index * 0.04,
                        }}
                        className="
                          border-t
                          border-slate-100
                          transition
                          hover:bg-blue-50/30
                        "
                      >

                        <td className="
                          px-5
                          py-4
                        ">
                          <div className="
                            flex
                            items-center
                            gap-2
                          ">
                            <div className="
                              flex
                              h-8
                              w-8
                              items-center
                              justify-center
                              rounded-lg
                              bg-blue-50
                              text-blue-600
                            ">
                              <CalendarDays
                                size={14}
                              />
                            </div>

                            <span className="
                              text-xs
                              font-semibold
                              text-slate-800
                            ">
                              {item.month}
                            </span>
                          </div>
                        </td>

                        <td className="
                          px-5
                          py-4
                        ">
                          <span className="
                            text-xs
                            font-semibold
                            text-indigo-600
                          ">
                            {item.plannedProgress}%
                          </span>
                        </td>

                        <td className="
                          px-5
                          py-4
                        ">
                          <span className="
                            text-xs
                            font-bold
                            text-sky-600
                          ">
                            {item.actualProgress}%
                          </span>
                        </td>

                        <td className="
                          px-5
                          py-4
                        ">
                          <span
                            className={`
                              rounded-full
                              px-2.5
                              py-1
                              text-[9px]
                              font-bold
                              ${
                                gap > 0
                                  ? "bg-red-50 text-red-600"
                                  : "bg-emerald-50 text-emerald-600"
                              }
                            `}
                          >
                            {gap > 0
                              ? `-${gap}%`
                              : `+${Math.abs(gap)}%`}
                          </span>
                        </td>

                        <td className="
                          px-5
                          py-4
                        ">
                          <span className="
                            text-xs
                            font-semibold
                            text-slate-700
                          ">
                            ₹
                            {Number(
                              item.expenditure ||
                                0
                            )}
                          </span>
                        </td>

                        <td className="
                          max-w-[280px]
                          px-5
                          py-4
                        ">
                          <p className="
                            truncate
                            text-xs
                            text-slate-500
                          ">
                            {item.remarks ||
                              "No remarks"}
                          </p>
                        </td>

                        <td className="
                          px-5
                          py-4
                        ">
                          <span className="
                            text-[10px]
                            text-slate-400
                          ">
                            {item.createdAt
                              ? new Date(
                                  item.createdAt
                                ).toLocaleDateString(
                                  "en-IN"
                                )
                              : "-"}
                          </span>
                        </td>

                      </motion.tr>
                    );
                  }
                )}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>

      {/* =====================================
          ADD PROGRESS MODAL
      ====================================== */}

      <AnimatePresence>
        {showAddProgress && (
          <ProgressModal
            project={selectedProject}
            onClose={() =>
              setShowAddProgress(false)
            }
            onSubmit={
              handleAddProgress
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// MONITOR CARD
// ==========================================

function MonitorCard({
  title,
  value,
  subtitle,
  icon: Icon,
  type,
}) {
  const styles = {
    blue: {
      box: "bg-blue-50 text-blue-600",
      value: "text-blue-600",
    },

    green: {
      box: "bg-emerald-50 text-emerald-600",
      value: "text-emerald-600",
    },

    orange: {
      box: "bg-orange-50 text-orange-600",
      value: "text-orange-600",
    },

    red: {
      box: "bg-red-50 text-red-600",
      value: "text-red-600",
    },
  };

  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-4
        shadow-sm
      "
    >
      <div className="
        flex
        items-start
        justify-between
      ">
        <div>
          <p className="
            text-[10px]
            font-medium
            text-slate-400
          ">
            {title}
          </p>

          <p className={`
            mt-1
            text-2xl
            font-bold
            ${styles[type].value}
          `}>
            {value}
          </p>

          <p className="
            mt-1
            text-[10px]
            text-slate-400
          ">
            {subtitle}
          </p>
        </div>

        <div className={`
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          ${styles[type].box}
        `}>
          <Icon size={19} />
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// PROGRESS CIRCLE
// ==========================================

function ProgressCircle({ value }) {
  const safeValue = Math.min(
    100,
    Math.max(0, Number(value || 0))
  );

  const radius = 54;
  const circumference =
    2 * Math.PI * radius;

  const offset =
    circumference -
    (safeValue / 100) *
      circumference;

  return (
    <div className="
      relative
      h-36
      w-36
    ">
      <svg
        className="
          h-full
          w-full
          -rotate-90
        "
        viewBox="0 0 128 128"
      >
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="10"
        />

        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={
            circumference
          }
          strokeDashoffset={offset}
        />
      </svg>

      <div className="
        absolute
        inset-0
        flex
        flex-col
        items-center
        justify-center
      ">
        <span className="
          text-2xl
          font-bold
          text-slate-950
        ">
          {safeValue}%
        </span>

        <span className="
          text-[9px]
          text-slate-400
        ">
          Actual
        </span>
      </div>
    </div>
  );
}

// ==========================================
// STATUS ROW
// ==========================================

function StatusRow({
  label,
  value,
  type,
}) {
  const styles = {
    blue: "bg-blue-50 text-blue-600",
    green:
      "bg-emerald-50 text-emerald-600",
    orange:
      "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="
      flex
      items-center
      justify-between
      rounded-xl
      bg-slate-50
      px-3
      py-2.5
    ">
      <span className="
        text-xs
        text-slate-500
      ">
        {label}
      </span>

      <span className={`
        rounded-full
        px-2.5
        py-1
        text-[9px]
        font-bold
        ${styles[type]}
      `}>
        {value}
      </span>
    </div>
  );
}

// ==========================================
// TABLE HEAD
// ==========================================

function TableHead({ children }) {
  return (
    <th className="
      px-5
      py-3
      text-left
      text-[9px]
      font-bold
      uppercase
      tracking-wider
      text-slate-400
    ">
      {children}
    </th>
  );
}

// ==========================================
// LOADING BOX
// ==========================================

function LoadingBox() {
  return (
    <div className="
      flex
      h-full
      min-h-[180px]
      flex-col
      items-center
      justify-center
    ">
      <div className="
        h-8
        w-8
        animate-spin
        rounded-full
        border-4
        border-blue-100
        border-t-blue-600
      " />

      <p className="
        mt-3
        text-xs
        text-slate-400
      ">
        Loading monitoring data...
      </p>
    </div>
  );
}

// ==========================================
// EMPTY STATE
// ==========================================

function EmptyState({
  icon: Icon,
  title,
  text,
}) {
  return (
    <div className="
      flex
      min-h-[180px]
      flex-col
      items-center
      justify-center
      text-center
    ">
      <div className="
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-2xl
        bg-slate-100
        text-slate-400
      ">
        <Icon size={24} />
      </div>

      <h3 className="
        mt-4
        text-sm
        font-bold
        text-slate-800
      ">
        {title}
      </h3>

      <p className="
        mt-1
        max-w-sm
        text-xs
        text-slate-400
      ">
        {text}
      </p>
    </div>
  );
}

// ==========================================
// PROGRESS MODAL
// ==========================================

function ProgressModal({
  project,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState({
    month: "September 2026",
    plannedProgress: "",
    actualProgress: "",
    expenditure: "",
    remarks: "",
  });

  const [submitting, setSubmitting] =
    useState(false);

  const handleChange = (
    field,
    value
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.month) {
      alert("Please enter month.");
      return;
    }

    if (
      form.plannedProgress === "" ||
      form.actualProgress === ""
    ) {
      alert(
        "Please enter planned and actual progress."
      );
      return;
    }

    const planned = Number(
      form.plannedProgress
    );

    const actual = Number(
      form.actualProgress
    );

    if (
      planned < 0 ||
      planned > 100 ||
      actual < 0 ||
      actual > 100
    ) {
      alert(
        "Progress must be between 0 and 100."
      );
      return;
    }

    try {
      setSubmitting(true);

      await onSubmit({
        month: form.month,
        plannedProgress: planned,
        actualProgress: actual,
        expenditure:
          Number(form.expenditure) || 0,
        remarks: form.remarks.trim(),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-slate-950/50
        p-4
        backdrop-blur-sm
      "
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95,
          y: 20,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.95,
        }}
        className="
          w-full
          max-w-xl
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
        "
      >

        {/* HEADER */}

        <div className="
          flex
          items-center
          justify-between
          border-b
          border-slate-100
          p-5
        ">
          <div>
            <p className="
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-blue-500
            ">
              Monthly Update
            </p>

            <h2 className="
              mt-1
              text-lg
              font-bold
              text-slate-950
            ">
              Add Progress
            </h2>

            <p className="
              mt-1
              max-w-md
              truncate
              text-xs
              text-slate-400
            ">
              {project?.name ||
                "Selected Project"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              rounded-xl
              p-2
              text-slate-400
              transition
              hover:bg-slate-100
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="
            space-y-4
            p-5
          "
        >

          <div className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
          ">

            <FormInput
              label="Month *"
              type="month"
              value={form.month}
              onChange={(value) =>
                handleChange(
                  "month",
                  formatMonthValue(
                    value
                  )
                )
              }
              placeholder="September 2026"
            />

            <FormInput
              label="Planned Progress (%) *"
              type="number"
              min="0"
              max="100"
              value={
                form.plannedProgress
              }
              onChange={(value) =>
                handleChange(
                  "plannedProgress",
                  value
                )
              }
              placeholder="40"
            />

            <FormInput
              label="Actual Progress (%) *"
              type="number"
              min="0"
              max="100"
              value={
                form.actualProgress
              }
              onChange={(value) =>
                handleChange(
                  "actualProgress",
                  value
                )
              }
              placeholder="32"
            />

            <FormInput
              label="Expenditure (₹ Cr)"
              type="number"
              min="0"
              value={
                form.expenditure
              }
              onChange={(value) =>
                handleChange(
                  "expenditure",
                  value
                )
              }
              placeholder="250"
            />

          </div>

          {/* LIVE GAP */}

          {form.plannedProgress !== "" &&
            form.actualProgress !== "" && (
              <div className="
                rounded-xl
                border
                border-slate-100
                bg-slate-50
                p-4
              ">
                <div className="
                  flex
                  items-center
                  justify-between
                ">
                  <span className="
                    text-xs
                    font-medium
                    text-slate-500
                  ">
                    Progress Gap
                  </span>

                  <span className={`
                    rounded-full
                    px-3
                    py-1
                    text-[10px]
                    font-bold
                    ${
                      Number(
                        form.plannedProgress
                      ) >
                      Number(
                        form.actualProgress
                      )
                        ? "bg-red-50 text-red-600"
                        : "bg-emerald-50 text-emerald-600"
                    }
                  `}>
                    {Math.abs(
                      Number(
                        form.plannedProgress
                      ) -
                        Number(
                          form.actualProgress
                        )
                    )}
                    %
                  </span>
                </div>

                <p className="
                  mt-2
                  text-[10px]
                  text-slate-400
                ">
                  {Number(
                    form.plannedProgress
                  ) >
                  Number(
                    form.actualProgress
                  )
                    ? "Project is behind the planned target."
                    : "Project is meeting or exceeding the planned target."}
                </p>
              </div>
            )}

          <label className="block">
            <span className="
              mb-1.5
              block
              text-[11px]
              font-semibold
              text-slate-600
            ">
              Remarks
            </span>

            <textarea
              value={form.remarks}
              onChange={(e) =>
                handleChange(
                  "remarks",
                  e.target.value
                )
              }
              rows={3}
              placeholder="Enter monthly progress remarks..."
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-3
                py-2.5
                text-sm
                text-slate-700
                outline-none
                transition
                placeholder:text-slate-300
                focus:border-blue-400
                focus:bg-white
              "
            />
          </label>

          {/* BUTTONS */}

          <div className="
            flex
            justify-end
            gap-3
            border-t
            border-slate-100
            pt-4
          ">

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="
                rounded-xl
                border
                border-slate-200
                px-4
                py-2.5
                text-sm
                font-medium
                text-slate-600
                transition
                hover:bg-slate-50
              "
            >
              Cancel
            </button>

            <button
                type="submit"
                disabled={submitting}
                className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-gradient-to-r
                    from-blue-600
                    to-indigo-600
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    shadow-lg
                    shadow-blue-500/20
                    transition
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                "
                >
                {submitting && (
                    <div
                    className="
                        h-4
                        w-4
                        animate-spin
                        rounded-full
                        border-2
                        border-white/30
                        border-t-white
                    "
                    />
                )}

                {submitting ? "Saving..." : "Save Progress"}
                </button>

          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ==========================================
// FORM INPUT
// ==========================================

function FormInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  min,
  max,
}) {
  return (
    <label className="block">
      <span className="
        mb-1.5
        block
        text-[11px]
        font-semibold
        text-slate-600
      ">
        {label}
      </span>

      <input
        type={type}
        value={
          type === "month"
            ? convertToMonthInput(
                value
              )
            : value
        }
        min={min}
        max={max}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        placeholder={placeholder}
        className="
          h-10
          w-full
          rounded-xl
          border
          border-slate-200
          bg-slate-50
          px-3
          text-sm
          text-slate-700
          outline-none
          transition
          placeholder:text-slate-300
          focus:border-blue-400
          focus:bg-white
        "
      />
    </label>
  );
}

// ==========================================
// MONTH HELPERS
// ==========================================

function formatMonthValue(value) {
  if (!value) return "";

  const [year, month] =
    value.split("-");

  const date = new Date(
    Number(year),
    Number(month) - 1,
    1
  );

  return date.toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    }
  );
}

function convertToMonthInput(value) {
  if (!value) return "";

  const date = new Date(
    `${value} 1`
  );

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  return `${year}-${month}`;
}