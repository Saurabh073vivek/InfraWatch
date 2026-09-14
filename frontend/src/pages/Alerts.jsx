import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock3,
  IndianRupee,
  RefreshCw,
  ShieldAlert,
  TrendingDown,
  XCircle,
  Activity,
  Search,
  MapPin,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

export default function Alerts() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");

  // ==========================================
  // FETCH PROJECTS
  // ==========================================

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/projects`
      );

      setProjects(
        response.data.projects || []
      );
    } catch (error) {
      console.error(
        "Alerts Fetch Error:",
        error
      );

      setError(
        "Unable to load alerts. Please check the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // REFRESH
  // ==========================================

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      const response = await axios.get(
        `${API_URL}/projects`
      );

      setProjects(
        response.data.projects || []
      );
    } catch (error) {
      console.error(error);

      setError(
        "Failed to refresh alerts."
      );
    } finally {
      setRefreshing(false);
    }
  };

  // ==========================================
  // ALERT LEVEL
  // ==========================================

  const getAlertLevel = (score) => {
    const value = Number(score || 0);

    if (value >= 75) return "Critical";
    if (value >= 50) return "High";
    if (value >= 25) return "Warning";

    return "Normal";
  };

  // ==========================================
  // FILTER ALERT PROJECTS
  // ==========================================

  const alertProjects = useMemo(() => {
    return projects.filter((project) => {
      const score =
        Number(project.riskScore || 0);

      const level =
        getAlertLevel(score);

      // Normal projects are not shown
      if (level === "Normal") {
        return false;
      }

      const matchesSearch =
        project.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        project.projectCode
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        project.location
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        level === filter;

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [
    projects,
    search,
    filter,
  ]);

  // ==========================================
  // STATISTICS
  // ==========================================

  const statistics = useMemo(() => {
    let warning = 0;
    let high = 0;
    let critical = 0;

    projects.forEach((project) => {
      const level = getAlertLevel(
        project.riskScore
      );

      if (level === "Warning") warning++;
      if (level === "High") high++;
      if (level === "Critical") critical++;
    });

    return {
      warning,
      high,
      critical,
      total:
        warning +
        high +
        critical,
    };
  }, [projects]);

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
              bg-red-500
              text-white
              shadow-lg
              shadow-red-500/20
            ">
              <Bell size={17} />
            </div>

            <p className="
              text-[11px]
              font-bold
              uppercase
              tracking-wider
              text-red-500
            ">
              Early Warning System
            </p>
          </div>

          <h1 className="
            mt-2
            text-2xl
            font-bold
            tracking-tight
            text-slate-950
          ">
            Alerts & Early Warnings
          </h1>

          <p className="
            mt-1
            text-sm
            text-slate-500
          ">
            Identify projects requiring immediate
            attention.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="
            flex
            items-center
            justify-center
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
            disabled:opacity-60
          "
        >
          <RefreshCw
            size={16}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>
      </motion.div>

      {/* =====================================
          ERROR
      ====================================== */}

      {error && (
        <div className="
          flex
          items-center
          gap-3
          rounded-xl
          border
          border-red-200
          bg-red-50
          px-4
          py-3
          text-sm
          text-red-600
        ">
          <AlertTriangle size={17} />
          {error}
        </div>
      )}

      {/* =====================================
          ALERT SUMMARY
      ====================================== */}

      <div className="
        grid
        grid-cols-1
        gap-4
        sm:grid-cols-2
        xl:grid-cols-4
      ">

        <AlertStat
          title="Total Alerts"
          value={statistics.total}
          subtitle="Projects requiring attention"
          icon={Bell}
          type="blue"
        />

        <AlertStat
          title="Warnings"
          value={statistics.warning}
          subtitle="Medium risk projects"
          icon={AlertTriangle}
          type="orange"
        />

        <AlertStat
          title="High Risk"
          value={statistics.high}
          subtitle="Immediate monitoring required"
          icon={ShieldAlert}
          type="red"
        />

        <AlertStat
          title="Critical"
          value={statistics.critical}
          subtitle="Immediate intervention required"
          icon={XCircle}
          type="dark"
        />

      </div>

      {/* =====================================
          SEARCH + FILTER
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
        ">

          {/* Search */}

          <div className="
            relative
            flex-1
          ">
            <Search
              size={17}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="
                Search project, code or location...
              "
              className="
                h-11
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                pl-10
                pr-4
                text-sm
                text-slate-700
                outline-none
                transition
                focus:border-blue-400
                focus:bg-white
              "
            />
          </div>

          {/* Filter */}

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
            className="
              h-11
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              px-4
              text-sm
              text-slate-600
              outline-none
              focus:border-blue-400
            "
          >
            <option value="All">
              All Alerts
            </option>

            <option value="Warning">
              Warnings
            </option>

            <option value="High">
              High Risk
            </option>

            <option value="Critical">
              Critical
            </option>
          </select>
        </div>
      </motion.div>

      {/* =====================================
          ALERT LIST
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
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >

        {/* Header */}

        <div className="
          flex
          items-center
          justify-between
          border-b
          border-slate-100
          px-5
          py-4
        ">
          <div>
            <h2 className="
              text-sm
              font-bold
              text-slate-950
            ">
              Active Early Warnings
            </h2>

            <p className="
              mt-1
              text-[11px]
              text-slate-400
            ">
              Projects with elevated risk indicators
            </p>
          </div>

          <span className="
            rounded-full
            bg-red-50
            px-3
            py-1.5
            text-[10px]
            font-bold
            text-red-600
          ">
            {alertProjects.length} Active
          </span>
        </div>

        {/* Loading */}

        {loading ? (
          <div className="
            flex
            min-h-[300px]
            items-center
            justify-center
          ">
            <RefreshCw
              size={28}
              className="
                animate-spin
                text-blue-500
              "
            />
          </div>
        ) : alertProjects.length === 0 ? (

          /* Empty */

          <div className="
            flex
            min-h-[330px]
            flex-col
            items-center
            justify-center
            px-5
            text-center
          ">
            <div className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-emerald-50
              text-emerald-500
            ">
              <CheckCircle2 size={30} />
            </div>

            <h3 className="
              mt-4
              text-base
              font-bold
              text-slate-800
            ">
              No active alerts
            </h3>

            <p className="
              mt-1
              max-w-md
              text-xs
              leading-5
              text-slate-400
            ">
              No projects currently match the selected
              alert criteria.
            </p>
          </div>

        ) : (

          /* Alert Cards */

          <div className="divide-y divide-slate-100">

            {alertProjects.map(
              (project, index) => (
                <AlertCard
                  key={project._id}
                  project={project}
                  index={index}
                />
              )
            )}

          </div>
        )}
      </motion.div>

      {/* =====================================
          SYSTEM INFORMATION
      ====================================== */}

      <div className="
        rounded-2xl
        border
        border-blue-100
        bg-gradient-to-r
        from-blue-50
        to-indigo-50
        p-5
      ">
        <div className="
          flex
          items-start
          gap-3
        ">
          <div className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-blue-600
            text-white
          ">
            <Activity size={18} />
          </div>

          <div>
            <h3 className="
              text-sm
              font-bold
              text-slate-800
            ">
              How Early Warnings Work
            </h3>

            <p className="
              mt-1
              max-w-4xl
              text-xs
              leading-5
              text-slate-500
            ">
              InfraWatch evaluates project risk scores
              generated from progress, cost and
              implementation indicators. Elevated risk
              projects are surfaced here so project
              officers can take corrective action before
              delays become critical.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

// ==========================================
// ALERT STAT
// ==========================================

function AlertStat({
  title,
  value,
  subtitle,
  icon: Icon,
  type,
}) {
  const styles = {
    blue: {
      icon:
        "bg-blue-50 text-blue-600",
      value:
        "text-blue-600",
    },

    orange: {
      icon:
        "bg-orange-50 text-orange-600",
      value:
        "text-orange-600",
    },

    red: {
      icon:
        "bg-red-50 text-red-600",
      value:
        "text-red-600",
    },

    dark: {
      icon:
        "bg-slate-100 text-slate-800",
      value:
        "text-slate-900",
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
          ${styles[type].icon}
        `}>
          <Icon size={19} />
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// ALERT CARD
// ==========================================

