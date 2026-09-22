import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const getToken = () => {
    return localStorage.getItem("infrawatch_token");
  };

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  // ================================
  // FETCH USERS
  // ================================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/users`,
        getAuthConfig()
      );

      setUsers(response.data.users || []);
    } catch (err) {
      console.error("Fetch Users Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to fetch users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================================
  // UPDATE ROLE
  // ================================
  const updateRole = async (userId, role) => {
    try {
      setActionLoading(userId);
      setError("");
      setMessage("");

      const response = await axios.put(
        `${API_URL}/users/${userId}/role`,
        { role },
        getAuthConfig()
      );

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user._id === userId
            ? {
                ...user,
                role: response.data.user.role,
              }
            : user
        )
      );

      setMessage("User role updated successfully.");
    } catch (err) {
      console.error("Update Role Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to update user role"
      );
    } finally {
      setActionLoading("");
    }
  };

  // ================================
  // UPDATE STATUS
  // ================================
  const updateStatus = async (userId, status) => {
    try {
      setActionLoading(userId);
      setError("");
      setMessage("");

      const response = await axios.patch(
        `${API_URL}/users/${userId}/status`,
        { status },
        getAuthConfig()
      );

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user._id === userId
            ? {
                ...user,
                status: response.data.user.status,
              }
            : user
        )
      );

      setMessage(
        status === "active"
          ? "User activated successfully."
          : "User deactivated successfully."
      );
    } catch (err) {
      console.error("Update Status Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to update user status"
      );
    } finally {
      setActionLoading("");
    }
  };

  // ================================
  // SEARCH
  // ================================
  const filteredUsers = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.name?.toLowerCase().includes(value) ||
        user.email?.toLowerCase().includes(value) ||
        user.role?.toLowerCase().includes(value) ||
        user.status?.toLowerCase().includes(value)
      );
    });
  }, [users, search]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-blue-500">
          User Management
        </h1>

        <p className="mt-1 text-slate-500">
          Manage InfraWatch users, roles and account status.
        </p>
      </div>

      {/* ALERTS */}
      {message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Users
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {users.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Active Users
          </p>

          <h2 className="mt-2 text-3xl font-bold text-emerald-600">
            {
              users.filter(
                (user) =>
                  (user.status || "active") === "active"
              ).length
            }
          </h2>
        </div>

        <div className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Inactive Users
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-600">
            {
              users.filter(
                (user) => user.status === "inactive"
              ).length
            }
          </h2>
        </div>
      </div>

      {/* SEARCH + REFRESH */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search by name, email, role or status..."
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Loading..." : "Refresh Users"}
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="mt-4 text-sm text-slate-500">
                Loading users...
              </p>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-semibold text-slate-700">
              No users found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Try a different search.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    User
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Email
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Role
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => {
                  const status =
                    user.status || "active";

                  const isLoading =
                    actionLoading === user._id;

                  return (
                    <tr
                      key={user._id}
                      className="transition hover:bg-slate-50"
                    >
                      {/* USER */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                            {user.name
                              ?.charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900">
                              {user.name}
                            </p>

                            <p className="text-xs text-slate-400">
                              ID:{" "}
                              {user._id.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* EMAIL */}
                      <td className="px-6 py-5 text-sm text-slate-600">
                        {user.email}
                      </td>

                      {/* ROLE */}
                      <td className="px-6 py-5">
                        <select
                          value={user.role}
                          disabled={isLoading}
                          onChange={(e) =>
                            updateRole(
                              user._id,
                              e.target.value
                            )
                          }
                          className={`rounded-lg border px-3 py-2 text-sm font-semibold outline-none ${
                            user.role === "admin"
                              ? "border-purple-200 bg-purple-50 text-purple-700"
                              : "border-blue-200 bg-blue-50 text-blue-700"
                          }`}
                        >
                          <option value="officer">
                            Officer
                          </option>

                          <option value="admin">
                            Admin
                          </option>
                        </select>
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-5">
                        {status === "active" ? (
                          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* ACTION */}
                      <td className="px-6 py-5">
                        <button
                          disabled={isLoading}
                          onClick={() =>
                            updateStatus(
                              user._id,
                              status === "active"
                                ? "inactive"
                                : "active"
                            )
                          }
                          className={`rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            status === "active"
                              ? "bg-red-50 text-red-600 hover:bg-red-100"
                              : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                          }`}
                        >
                          {isLoading
                            ? "Updating..."
                            : status === "active"
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}