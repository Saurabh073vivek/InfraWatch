import { Bell, Search, Menu } from "lucide-react";

export default function Navbar() {
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
        <button
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

        <div className="flex items-center gap-2.5">
          <div
            className="flex h-10 w-10 items-center justify-center
            rounded-full bg-slate-950 text-xs font-bold text-white"
          >
            SV
          </div>

          <div className="hidden md:block">
            <p className="text-[13px] font-semibold text-slate-900">
              Saurabh Vivek
            </p>

            <p className="text-[11px] text-slate-400">
              Project Officer
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}