function AlertCard({
  project,
  index,
}) {
  const score =
    Number(project.riskScore || 0);

  let level = "Warning";

  if (score >= 75) {
    level = "Critical";
  } else if (score >= 50) {
    level = "High";
  }

  const config = {
    Warning: {
      icon: AlertTriangle,
      iconBox:
        "bg-amber-100 text-amber-600",
      badge:
        "bg-amber-50 text-amber-700 border-amber-200",
      border:
        "border-l-amber-400",
      title:
        "Project requires attention",
      message:
        "Project risk has reached a warning level. Review current progress and implementation factors.",
    },

    High: {
      icon: ShieldAlert,
      iconBox:
        "bg-orange-100 text-orange-600",
      badge:
        "bg-orange-50 text-orange-700 border-orange-200",
      border:
        "border-l-orange-500",
      title:
        "High risk project",
      message:
        "Project requires close monitoring and corrective action.",
    },

    Critical: {
      icon: XCircle,
      iconBox:
        "bg-red-100 text-red-600",
      badge:
        "bg-red-50 text-red-700 border-red-200",
      border:
        "border-l-red-500",
      title:
        "Critical intervention required",
      message:
        "Immediate intervention is recommended to prevent further project deterioration.",
    },
  };

  const current =
    config[level];

  const Icon = current.icon;

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: -10,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        delay: index * 0.05,
      }}
      className={`
        border-l-4
        p-5
        transition
        hover:bg-slate-50
        ${current.border}
      `}
    >
      <div className="
        flex
        flex-col
        gap-4
        lg:flex-row
        lg:items-center
        lg:justify-between
      ">

        {/* Project */}

        <div className="
          flex
          min-w-0
          items-start
          gap-3
        ">
          <div className={`
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            ${current.iconBox}
          `}>
            <Icon size={20} />
          </div>

          <div className="min-w-0">
            <div className="
              flex
              flex-wrap
              items-center
              gap-2
            ">
              <h3 className="
                text-sm
                font-bold
                text-slate-900
              ">
                {project.name}
              </h3>

              <span className={`
                rounded-full
                border
                px-2
                py-0.5
                text-[9px]
                font-bold
                ${current.badge}
              `}>
                {level}
              </span>
            </div>

            <div className="
              mt-1.5
              flex
              flex-wrap
              items-center
              gap-3
              text-[10px]
              text-slate-400
            ">
              <span>
                {project.projectCode}
              </span>

              <span className="
                flex
                items-center
                gap-1
              ">
                <MapPin size={11} />

                {project.location ||
                  "Location unavailable"}
              </span>
            </div>

            <p className="
              mt-2
              text-xs
              leading-5
              text-slate-500
            ">
              {current.message}
            </p>
          </div>
        </div>

        {/* Metrics */}

        <div className="
          grid
          grid-cols-2
          gap-2
          sm:grid-cols-4
          lg:min-w-[470px]
        ">

          <MiniMetric
            label="Risk Score"
            value={`${score}/100`}
            icon={ShieldAlert}
            danger
          />

          <MiniMetric
            label="Progress"
            value={`${
              project.physicalProgress || 0
            }%`}
            icon={TrendingDown}
          />

          <MiniMetric
            label="Budget"
            value={`₹${
              project.approvedCost || 0
            } Cr`}
            icon={IndianRupee}
          />

          <MiniMetric
            label="Status"
            value={
              project.status ||
              "On Track"
            }
            icon={Clock3}
          />

        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// MINI METRIC
// ==========================================

function MiniMetric({
  label,
  value,
  icon: Icon,
  danger = false,
}) {
  return (
    <div className="
      rounded-xl
      bg-slate-50
      px-3
      py-2.5
    ">
      <div className="
        flex
        items-center
        gap-1.5
      ">
        <Icon
          size={12}
          className={
            danger
              ? "text-red-500"
              : "text-slate-400"
          }
        />

        <span className="
          text-[9px]
          text-slate-400
        ">
          {label}
        </span>
      </div>

      <p className="
        mt-1
        truncate
        text-xs
        font-bold
        text-slate-700
      ">
        {value}
      </p>
    </div>
  );
}