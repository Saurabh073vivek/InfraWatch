import { motion } from "framer-motion";

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
  ChevronDown,
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

const progressData = [
  { month: "Jan", planned: 32, actual: 25 },
  { month: "Feb", planned: 40, actual: 31 },
  { month: "Mar", planned: 48, actual: 38 },
  { month: "Apr", planned: 56, actual: 45 },
  { month: "May", planned: 64, actual: 52 },
  { month: "Jun", planned: 71, actual: 59 },
  { month: "Jul", planned: 78, actual: 65 },
  { month: "Aug", planned: 84, actual: 72 },
  { month: "Sep", planned: 90, actual: 78 },
];

const projects = [
  {
    name: "National Highway Expansion",
    location: "Bihar",
    progress: 48,
    risk: "Critical",
    riskScore: 86,
  },
  {
    name: "Metro Infrastructure Project",
    location: "Delhi",
    progress: 72,
    risk: "High",
    riskScore: 71,
  },
  {
    name: "Smart City Development",
    location: "Maharashtra",
    progress: 81,
    risk: "Medium",
    riskScore: 54,
  },
  {
    name: "Rural Road Connectivity",
    location: "Uttar Pradesh",
    progress: 34,
    risk: "Medium",
    riskScore: 48,
  },
  {
    name: "River Bridge Construction",
    location: "West Bengal",
    progress: 66,
    risk: "High",
    riskScore: 62,
  },
];

