import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();

  const admin = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  })();

  const menuItems = [
    { name: "Dashboard", icon: "📊", path: "/admin-dashboard" },
    { name: "Users", icon: "👥", path: "/admin-users" },
    { name: "Marketing Team", icon: "📈", path: "/admin-marketing" },
    { name: "Feedback", icon: "💬", path: "/admin-feedback" },
    { name: "Activity Monitor", icon: "📋", path: "/admin-activity" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <aside className="w-[230px] min-h-screen bg-[#070f1c] border-r border-white/5 flex flex-col justify-between px-4 py-4">
      <div>
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-11 h-11 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xl">
            A
          </div>
          <div>
            <h1 className="text-[18px] font-bold leading-none text-white">
              Admin Panel
            </h1>
            <p className="text-[11px] text-slate-400 mt-1">CryptoSence</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition border ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/15"
                    : "bg-transparent text-slate-300 border-transparent hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <span className="text-sm w-5 text-center">{item.icon}</span>
              <span className="text-sm font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="space-y-3">
        <div className="bg-[#0d1727] border border-white/5 rounded-2xl p-4">
          <p className="text-[11px] text-slate-400">Logged in as</p>
          <h3 className="text-sm font-semibold text-white mt-1">
            {admin.username || admin.name || "Admin"}
          </h3>
          <p className="text-cyan-400 text-[11px] mt-2">
            {admin.email || "admin@cryptosence.com"}
          </p>
          <p className="text-slate-500 text-[11px] mt-1">
            Role: {admin.role || "admin"}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2a1420] text-[#ff6a6a] border border-[#4a2030] hover:bg-[#341824] transition"
        >
          <span className="text-sm">🚪</span>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;