import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  SlidersHorizontal,
  MapPin,
  CalendarDays,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  X,
  FolderKanban,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  ChevronDown,
} from "lucide-react";

import RiskBadge from "../components/RiskBadge";

const initialProjects = [
  {
    id: 1,
    code: "NHE-2026-014",
    name: "National Highway Expansion",
    ministry: "Ministry of Road Transport",
    sector: "Roads & Highways",
    location: "Bihar",
    progress: 48,
    status: "At Risk",
    risk: "Critical",
    riskScore: 86,
    budget: "₹850 Cr",
    startDate: "12 Jan 2025",
    endDate: "30 Dec 2027",
  },
  {
    id: 2,
    code: "MIP-2026-031",
    name: "Metro Infrastructure Project",
    ministry: "Ministry of Housing",
    sector: "Urban Transport",
    location: "Delhi",
    progress: 72,
    status: "At Risk",
    risk: "High",
    riskScore: 71,
    budget: "₹1,240 Cr",
    startDate: "10 Mar 2025",
    endDate: "15 Aug 2027",
  },
  {
    id: 3,
    code: "SCD-2026-042",
    name: "Smart City Development",
    ministry: "Ministry of Urban Affairs",
    sector: "Smart Cities",
    location: "Maharashtra",
    progress: 81,
    status: "On Track",
    risk: "Medium",
    riskScore: 54,
    budget: "₹620 Cr",
    startDate: "05 Feb 2025",
    endDate: "20 Nov 2027",
  },
  {
    id: 4,
    code: "RRC-2026-018",
    name: "Rural Road Connectivity",
    ministry: "Ministry of Rural Development",
    sector: "Rural Roads",
    location: "Uttar Pradesh",
    progress: 34,
    status: "Delayed",
    risk: "Medium",
    riskScore: 48,
    budget: "₹410 Cr",
    startDate: "20 Apr 2025",
    endDate: "10 Jun 2027",
  },
  {
    id: 5,
    code: "RBC-2026-009",
    name: "River Bridge Construction",
    ministry: "Ministry of Road Transport",
    sector: "Bridges",
    location: "West Bengal",
    progress: 66,
    status: "At Risk",
    risk: "High",
    riskScore: 62,
    budget: "₹730 Cr",
    startDate: "15 Feb 2025",
    endDate: "25 Sep 2027",
  },
];

export default function Projects() {
  const [projects, setProjects] = useState(initialProjects);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");

  const [showAdd, setShowAdd] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        project.name.toLowerCase().includes(searchText) ||
        project.code.toLowerCase().includes(searchText) ||
        project.location.toLowerCase().includes(searchText) ||
        project.sector.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        project.status === statusFilter;

      const matchesRisk =
        riskFilter === "All" ||
        project.risk === riskFilter;

      return matchesSearch && matchesStatus && matchesRisk;
    });
  }, [projects, search, statusFilter, riskFilter]);

  const deleteProject = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    setProjects((prev) =>
      prev.filter((project) => project.id !== id)
    );
  };

  const addProject = (project) => {
    setProjects((prev) => [
      {
        ...project,
        id: Date.now(),
        code: `PRJ-${new Date().getFullYear()}-${String(
          prev.length + 1
        ).padStart(3, "0")}`,
        riskScore: 20,
        risk: "Low",
        progress: 0,
        status: "On Track",
      },
      ...prev,
    ]);

    setShowAdd(false);
  };

  const updateProject = (updatedProject) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === updatedProject.id
          ? updatedProject
          : project
      )
    );

    setEditingProject(null);
  };

  return (
    <div className="space-y-5">

      {/* Header */}

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-between gap-4 md:flex-row md:items-center"
      >
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-500">
            Project Management
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
            Infrastructure Projects
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage, monitor and analyze all infrastructure projects.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="
            flex w-fit items-center gap-2
            rounded-xl
            bg-gradient-to-r from-blue-600 to-indigo-600
            px-4 py-2.5
            text-sm font-semibold text-white
            shadow-lg shadow-blue-500/20
            transition hover:-translate-y-0.5
          "
        >
          <Plus size={17} />
          Add Project
        </button>
      </motion.div>


      {/* Summary Cards */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <MiniStat
          title="Total Projects"
          value={projects.length}
          icon={FolderKanban}
          type="blue"
        />

        <MiniStat
          title="On Track"
          value={
            projects.filter(
              (p) => p.status === "On Track"
            ).length
          }
          icon={CheckCircle2}
          type="green"
        />

        <MiniStat
          title="At Risk"
          value={
            projects.filter(
              (p) => p.status === "At Risk"
            ).length
          }
          icon={AlertTriangle}
          type="orange"
        />

        <MiniStat
          title="Delayed"
          value={
            projects.filter(
              (p) => p.status === "Delayed"
            ).length
          }
          icon={Clock3}
          type="red"
        />

      </div>


      {/* Search & Filters */}

      <div
        className="
          rounded-2xl border border-slate-200
          bg-white p-4 shadow-sm
        "
      >

        <div className="flex flex-col gap-3 lg:flex-row">

          {/* Search */}

          <div className="relative flex-1">

            <Search
              size={17}
              className="
                absolute left-3.5 top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search project, code, location or sector..."
              className="
                h-11 w-full rounded-xl
                border border-slate-200
                bg-slate-50
                pl-10 pr-4
                text-sm text-slate-700
                outline-none
                transition
                focus:border-blue-400
                focus:bg-white
              "
            />

          </div>


          {/* Status */}

          <div className="relative">

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="
                h-11 min-w-[160px]
                appearance-none
                rounded-xl
                border border-slate-200
                bg-white
                px-4 pr-10
                text-sm text-slate-600
                outline-none
                focus:border-blue-400
              "
            >
              <option value="All">
                All Status
              </option>

              <option value="On Track">
                On Track
              </option>

              <option value="At Risk">
                At Risk
              </option>

              <option value="Delayed">
                Delayed
              </option>
            </select>

            <ChevronDown
              size={15}
              className="
                pointer-events-none
                absolute right-3 top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

          </div>


          {/* Risk */}

          <div className="relative">

            <select
              value={riskFilter}
              onChange={(e) =>
                setRiskFilter(e.target.value)
              }
              className="
                h-11 min-w-[150px]
                appearance-none
                rounded-xl
                border border-slate-200
                bg-white
                px-4 pr-10
                text-sm text-slate-600
                outline-none
                focus:border-blue-400
              "
            >
              <option value="All">
                All Risk
              </option>

              <option value="Low">
                Low
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="High">
                High
              </option>

              <option value="Critical">
                Critical
              </option>
            </select>

            <ChevronDown
              size={15}
              className="
                pointer-events-none
                absolute right-3 top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

          </div>

          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
              setRiskFilter("All");
            }}
            className="
              flex h-11 items-center
              justify-center gap-2
              rounded-xl
              border border-slate-200
              px-4 text-sm
              font-medium text-slate-500
              hover:bg-slate-50
            "
          >
            <SlidersHorizontal size={16} />
            Reset
          </button>

        </div>

        <div className="
          mt-3 text-xs text-slate-400
        ">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {filteredProjects.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-700">
            {projects.length}
          </span>{" "}
          projects
        </div>

      </div>


      {/* Project Table */}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          overflow-hidden
          rounded-2xl
          border border-slate-200
          bg-white shadow-sm
        "
      >

        <div className="
          flex items-center
          justify-between
          border-b border-slate-100
          p-5
        ">

          <div>
            <h2 className="
              text-sm font-bold
              text-slate-950
            ">
              All Projects
            </h2>

            <p className="
              mt-1 text-[10px]
              text-slate-400
            ">
              Complete infrastructure project portfolio
            </p>
          </div>

          <span className="
            rounded-full
            bg-blue-50
            px-3 py-1
            text-[10px]
            font-bold
            text-blue-600
          ">
            {filteredProjects.length} Projects
          </span>

        </div>


        <div className="overflow-x-auto">

          <table className="
            w-full min-w-[1000px]
          ">

            <thead>

              <tr className="bg-slate-50">

                <TableHead>
                  Project
                </TableHead>

                <TableHead>
                  Location
                </TableHead>

                <TableHead>
                  Progress
                </TableHead>

                <TableHead>
                  Budget
                </TableHead>

                <TableHead>
                  Risk
                </TableHead>

                <TableHead>
                  Status
                </TableHead>

                <TableHead>
                  Action
                </TableHead>

              </tr>

            </thead>

            <tbody>

              <AnimatePresence>
                {filteredProjects.map((project) => (

                  <motion.tr
                    key={project.id}
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                    }}
                    className="
                      border-t
                      border-slate-100
                      transition
                      hover:bg-blue-50/30
                    "
                  >

                    {/* Project */}

                    <td className="px-5 py-4">

                      <div>
                        <p className="
                          text-sm font-semibold
                          text-slate-900
                        ">
                          {project.name}
                        </p>

                        <p className="
                          mt-1 text-[10px]
                          font-medium
                          text-slate-400
                        ">
                          {project.code}
                        </p>
                      </div>

                    </td>


                    {/* Location */}

                    <td className="px-5 py-4">

                      <div className="
                        flex items-center
                        gap-1.5
                        text-xs
                        text-slate-500
                      ">

                        <MapPin
                          size={13}
                          className="text-blue-500"
                        />

                        {project.location}

                      </div>

                    </td>


                    {/* Progress */}

                    <td className="px-5 py-4">

                      <div className="w-32">

                        <div className="
                          mb-1.5 flex
                          justify-between
                        ">

                          <span className="
                            text-[10px]
                            text-slate-400
                          ">
                            Progress
                          </span>

                          <span className="
                            text-[10px]
                            font-bold
                            text-slate-700
                          ">
                            {project.progress}%
                          </span>

                        </div>

                        <div className="
                          h-2 overflow-hidden
                          rounded-full
                          bg-slate-100
                        ">

                          <motion.div
                            initial={{
                              width: 0,
                            }}
                            animate={{
                              width:
                                `${project.progress}%`,
                            }}
                            transition={{
                              duration: 0.7,
                            }}
                            className="
                              h-full rounded-full
                              bg-gradient-to-r
                              from-blue-500
                              to-violet-500
                            "
                          />

                        </div>

                      </div>

                    </td>


                    {/* Budget */}

                    <td className="
                      px-5 py-4
                      text-xs font-semibold
                      text-slate-700
                    ">
                      {project.budget}
                    </td>


                    {/* Risk */}

                    <td className="px-5 py-4">

                      <div>
                        <RiskBadge
                          level={project.risk}
                        />

                        <p className="
                          mt-1 text-[9px]
                          text-slate-400
                        ">
                          Score:{" "}
                          <span className="
                            font-bold
                            text-slate-600
                          ">
                            {project.riskScore}%
                          </span>
                        </p>
                      </div>

                    </td>


                    {/* Status */}

                    <td className="px-5 py-4">
                      <StatusBadge
                        status={project.status}
                      />
                    </td>


                    {/* Action */}

                    <td className="px-5 py-4">

                      <div className="
                        flex items-center gap-1
                      ">

                        <ActionButton
                          icon={Eye}
                          title="View"
                          onClick={() =>
                            setSelectedProject(project)
                          }
                        />

                        <ActionButton
                          icon={Pencil}
                          title="Edit"
                          onClick={() =>
                            setEditingProject(project)
                          }
                        />

                        <ActionButton
                          icon={Trash2}
                          title="Delete"
                          danger
                          onClick={() =>
                            deleteProject(project.id)
                          }
                        />

                      </div>

                    </td>

                  </motion.tr>

                ))}

              </AnimatePresence>

            </tbody>

          </table>

        </div>


        {filteredProjects.length === 0 && (
          <div className="
            flex flex-col
            items-center
            justify-center
            py-16
          ">

            <div className="
              flex h-14 w-14
              items-center
              justify-center
              rounded-2xl
              bg-slate-100
              text-slate-400
            ">
              <FolderKanban size={25} />
            </div>

            <h3 className="
              mt-4 text-sm
              font-bold text-slate-800
            ">
              No projects found
            </h3>

            <p className="
              mt-1 text-xs
              text-slate-400
            ">
              Try changing your search or filters.
            </p>

          </div>
        )}

      </motion.div>


      {/* Add Modal */}

      <AnimatePresence>

        {showAdd && (
          <ProjectModal
            title="Add New Project"
            onClose={() => setShowAdd(false)}
            onSubmit={addProject}
          />
        )}

      </AnimatePresence>


      {/* Edit Modal */}

      <AnimatePresence>

        {editingProject && (
          <ProjectModal
            title="Edit Project"
            project={editingProject}
            onClose={() =>
              setEditingProject(null)
            }
            onSubmit={updateProject}
          />
        )}

      </AnimatePresence>


      {/* Details Modal */}

      <AnimatePresence>

        {selectedProject && (
          <ProjectDetails
            project={selectedProject}
            onClose={() =>
              setSelectedProject(null)
            }
          />
        )}

      </AnimatePresence>

    </div>
  );
}


