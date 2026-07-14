import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const CG_API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;
const CG_BASE_URL =
  import.meta.env.VITE_COINGECKO_BASE_URL ||
  "https://api.coingecko.com/api/v3";
const FREE_DAILY_LIMIT = 5;

function getTodayKey() {
  const d = new Date();
  const dateStr = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

  let userId = "guest";
  try {
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    userId = savedUser?._id || savedUser?.email || "guest";
  } catch {
    userId = "guest";
  }

  return `cryptobot_usage_${userId}_${dateStr}`;
}

function Cryptobot() {
  const navigate = useNavigate();

  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState("");
  const [error, setError] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState("inactive");
  const [usageCount, setUsageCount] = useState(0);
  const [coins, setCoins] = useState([]);
  const [coinsLoading, setCoinsLoading] = useState(true);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const isPro = subscriptionStatus === "active";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const loadProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.user) {
          setSubscriptionStatus(data.user.subscriptionStatus || "inactive");
        }
      } catch {
        setSubscriptionStatus("inactive");
      }
    };

    loadProfile();

    const storedCount = parseInt(
      localStorage.getItem(getTodayKey()) || "0",
      10
    );
    setUsageCount(storedCount);
  }, []);

  useEffect(() => {
    const loadCoins = async () => {
      try {
        setCoinsLoading(true);
        const headers = CG_API_KEY ? { "x-cg-demo-api-key": CG_API_KEY } : {};

        const response = await fetch(
          `${CG_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`,
          { headers }
        );

        if (!response.ok) throw new Error("Failed to fetch coins");

        const data = await response.json();
        setCoins(data);
      } catch (err) {
        console.log(err);
        setCoins([]);
      } finally {
        setCoinsLoading(false);
      }
    };

    loadCoins();
  }, []);

  const matchingCoins = useMemo(() => {
    const query = symbol.trim().toLowerCase();
    if (!query) return coins.slice(0, 8);

    return coins
      .filter(
        (coin) =>
          coin.name.toLowerCase().includes(query) ||
          coin.symbol.toLowerCase().includes(query)
      )
      .slice(0, 8);
  }, [coins, symbol]);

  const remaining = Math.max(0, FREE_DAILY_LIMIT - usageCount);
  const limitReached = !isPro && remaining <= 0;

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-1.5-flash";

  const parsedResult = useMemo(() => {
    const text = resultText.trim();
    if (!text) return null;

    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const actionLine = lines.find((line) =>
      /BUY|SELL|HOLD/i.test(line)
    );

    let action = "HOLD";
    if (actionLine) {
      if (/BUY/i.test(actionLine)) action = "BUY";
      else if (/SELL/i.test(actionLine)) action = "SELL";
      else if (/HOLD/i.test(actionLine)) action = "HOLD";
    }

    const reason = lines[1] || "No reason returned.";
    const risk = lines[2] || "No risk note returned.";

    return { action, reason, risk, raw: text };
  }, [resultText]);

  const getActionStyles = (action) => {
    if (action === "BUY") {
      return {
        badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        card: "border-emerald-500/20",
      };
    }

    if (action === "SELL") {
      return {
        badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        card: "border-rose-500/20",
      };
    }

    return {
      badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      card: "border-cyan-500/20",
    };
  };

  const handlePredict = async () => {
    const query = symbol.trim();

    if (!query) {
      setError("Please select a coin from the list.");
      return;
    }

    const matched =
      selectedCoin &&
      (selectedCoin.symbol.toLowerCase() === query.toLowerCase() ||
        selectedCoin.name.toLowerCase() === query.toLowerCase())
        ? selectedCoin
        : coins.find(
            (coin) =>
              coin.symbol.toLowerCase() === query.toLowerCase() ||
              coin.name.toLowerCase() === query.toLowerCase()
          );

    if (!matched) {
      setError(
        "That coin isn't in the dashboard's top 100 list. Please pick one from the suggestions."
      );
      return;
    }

    if (!GEMINI_API_KEY) {
      setError("Gemini API key is missing in .env");
      return;
    }

    if (limitReached) {
      setError(
        `You've used all ${FREE_DAILY_LIMIT} free predictions for today. Subscribe for unlimited predictions.`
      );
      return;
    }

    setLoading(true);
    setError("");
    setResultText("");

    try {
      const prompt = `
You are a cryptocurrency prediction bot.

Give a short prediction for ${matched.name} (${matched.symbol.toUpperCase()}), currently priced around $${matched.current_price}.
Return exactly 3 lines only:

[Prediction: BUY | SELL | HOLD]
[One short reason]
[One short risk note]

Do not add any extra text.
      `.trim();

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 250,
            },
          }),
        }
      );

      const data = await response.json();
      console.log("Gemini response:", data);

      if (!response.ok) {
        throw new Error(
          data?.error?.message || `Request failed with status ${response.status}`
        );
      }

      const text =
        data?.candidates?.[0]?.content?.parts
          ?.map((part) => part.text || "")
          .join("")
          .trim() || "";

      if (!text) {
        throw new Error("Gemini returned no text.");
      }

      setResultText(text);
      setSymbol("");
      setSelectedCoin(null);

      if (!isPro) {
        const key = getTodayKey();
        const newCount = usageCount + 1;
        localStorage.setItem(key, String(newCount));
        setUsageCount(newCount);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Prediction service is not available right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b16] text-white flex flex-col md:flex-row overflow-x-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <main className="flex-1 px-4 py-4">
          <div className="max-w-[1100px] mx-auto">
            <div className="bg-[#0d1727] border border-white/5 rounded-3xl p-6 md:p-8">
              <div className="text-center">
                <h1 className="text-4xl font-extrabold">CryptoBot</h1>
                <p className="text-slate-400 mt-3">
                  Get a simple BUY, SELL, or HOLD prediction for any coin.
                </p>

                <div
                  className={`mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium ${
                    isPro
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                      : "border-cyan-500/15 bg-cyan-500/10 text-cyan-300"
                  }`}
                >
                  {isPro
                    ? "⭐ Full Plan — Unlimited Predictions"
                    : `Free Plan — ${remaining} of ${FREE_DAILY_LIMIT} predictions left today`}
                </div>
              </div>

              <div className="mt-8 bg-[#111c2d] border border-white/5 rounded-2xl p-4 md:p-5">
                <label className="block text-sm text-slate-400 mb-2">
                  Select a Coin
                </label>

                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={symbol}
                      onChange={(e) => {
                        setSymbol(e.target.value);
                        setSelectedCoin(null);
                        setShowDropdown(true);
                      }}
                      onFocus={() => setShowDropdown(true)}
                      onBlur={() =>
                        setTimeout(() => setShowDropdown(false), 150)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handlePredict();
                      }}
                      disabled={limitReached}
                      placeholder={
                        coinsLoading
                          ? "Loading coin list..."
                          : "Search any of the top 100 coins..."
                      }
                      className="w-full bg-[#0b1220] border border-white/5 rounded-2xl px-4 py-3 outline-none text-white placeholder:text-slate-500 disabled:opacity-50"
                    />

                    {showDropdown && !coinsLoading && (
                      <div className="absolute z-20 mt-2 w-full max-h-64 overflow-y-auto rounded-2xl border border-white/10 bg-[#0b1220] shadow-xl">
                        {matchingCoins.length === 0 ? (
                          <div className="px-4 py-3 text-sm text-slate-500">
                            No matching coin found.
                          </div>
                        ) : (
                          matchingCoins.map((coin) => (
                            <button
                              key={coin.id}
                              type="button"
                              onMouseDown={() => {
                                setSelectedCoin(coin);
                                setSymbol(coin.symbol.toUpperCase());
                                setShowDropdown(false);
                              }}
                              className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-white/5 transition"
                            >
                              <img
                                src={coin.image}
                                alt={coin.name}
                                className="w-6 h-6 rounded-full"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">
                                  {coin.name}
                                </div>
                                <div className="text-xs text-slate-500 uppercase">
                                  {coin.symbol}
                                </div>
                              </div>
                              <div className="text-xs text-slate-400">
                                ${coin.current_price?.toLocaleString()}
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={
                      limitReached
                        ? () => navigate("/subscription")
                        : handlePredict
                    }
                    disabled={loading}
                    className="px-6 py-3 rounded-2xl bg-cyan-500 text-[#050b16] font-semibold hover:bg-cyan-400 transition disabled:opacity-60"
                  >
                    {loading
                      ? "Predicting..."
                      : limitReached
                      ? "Upgrade Plan"
                      : "Get Prediction"}
                  </button>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Covers all 100 coins shown on your Dashboard — start typing a
                  name or symbol and pick one from the list.
                </p>

                {limitReached && (
                  <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-cyan-500/15 bg-cyan-500/5 px-4 py-3">
                    <div className="text-sm text-slate-300">
                      🔒 Daily free limit reached. Subscribe for unlimited
                      Cryptobot predictions.
                    </div>
                    <button
                      onClick={() => navigate("/subscription")}
                      className="shrink-0 px-4 py-2 rounded-xl bg-cyan-400 text-[#050b16] text-sm font-semibold hover:bg-cyan-300 transition"
                    >
                      Upgrade Plan
                    </button>
                  </div>
                )}

                {error && (
                  <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-300 rounded-2xl px-4 py-3 text-sm">
                    {error}
                  </div>
                )}
              </div>

              <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
                <div className="bg-[#111c2d] border border-white/5 rounded-2xl p-5 min-h-[260px]">
                  <h2 className="text-xl font-bold mb-4">Prediction Result</h2>

                  {parsedResult ? (
                    <div className="space-y-4">
                      <div
                        className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold border ${getActionStyles(
                          parsedResult.action
                        ).badge}`}
                      >
                        {parsedResult.action} PREDICTION
                      </div>

                      <div className="space-y-3 text-slate-200 leading-7">
                        <p>{parsedResult.reason}</p>
                        <p className="text-slate-400">{parsedResult.risk}</p>
                      </div>

                      <div className="mt-4 rounded-2xl border border-white/5 bg-[#0b1220] p-4">
                        <p className="text-xs text-slate-500 mb-2">Raw Response</p>
                        <pre className="whitespace-pre-wrap text-sm text-slate-300 leading-6">
                          {parsedResult.raw}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-500">
                      Your prediction will appear here after analysis.
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="bg-[#111c2d] border border-white/5 rounded-2xl p-5">
                    <h3 className="text-lg font-semibold">How it works</h3>
                    <p className="text-slate-400 text-sm leading-7 mt-3">
                      Enter a crypto symbol and the bot returns a short prediction
                      with a reason and a risk note.
                    </p>
                  </div>

                  <div className="bg-[#111c2d] border border-white/5 rounded-2xl p-5">
                    <h3 className="text-lg font-semibold">Coverage</h3>
                    <p className="text-slate-400 text-sm leading-7 mt-3">
                      Works with any of the top 100 coins from your Dashboard —
                      not just the well-known ones like BTC, ETH, SOL, or XRP.
                    </p>
                  </div>

                  <div className="bg-[#111c2d] border border-white/5 rounded-2xl p-5">
                    <h3 className="text-lg font-semibold">Note</h3>
                    <p className="text-slate-400 text-sm leading-7 mt-3">
                      Free accounts get {FREE_DAILY_LIMIT} predictions per day.
                      Subscribers get unlimited predictions. This is for demo
                      and educational use only.
                    </p>
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

export default Cryptobot;