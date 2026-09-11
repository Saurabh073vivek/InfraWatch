import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  Clock3,
  IndianRupee,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  XCircle,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

export default function AIRisk() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] =
    useState("");

  const [risk, setRisk] = useState(null);

  const [loadingProjects, setLoadingProjects] =
    useState(true);

  const [loadingRisk, setLoadingRisk] =
    useState(false);

  const [runningAnalysis, setRunningAnalysis] =
    useState(false);

  const [error, setError] = useState("");

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
        "Unable to load projects. Please check your backend."
      );
    } finally {
      setLoadingProjects(false);
    }
  };

  // ==========================================
  // LOAD RISK WHEN PROJECT CHANGES
  // ==========================================

  useEffect(() => {
    if (selectedProjectId) {
      fetchRisk(selectedProjectId);
    } else {
      setRisk(null);
    }
  }, [selectedProjectId]);

  const fetchRisk = async (projectId) => {
    try {
      setLoadingRisk(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/projects/${projectId}/risk`
      );

      setRisk(response.data);
    } catch (error) {
      console.error(
        "Fetch Risk Error:",
        error
      );

      setRisk(null);

      if (
        error.response?.status !== 404
      ) {
        setError(
          "Unable to load risk information."
        );
      }
    } finally {
      setLoadingRisk(false);
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
  }, [
    projects,
    selectedProjectId,
  ]);

  // ==========================================
  // RISK DATA
  // ==========================================

  const riskData = risk?.risk || {};

  const prediction =
    risk?.prediction || null;

  const riskScore =
    Number(riskData.riskScore || 0);

  const riskLevel =
    riskData.riskLevel || "Low";

  const factors =
    prediction?.factors || [];

  const progressGap =
    Number(
      prediction?.progressGap || 0
    );

  const costEscalation =
    Number(
      prediction?.costEscalation || 0
    );

  // ==========================================
  // RUN RISK ANALYSIS
  // ==========================================

  const runRiskAnalysis = async () => {
    if (!selectedProjectId) {
      alert("Please select a project.");
      return;
    }

    try {
      setRunningAnalysis(true);
      setError("");

      const response = await axios.post(
        `${API_URL}/projects/${selectedProjectId}/risk`
      );

      setRisk({
        success: true,
        risk: {
          riskScore:
            response.data.prediction
              ?.riskScore || 0,

          riskLevel:
            response.data.prediction
              ?.riskLevel || "Low",
        },

        prediction:
          response.data.prediction,
      });

      // Refresh project list because
      // risk score/status may have changed.
      await fetchProjects();
    } catch (error) {
      console.error(
        "Risk Analysis Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to generate risk prediction."
      );
    } finally {
      setRunningAnalysis(false);
    }
  };

  // ==========================================
  // RISK CONFIG
  // ==========================================

  const getRiskConfig = (level) => {
    switch (level) {
      case "Critical":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-600",
          darkBg: "bg-red-500",
          icon: XCircle,
          label: "Critical Risk",
          description:
            "Immediate intervention is recommended.",
        };

      case "High":
        return {
          bg: "bg-orange-50",
          border: "border-orange-200",
          text: "text-orange-600",
          darkBg: "bg-orange-500",
          icon: AlertTriangle,
          label: "High Risk",
          description:
            "Project requires close monitoring.",
        };

      case "Medium":
        return {
          bg: "bg-amber-50",
          border: "border-amber-200",
          text: "text-amber-600",
          darkBg: "bg-amber-500",
          icon: ShieldAlert,
          label: "Medium Risk",
          description:
            "Some risk factors require attention.",
        };

      default:
        return {
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          text: "text-emerald-600",
          darkBg: "bg-emerald-500",
          icon: CheckCircle2,
          label: "Low Risk",
          description:
            "Project is currently within acceptable risk levels.",
        };
    }
  };

  const riskConfig =
    getRiskConfig(riskLevel);

  const RiskIcon = riskConfig.icon;

  // ==========================================
  // REFRESH
  // ==========================================

  const handleRefresh = async () => {
    if (!selectedProjectId) return;

    await fetchRisk(
      selectedProjectId
    );
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
          flex
          flex-col
          justify-between
          gap-4
          md:flex-row
          md:items-center
        "
      >
        <div>
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
              bg-blue-600
              text-white
              shadow-lg
              shadow-blue-500/20
            ">
              <BrainCircuit size={17} />
            </div>

            <p className="
              text-[11px]
              font-bold
              uppercase
              tracking-wider
              text-blue-500
            ">
              Artificial Intelligence
            </p>
          </div>

          <h1 className="
            mt-2
            text-2xl
            font-bold
            tracking-tight
            text-slate-950
          ">
            AI Risk Prediction
          </h1>

          <p className="
            mt-1
            text-sm
            text-slate-500
          ">
            Predict project risks before they become
            critical.
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
              loadingRisk ||
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
                loadingRisk
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

          <button
            onClick={runRiskAnalysis}
            disabled={
              runningAnalysis ||
              !selectedProjectId
            }
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
              disabled:opacity-60
            "
          >
            {runningAnalysis ? (
              <RefreshCw
                size={17}
                className="animate-spin"
              />
            ) : (
              <Sparkles size={17} />
            )}

            {runningAnalysis
              ? "Analyzing..."
              : "Run Risk Analysis"}
          </button>
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
              Select a project to analyze its current
              risk.
            </p>
          </div>

          <div className="
            relative
            w-full
            lg:w-[450px]
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
          PROJECT BANNER
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
            overflow-hidden
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
            gap-5
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
                Risk Analysis Project
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
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-white/10
              bg-white/10
              px-4
              py-3
              backdrop-blur
            ">
              <RiskIcon
                size={25}
                className={
                  riskLevel === "Low"
                    ? "text-emerald-400"
                    : riskLevel === "Medium"
                    ? "text-amber-400"
                    : "text-red-400"
                }
              />

              <div>
                <p className="
                  text-[9px]
                  text-slate-300
                ">
                  Current Risk
                </p>

                <p className="
                  mt-0.5
                  text-lg
                  font-bold
                ">
                  {riskLevel}
                </p>
              </div>
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

        <RiskMetric
          title="Risk Score"
          value={`${riskScore}/100`}
          subtitle="Overall calculated risk"
          icon={ShieldAlert}
          type={
            riskLevel === "Low"
              ? "green"
              : riskLevel === "Medium"
              ? "orange"
              : "red"
          }
        />

        <RiskMetric
          title="Risk Level"
          value={riskLevel}
          subtitle={riskConfig.description}
          icon={RiskIcon}
          type={
            riskLevel === "Low"
              ? "green"
              : riskLevel === "Medium"
              ? "orange"
              : "red"
          }
        />

        <RiskMetric
          title="Progress Gap"
          value={`${Math.abs(
            progressGap
          )}%`}
          subtitle={
            progressGap > 0
              ? "Behind planned progress"
              : "On / ahead of plan"
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

        <RiskMetric
          title="Cost Escalation"
          value={`${costEscalation}%`}
          subtitle="Increase from approved cost"
          icon={IndianRupee}
          type={
            costEscalation > 15
              ? "red"
              : costEscalation > 5
              ? "orange"
              : "green"
          }
        />

      </div>

      {/* =====================================
          MAIN RISK SECTION
      ====================================== */}

      <div className="
        grid
        grid-cols-1
        gap-5
        xl:grid-cols-[360px_1fr]
      ">

        {/* RISK SCORE */}

        <motion.div
          initial={{
            opacity: 0,
            x: -10,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >
          <div>
            <h2 className="
              text-sm
              font-bold
              text-slate-950
            ">
              Risk Assessment
            </h2>

            <p className="
              mt-1
              text-[11px]
              text-slate-400
            ">
              Current project risk score
            </p>
          </div>

          <div className="
            mt-7
            flex
            justify-center
          ">
            <RiskGauge
              score={riskScore}
              level={riskLevel}
            />
          </div>

          <div className="
            mt-6
            text-center
          ">
            <div className={`
              mx-auto
              inline-flex
              items-center
              gap-2
              rounded-full
              px-4
              py-2
              text-xs
              font-bold
              ${riskConfig.bg}
              ${riskConfig.text}
            `}>
              <RiskIcon size={14} />

              {riskConfig.label}
            </div>

            <p className="
              mx-auto
              mt-3
              max-w-xs
              text-xs
              leading-5
              text-slate-500
            ">
              {riskConfig.description}
            </p>
          </div>
        </motion.div>

        {/* RISK FACTORS */}

        <motion.div
          initial={{
            opacity: 0,
            x: 10,
          }}
          animate={{
            opacity: 1,
            x: 0,
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
            items-center
            justify-between
          ">
            <div>
              <h2 className="
                text-sm
                font-bold
                text-slate-950
              ">
                Risk Contributing Factors
              </h2>

              <p className="
                mt-1
                text-[11px]
                text-slate-400
              ">
                Explainable factors behind the risk score
              </p>
            </div>

            <div className="
              rounded-lg
              bg-blue-50
              px-3
              py-1.5
              text-[10px]
              font-bold
              text-blue-600
            ">
              {factors.length} Factors
            </div>
          </div>

          <div className="
            mt-5
            space-y-3
          ">
            {loadingRisk ? (
              <div className="
                flex
                min-h-[220px]
                items-center
                justify-center
              ">
                <RefreshCw
                  size={26}
                  className="
                    animate-spin
                    text-blue-500
                  "
                />
              </div>
            ) : factors.length > 0 ? (
              factors.map(
                (factor, index) => (
                  <RiskFactor
                    key={
                      `${factor.factor}-${index}`
                    }
                    factor={factor}
                  />
                )
              )
            ) : (
              <div className="
                flex
                min-h-[220px]
                flex-col
                items-center
                justify-center
                rounded-xl
                bg-slate-50
                text-center
              ">
                <BrainCircuit
                  size={30}
                  className="text-slate-300"
                />

                <h3 className="
                  mt-3
                  text-sm
                  font-bold
                  text-slate-700
                ">
                  No risk analysis yet
                </h3>

                <p className="
                  mt-1
                  max-w-sm
                  text-xs
                  text-slate-400
                ">
                  Click "Run Risk Analysis" to
                  generate the project's current
                  risk assessment.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* =====================================
          PROJECT METRICS + RECOMMENDATION
      ====================================== */}

      <div className="
        grid
        grid-cols-1
        gap-5
        xl:grid-cols-2
      ">

        {/* PROJECT METRICS */}

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
            p-5
            shadow-sm
          "
        >
          <h2 className="
            text-sm
            font-bold
            text-slate-950
          ">
            Project Risk Indicators
          </h2>

          <p className="
            mt-1
            text-[11px]
            text-slate-400
          ">
            Key project values used during assessment
          </p>

          <div className="
            mt-5
            grid
            grid-cols-2
            gap-3
          ">

            <Indicator
              icon={Activity}
              label="Physical Progress"
              value={`${
                selectedProject?.physicalProgress ||
                0
              }%`}
            />

            <Indicator
              icon={Target}
              label="Financial Progress"
              value={`${
                selectedProject?.financialProgress ||
                0
              }%`}
            />

            <Indicator
              icon={IndianRupee}
              label="Approved Cost"
              value={`₹${
                selectedProject?.approvedCost ||
                0
              } Cr`}
            />

            <Indicator
              icon={TrendingUp}
              label="Revised Cost"
              value={`₹${
                selectedProject?.revisedCost ||
                0
              } Cr`}
            />

            <Indicator
              icon={Clock3}
              label="Project Status"
              value={
                selectedProject?.status ||
                "On Track"
              }
            />

            <Indicator
              icon={AlertTriangle}
              label="Risk Level"
              value={riskLevel}
            />

          </div>
        </motion.div>

        {/* RECOMMENDATION */}

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
            overflow-hidden
            rounded-2xl
            bg-gradient-to-br
            from-blue-600
            via-indigo-600
            to-violet-700
            p-5
            text-white
            shadow-xl
          "
        >
          <div className="
            flex
            items-start
            justify-between
          ">
            <div>
              <div className="
                flex
                items-center
                gap-2
              ">
                <Sparkles size={18} />

                <span className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-blue-100
                ">
                  AI Insight
                </span>
              </div>

              <h2 className="
                mt-2
                text-lg
                font-bold
              ">
                Recommended Action
              </h2>
            </div>

            <div className="
              rounded-xl
              bg-white/10
              p-2.5
              backdrop-blur
            ">
              <BrainCircuit size={20} />
            </div>
          </div>

          <div className="
            mt-5
            rounded-xl
            border
            border-white/10
            bg-white/10
            p-4
            backdrop-blur
          ">
            <p className="
              text-sm
              leading-6
              text-blue-50
            ">
              {getRecommendation(
                riskLevel,
                progressGap,
                costEscalation
              )}
            </p>
          </div>

          <div className="
            mt-5
            flex
            items-center
            gap-2
            text-[10px]
            text-blue-100
          ">
            <CheckCircle2 size={14} />

            Risk assessment generated using
            explainable project indicators.
          </div>
        </motion.div>
      </div>

      {/* =====================================
          ANALYSIS FOOTER
      ====================================== */}

      {prediction && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          className="
            flex
            flex-col
            justify-between
            gap-3
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            py-3
            text-[10px]
            text-slate-400
            sm:flex-row
            sm:items-center
          "
        >
          <span>
            Prediction Source:{" "}
            <strong className="text-slate-600">
              {prediction.predictionSource ||
                "Rule Engine"}
            </strong>
          </span>

          <span>
            Last analyzed:{" "}
            {prediction.createdAt
              ? new Date(
                  prediction.createdAt
                ).toLocaleString("en-IN")
              : "Just now"}
          </span>
        </motion.div>
      )}
    </div>
  );
}

// ==========================================
// RISK METRIC
// ==========================================

function RiskMetric({
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
      box:
        "bg-emerald-50 text-emerald-600",
      value: "text-emerald-600",
    },

    orange: {
      box:
        "bg-orange-50 text-orange-600",
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
            leading-4
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
// RISK GAUGE
// ==========================================

function RiskGauge({
  score,
  level,
}) {
  const radius = 62;

  const circumference =
    2 * Math.PI * radius;

  const safeScore = Math.min(
    100,
    Math.max(0, Number(score || 0))
  );

  const offset =
    circumference -
    (safeScore / 100) *
      circumference;

  let stroke = "#10b981";

  if (level === "Medium") {
    stroke = "#f59e0b";
  }

  if (level === "High") {
    stroke = "#f97316";
  }

  if (level === "Critical") {
    stroke = "#ef4444";
  }

  return (
    <div className="
      relative
      h-48
      w-48
    ">
      <svg
        viewBox="0 0 160 160"
        className="
          h-full
          w-full
          -rotate-90
        "
      >
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="12"
        />

        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth="12"
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
          text-4xl
          font-bold
          text-slate-950
        ">
          {safeScore}
        </span>

        <span className="
          mt-0.5
          text-[10px]
          font-medium
          uppercase
          tracking-wider
          text-slate-400
        ">
          Risk Score
        </span>
      </div>
    </div>
  );
}

// ==========================================
// RISK FACTOR
// ==========================================

function RiskFactor({
  factor,
}) {
  const isHigh =
    factor.impact === "High";

  const isMedium =
    factor.impact === "Medium";

  const bg = isHigh
    ? "bg-red-50 border-red-100"
    : isMedium
    ? "bg-amber-50 border-amber-100"
    : "bg-blue-50 border-blue-100";

  const iconBg = isHigh
    ? "bg-red-100 text-red-600"
    : isMedium
    ? "bg-amber-100 text-amber-600"
    : "bg-blue-100 text-blue-600";

  const text = isHigh
    ? "text-red-600"
    : isMedium
    ? "text-amber-600"
    : "text-blue-600";

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: -8,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      className={`
        rounded-xl
        border
        p-4
        ${bg}
      `}
    >
      <div className="
        flex
        items-start
        gap-3
      ">
        <div className={`
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-lg
          ${iconBg}
        `}>
          <AlertTriangle size={17} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="
            flex
            flex-wrap
            items-center
            justify-between
            gap-2
          ">
            <h3 className="
              text-xs
              font-bold
              text-slate-800
            ">
              {factor.factor}
            </h3>

            <div className="
              flex
              items-center
              gap-2
            ">
              <span className={`
                rounded-full
                px-2
                py-0.5
                text-[8px]
                font-bold
                ${text}
              `}>
                {factor.impact}
              </span>

              <span className="
                rounded-full
                bg-white
                px-2
                py-0.5
                text-[9px]
                font-bold
                text-slate-600
              ">
                +{factor.points} pts
              </span>
            </div>
          </div>

          <p className="
            mt-1.5
            text-[11px]
            leading-5
            text-slate-500
          ">
            {factor.message}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// INDICATOR
// ==========================================

function Indicator({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="
      rounded-xl
      border
      border-slate-100
      bg-slate-50
      p-3
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
          bg-white
          text-blue-600
          shadow-sm
        ">
          <Icon size={15} />
        </div>

        <span className="
          text-[10px]
          text-slate-400
        ">
          {label}
        </span>
      </div>

      <p className="
        mt-2
        truncate
        text-sm
        font-bold
        text-slate-800
      ">
        {value}
      </p>
    </div>
  );
}

// ==========================================
// RECOMMENDATION
// ==========================================

function getRecommendation(
  riskLevel,
  progressGap,
  costEscalation
) {
  if (riskLevel === "Critical") {
    return (
      "Immediate intervention is recommended. Review project delays, cost drivers and implementation issues, and initiate corrective action with the responsible agency."
    );
  }

  if (riskLevel === "High") {
    return (
      "The project requires close monitoring. Review the major risk factors and take corrective measures before the current deviations become critical."
    );
  }

  if (riskLevel === "Medium") {
    if (progressGap > 0) {
      return (
        `The project is currently at medium risk and is ${progressGap}% behind the planned progress. Increase monitoring frequency and investigate the causes of the delay.`
      );
    }

    if (costEscalation > 5) {
      return (
        `The project has medium risk with ${costEscalation}% cost escalation. Review expenditure trends and identify the source of cost pressure.`
      );
    }

    return (
      "The project has moderate risk indicators. Continue regular monitoring and review emerging deviations before they increase."
    );
  }

  return (
    "The project is currently within acceptable risk levels. Continue regular monitoring and update project progress periodically."
  );
}