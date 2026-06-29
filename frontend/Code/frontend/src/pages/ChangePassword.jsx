import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setMessage("");
    setError("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    if (formData.newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/auth/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Password change failed");
        return;
      }

      setMessage(data.message || "Password changed successfully");

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        const role = localStorage.getItem("role");
        if (role === "admin") navigate("/admin-dashboard");
        else if (role === "marketing") navigate("/marketing-dashboard");
        else navigate("/dashboard");
      }, 1200);
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b16] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-white text-4xl font-bold">Change Password</h1>
          <p className="text-slate-400 mt-2">
            Update your account password securely
          </p>
        </div>

        <div className="bg-[#0d1727] border border-white/5 rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-slate-300 text-sm mb-2">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                required
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
                className="w-full bg-[#111c2d] border border-white/5 rounded-2xl px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm mb-2">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                required
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                className="w-full bg-[#111c2d] border border-white/5 rounded-2xl px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className="w-full bg-[#111c2d] border border-white/5 rounded-2xl px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-green-400 text-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-semibold py-3 rounded-2xl transition ${
                loading
                  ? "bg-slate-600 text-white cursor-not-allowed"
                  : "bg-cyan-500 hover:bg-cyan-400 text-[#050b16]"
              }`}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;