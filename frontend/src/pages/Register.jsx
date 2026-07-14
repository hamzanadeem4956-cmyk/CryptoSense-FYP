import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      if (role === "admin") navigate("/admin-dashboard", { replace: true });
      else if (role === "marketing") navigate("/marketing-dashboard", { replace: true });
      else navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setError("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard", { replace: true });
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
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-3xl font-bold mx-auto">
            C
          </div>

          <h1 className="text-white text-4xl font-bold mt-4">CryptoSence</h1>
          <p className="text-slate-400 mt-2">Create your account</p>
        </div>

        <div className="bg-[#0d1727] border border-white/5 rounded-3xl p-8">
          <form onSubmit={handleRegister}>
            <div className="space-y-5">
              <div>
                <label className="block text-slate-300 text-sm mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="w-full bg-[#111c2d] border border-white/5 rounded-2xl px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full bg-[#111c2d] border border-white/5 rounded-2xl px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full bg-[#111c2d] border border-white/5 rounded-2xl px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full bg-[#111c2d] border border-white/5 rounded-2xl px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">
                  {error}
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
                {loading ? "Creating Account..." : "Sign Up"}
              </button>

              <p className="text-center text-slate-400 text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-cyan-400 hover:text-cyan-300">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-slate-500 text-sm">
            © 2026 CryptoSence. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;