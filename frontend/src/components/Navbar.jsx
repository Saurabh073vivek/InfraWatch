import { useEffect, useRef, useState } from "react";
import { Bell, Search, ChevronDown, User, LogOut, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const displayName = user?.name || "Saurabh Vivek";
  const role =
    user?.role === "admin" ? "Administrator" : "Project Officer";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header
      className="sticky top-0 z-30 flex h-[76px] items-center
      justify-between border-b border-slate-200 bg-white/90
      px-4 backdrop-blur-xl sm:px-6 lg:px-7"
    >
      {/* Search */}
      <div className="relative w-full max-w-[360px]">
        <Search
          size={17}
          className="absolute left-3.5 top-1/2
          -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search projects..."
          className="h-10 w-full rounded-xl border border-slate-200
          bg-slate-50 pl-10 pr-4 text-sm text-slate-700
          outline-none transition
          placeholder:text-slate-400
          focus:border-slate-400 focus:bg-white"
        />
      </div>

      {/* Right */}
      <div className="ml-4 flex items-center gap-3">
        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center
          justify-center rounded-xl text-slate-500
          transition hover:bg-slate-100 hover:text-slate-900"
        >
          <Bell size={19} />

          <span
            className="absolute right-2.5 top-2 h-1.5 w-1.5
            rounded-full bg-red-500 ring-2 ring-white"
          />
        </button>

        <div className="hidden h-8 w-px bg-slate-200 sm:block" />

        {/* User Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-haspopup="menu"
            className="flex items-center gap-2.5 rounded-xl px-2 py-1.5
            transition hover:bg-slate-100"
          >
            <div
              className="flex h-10 w-10 items-center justify-center
              rounded-full bg-slate-950 text-xs font-bold text-white"
            >
              {initials || "SV"}
            </div>

            <div className="hidden text-left md:block">
              <p className="text-[13px] font-semibold text-slate-900">
                {displayName}
              </p>

              <p className="text-[11px] text-slate-400">
                {role}
              </p>
            </div>

            <ChevronDown
              size={16}
              className={`hidden text-slate-400 transition-transform md:block ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {open && (
            <div
              role="menu"
              className="absolute right-0 top-[calc(100%+10px)] w-72
              overflow-hidden rounded-2xl border border-slate-200
              bg-white shadow-2xl"
            >
              {/* User Header */}
              <div className="border-b border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center
                    rounded-full bg-slate-950 text-sm font-bold text-white"
                  >
                    {initials || "SV"}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {displayName}
                    </p>

                    <p className="truncate text-xs text-slate-500">
                      {user?.email || "Authenticated user"}
                    </p>
                  </div>
                </div>

                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                  <ShieldCheck size={13} />
                  {role}
                </div>
              </div>

              {/* Menu */}
              <div className="p-2">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setOpen(false);
                    navigate("/profile");
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3
                  text-left text-sm font-medium text-slate-700
                  transition hover:bg-slate-100"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <User size={17} />
                  </span>

                  <span>
                    <span className="block">Profile</span>
                    <span className="block text-[11px] font-normal text-slate-400">
                      View your account
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3
                  text-left text-sm font-semibold text-red-600
                  transition hover:bg-red-50"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
                    <LogOut size={17} />
                  </span>

                  <span>
                    <span className="block">Logout</span>
                    <span className="block text-[11px] font-normal text-red-400">
                      Sign out of InfraWatch
                    </span>
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
