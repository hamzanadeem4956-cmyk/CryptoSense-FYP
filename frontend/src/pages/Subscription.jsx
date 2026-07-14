import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Subscription() {
  const [loading, setLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");
  const [subscription, setSubscription] = useState(null);

  const token = localStorage.getItem("token");
  const params = new URLSearchParams(window.location.search);

  const loadSubscription = async () => {
    try {
      setFetching(true);

      const response = await fetch(`${API_BASE}/api/subscriptions/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setSubscription(data.subscription);
      } else {
        setMessage(data.message || "Failed to load subscription");
      }
    } catch (error) {
      setMessage("Unable to load subscription");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (params.get("success") === "1") {
      setMessage("Payment successful. Your subscription is being updated.");
    }

    if (params.get("canceled") === "1") {
      setMessage("Checkout was canceled.");
    }

    loadSubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${API_BASE}/api/subscriptions/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to start checkout");
      }

      window.location.href = data.url;
    } catch (error) {
      setMessage(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setPortalLoading(true);
      setMessage("");

      const response = await fetch(
        `${API_BASE}/api/subscriptions/create-portal-session`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to open portal");
      }

      window.location.href = data.url;
    } catch (error) {
      setMessage(error.message || "Something went wrong");
    } finally {
      setPortalLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    if (status === "active") return "Active";
    if (status === "cancelled") return "Cancelled";
    if (status === "expired") return "Expired";
    return "Inactive";
  };

  return (
    <div className="min-h-screen bg-[#050b16] text-white flex flex-col md:flex-row overflow-x-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <main className="flex-1 px-4 py-4">
          <div className="max-w-[1180px] mx-auto">
            <div className="bg-[#0d1727] border border-white/5 rounded-3xl px-6 py-12 text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Subscription
              </h1>
              <p className="text-slate-400 mt-4 max-w-3xl mx-auto leading-7">
                Subscribe once and get access to CryptoSence premium features.
              </p>
            </div>

            {message && (
              <div className="mt-5 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-300">
                {message}
              </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6 mt-6">
              <div className="bg-[#0d1727] border border-white/5 rounded-3xl p-8">
                <div className="inline-flex px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
                  Premium Plan
                </div>

                <h2 className="text-3xl md:text-4xl font-bold mt-4">
                  CryptoSence Premium
                </h2>

                <p className="text-slate-400 mt-3 max-w-2xl leading-7">
                  One subscription for full access to dashboard features, Cryptobot,
                  Learning Hub, and premium support.
                </p>

                <div className="mt-8">
                  <span className="text-5xl font-extrabold text-cyan-400">
                    ₨ 1,999
                  </span>
                  <span className="text-slate-400 text-sm ml-2">/ month</span>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-slate-300">
                    ✓ Full dashboard access
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-slate-300">
                    ✓ Cryptobot access
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-slate-300">
                    ✓ Learning Hub access
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-slate-300">
                    ✓ Feedback system access
                  </div>
                </div>

                <button
                  onClick={handleSubscribe}
                  disabled={loading}
                  className="mt-8 w-full md:w-auto bg-blue-600 hover:bg-blue-500 disabled:opacity-60 transition rounded-2xl px-6 py-3 text-sm font-medium"
                >
                  {loading ? "Redirecting to Stripe..." : "Subscribe Now"}
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-[#0d1727] border border-white/5 rounded-3xl p-6">
                  <h3 className="text-xl font-bold mb-4">Current Subscription</h3>

                  {fetching ? (
                    <p className="text-slate-400 text-sm">Loading...</p>
                  ) : subscription ? (
                    <div className="space-y-3 text-sm text-slate-300">
                      <p>
                        <span className="text-slate-500">Status:</span>{" "}
                        {getStatusLabel(subscription.status)}
                      </p>
                      <p>
                        <span className="text-slate-500">Started:</span>{" "}
                        {subscription.startedAt
                          ? new Date(subscription.startedAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                      <p>
                        <span className="text-slate-500">Ends:</span>{" "}
                        {subscription.currentPeriodEnd
                          ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                          : "N/A"}
                      </p>

                      <button
                        onClick={handleManageSubscription}
                        disabled={portalLoading}
                        className="w-full mt-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-300 hover:bg-cyan-500/20 disabled:opacity-60"
                      >
                        {portalLoading ? "Opening..." : "Manage in Stripe Portal"}
                      </button>
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm">
                      No active subscription found.
                    </p>
                  )}
                </div>

                <div className="bg-[#0d1727] border border-white/5 rounded-3xl p-6">
                  <h3 className="text-xl font-bold mb-4">Why subscribe?</h3>
                  <div className="space-y-3 text-sm text-slate-300">
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-400">✓</span>
                      Live crypto market data
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-400">✓</span>
                      AI chatbot support
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-400">✓</span>
                      Learning Hub access
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-400">✓</span>
                      Premium user tools
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
export default Subscription;