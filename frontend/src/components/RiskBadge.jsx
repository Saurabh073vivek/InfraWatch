export default function RiskBadge({ level }) {
  const styles = {
    Low: {
      wrapper:
        "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
      dot: "bg-emerald-500",
    },

    Medium: {
      wrapper:
        "bg-amber-50 text-amber-700 ring-amber-600/10",
      dot: "bg-amber-500",
    },

    High: {
      wrapper:
        "bg-orange-50 text-orange-700 ring-orange-600/10",
      dot: "bg-orange-500",
    },

    Critical: {
      wrapper:
        "bg-red-50 text-red-700 ring-red-600/10",
      dot: "bg-red-500",
    },
  };

  const style = styles[level] || styles.Medium;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full px-2.5 py-1
        text-[9px] font-bold
        ring-1 ring-inset
        ${style.wrapper}
      `}
    >
      <span
        className={`
          h-1.5 w-1.5
          rounded-full
          ${style.dot}
        `}
      />

      {level}
    </span>
  );
}