/* =========================================================
   MINI STAT
========================================================= */

function MiniStat({
  title,
  value,
  icon: Icon,
  type,
}) {
  const styles = {
    blue:
      "bg-blue-50 text-blue-600",
    green:
      "bg-emerald-50 text-emerald-600",
    orange:
      "bg-orange-50 text-orange-600",
    red:
      "bg-red-50 text-red-600",
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="
        flex items-center
        justify-between
        rounded-2xl
        border border-slate-200
        bg-white p-4
        shadow-sm
      "
    >

      <div>
        <p className="
          text-[10px]
          font-medium
          text-slate-400
        ">
          {title}
        </p>

        <p className="
          mt-1 text-2xl
          font-bold text-slate-950
        ">
          {value}
        </p>
      </div>

      <div className={`
        flex h-10 w-10
        items-center justify-center
        rounded-xl ${styles[type]}
      `}>
        <Icon size={19} />
      </div>

    </motion.div>
  );
}


/* =========================================================
   TABLE HEAD
========================================================= */

function TableHead({ children }) {
  return (
    <th className="
      px-5 py-3
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


/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }) {
  const styles = {
    "On Track":
      "bg-emerald-50 text-emerald-700",
    "At Risk":
      "bg-orange-50 text-orange-700",
    Delayed:
      "bg-red-50 text-red-700",
  };

  return (
    <span className={`
      rounded-full
      px-2.5 py-1
      text-[9px]
      font-bold
      ${styles[status]}
    `}>
      {status}
    </span>
  );
}


