import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Activity,
  BrainCircuit,
  BellRing,
  BarChart3,
  Map,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Projects", path: "/projects", icon: FolderKanban },
  { name: "Monitoring", path: "/monitoring", icon: Activity },
  { name: "AI Risk", path: "/ai-risk", icon: BrainCircuit },
  { name: "Alerts", path: "/alerts", icon: BellRing },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
  { name: "Project Map", path: "/map", icon: Map },
  { name: "Reports", path: "/reports", icon: FileText },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  return (
    <>
      {/* Mobile Overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen flex-col
          border-r border-slate-200 bg-white
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-[78px]" : "w-[250px]"}
        `}
      >
        {/* Logo */}
        <div
          className={`flex h-[76px] items-center border-b border-slate-200
          ${collapsed ? "justify-center px-3" : "justify-between px-4"}`}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center
              rounded-xl bg-gradient-to-br from-blue-600 to-violet-600
              text-white shadow-lg"
            >
              <BrainCircuit size={21} />
            </div>

            {!collapsed && (
              <div>
                <h1 className="text-[17px] font-bold tracking-tight text-slate-950">
                  InfraWatch
                </h1>

                <p className="text-[11px] font-medium text-slate-400">
                  AI Monitoring
                </p>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              aria-label="Collapse sidebar"
              className="rounded-lg p-1.5 text-slate-400 transition
              hover:bg-slate-100 hover:text-slate-700"
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {/* Expand button */}
        {collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            aria-label="Expand sidebar"
            className="absolute -right-3 top-[62px] flex h-6 w-6
            items-center justify-center rounded-full border
            border-slate-200 bg-white text-slate-500 shadow-sm
            hover:text-slate-900"
          >
            <ChevronRight size={14} />
          </button>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={collapsed ? item.name : ""}
                className={({ isActive }) => `
                  group flex items-center rounded-xl py-2.5
                  text-[13px] font-medium transition-all duration-200
                  ${collapsed ? "justify-center px-2" : "gap-3 px-3"}
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                  }
                `}
              >
                <Icon size={18} className="shrink-0" />

                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-slate-200 p-3">
          <NavLink
            to="/settings"
            title={collapsed ? "Settings" : ""}
            className={`
              flex items-center rounded-xl py-2.5 text-[13px]
              text-slate-500 transition hover:bg-slate-100
              hover:text-slate-950
              ${collapsed ? "justify-center" : "gap-3 px-3"}
            `}
          >
            <Settings size={18} />

            {!collapsed && <span>Settings</span>}
          </NavLink>
        </div>
      </aside>
    </>
  );
}
