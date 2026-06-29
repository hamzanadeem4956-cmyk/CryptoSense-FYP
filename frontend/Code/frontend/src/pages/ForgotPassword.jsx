<<<<<<< HEAD:src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      setMessage(data.message || "Reset link sent to your email.");
    } catch (error) {
      setMessage(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b16] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#0d1727] border border-white/5 rounded-3xl p-8">
        <h1 className="text-3xl font-bold text-white text-center">Forgot Password</h1>
        <p className="text-slate-400 text-sm text-center mt-2">
          Enter your registered email and we will send a reset link.
        </p>

        {message && (
          <div className="mt-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-300">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl bg-[#050b16] border border-white/10 px-4 py-3 text-white outline-none focus:border-cyan-500"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 transition rounded-2xl py-3 text-sm font-medium text-white"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center mt-5 text-sm text-slate-400">
          Remember your password?{" "}
          <Link to="/login" className="text-cyan-400 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

=======
import React, { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }

    // Backend API call here
    setMessage("Password reset link has been sent to your email.");
  };

  return (
    <div className="min-h-screen bg-[#050b16] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-3xl font-bold mx-auto">
            C
          </div>

          <h1 className="text-white text-4xl font-bold mt-4">
            CryptoSence
          </h1>

          <p className="text-slate-400 mt-2">
            Reset your password
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0d1727] border border-white/5 rounded-3xl p-8">
          <h2 className="text-white text-2xl font-bold mb-2">
            Forgot Password
          </h2>

          <p className="text-slate-400 text-sm mb-6">
            Enter your registered email address and we will send you a password reset link.
          </p>

          <form onSubmit={handleSubmit}>
            <div>
              <label className="block text-slate-300 text-sm mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#111c2d] border border-white/5 rounded-2xl px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500"
              />
            </div>

            {message && (
              <div className="mt-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 text-cyan-400 text-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-6 bg-cyan-500 hover:bg-cyan-400 text-[#050b16] font-semibold py-3 rounded-2xl transition"
            >
              Send Reset Link
            </button>
          </form>

          <div className="text-center mt-6">
            <Link
              to="/login"
              className="text-cyan-400 hover:text-cyan-300 text-sm"
            >
              ← Back to Login
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-slate-500 text-sm">
            © 2026 CryptoSence. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

>>>>>>> 901084fcfd99cb2b2a13df805ad65fc5833bda41:Code/frontend/src/pages/ForgotPassword.jsx
export default ForgotPassword;