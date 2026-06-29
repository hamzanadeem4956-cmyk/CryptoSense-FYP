<<<<<<< HEAD:src/pages/Cryptobot.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

// ============================================================
// 1. MOCK DATA GENERATOR
// ============================================================
function generateCryptoData(symbol) {
  const seed = symbol.toUpperCase().charCodeAt(0) + Date.now() / 30000;
  const rand = (min, max) => {
    const x = Math.sin(seed + min) * 10000;
    return min + (Math.abs(x) % (max - min + 1));
  };

  const basePriceMap = {
    BTC: 67000,
    ETH: 3500,
    SOL: 170,
    DOGE: 0.15,
    ADA: 0.62,
    AVAX: 38,
    DOT: 7.8,
    LINK: 15.2,
    UNI: 7.5,
    MATIC: 0.72,
  };
  const basePrice = basePriceMap[symbol.toUpperCase()] || 100;

  const variation = (rand(0, 100) - 50) / 100;
  const price = basePrice * (1 + variation * 0.12);

  const volume = Math.round(basePrice * (rand(0, 300) + 50) * 100) / 100;

  let rsi = 50 + variation * 40 + rand(-5, 5);
  rsi = Math.min(85, Math.max(22, rsi));
  rsi = Math.round(rsi * 10) / 10;

  const support = Math.round(price * (1 - rand(3, 9) / 100) * 100) / 100;
  const resistance = Math.round(price * (1 + rand(3, 9) / 100) * 100) / 100;

  return {
    symbol: symbol.toUpperCase(),
    price: Math.round(price * 100) / 100,
    volume,
    rsi,
    support,
    resistance,
    timestamp: new Date().toLocaleTimeString(),
  };
}

// ============================================================
// 2. COMBINED ANALYSIS
// ============================================================
function analyze(data) {
  const { rsi, volume, price, support, resistance } = data;

  const rsiSignal = rsi < 30 ? 'oversold' : rsi > 70 ? 'overbought' : 'neutral';
  const avgVolume = price * 0.8;
  const volumeRatio = volume / avgVolume;
  const highVolume = volumeRatio > 1.4;
  const lowVolume = volumeRatio < 0.6;
  const nearSupport = (price - support) / price < 0.02;
  const nearResistance = (resistance - price) / price < 0.02;

  let signal = 'HOLD';
  let reasons = [];

  // BUY conditions
  if (rsiSignal === 'oversold' && highVolume) {
    signal = 'BUY';
    reasons.push('RSI oversold + high volume');
  } else if (rsiSignal === 'oversold' && nearSupport) {
    signal = 'BUY';
    reasons.push('RSI oversold & price near support');
  } else if (rsiSignal === 'neutral' && highVolume && nearSupport) {
    signal = 'BUY';
    reasons.push('high volume + support bounce');
  } else if (rsi < 45 && highVolume && price > support) {
    signal = 'BUY';
    reasons.push('bullish volume & RSI rising');
  }

  // SELL conditions
  if (rsiSignal === 'overbought' && nearResistance) {
    signal = 'SELL';
    reasons.push('RSI overbought & price at resistance');
  } else if (rsiSignal === 'overbought' && lowVolume) {
    signal = 'SELL';
    reasons.push('overbought with low volume (weakness)');
  } else if (rsi > 68 && nearResistance) {
    signal = 'SELL';
    reasons.push('resistance rejection + high RSI');
  } else if (rsiSignal === 'neutral' && nearResistance && lowVolume) {
    signal = 'SELL';
    reasons.push('low volume at resistance');
  }

  // HOLD fallback
  if (signal === 'HOLD') {
    if (rsiSignal === 'neutral' && !nearSupport && !nearResistance) {
      reasons.push('RSI neutral, no key levels');
    } else if (rsiSignal === 'neutral' && highVolume) {
      reasons.push('high volume but no clear direction');
    } else {
      reasons.push('mixed indicators, wait for clarity');
    }
  }

  let explanation = '';
  if (signal === 'BUY') {
    explanation = `📈 ${reasons.slice(0, 2).join('; ')}. Upside potential.`;
  } else if (signal === 'SELL') {
    explanation = `📉 ${reasons.slice(0, 2).join('; ')}. Downside risk.`;
  } else {
    explanation = `⏸️ ${reasons.slice(0, 2).join('; ')}. No strong edge.`;
  }

  const detailLine = `RSI ${rsi} · Vol ${volume.toFixed(0)} · S: ${support} · R: ${resistance}`;

  return { signal, explanation, detailLine, data };
}

