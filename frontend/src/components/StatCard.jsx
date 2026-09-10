import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  type = "blue",
}) {
  const themes = {
    blue: {
      card: "from-blue-50 via-white to-blue-50/40 border-blue-100",
      icon: "bg-blue-100 text-blue-600",
      number: "text-blue-950",
      trend: "text-blue-600",
      ring: "border-blue-500",
    },

    green: {
      card: "from-emerald-50 via-white to-emerald-50/40 border-emerald-100",
      icon: "bg-emerald-100 text-emerald-600",
      number: "text-emerald-950",
      trend: "text-emerald-600",
      ring: "border-emerald-500",
    },

    orange: {
      card: "from-amber-50 via-white to-amber-50/40 border-amber-100",
      icon: "bg-amber-100 text-amber-600",
      number: "text-amber-950",
      trend: "text-orange-600",
      ring: "border-orange-500",
    },

    red: {
      card: "from-rose-50 via-white to-rose-50/40 border-rose-100",
      icon: "bg-rose-100 text-rose-600",
      number: "text-rose-950",
      trend: "text-rose-600",
      ring: "border-rose-500",
    },
  };

  const theme = themes[type];

  const percentage = {
    blue: 100,
    green: 64,
    orange: 18,
    red: 6,
  }[type];

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -4,
      }}
      className={`
        relative overflow-hidden
        rounded-2xl border
        bg-gradient-to-br
        ${theme.card}
        p-4 shadow-sm
        transition-shadow
        hover:shadow-lg
      `}
    >

      <div className="
        flex items-start
        justify-between
      ">

        <div>

          <p className="
            text-[10px]
            font-semibold
            text-slate-500
          ">
            {title}
          </p>

          <h2 className={`
            mt-1.5
            text-2xl
            font-bold
            ${theme.number}
          `}>
            {value}
          </h2>

          <p className="
            mt-1 text-[9px]
            text-slate-500
          ">
            {subtitle}
          </p>

        </div>

        <div className="relative">

          <div className={`
            flex h-10 w-10
            items-center justify-center
            rounded-xl ${theme.icon}
          `}>
            <Icon size={19} />
          </div>

        </div>

      </div>

      <div className={`
        mt-3 flex items-center
        gap-1 text-[9px]
        font-bold ${theme.trend}
      `}>

        <ArrowUpRight size={11} />

        {trend}

        <span className="
          font-normal
          text-slate-400
        ">
          vs last month
        </span>

      </div>

    </motion.div>
  );
}