const alerts = [
  {
    title: "Delay risk increased",
    project: "National Highway Expansion",
    time: "2h ago",
    icon: AlertTriangle,
    type: "red",
  },
  {
    title: "Cost overrun detected",
    project: "Metro Infrastructure Project",
    time: "5h ago",
    icon: IndianRupee,
    type: "orange",
  },
  {
    title: "Low manpower detected",
    project: "Rural Road Development",
    time: "1d ago",
    icon: BellRing,
    type: "yellow",
  },
  {
    title: "Weather risk alert",
    project: "Bridge Construction Project",
    time: "1d ago",
    icon: MapPin,
    type: "blue",
  },
  {
    title: "Milestone delayed",
    project: "Smart City Development",
    time: "2d ago",
    icon: CalendarDays,
    type: "purple",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-5 pb-6">

      {/* ================= HERO ================= */}

      <motion.section
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          relative min-h-[175px] overflow-hidden
          rounded-2xl shadow-lg
        "
      >

        {/* Infrastructure Image */}

        <img
          src="/infrastructure-banner.png"
          alt="Infrastructure"
          className="
            absolute inset-0 h-full w-full
            object-cover
          "
        />

        {/* Blue overlay */}

        <div
          className="
            absolute inset-0
            bg-gradient-to-r
            from-blue-700/95
            via-blue-600/70
            to-violet-600/30
          "
        />

        {/* Content */}

        <div className="relative z-10 flex min-h-[175px] flex-col justify-between p-6">

          <div>

            <p className="
              text-[11px] font-bold uppercase
              tracking-widest text-blue-100
            ">
              Infrastructure for a Better Tomorrow
            </p>

            <h1 className="
              mt-2 text-3xl font-bold
              tracking-tight text-white
            ">
              Good Morning, Saurabh 👋
            </h1>

            <p className="
              mt-1.5 text-sm text-blue-50
            ">
              Here's what's happening with your infrastructure
              projects today.
            </p>

          </div>

          {/* Hero bottom tags */}

          <div className="
            hidden items-center gap-3
            lg:flex
          ">

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

          {/* Date + Export */}

          <div className="
            absolute bottom-5 right-5
            flex items-center gap-2
          ">

            <div className="
              flex items-center gap-2
              rounded-xl border border-white/20
              bg-white/15 px-3 py-2
              text-xs font-semibold text-white
              backdrop-blur-md
            ">
              <CalendarDays size={14} />
              Mon, 8 Sep 2026
            </div>

            <button className="
              flex items-center gap-2
              rounded-xl bg-white
              px-4 py-2.5
              text-xs font-bold
              text-blue-700
              shadow-lg
              transition hover:-translate-y-0.5
            ">
              <Download size={14} />
              Export Report
            </button>

          </div>

        </div>
      </motion.section>


      {/* ================= KPI CARDS ================= */}

      <section className="
        grid grid-cols-1 gap-4
        sm:grid-cols-2
        xl:grid-cols-4
      ">

        <StatCard
          title="Total Projects"
          value="128"
          subtitle="64% of total projects"
          trend="+12 this month"
          icon={FolderKanban}
          type="blue"
        />

        <StatCard
          title="Projects On Track"
          value="82"
          subtitle="64% of total projects"
          trend="+6.2%"
          icon={CheckCircle2}
          type="green"
        />

        <StatCard
          title="Projects At Risk"
          value="18"
          subtitle="Requires attention"
          trend="+3 from last month"
          icon={AlertTriangle}
          type="orange"
        />

        <StatCard
          title="Critical Projects"
          value="07"
          subtitle="Immediate action required"
          trend="+2 from last month"
          icon={ShieldAlert}
          type="red"
        />

      </section>


      {/* ================= CHART + RISK + ALERTS ================= */}

      <section className="
        grid grid-cols-1 gap-5
        xl:grid-cols-12
      ">

        {/* Performance */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            rounded-2xl border
            border-slate-200 bg-white
            p-5 shadow-sm
            xl:col-span-6
          "
        >

          <SectionHeader
            icon={TrendingUp}
            iconClass="bg-violet-100 text-violet-600"
            title="Project Performance"
            subtitle="Planned vs actual progress"
          />

          <div className="
            mt-5 h-[250px] w-full
          ">

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
                  tickFormatter={(v) => `${v}%`}
                />

                <Tooltip />

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

          </div>

          <div className="
            mt-2 flex justify-center gap-6
          ">

            <Legend color="bg-blue-600" text="Planned" />
            <Legend color="bg-violet-600" text="Actual" />

          </div>

        </motion.div>


        {/* Risk Overview */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="
            rounded-2xl border
            border-slate-200 bg-white
            p-5 shadow-sm
            xl:col-span-3
          "
        >

          <SectionHeader
            icon={ShieldAlert}
            iconClass="bg-emerald-100 text-emerald-600"
            title="Risk Overview"
            subtitle="Current project risk distribution"
          />

          <div className="
            relative mx-auto mt-5
            h-36 w-36
          ">

            <div className="
              absolute inset-0
              rounded-full
              bg-[conic-gradient(#10b981_0deg_230deg,#fbbf24_230deg_288deg,#f97316_288deg_338deg,#ef4444_338deg_360deg)]
            " />

            <div className="
              absolute inset-[13px]
              flex items-center justify-center
              rounded-full bg-white
            ">

              <div className="text-center">

                <p className="
                  text-3xl font-bold
                  text-slate-950
                ">
                  18%
                </p>

                <p className="
                  text-[10px] text-slate-400
                ">
                  At Risk
                </p>

              </div>

            </div>

          </div>

          <div className="
            mt-5 space-y-2.5
          ">

            <RiskRow
              label="Low Risk"
              count="82"
              percentage="64%"
              dot="bg-emerald-500"
            />

            <RiskRow
              label="Medium Risk"
              count="21"
              percentage="16%"
              dot="bg-amber-400"
            />

            <RiskRow
              label="High Risk"
              count="18"
              percentage="14%"
              dot="bg-orange-500"
            />

            <RiskRow
              label="Critical"
              count="07"
              percentage="6%"
              dot="bg-red-500"
            />

          </div>

        </motion.div>


        {/* Recent Alerts */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="
            overflow-hidden rounded-2xl
            border border-slate-200
            bg-white shadow-sm
            xl:col-span-3
          "
        >

          <div className="
            flex items-center
            justify-between
            border-b border-slate-100
            p-4
          ">

            <div>

              <h2 className="
                text-sm font-bold
                text-slate-950
              ">
                Recent Alerts
              </h2>

              <p className="
                mt-0.5 text-[10px]
                text-slate-400
              ">
                Latest project warnings
              </p>

            </div>

            <button className="
              text-[10px] font-bold
              text-blue-600
            ">
              View All
            </button>

          </div>

          <div>

            {alerts.map((alert, index) => (
              <AlertItem
                key={index}
                {...alert}
              />
            ))}

          </div>

        </motion.div>

      </section>


      {/* ================= BOTTOM SECTION ================= */}

      <section className="
        grid grid-cols-1 gap-5
        xl:grid-cols-12
      ">

        {/* High Risk Projects */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            overflow-hidden rounded-2xl
            border border-slate-200
            bg-white shadow-sm
            xl:col-span-6
          "
        >

          <div className="
            flex items-center
            justify-between
            border-b border-slate-100
            p-4
          ">

            <div className="flex items-center gap-3">

              <div className="
                flex h-9 w-9
                items-center justify-center
                rounded-xl
                bg-orange-100
                text-orange-600
              ">
                <AlertTriangle size={17} />
              </div>

              <div>

                <h2 className="
                  text-sm font-bold
                  text-slate-950
                ">
                  High Risk Projects
                </h2>

                <p className="
                  text-[10px] text-slate-400
                ">
                  Projects requiring attention
                </p>

              </div>

            </div>

            <button className="
              text-[10px] font-bold
              text-blue-600
            ">
              View All
            </button>

          </div>

          <div className="overflow-x-auto">

            <table className="
              w-full min-w-[650px]
            ">

              <thead>

                <tr className="
                  bg-slate-50
                  text-left
                ">

                  <th className="tableHead">#</th>
                  <th className="tableHead">Project Name</th>
                  <th className="tableHead">Location</th>
                  <th className="tableHead">Progress</th>
                  <th className="tableHead">Risk Score</th>
                  <th className="tableHead">Status</th>

                </tr>

              </thead>

              <tbody>

                {projects.map((project, index) => (

                  <tr
                    key={project.name}
                    className="
                      border-t border-slate-100
                      hover:bg-blue-50/40
                    "
                  >

                    <td className="tableCell font-bold">
                      {String(index + 1).padStart(2, "0")}
                    </td>

                    <td className="
                      tableCell font-semibold
                      text-slate-800
                    ">
                      {project.name}
                    </td>

                    <td className="tableCell">
                      {project.location}
                    </td>

                    <td className="tableCell">

                      <div className="
                        flex items-center gap-2
                      ">

                        <div className="
                          h-1.5 w-16
                          overflow-hidden
                          rounded-full
                          bg-slate-100
                        ">

                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${project.progress}%`,
                            }}
                            transition={{
                              duration: 0.8,
                            }}
                            className="
                              h-full rounded-full
                              bg-gradient-to-r
                              from-blue-500
                              to-violet-500
                            "
                          />

                        </div>

                        <span className="
                          text-[10px]
                          font-semibold
                        ">
                          {project.progress}%
                        </span>

                      </div>

                    </td>

                    <td className="
                      tableCell font-bold
                      text-slate-800
                    ">
                      {project.riskScore}%
                    </td>

                    <td className="tableCell">

                      <RiskBadge
                        level={project.risk}
                      />

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </motion.div>


        {/* Key Insights */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="
            rounded-2xl border
            border-slate-200
            bg-white p-4 shadow-sm
            xl:col-span-3
          "
        >

          <SectionHeader
            icon={TrendingUp}
            iconClass="bg-violet-100 text-violet-600"
            title="Key Insights"
            subtitle="Important project intelligence"
          />

          <div className="
            mt-4 grid grid-cols-1
            gap-3
          ">

            <Insight
              icon={TrendingUp}
              title="Average Progress"
              value="68.4%"
              text="↑ 5.2% from last month"
              type="purple"
            />

            <Insight
              icon={IndianRupee}
              title="Cost Variance"
              value="₹2.8 Cr"
              text="↑ 8.7% above planned"
              type="green"
            />

            <Insight
              icon={Clock3}
              title="Delay Exposure"
              value="11 Projects"
              text="₹45.6 Cr estimated impact"
              type="blue"
            />

          </div>

        </motion.div>


        {/* Project Map */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="
            overflow-hidden rounded-2xl
            border border-slate-200
            bg-white shadow-sm
            xl:col-span-3
          "
        >

          <div className="
            flex items-center
            justify-between
            border-b border-slate-100
            p-4
          ">

            <div className="flex items-center gap-3">

              <div className="
                flex h-9 w-9
                items-center justify-center
                rounded-xl
                bg-blue-100
                text-blue-600
              ">
                <MapPinned size={17} />
              </div>

              <div>

                <h2 className="
                  text-sm font-bold
                  text-slate-950
                ">
                  Project Locations
                </h2>

                <p className="
                  text-[10px] text-slate-400
                ">
                  Infrastructure projects
                </p>

              </div>

            </div>

            <button className="
              text-[10px] font-bold
              text-blue-600
            ">
              View Map
            </button>

          </div>

          <div className="
            relative h-[185px]
            overflow-hidden
            bg-gradient-to-br
            from-blue-50
            via-slate-100
            to-emerald-50
          ">

            {/* Map-like background */}

            <div className="
              absolute inset-0 opacity-40
              bg-[radial-gradient(circle_at_30%_40%,#60a5fa_1px,transparent_1px)]
              [background-size:18px_18px]
            " />

            {/* India shape approximation */}

            <div className="
              absolute left-[27%] top-[15%]
              h-[125px] w-[115px]
              rotate-[18deg]
              rounded-[45%_55%_50%_45%]
              bg-slate-200/80
              shadow-inner
            " />

            <MapMarker
              left="34%"
              top="32%"
              color="bg-emerald-500"
            />

            <MapMarker
              left="50%"
              top="42%"
              color="bg-red-500"
            />

            <MapMarker
              left="44%"
              top="62%"
              color="bg-amber-500"
            />

            <MapMarker
              left="29%"
              top="58%"
              color="bg-emerald-500"
            />

            <MapMarker
              left="57%"
              top="70%"
              color="bg-orange-500"
            />

            <div className="
              absolute bottom-3 right-3
              rounded-xl border
              border-white/70
              bg-white/90 p-2.5
              shadow-lg backdrop-blur
            ">

              <MapLegend
                color="bg-emerald-500"
                text="On Track"
              />

              <MapLegend
                color="bg-amber-500"
                text="At Risk"
              />

              <MapLegend
                color="bg-red-500"
                text="Critical"
              />

            </div>

          </div>

        </motion.div>

      </section>


      {/* Footer */}

      <div className="
        flex items-center
        justify-between
        px-1 pt-1
        text-[10px] text-slate-400
      ">

        <span>
          © 2026 InfraWatch. AI Monitoring Infrastructure
          for a Better Tomorrow.
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


/* =========================================================
   SMALL COMPONENTS
========================================================= */

function HeroTag({ icon: Icon, text }) {
  return (
    <div className="
      flex items-center gap-2
      rounded-lg
      border border-white/20
      bg-white/10
      px-3 py-1.5
      text-[10px] font-semibold
      backdrop-blur-md
    ">
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

      <div className={`
        flex h-9 w-9
        items-center justify-center
        rounded-xl ${iconClass}
      `}>
        <Icon size={17} />
      </div>

      <div>

        <h2 className="
          text-sm font-bold
          text-slate-950
        ">
          {title}
        </h2>

        <p className="
          mt-0.5 text-[10px]
          text-slate-400
        ">
          {subtitle}
        </p>

      </div>

    </div>
  );
}


function Legend({ color, text }) {
  return (
    <span className="
      flex items-center gap-2
      text-[10px] text-slate-500
    ">
      <span className={`
        h-2 w-2 rounded-full ${color}
      `} />

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
    <div className="
      flex items-center
      justify-between
    ">

      <div className="
        flex items-center gap-2
      ">

        <span className={`
          h-2 w-2 rounded-full ${dot}
        `} />

        <span className="
          text-[10px] text-slate-500
        ">
          {label}
        </span>

      </div>

      <div className="
        flex items-center gap-4
      ">

        <span className="
          text-[10px] font-bold
          text-slate-800
        ">
          {count}
        </span>

        <span className="
          w-7 text-right
          text-[9px] text-slate-400
        ">
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
    orange: "bg-orange-100 text-orange-600",
    yellow: "bg-amber-100 text-amber-600",
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-violet-100 text-violet-600",
  };

  return (
    <div className="
      flex items-center gap-2.5
      border-b border-slate-100
      px-4 py-2.5
      transition hover:bg-slate-50
    ">

      <div className={`
        flex h-8 w-8 shrink-0
        items-center justify-center
        rounded-lg ${styles[type]}
      `}>
        <Icon size={14} />
      </div>

      <div className="min-w-0 flex-1">

        <p className="
          truncate text-[10px]
          font-bold text-slate-800
        ">
          {title}
        </p>

        <p className="
          truncate text-[9px]
          text-slate-400
        ">
          {project}
        </p>

      </div>

      <span className="
        shrink-0 text-[9px]
        text-slate-400
      ">
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
    purple: "bg-violet-100 text-violet-600",
    green: "bg-emerald-100 text-emerald-600",
    blue: "bg-blue-100 text-blue-600",
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="
        rounded-xl border
        border-slate-100
        bg-slate-50/70
        p-3
      "
    >

      <div className="flex items-center gap-2.5">

        <div className={`
          flex h-8 w-8
          items-center justify-center
          rounded-lg ${styles[type]}
        `}>
          <Icon size={15} />
        </div>

        <div>

          <p className="
            text-[9px]
            text-slate-400
          ">
            {title}
          </p>

          <p className="
            text-base font-bold
            text-slate-950
          ">
            {value}
          </p>

        </div>

      </div>

      <p className="
        mt-2 text-[9px]
        font-medium text-slate-500
      ">
        {text}
      </p>

    </motion.div>
  );
}


function MapMarker({
  left,
  top,
  color,
}) {
  return (
    <div
      className="absolute"
      style={{ left, top }}
    >
      <div className={`
        h-4 w-4
        rounded-full
        border-2 border-white
        ${color}
        shadow-lg
      `} />

      <div className={`
        absolute left-1/2 top-1/2
        h-8 w-8 -translate-x-1/2
        -translate-y-1/2
        rounded-full
        ${color}/20
        animate-ping
      `} />
    </div>
  );
}


function MapLegend({ color, text }) {
  return (
    <div className="
      flex items-center gap-2
      py-0.5 text-[9px]
      font-medium text-slate-600
    ">
      <span className={`
        h-2 w-2 rounded-full ${color}
      `} />
      {text}
    </div>
  );
}