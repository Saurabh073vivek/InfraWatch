import { useState } from "react";
import axios from "axios";
import {
  Lock,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

export default function Settings() {
  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const changePassword = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setError(
        "Please fill all password fields."
      );
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "New password must contain at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        "New password and confirm password do not match."
      );
      return;
    }

    try {
      setLoading(true);

      const token =
        localStorage.getItem(
          "infrawatch_token"
        );

      const response = await axios.put(
        `${API_URL}/auth/change-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          "Password changed successfully."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to change password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Settings
        </h1>

        <p className="mt-1 text-slate-500">
          Manage your InfraWatch account and security.
        </p>
      </div>

      {/* ACCOUNT SECURITY */}
      <div className="grid gap-6 lg:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <ShieldCheck size={24} />
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-900">
            Account Security
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Keep your account secure by using a strong
            password and protecting your login credentials.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <KeyRound size={24} />
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-900">
            Password Protection
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your password is securely hashed before being
            stored in the database.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Lock size={24} />
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-900">
            Protected Access
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            InfraWatch uses JWT authentication to protect
            authorized application resources.
          </p>
        </div>

      </div>

      {/* CHANGE PASSWORD */}
      <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Lock size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Change Password
              </h2>

              <p className="text-sm text-slate-500">
                Update your account password.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={changePassword}
          className="space-y-5 p-6"
        >

          {/* SUCCESS */}
          {message && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              <CheckCircle2 size={18} />
              {message}
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Current Password
            </label>

            <input
              type="password"
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(
                  e.target.value
                )
              }
              placeholder="Enter current password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
              placeholder="Enter new password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Confirm New Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              placeholder="Confirm new password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Updating..."
              : "Change Password"}
          </button>

        </form>
      </div>
    </div>
  );
}