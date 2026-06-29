import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  })();

  const menuItems = [
    { name: "Dashboard", icon: "📊", path: "/dashboard" },
    { name: "Cryptobot", icon: "🤖", path: "/cryptobot" },
    { name: "Learning Hub", icon: "📚", path: "/learninghub" },
    { name: "Feedback", icon: "💬", path: "/feedback" },
    { name: "Subscription", icon: "⭐", path: "/subscription" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <aside className="w-[210px] min-h-screen bg-[#070f1c] border-r border-white/5 flex flex-col justify-between px-3 py-4">
      <div>
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
            C
          </div>
          <div>
            <h1 className="text-white text-lg font-bold">CryptoSence</h1>
            <p className="text-slate-400 text-xs">User Portal</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition border ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                    : "text-slate-300 border-transparent hover:bg-white/5"
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="space-y-3">
        <div className="bg-[#0d1727] border border-white/5 rounded-2xl p-3">
          <p className="text-xs text-slate-400">Logged in as</p>
          <h3 className="text-white font-semibold">
            {user.username || user.name || "User"}
          </h3>
          <p className="text-cyan-400 text-xs">
            {user.email || "user@gmail.com"}
          </p>
          <p className="text-slate-500 text-[11px] mt-1">
            Role: {user.role || "user"}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;