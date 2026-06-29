import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

function MarketingSidebar() {
  const navigate = useNavigate();

  const marketing = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  })();

  const menuItems = [
    { name: "Dashboard", icon: "📊", path: "/marketing-dashboard" },
    { name: "Strategy Maker", icon: "🎯", path: "/marketing-strategy" },
    { name: "Growth Tracking", icon: "📈", path: "/marketing-growth" },
    { name: "Media Uploads", icon: "📁", path: "/marketing-media" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <aside className="w-[240px] min-h-screen bg-[#070f1c] border-r border-white/5 flex flex-col justify-between px-4 py-4">
      <div>
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xl">
            M
          </div>

          <div>
            <h1 className="text-lg font-bold text-white leading-none">
              Marketing Panel
            </h1>
            <p className="text-xs text-slate-400 mt-1">CryptoSence</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition border ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/15"
                    : "text-slate-300 border-transparent hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="space-y-3">
        <div className="bg-[#0d1727] border border-white/5 rounded-2xl p-4">
          <p className="text-xs text-slate-400">Logged in as</p>
          <h3 className="text-sm font-semibold text-white mt-1">
            {marketing.username || marketing.name || "Marketing User"}
          </h3>
          <p className="text-cyan-400 text-xs mt-2">
            {marketing.email || "marketing@cryptosence.com"}
          </p>
          <p className="text-slate-500 text-[11px] mt-1">
            Role: {marketing.role || "marketing"}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition"
        >
          <span>🚪</span>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default MarketingSidebar;