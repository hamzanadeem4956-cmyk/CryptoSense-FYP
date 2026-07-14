import React, { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function Cryptobot() {
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState("");
  const [error, setError] = useState("");

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
    const crypto = symbol.trim().toUpperCase();

    if (!crypto) {
      setError("Please enter a crypto symbol like BTC or ETH.");
      return;
    }

    if (!GEMINI_API_KEY) {
      setError("Gemini API key is missing in .env");
      return;
    }

    setLoading(true);
    setError("");
    setResultText("");

    try {
      const prompt = `
You are a cryptocurrency prediction bot.

Give a short prediction for ${crypto}.
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
              </div>

              <div className="mt-8 bg-[#111c2d] border border-white/5 rounded-2xl p-4 md:p-5">
                <label className="block text-sm text-slate-400 mb-2">
                  Enter Crypto Symbol
                </label>

                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handlePredict();
                    }}
                    placeholder="BTC, ETH, SOL..."
                    className="flex-1 bg-[#0b1220] border border-white/5 rounded-2xl px-4 py-3 outline-none text-white placeholder:text-slate-500 uppercase"
                  />

                  <button
                    onClick={handlePredict}
                    disabled={loading}
                    className="px-6 py-3 rounded-2xl bg-cyan-500 text-[#050b16] font-semibold hover:bg-cyan-400 transition disabled:opacity-60"
                  >
                    {loading ? "Predicting..." : "Get Prediction"}
                  </button>
                </div>

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
                    <h3 className="text-lg font-semibold">Examples</h3>
                    <div className="mt-3 space-y-2 text-sm text-slate-400">
                      <div>BTC</div>
                      <div>ETH</div>
                      <div>SOL</div>
                      <div>XRP</div>
                    </div>
                  </div>

                  <div className="bg-[#111c2d] border border-white/5 rounded-2xl p-5">
                    <h3 className="text-lg font-semibold">Note</h3>
                    <p className="text-slate-400 text-sm leading-7 mt-3">
                      This is for demo and educational use only. It does not store
                      history or use a database.
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