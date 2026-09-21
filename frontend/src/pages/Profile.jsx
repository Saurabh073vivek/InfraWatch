import { useEffect, useState } from "react";
import axios from "axios";
import {
  User,
  Mail,
  ShieldCheck,
  CalendarDays,
  Lock,
  CheckCircle2,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token =
    localStorage.getItem("infrawatch_token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/auth/me`,
        config
      );

      setUser(response.data.user);
    } catch (error) {
      console.error(
        "Profile Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center">
        Unable to load profile.
      </div>
    );
  }

  const initials =
    user.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          My Profile
        </h1>

        <p className="mt-1 text-slate-500">
          View your InfraWatch account information.
        </p>
      </div>

      {/* PROFILE CARD */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-8 py-10">
          <div className="flex flex-col items-center gap-4 sm:flex-row">

            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/40 bg-white text-2xl font-bold text-blue-700 shadow-xl">
              {initials}
            </div>

            <div className="text-center text-white sm:text-left">
              <h2 className="text-2xl font-bold">
                {user.name}
              </h2>

              <p className="mt-1 text-blue-100">
                {user.email}
              </p>

              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium">
                <ShieldCheck size={16} />

                {user.role === "admin"
                  ? "Administrator"
                  : "Project Officer"}
              </div>
            </div>
          </div>
        </div>

        {/* INFORMATION */}
        <div className="grid gap-5 p-8 md:grid-cols-2">

          <div className="rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                <User size={20} />
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Full Name
                </p>

                <p className="font-semibold text-slate-900">
                  {user.name}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
                <Mail size={20} />
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Email Address
                </p>

                <p className="font-semibold text-slate-900">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                <ShieldCheck size={20} />
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Account Role
                </p>

                <p className="font-semibold text-slate-900">
                  {user.role === "admin"
                    ? "Administrator"
                    : "Project Officer"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
                <CheckCircle2 size={20} />
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Account Status
                </p>

                <p className="font-semibold text-emerald-600">
                  {user.status || "Active"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-5 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                <CalendarDays size={20} />
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Account Created
                </p>

                <p className="font-semibold text-slate-900">
                  {user.createdAt
                    ? new Date(
                        user.createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      )
                    : "Not available"}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}