import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

function AdminActivityMonitor() {
  const [stats, setStats] = useState(null);
  const [latestUsers, setLatestUsers] = useState([]);
  const [latestFeedback, setLatestFeedback] = useState([]);
  const [recentLogins, setRecentLogins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchActivity = async () => {
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
        throw new Error(data.message || "Failed to load activity data");
      }

      setStats(data.stats);
      setLatestUsers(data.latestUsers || []);
      setLatestFeedback(data.latestFeedback || []);
      setRecentLogins(data.recentLogins || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  return (
    <div className="min-h-screen bg-[#050b16] text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        <AdminSidebar />

        <main className="bg-[#0b1220] border border-white/10 rounded-2xl p-5 md:p-6 shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <h1 className="text-3xl font-bold">Activity Monitor</h1>
            <p className="text-sm text-slate-400">
              System usage, users, feedback, and recent logins
            </p>
          </div>

          {message && (
            <div className="mb-4 rounded-xl bg-cyan-500/10 border border-cyan-400/20 px-4 py-3 text-cyan-300">
              {message}
            </div>
          )}

          {loading ? (
            <p className="text-slate-400">Loading activity data...</p>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="rounded-2xl border border-white/10 bg-[#050b16] p-5">
                    <p className="text-slate-400 text-sm">Blocked Users</p>
                    <p className="text-2xl font-bold mt-2">{stats.blockedUsers}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#050b16] p-5">
                    <p className="text-slate-400 text-sm">New Feedback</p>
                    <p className="text-2xl font-bold mt-2">{stats.newFeedback}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#050b16] p-5">
                    <p className="text-slate-400 text-sm">Resolved Feedback</p>
                    <p className="text-2xl font-bold mt-2">{stats.resolvedFeedback}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <section className="rounded-2xl border border-white/10 bg-[#050b16] p-5">
                  <h2 className="text-xl font-bold mb-4">Recent Users</h2>

                  {latestUsers.length === 0 ? (
                    <p className="text-slate-400">No users found.</p>
                  ) : (
                    <div className="space-y-3">
                      {latestUsers.map((user) => (
                        <div
                          key={user._id}
                          className="rounded-xl border border-white/10 bg-[#0b1220] p-4"
                        >
                          <p className="font-semibold">{user.username}</p>
                          <p className="text-sm text-slate-400">{user.email}</p>
                          <p className="text-xs text-slate-500 mt-1 capitalize">
                            Role: {user.role}
                          </p>
                          <p className="text-xs text-slate-500">
                            Joined: {new Date(user.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <section className="rounded-2xl border border-white/10 bg-[#050b16] p-5">
                  <h2 className="text-xl font-bold mb-4">Recent Logins</h2>

                  {recentLogins.length === 0 ? (
                    <p className="text-slate-400">No login activity found.</p>
                  ) : (
                    <div className="space-y-3">
                      {recentLogins.map((user) => (
                        <div
                          key={user._id}
                          className="rounded-xl border border-white/10 bg-[#0b1220] p-4"
                        >
                          <p className="font-semibold">{user.username}</p>
                          <p className="text-sm text-slate-400">{user.email}</p>
                          <p className="text-xs text-slate-500 mt-1 capitalize">
                            Role: {user.role}
                          </p>
                          <p className="text-xs text-slate-500">
                            Last login: {new Date(user.lastLogin).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>

              <section className="rounded-2xl border border-white/10 bg-[#050b16] p-5 mt-6">
                <h2 className="text-xl font-bold mb-4">Recent Feedback</h2>

                {latestFeedback.length === 0 ? (
                  <p className="text-slate-400">No feedback found.</p>
                ) : (
                  <div className="space-y-3">
                    {latestFeedback.map((item) => (
                      <div
                        key={item._id}
                        className="rounded-xl border border-white/10 bg-[#0b1220] p-4"
                      >
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-slate-400">{item.email}</p>
                          </div>

                          <span className="text-xs rounded-full px-3 py-1 bg-cyan-500/10 text-cyan-300 border border-cyan-400/20 capitalize">
                            {item.status || "new"}
                          </span>
                        </div>

                        <p className="text-slate-200 mt-3 leading-7">
                          {item.message}
                        </p>

                        <p className="text-xs text-slate-500 mt-2">
                          Submitted: {new Date(item.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminActivityMonitor;