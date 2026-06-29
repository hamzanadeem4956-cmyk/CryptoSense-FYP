import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("http://localhost:5000/api/admin/activity", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load dashboard data");
      }

      setStats(data.stats);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const quickLinks = [
    {
      title: "Manage Users",
      desc: "View, block, or delete normal users",
      path: "/admin-users",
    },
    {
      title: "Marketing Team",
      desc: "Create and manage marketing users",
      path: "/admin-marketing",
    },
    {
      title: "Feedback",
      desc: "Review user feedback and status",
      path: "/admin-feedback",
    },
    {
      title: "Activity Monitor",
      desc: "Check usage, logins, and activity",
      path: "/admin-activity",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050b16] text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        <AdminSidebar />

        <main className="bg-[#0b1220] border border-white/10 rounded-2xl p-5 md:p-6 shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-slate-400 mt-1">
                Overview of users, marketing team, and feedback
              </p>
            </div>

            <button
              onClick={fetchDashboardData}
              className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold hover:bg-cyan-700"
            >
              Refresh
            </button>
          </div>

          {message && (
            <div className="mb-4 rounded-xl bg-cyan-500/10 border border-cyan-400/20 px-4 py-3 text-cyan-300">
              {message}
            </div>
          )}

          {loading ? (
            <p className="text-slate-400">Loading dashboard...</p>
          ) : (
            <>
              {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                  <div className="rounded-2xl border border-white/10 bg-[#050b16] p-5">
                    <p className="text-slate-400 text-sm">Total Users</p>
                    <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#050b16] p-5">
                    <p className="text-slate-400 text-sm">Normal Users</p>
                    <p className="text-3xl font-bold mt-2">{stats.normalUsers}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#050b16] p-5">
                    <p className="text-slate-400 text-sm">Marketing Users</p>
                    <p className="text-3xl font-bold mt-2">{stats.marketingUsers}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#050b16] p-5">
                    <p className="text-slate-400 text-sm">Admin Users</p>
                    <p className="text-3xl font-bold mt-2">{stats.adminUsers}</p>
                  </div>
                </div>
              )}

              {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                  <div className="rounded-2xl border border-white/10 bg-[#050b16] p-5">
                    <p className="text-slate-400 text-sm">Blocked Users</p>
                    <p className="text-3xl font-bold mt-2">{stats.blockedUsers}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#050b16] p-5">
                    <p className="text-slate-400 text-sm">Total Feedback</p>
                    <p className="text-3xl font-bold mt-2">{stats.totalFeedback}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#050b16] p-5">
                    <p className="text-slate-400 text-sm">New Feedback</p>
                    <p className="text-3xl font-bold mt-2">{stats.newFeedback}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#050b16] p-5">
                    <p className="text-slate-400 text-sm">Resolved Feedback</p>
                    <p className="text-3xl font-bold mt-2">{stats.resolvedFeedback}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <section className="rounded-2xl border border-white/10 bg-[#050b16] p-5">
                  <h2 className="text-xl font-bold mb-4">Quick Actions</h2>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {quickLinks.map((item) => (
                      <button
                        key={item.title}
                        onClick={() => navigate(item.path)}
                        className="text-left rounded-xl border border-white/10 bg-[#0b1220] p-4 hover:border-cyan-400/30 hover:bg-cyan-500/5 transition"
                      >
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-sm text-slate-400 mt-1">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="rounded-2xl border border-white/10 bg-[#050b16] p-5">
                  <h2 className="text-xl font-bold mb-4">System Summary</h2>

                  <div className="space-y-3">
                    <div className="rounded-xl border border-white/10 bg-[#0b1220] p-4">
                      <p className="text-slate-400 text-sm">Platform Status</p>
                      <p className="font-semibold text-green-400 mt-1">Active</p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-[#0b1220] p-4">
                      <p className="text-slate-400 text-sm">Admin Role</p>
                      <p className="font-semibold mt-1">Full access to user control and feedback</p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-[#0b1220] p-4">
                      <p className="text-slate-400 text-sm">Main Modules</p>
                      <p className="font-semibold mt-1">
                        Users, Marketing Team, Feedback, Activity Monitor
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;