/* =========================================================
   ACTION BUTTON
========================================================= */

function ActionButton({
  icon: Icon,
  title,
  onClick,
  danger,
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`
        flex h-8 w-8
        items-center justify-center
        rounded-lg
        transition
        ${
          danger
            ? "text-red-400 hover:bg-red-50 hover:text-red-600"
            : "text-slate-400 hover:bg-blue-50 hover:text-blue-600"
        }
      `}
    >
      <Icon size={14} />
    </button>
  );
}


/* =========================================================
   PROJECT MODAL
========================================================= */

function ProjectModal({
  title,
  project,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState({
    name: project?.name || "",
    ministry: project?.ministry || "",
    sector: project?.sector || "",
    location: project?.location || "",
    budget: project?.budget || "",
    startDate: project?.startDate || "",
    endDate: project?.endDate || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.ministry ||
      !form.sector ||
      !form.location ||
      !form.budget
    ) {
      alert("Please fill all required fields.");
      return;
    }

    onSubmit(
      project
        ? {
            ...project,
            ...form,
          }
        : form
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="
        fixed inset-0 z-[100]
        flex items-center
        justify-center
        bg-slate-950/50
        p-4 backdrop-blur-sm
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
          w-full max-w-2xl
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
        "
      >

        {/* Header */}

        <div className="
          flex items-center
          justify-between
          border-b border-slate-100
          p-5
        ">

          <div>
            <h2 className="
              text-lg font-bold
              text-slate-950
            ">
              {title}
            </h2>

            <p className="
              mt-1 text-xs
              text-slate-400
            ">
              Enter project information below.
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              rounded-xl p-2
              text-slate-400
              hover:bg-slate-100
            "
          >
            <X size={18} />
          </button>

        </div>


        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-5"
        >

          <div className="
            grid grid-cols-1
            gap-4 sm:grid-cols-2
          ">

            <Input
              label="Project Name *"
              value={form.name}
              onChange={(value) =>
                setForm({
                  ...form,
                  name: value,
                })
              }
              placeholder="National Highway Expansion"
            />

            <Input
              label="Ministry *"
              value={form.ministry}
              onChange={(value) =>
                setForm({
                  ...form,
                  ministry: value,
                })
              }
              placeholder="Ministry of Road Transport"
            />

            <Input
              label="Sector *"
              value={form.sector}
              onChange={(value) =>
                setForm({
                  ...form,
                  sector: value,
                })
              }
              placeholder="Roads & Highways"
            />

            <Input
              label="Location *"
              value={form.location}
              onChange={(value) =>
                setForm({
                  ...form,
                  location: value,
                })
              }
              placeholder="Bihar"
            />

            <Input
              label="Approved Budget *"
              value={form.budget}
              onChange={(value) =>
                setForm({
                  ...form,
                  budget: value,
                })
              }
              placeholder="₹500 Cr"
            />

            <Input
              label="Start Date"
              value={form.startDate}
              onChange={(value) =>
                setForm({
                  ...form,
                  startDate: value,
                })
              }
              placeholder="12 Jan 2026"
            />

            <Input
              label="Expected Completion"
              value={form.endDate}
              onChange={(value) =>
                setForm({
                  ...form,
                  endDate: value,
                })
              }
              placeholder="30 Dec 2028"
            />

          </div>


          <div className="
            flex justify-end
            gap-3 border-t
            border-slate-100
            pt-4
          ">

            <button
              type="button"
              onClick={onClose}
              className="
                rounded-xl
                border border-slate-200
                px-4 py-2.5
                text-sm font-medium
                text-slate-600
                hover:bg-slate-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                rounded-xl
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                px-5 py-2.5
                text-sm font-semibold
                text-white
                shadow-lg
                shadow-blue-500/20
              "
            >
              {project
                ? "Save Changes"
                : "Create Project"}
            </button>

          </div>

        </form>

      </motion.div>

    </motion.div>
  );
}


/* =========================================================
   INPUT
========================================================= */

function Input({
  label,
  value,
  onChange,
  placeholder,
}) {
  return (
    <label className="block">

      <span className="
        mb-1.5 block
        text-[11px]
        font-semibold
        text-slate-600
      ">
        {label}
      </span>

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="
          h-10 w-full
          rounded-xl
          border border-slate-200
          bg-slate-50
          px-3
          text-sm
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


/* =========================================================
   PROJECT DETAILS
========================================================= */

function ProjectDetails({
  project,
  onClose,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="
        fixed inset-0 z-[100]
        flex items-center
        justify-center
        bg-slate-950/50
        p-4 backdrop-blur-sm
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
        className="
          w-full max-w-xl
          rounded-2xl
          bg-white
          p-6
          shadow-2xl
        "
      >

        <div className="
          flex items-start
          justify-between
        ">

          <div>

            <p className="
              text-[10px]
              font-bold uppercase
              tracking-wider
              text-blue-500
            ">
              Project Details
            </p>

            <h2 className="
              mt-1 text-xl
              font-bold
              text-slate-950
            ">
              {project.name}
            </h2>

            <p className="
              mt-1 text-xs
              text-slate-400
            ">
              {project.code}
            </p>

          </div>

          <button
            onClick={onClose}
            className="
              rounded-xl p-2
              text-slate-400
              hover:bg-slate-100
            "
          >
            <X size={18} />
          </button>

        </div>


        <div className="
          mt-6 grid
          grid-cols-2
          gap-3
        ">

          <Detail
            label="Ministry"
            value={project.ministry}
          />

          <Detail
            label="Sector"
            value={project.sector}
          />

          <Detail
            label="Location"
            value={project.location}
          />

          <Detail
            label="Budget"
            value={project.budget}
          />

          <Detail
            label="Start Date"
            value={project.startDate}
          />

          <Detail
            label="Completion"
            value={project.endDate}
          />

        </div>


        <div className="
          mt-5 rounded-xl
          bg-slate-50 p-4
        ">

          <div className="
            flex items-center
            justify-between
          ">

            <span className="
              text-xs
              text-slate-500
            ">
              Project Progress
            </span>

            <span className="
              text-sm font-bold
              text-blue-600
            ">
              {project.progress}%
            </span>

          </div>

          <div className="
            mt-2 h-2
            overflow-hidden
            rounded-full
            bg-slate-200
          ">

            <div
              style={{
                width: `${project.progress}%`,
              }}
              className="
                h-full
                rounded-full
                bg-gradient-to-r
                from-blue-500
                to-violet-500
              "
            />

          </div>

        </div>


        <div className="
          mt-4 flex
          items-center
          justify-between
        ">

          <div>

            <p className="
              text-[10px]
              text-slate-400
            ">
              Risk
            </p>

            <div className="mt-1">
              <RiskBadge
                level={project.risk}
              />
            </div>

          </div>

          <div className="text-right">

            <p className="
              text-[10px]
              text-slate-400
            ">
              Risk Score
            </p>

            <p className="
              mt-1 text-xl
              font-bold
              text-slate-950
            ">
              {project.riskScore}%
            </p>

          </div>

        </div>

      </motion.div>

    </motion.div>
  );
}


/* =========================================================
   DETAIL
========================================================= */

function Detail({
  label,
  value,
}) {
  return (
    <div className="
      rounded-xl
      border border-slate-100
      bg-slate-50
      p-3
    ">

      <p className="
        text-[9px]
        text-slate-400
      ">
        {label}
      </p>

      <p className="
        mt-1 text-xs
        font-semibold
        text-slate-800
      ">
        {value || "Not available"}
      </p>

    </div>
  );
}