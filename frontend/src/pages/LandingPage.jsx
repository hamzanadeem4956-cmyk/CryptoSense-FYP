import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer"
function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050b16] text-white overflow-hidden">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),_transparent_35%),radial-gradient(circle_at_center,_rgba(16,185,129,0.08),_transparent_40%)]" />

      <div className="relative">
        <section className="px-4 pt-10">
          <div className="mx-auto max-w-[1200px] rounded-[28px] border border-white/5 bg-[#0d1727] px-6 py-12 shadow-2xl shadow-black/30 sm:px-10 sm:py-16">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/15 bg-cyan-500/10 px-4 py-2 text-xs font-medium text-cyan-300">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                AI-Powered Crypto Analysis Platform
              </div>

              <h1 className="mt-8 text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl">
                Master Crypto with{" "}
                <span className="text-cyan-400">CryptoSence</span>
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Track live cryptocurrency prices, view charts, get AI-powered
                crypto explanations from Cryptobot, learn through the Learning
                Hub, and share feedback in one secure platform.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button
                  onClick={() => navigate("/register")}
                  className="rounded-2xl bg-cyan-400 px-7 py-3.5 font-semibold text-[#050b16] shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300"
                >
                  Get Started Today →
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className="rounded-2xl border border-white/10 bg-white/5 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
                >
                  Login to Dashboard
                </button>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { title: "Live", subtitle: "CRYPTO DATA" },
                  { title: "AI", subtitle: "CRYPTOBOT" },
                  { title: "Learn", subtitle: "LEARNING HUB" },
                  { title: "Secure", subtitle: "USER ACCESS" },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/5 bg-white/5 px-4 py-5 text-center"
                  >
                    <div className="text-lg font-bold text-cyan-300">
                      {item.title}
                    </div>
                    <div className="mt-1 text-[11px] tracking-[0.18em] text-slate-400">
                      {item.subtitle}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 mt-14">
          <div className="mx-auto max-w-[1200px]">
            <div className="mb-6">
              <div className="text-[11px] uppercase tracking-[0.35em] text-slate-500">
                Luke Features
              </div>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                Designed for your CryptoSence project
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                A clean and professional landing page that focuses on login and
                signup while showing the main value of the platform.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="flex flex-col gap-5 rounded-[22px] border border-white/5 bg-[#0d1727] p-5 sm:p-6 md:flex-row">
                <div className="flex-1">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-500/10 bg-cyan-500/10 text-cyan-300">
                    📈
                  </div>
                  <h3 className="mt-5 text-2xl font-bold">
                    Real-time Crypto Dashboard
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    View live crypto prices, charts, percentage changes, and
                    market details in a simple interface.
                  </p>

                  <ul className="mt-5 space-y-2 text-sm text-slate-300">
                    <li>✓ Live market tracking</li>
                    <li>✓ Clean chart view</li>
                    <li>✓ Search any coin easily</li>
                  </ul>
                </div>

                <div className="flex flex-1 items-center justify-center rounded-[20px] border border-white/5 bg-[#101a2b] p-4">
                  <div className="w-full max-w-[260px] rounded-3xl border border-white/5 bg-[#0c1322] p-4">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>BTC / USD</span>
                      <span>Live</span>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-[72%] rounded-full bg-cyan-400" />
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-[55%] rounded-full bg-emerald-400" />
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-[80%] rounded-full bg-cyan-300" />
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-[68%] rounded-full bg-emerald-300" />
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                      {["Price", "Volume", "Trend"].map((t) => (
                        <div
                          key={t}
                          className="rounded-xl border border-white/5 bg-white/5 py-2 text-center text-slate-400"
                        >
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[22px] border border-white/5 bg-[#0d1727] p-5 sm:p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-500/10 bg-purple-500/10 text-purple-300">
                  🤖
                </div>
                <h3 className="mt-5 text-2xl font-bold">Cryptobot</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  AI support for crypto questions, trend explanation, and simple
                  market guidance.
                </p>

                <div className="mt-6 rounded-2xl border border-white/5 bg-[#101a2b] p-4">
                  <div className="text-sm italic text-slate-400">
                    “What is the trend of ETH?”
                  </div>
                  <div className="mt-3 rounded-2xl border border-emerald-500/10 bg-emerald-500/10 p-3 text-sm text-emerald-300">
                    ETH shows market movement that can be explained with short
                    and easy analysis.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-[22px] border border-white/5 bg-[#0d1727] p-5 sm:p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-pink-500/10 bg-pink-500/10 text-pink-300">
                🧩
              </div>

              <h3 className="mt-5 text-2xl font-bold">Learn, Improve & Grow</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                CryptoSence helps users learn cryptocurrency concepts, improve
                market understanding, and share valuable feedback to enhance
                the platform experience.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-[18px] border border-white/5 bg-[#101a2b] p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-500/10 bg-cyan-500/10 text-cyan-300">
                    📚
                  </div>
                  <h4 className="mt-4 text-lg font-bold">Learning Hub</h4>
                  <p className="mt-2 text-sm leading-7 text-slate-400">
                    Access tutorials, books, learning guides, and educational
                    resources designed for beginners and traders.
                  </p>
                </div>

                <div className="rounded-[18px] border border-white/5 bg-[#101a2b] p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-indigo-500/10 bg-indigo-500/10 text-indigo-300">
                    💬
                  </div>
                  <h4 className="mt-4 text-lg font-bold">Feedback System</h4>
                  <p className="mt-2 text-sm leading-7 text-slate-400">
                    Submit suggestions, report issues, and help improve the
                    CryptoSence platform.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-[22px] border border-white/5 bg-[#0d1727] p-8 text-center sm:p-10">
              <h3 className="text-3xl font-extrabold">
                Ready to start your journey?
              </h3>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Create an account or login to access the dashboard, Cryptobot,
                learning features, and feedback system.
              </p>

              <button
                onClick={() => navigate("/register")}
                className="mt-6 rounded-2xl bg-cyan-400 px-7 py-3.5 font-semibold text-[#050b16] transition hover:bg-cyan-300"
              >
                Get Started Today →
              </button>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-[#0b1220] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/15 font-bold text-cyan-300">
                  C
                </div>
                <div>
                  <div className="font-semibold leading-none">CryptoSence</div>
                  <div className="mt-1 text-xs text-slate-500">
                    Precise Trading. Absolute Security.
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate("/login")}
                  className="rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-[#050b16] transition hover:bg-cyan-300"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </section>
        < Footer/>
      </div>
    </div>
  );
}

export default LandingPage;