// ============================================================
// 3. MAIN COMPONENT with Tailwind CSS
// ============================================================
export default function Cryptobot() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      from: 'bot',
      text: (
        <>
          👋 Hello! I'm <strong className="text-blue-300">CryptoAI</strong>.<br />
          Enter a crypto symbol (e.g. <strong className="text-yellow-300">BTC</strong>,{' '}
          <strong className="text-yellow-300">ETH</strong>,{' '}
          <strong className="text-yellow-300">SOL</strong>) and I'll analyze:
          <br />
          <span className="text-gray-400">📊 RSI · Volume · Support/Resistance</span>
          <br />
          Then give a <strong className="text-green-400">BUY</strong> /{' '}
          <strong className="text-red-400">SELL</strong> /{' '}
          <strong className="text-yellow-400">HOLD</strong> signal.
        </>
      ),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    const symbol = inputValue.trim();
    if (!symbol || isLoading) return;

    const userMsg = {
      id: Date.now() + '-user',
      from: 'user',
      text: `🔍 Analyzing <strong>${symbol.toUpperCase()}</strong> ...`,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 300));

    try {
      const data = generateCryptoData(symbol);
      const result = analyze(data);

      const botMsg = {
        id: Date.now() + '-bot',
        from: 'bot',
        text: `📊 <strong>${data.symbol}</strong> · $${data.price}  (${data.timestamp})`,
        signal: result.signal,
        explanation: result.explanation,
        detailLine: result.detailLine,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + '-error',
          from: 'bot',
          text: `❌ Error analyzing ${symbol}. Try again.`,
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleQuickToken = (sym) => {
    setInputValue(sym);
    setTimeout(() => handleSend(), 50);
  };

  // -------- render helpers --------
  const renderMessage = (msg) => {
    const isBot = msg.from === 'bot';
    const avatarIcon = isBot ? 'fas fa-robot' : 'fas fa-user';
    const avatarBg = isBot ? 'bg-indigo-700/50' : 'bg-blue-600/60';

    let bubbleContent = msg.text;
    if (isBot && msg.signal) {
      const signalConfig = {
        BUY: {
          border: 'border-l-4 border-green-400',
          bg: 'bg-green-900/20',
          emoji: '🟢',
          text: 'text-green-300',
        },
        SELL: {
          border: 'border-l-4 border-red-400',
          bg: 'bg-red-900/20',
          emoji: '🔴',
          text: 'text-red-300',
        },
        HOLD: {
          border: 'border-l-4 border-yellow-400',
          bg: 'bg-yellow-900/20',
          emoji: '🟡',
          text: 'text-yellow-300',
        },
      };
      const config = signalConfig[msg.signal] || signalConfig.HOLD;

      bubbleContent = (
        <>
          <div className="mb-1">{msg.text}</div>
          <div className={`mt-2 rounded-lg p-3 ${config.bg} ${config.border}`}>
            <strong className={`text-lg ${config.text}`}>
              {config.emoji} {msg.signal}
            </strong>
            <div className="mt-1 text-sm text-gray-300">{msg.explanation}</div>
            <div className="mt-2 pt-2 text-xs text-gray-400 border-t border-gray-700/50">
              {msg.detailLine}
            </div>
          </div>
        </>
      );
    }

    return (
      <div
        key={msg.id}
        className={`flex items-start gap-3 mb-4 ${
          isBot ? 'justify-start' : 'justify-end'
        }`}
      >
        {isBot && (
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${avatarBg} flex-shrink-0 shadow-lg`}>
            <i className={avatarIcon}></i>
          </div>
        )}
        <div
          className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-lg ${
            isBot
              ? 'bg-gray-800/80 backdrop-blur-sm text-gray-100 rounded-tl-none border border-gray-700/30'
              : 'bg-blue-600/80 backdrop-blur-sm text-white rounded-tr-none border border-blue-400/30'
          }`}
        >
          {bubbleContent}
        </div>
        {!isBot && (
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${avatarBg} flex-shrink-0 shadow-lg`}>
            <i className={avatarIcon}></i>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950 overflow-hidden">
      {/* Sidebar - Full height */}
      <div className="h-full flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content - Full height */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Welcome Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4 flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome, hnmeer</h1>
            <p className="text-sm text-gray-400">hnmir4956@gmail.com - Role: user</p>
          </div>
        </div>

        {/* Main Content Area with Crypto Bot - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="w-full max-w-3xl mx-auto bg-gray-900/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50 p-6 md:p-8">
            {/* Chat Messages */}
            <div className="h-[400px] overflow-y-auto mb-6 pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              {messages.map(renderMessage)}
              {isLoading && (
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-indigo-700/50 flex items-center justify-center text-white flex-shrink-0 shadow-lg">
                    <i className="fas fa-robot"></i>
                  </div>
                  <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl rounded-tl-none px-4 py-3 border border-gray-700/30">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex items-center gap-2 bg-gray-800/80 rounded-full border border-gray-700/50 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/30 transition-all p-1 pl-5">
              <input
                ref={inputRef}
                type="text"
                placeholder="e.g. BTC, ETH, SOL, DOGE..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none py-2.5 disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !inputValue.trim()}
                className="w-11 h-11 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>

            {/* Quick Tokens */}
            <div className="flex flex-wrap gap-2 mt-4">
              {['BTC', 'ETH', 'SOL', 'DOGE', 'ADA', 'AVAX'].map((sym) => (
                <button
                  key={sym}
                  onClick={() => handleQuickToken(sym)}
                  className="px-4 py-1.5 text-sm font-medium text-gray-300 bg-gray-800/60 hover:bg-gray-700/60 rounded-full border border-gray-700/50 hover:border-gray-600 transition-all"
                >
                  {sym}
                </button>
              ))}
            </div>

            {/* Status Info */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700/50">
              <div className="flex gap-4 text-xs text-gray-500">
                <span>
                  <i className="fas fa-database mr-1"></i> simulated current data
                </span>
                <span>
                  <i className="fas fa-clock mr-1"></i> real-time analysis
                </span>
              </div>
              <div className="text-xs text-gray-500">
                <i className="fas fa-shield-alt mr-1"></i> AI-powered insights
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
=======
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
    <div className="min-h-screen bg-[#050b16] text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen">
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
>>>>>>> 901084fcfd99cb2b2a13df805ad65fc5833bda41:Code/frontend/src/pages/Cryptobot.jsx
