import { useState, useEffect, useCallback, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Newspaper,
  AlertTriangle,
  ExternalLink,
  Clock,
  Activity,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Data sources (no API key required, CORS-enabled)                    */
/*  - Rates & history: currencyexchangetool.com (live, Yahoo Finance)  */
/*  - News: rss2json.com proxying public forex/finance RSS feeds       */
/* ------------------------------------------------------------------ */

const RATES_API = "https://www.currencyexchangetool.com/api/v1";
const GOLD_API = "https://xaus.com/api/v1";
const NEWS_FEEDS = [
  "https://www.forexlive.com/feed/news",
  "https://www.babypips.com/feed.rss",
  "https://www.investing.com/rss/news_1.rss",
];

const CCY_NAMES = {
  EUR: "Yevro",
  USD: "AQSH dollari",
  GBP: "Funt sterling",
  JPY: "Yaponiya iyenasi",
  CHF: "Shveytsariya franki",
  AUD: "Avstraliya dollari",
  CAD: "Kanada dollari",
  NZD: "Yangi Zelandiya dollari",
  XAU: "Oltin",
};

const PAIRS = [
  { base: "EUR", quote: "USD" },
  { base: "GBP", quote: "USD" },
  { base: "USD", quote: "JPY" },
  { base: "USD", quote: "CHF" },
  { base: "AUD", quote: "USD" },
  { base: "USD", quote: "CAD" },
  { base: "NZD", quote: "USD" },
  { base: "EUR", quote: "GBP" },
  { base: "EUR", quote: "JPY" },
  { base: "GBP", quote: "JPY" },
  { base: "XAU", quote: "USD" },
].map((p) => ({
  ...p,
  key: p.base + p.quote,
  label: `${p.base}/${p.quote}`,
  name: `${CCY_NAMES[p.base]} / ${CCY_NAMES[p.quote]}`,
}));

const COLORS = {
  bg: "#0B1220",
  panel: "#121B2E",
  panelAlt: "#161F35",
  border: "rgba(201,162,39,0.18)",
  gold: "#C9A227",
  goldSoft: "#D9C070",
  text: "#EDEAE2",
  textMuted: "#8B93A7",
  positive: "#34B389",
  negative: "#E2574C",
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatRate(v) {
  if (v == null || Number.isNaN(v)) return "—";
  return v >= 10 ? v.toFixed(3) : v.toFixed(5);
}

function pctString(v) {
  if (v == null || Number.isNaN(v)) return null;
  return `${v >= 0 ? "▲" : "▼"} ${Math.abs(v).toFixed(2)}%`;
}

function sma(arr, period) {
  if (arr.length < period) return null;
  const slice = arr.slice(arr.length - period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

function emaSeries(arr, period) {
  if (arr.length === 0) return [];
  const k = 2 / (period + 1);
  const out = [arr[0]];
  for (let i = 1; i < arr.length; i++) out.push(arr[i] * k + out[i - 1] * (1 - k));
  return out;
}

function rsi(arr, period = 14) {
  if (arr.length < period + 1) return null;
  let gains = 0,
    losses = 0;
  for (let i = arr.length - period; i < arr.length; i++) {
    const diff = arr[i] - arr[i - 1];
    if (diff >= 0) gains += diff;
    else losses += -diff;
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

function stdevReturns(arr) {
  if (arr.length < 2) return 0;
  const rets = [];
  for (let i = 1; i < arr.length; i++) rets.push((arr[i] - arr[i - 1]) / arr[i - 1]);
  const mean = rets.reduce((a, b) => a + b, 0) / rets.length;
  const variance = rets.reduce((a, b) => a + (b - mean) ** 2, 0) / rets.length;
  return Math.sqrt(variance);
}

function atrSeries(closes, period = 14) {
  if (!closes || closes.length < period + 1) return null;
  const ranges = [];
  for (let i = 1; i < closes.length; i++) ranges.push(Math.abs(closes[i] - closes[i - 1]));
  const slice = ranges.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / slice.length;
}

function computeIndicators(closes) {
  if (!closes || closes.length < 30) return null;
  const sma5 = sma(closes, 5);
  const sma20 = sma(closes, 20);
  const sma50 = sma(closes, 50);
  const rsi14 = rsi(closes, 14);
  const ema12 = emaSeries(closes, 12);
  const ema26 = emaSeries(closes, 26);
  const macdSeries = closes.map((_, i) => ema12[i] - ema26[i]);
  const signalSeries = emaSeries(macdSeries, 9);
  const macdLine = macdSeries[macdSeries.length - 1];
  const signalLine = signalSeries[signalSeries.length - 1];
  const atr14 = atrSeries(closes, 14);
  const volatility = stdevReturns(closes.slice(-30)) || 0.004;
  const lookback = closes.slice(-20);
  const resistance = Math.max(...lookback);
  const support = Math.min(...lookback);
  return { sma5, sma20, sma50, rsi14, macdLine, signalLine, atr14, volatility, support, resistance };
}

function computeSignal(ind, currentPrice) {
  if (!ind || currentPrice == null)
    return { type: "HOLD", confidence: 0, reasons: ["Tahlil uchun yetarli tarixiy ma'lumot yo'q"] };

  const { sma5, sma20, sma50, rsi14, macdLine, signalLine, atr14, volatility, support, resistance } = ind;
  let score = 0;
  const reasons = [];
  const maxScore = 6;

  if (sma5 != null && sma20 != null) {
    if (sma5 > sma20) { score += 1; reasons.push("SMA5 > SMA20 — qisqa trend BUY tomonda"); }
    else { score -= 1; reasons.push("SMA5 < SMA20 — qisqa trend SELL tomonda"); }
  }
  if (sma20 != null && sma50 != null) {
    if (sma20 > sma50) { score += 1; reasons.push("SMA20 > SMA50 — asosiy trend bullish"); }
    else { score -= 1; reasons.push("SMA20 < SMA50 — asosiy trend bearish"); }
  }
  if (rsi14 != null) {
    if (rsi14 >= 52 && rsi14 <= 68) { score += 1; reasons.push(`RSI ${rsi14.toFixed(0)} — bullish momentum`); }
    else if (rsi14 >= 32 && rsi14 < 48) { score -= 1; reasons.push(`RSI ${rsi14.toFixed(0)} — bearish momentum`); }
    else if (rsi14 < 30) { score += 1; reasons.push(`RSI ${rsi14.toFixed(0)} — oversold, reversal ehtimoli`); }
    else if (rsi14 > 70) { score -= 1; reasons.push(`RSI ${rsi14.toFixed(0)} — overbought, pullback ehtimoli`); }
    else reasons.push(`RSI ${rsi14.toFixed(0)} — neytral zona`);
  }
  if (macdLine != null && signalLine != null) {
    if (macdLine > signalLine) { score += 1; reasons.push("MACD > Signal — bullish momentum"); }
    else { score -= 1; reasons.push("MACD < Signal — bearish momentum"); }
  }
  if (currentPrice > resistance * 0.998) { score += 1; reasons.push("Narx 20-period resistance yaqinida/breakout zonada"); }
  else if (currentPrice < support * 1.002) { score -= 1; reasons.push("Narx 20-period support yaqinida/breakdown zonada"); }
  else if (currentPrice > (support + resistance) / 2) reasons.push("Narx range o'rtasidan yuqorida");
  else reasons.push("Narx range o'rtasidan pastda");

  let type = "HOLD";
  if (score >= 4) type = "BUY";
  else if (score <= -4) type = "SELL";

  const confidence = Math.min(95, Math.max(0, Math.round((Math.abs(score) / maxScore) * 100)));
  let entry = null, stopLoss = null, tp1 = null, tp2 = null, tp3 = null;
  const riskUnit = Math.max(atr14 || currentPrice * volatility * 100, currentPrice * 0.0035);

  if (type === "BUY") {
    entry = currentPrice;
    stopLoss = Math.min(currentPrice - riskUnit * 1.25, support || currentPrice - riskUnit * 1.25);
    if (stopLoss >= entry) stopLoss = entry - riskUnit * 1.25;
    const risk = entry - stopLoss;
    tp1 = entry + risk * 1.0;
    tp2 = entry + risk * 2.0;
    tp3 = entry + risk * 3.0;
  } else if (type === "SELL") {
    entry = currentPrice;
    stopLoss = Math.max(currentPrice + riskUnit * 1.25, resistance || currentPrice + riskUnit * 1.25);
    if (stopLoss <= entry) stopLoss = entry + riskUnit * 1.25;
    const risk = stopLoss - entry;
    tp1 = entry - risk * 1.0;
    tp2 = entry - risk * 2.0;
    tp3 = entry - risk * 3.0;
  }

  const riskReward = entry && stopLoss && tp3 ? Math.abs(tp3 - entry) / Math.abs(entry - stopLoss) : null;
  return { type, confidence, entry, stopLoss, tp1, tp2, tp3, riskReward, reasons, score, support, resistance };
}

async function fetchRate(pair) {
  // XAU/USD uses a dedicated gold feed because the FX endpoint may not support XAU.
  if (pair.base === "XAU" && pair.quote === "USD") {
    const res = await fetch(`${GOLD_API}/spot?compact=1&fresh=${Date.now()}`);
    if (!res.ok) throw new Error("gold-rate");
    const data = await res.json();
    if (data.data_state?.status === "unavailable" || data.spot_usd_oz == null) throw new Error("gold-rate");
    return {
      rate: Number(data.spot_usd_oz),
      changePct24h: null,
      source: "XAUS",
      stale: Boolean(data.stale || data.data_state?.status === "stale"),
    };
  }

  const res = await fetch(`${RATES_API}/convert?amount=1&from=${pair.base}&to=${pair.quote}`);
  if (!res.ok) throw new Error("rate");
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "rate");
  return data;
}

async function fetchHistory(pair, days = 90) {
  // XAUS provides daily XAU/USD history directly and is CORS-enabled.
  if (pair.base === "XAU" && pair.quote === "USD") {
    const range = days <= 30 ? "1m" : days <= 180 ? "6m" : "1y";
    const res = await fetch(`${GOLD_API}/history?range=${range}&fresh=${Date.now()}`);
    if (!res.ok) throw new Error("gold-history");
    const data = await res.json();
    const points = Array.isArray(data.points) ? data.points : [];
    return points.map((d) => ({ date: d.d, rate: Number(d.c) })).filter((d) => Number.isFinite(d.rate));
  }

  const res = await fetch(`${RATES_API}/history?from=${pair.base}&to=${pair.quote}&days=${days}`);
  if (!res.ok) throw new Error("history");
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "history");
  return data.data || [];
}

async function fetchNews() {
  let lastErr = null;
  for (const feedUrl of NEWS_FEEDS) {
    try {
      const res = await fetch(
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}&count=8`
      );
      if (!res.ok) continue;
      const data = await res.json();
      if (data.status === "ok" && Array.isArray(data.items) && data.items.length > 0) {
        return data.items.map((it) => ({
          title: it.title,
          link: it.link,
          pubDate: it.pubDate,
          source: (data.feed && data.feed.title) || "Forex yangiliklari",
        }));
      }
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("news");
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return "";
  const diffMin = Math.round((Date.now() - d.getTime()) / 60000);
  if (diffMin < 1) return "hozirgina";
  if (diffMin < 60) return `${diffMin} daqiqa oldin`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `${diffH} soat oldin`;
  return `${Math.round(diffH / 24)} kun oldin`;
}

/* ------------------------------------------------------------------ */
/* Small UI pieces                                                     */
/* ------------------------------------------------------------------ */

function StatBox({ label, value, sub, color }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 10,
        padding: "10px 12px",
      }}
    >
      <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 4 }}>{label}</div>
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 16,
          fontWeight: 600,
          color: color || COLORS.text,
        }}
      >
        {value}
      </div>
      {sub && <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function TickerTape({ rates }) {
  const renderSet = (dup) =>
    PAIRS.map((p) => {
      const r = rates[p.key];
      const pct = r && r.changePct24h;
      const positive = pct != null && pct >= 0;
      return (
        <span
          key={p.key + dup}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginRight: 36,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 13,
          }}
        >
          <span style={{ color: COLORS.goldSoft, fontWeight: 600 }}>{p.label}</span>
          <span style={{ color: COLORS.text }}>{r && r.rate != null ? formatRate(r.rate) : "…"}</span>
          {pct != null && (
            <span style={{ color: positive ? COLORS.positive : COLORS.negative }}>{pctString(pct)}</span>
          )}
        </span>
      );
    });

  return (
    <div
      style={{
        overflow: "hidden",
        background: COLORS.bg,
        borderBottom: `1px solid ${COLORS.border}`,
        padding: "10px 0",
        whiteSpace: "nowrap",
      }}
    >
      <div className="ticker-track">
        {renderSet("a")}
        {renderSet("b")}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export default function ForexSignalTerminal() {
  const [rates, setRates] = useState({});
  const [selectedKey, setSelectedKey] = useState("EURUSD");
  const [history, setHistory] = useState({ loading: true, error: null, dates: [], closes: [] });
  const [news, setNews] = useState({ loading: true, error: null, items: [] });
  const [lastUpdated, setLastUpdated] = useState(null);
  const selectedRef = useRef(selectedKey);
  selectedRef.current = selectedKey;

  const selectedPair = PAIRS.find((p) => p.key === selectedKey) || PAIRS[0];

  const loadRates = useCallback(async () => {
    const results = await Promise.all(
      PAIRS.map(async (p) => {
        try {
          const d = await fetchRate(p);
          return [p.key, { rate: d.rate, changePct24h: d.changePct24h, error: null }];
        } catch (e) {
          return [p.key, { rate: null, changePct24h: null, error: "xato" }];
        }
      })
    );
    setRates((prev) => {
      const next = { ...prev };
      results.forEach(([k, v]) => (next[k] = v));
      return next;
    });
    setLastUpdated(new Date());
  }, []);

  const loadHistory = useCallback(async (pair) => {
    setHistory((h) => ({ ...h, loading: true, error: null }));
    try {
      const data = await fetchHistory(pair, 90);
      if (selectedRef.current !== pair.key) return;
      setHistory({
        loading: false,
        error: null,
        dates: data.map((d) => d.date),
        closes: data.map((d) => d.rate),
      });
    } catch (e) {
      if (selectedRef.current !== pair.key) return;
      setHistory({ loading: false, error: "Tarixiy ma'lumotlarni yuklab bo'lmadi", dates: [], closes: [] });
    }
  }, []);

  const loadNews = useCallback(async () => {
    setNews((n) => ({ ...n, loading: true, error: null }));
    try {
      const items = await fetchNews();
      setNews({ loading: false, error: null, items });
    } catch (e) {
      setNews({ loading: false, error: "Yangiliklarni yuklab bo'lmadi", items: [] });
    }
  }, []);

  useEffect(() => {
    loadRates();
    loadNews();
    const ratesInterval = setInterval(loadRates, 45000);
    const newsInterval = setInterval(loadNews, 5 * 60000);
    return () => {
      clearInterval(ratesInterval);
      clearInterval(newsInterval);
    };
  }, [loadRates, loadNews]);

  useEffect(() => {
    loadHistory(selectedPair);
    const histInterval = setInterval(() => loadHistory(selectedPair), 5 * 60000);
    return () => clearInterval(histInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey]);

  const currentRateInfo = rates[selectedKey];
  const indicators = !history.loading && !history.error ? computeIndicators(history.closes) : null;
  const currentPrice =
    (currentRateInfo && currentRateInfo.rate) ||
    (history.closes.length ? history.closes[history.closes.length - 1] : null);
  const signal = computeSignal(indicators, currentPrice);
  const chartData = history.dates.map((d, i) => ({
    date: d.slice(5),
    rate: history.closes[i],
  }));

  const refreshAll = () => {
    loadRates();
    loadHistory(selectedPair);
    loadNews();
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        .ticker-track { display: inline-block; animation: ticker-scroll 38s linear infinite; }
        @keyframes ticker-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .fst-grid { display: grid; grid-template-columns: 280px 1fr; gap: 20px; }
        @media (max-width: 780px) {
          .fst-grid { grid-template-columns: 1fr; }
          .fst-stats { grid-template-columns: 1fr !important; }
        }
        .fst-pair-row:hover { background: rgba(201,162,39,0.08) !important; }
        .fst-news-link:hover { color: ${COLORS.gold} !important; }
        .fst-refresh:hover { opacity: 0.8; }
        a { text-decoration: none; }
      `}</style>

      <TickerTape rates={rates} />

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 18px 64px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Activity size={26} color={COLORS.gold} />
              <h1
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 26,
                  fontWeight: 700,
                  margin: 0,
                  letterSpacing: 0.3,
                }}
              >
                Forex Signal Terminal
              </h1>
            </div>
            <p style={{ color: COLORS.textMuted, fontSize: 14, marginTop: 6, maxWidth: 560 }}>
              Asosiy valyuta juftliklari va <strong style={{ color: COLORS.goldSoft }}>XAU/USD oltin</strong> bo'yicha jonli kurslar, texnik tahlil va avtomatik savdo signallari
            </p>
          </div>
          <button
            onClick={refreshAll}
            className="fst-refresh"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: COLORS.panel,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 8,
              padding: "10px 16px",
              color: COLORS.text,
              cursor: "pointer",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12,
            }}
          >
            <RefreshCw size={14} />
            Yangilash
            {lastUpdated && (
              <span style={{ color: COLORS.textMuted }}>
                · {lastUpdated.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </button>
        </div>

        {/* Disclaimer stamp */}
        <div
          style={{
            marginTop: 20,
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
            border: `1px dashed ${COLORS.border}`,
            borderRadius: 10,
            padding: "12px 14px",
            background: "rgba(201,162,39,0.05)",
          }}
        >
          <AlertTriangle size={16} color={COLORS.gold} style={{ marginTop: 2, flexShrink: 0 }} />
          <p style={{ margin: 0, fontSize: 12.5, color: COLORS.textMuted, lineHeight: 1.6 }}>
            Bu sahifadagi signallar oddiy texnik indikatorlar (SMA, RSI, MACD) asosida avtomatik hisoblanadi va{" "}
            <strong style={{ color: COLORS.goldSoft }}>moliyaviy maslahat emas</strong>. Kurslar va yangiliklar ochiq
            manbalardan olinadi, kechikish yoki xatoliklar bo'lishi mumkin. Real pul bilan savdo qilishdan oldin
            albatta o'zingiz qo'shimcha tahlil qiling va xavflarni baholang.
          </p>
        </div>

        {/* Watchlist + Detail */}
        <div className="fst-grid" style={{ marginTop: 24 }}>
          <div
            style={{
              background: COLORS.panel,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              padding: 10,
              alignSelf: "start",
            }}
          >
            <div style={{ fontSize: 11, color: COLORS.textMuted, padding: "6px 10px", letterSpacing: 0.5 }}>
              KUZATUV RO'YXATI
            </div>
            {PAIRS.map((p) => {
              const r = rates[p.key];
              const pct = r && r.changePct24h;
              const positive = pct != null && pct >= 0;
              const active = p.key === selectedKey;
              return (
                <div
                  key={p.key}
                  className="fst-pair-row"
                  onClick={() => setSelectedKey(p.key)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 10px",
                    borderRadius: 8,
                    cursor: "pointer",
                    background: active ? "rgba(201,162,39,0.12)" : "transparent",
                    borderLeft: active ? `3px solid ${COLORS.gold}` : "3px solid transparent",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{p.label}</div>
                    <div style={{ fontSize: 10.5, color: COLORS.textMuted }}>{p.name}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}>
                      {r && r.rate != null ? formatRate(r.rate) : "…"}
                    </div>
                    {pct != null && (
                      <div style={{ fontSize: 11, color: positive ? COLORS.positive : COLORS.negative }}>
                        {pctString(pct)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div
              style={{
                background: COLORS.panel,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                padding: 20,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700 }}>
                    {selectedPair.label}
                  </div>
                  <div style={{ fontSize: 12.5, color: COLORS.textMuted }}>{selectedPair.name}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 24, fontWeight: 600 }}>
                    {currentPrice != null ? formatRate(currentPrice) : "…"}
                  </div>
                  {currentRateInfo && currentRateInfo.changePct24h != null && (
                    <div
                      style={{
                        fontSize: 12.5,
                        color: currentRateInfo.changePct24h >= 0 ? COLORS.positive : COLORS.negative,
                      }}
                    >
                      {pctString(currentRateInfo.changePct24h)} (24 soat)
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: 18, height: 260 }}>
                {history.loading ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: COLORS.textMuted, fontSize: 13 }}>
                    Grafik yuklanmoqda…
                  </div>
                ) : history.error ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: COLORS.negative, fontSize: 13 }}>
                    {history.error}
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 6, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: COLORS.textMuted, fontSize: 10 }}
                        tickLine={false}
                        axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                        minTickGap={40}
                      />
                      <YAxis
                        domain={["auto", "auto"]}
                        tick={{ fill: COLORS.textMuted, fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                        width={58}
                        tickFormatter={(v) => formatRate(v)}
                      />
                      <Tooltip
                        contentStyle={{ background: COLORS.panelAlt, border: `1px solid ${COLORS.border}`, borderRadius: 8 }}
                        labelStyle={{ color: COLORS.textMuted, fontSize: 11 }}
                        itemStyle={{ color: COLORS.text, fontSize: 12 }}
                        formatter={(v) => [formatRate(v), "Kurs"]}
                      />
                      <Line type="monotone" dataKey="rate" stroke={COLORS.gold} strokeWidth={2} dot={false} />
                      {signal.entry != null && (
                        <ReferenceLine y={signal.entry} stroke={COLORS.text} strokeDasharray="3 3" />
                      )}
                      {signal.stopLoss != null && (
                        <ReferenceLine y={signal.stopLoss} stroke={COLORS.negative} strokeDasharray="3 3" />
                      )}
                      {signal.tp1 != null && <ReferenceLine y={signal.tp1} stroke={COLORS.positive} strokeDasharray="2 3" />}
                      {signal.tp2 != null && <ReferenceLine y={signal.tp2} stroke={COLORS.positive} strokeDasharray="4 3" />}
                      {signal.tp3 != null && <ReferenceLine y={signal.tp3} stroke={COLORS.positive} strokeDasharray="7 3" />}
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Signal card */}
            {(() => {
              const color = signal.type === "BUY" ? COLORS.positive : signal.type === "SELL" ? COLORS.negative : COLORS.textMuted;
              const label = signal.type === "BUY" ? "SOTIB OLISH" : signal.type === "SELL" ? "SOTISH" : "KUZATIB TURISH";
              const Icon = signal.type === "BUY" ? TrendingUp : signal.type === "SELL" ? TrendingDown : Minus;
              return (
                <div
                  style={{
                    border: `1px solid ${color}55`,
                    background: `${color}14`,
                    borderRadius: 12,
                    padding: 20,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Icon size={22} color={color} />
                      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 19, color }}>
                        {label}
                      </span>
                    </div>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, color: COLORS.textMuted }}>
                      Signal ishonchi: {signal.confidence}%
                    </span>
                  </div>

                  {signal.type !== "HOLD" && (
                    <div className="fst-stats" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 16 }}>
                      <StatBox label="Kirish" value={formatRate(signal.entry)} />
                      <StatBox label="Stop-Loss" value={formatRate(signal.stopLoss)} color={COLORS.negative} />
                      <StatBox label="TP1 · 1R" value={formatRate(signal.tp1)} color={COLORS.positive} />
                      <StatBox label="TP2 · 2R" value={formatRate(signal.tp2)} color={COLORS.positive} />
                      <StatBox label="TP3 · 3R" value={formatRate(signal.tp3)} color={COLORS.positive} />
                      <StatBox label="Risk / Reward" value={signal.riskReward ? `1 : ${signal.riskReward.toFixed(1)}` : "—"} />
                    </div>
                    <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
                      <StatBox label="Support" value={formatRate(signal.support)} />
                      <StatBox label="Resistance" value={formatRate(signal.resistance)} />
                    </div>
                  )}

                  <ul style={{ marginTop: 16, paddingLeft: 18, fontSize: 13, color: "#B7BECF", lineHeight: 1.75 }}>
                    {signal.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              );
            })()}
          </div>
        </div>

        {/* News */}
        <div style={{ marginTop: 30 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Newspaper size={18} color={COLORS.gold} />
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, margin: 0 }}>
              Bozor yangiliklari
            </h2>
          </div>
          <div
            style={{
              background: COLORS.panel,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              padding: 6,
            }}
          >
            {news.loading ? (
              <div style={{ padding: 20, color: COLORS.textMuted, fontSize: 13, textAlign: "center" }}>
                Yangiliklar yuklanmoqda…
              </div>
            ) : news.error ? (
              <div style={{ padding: 20, textAlign: "center" }}>
                <div style={{ color: COLORS.negative, fontSize: 13, marginBottom: 10 }}>{news.error}</div>
                <button
                  onClick={loadNews}
                  style={{
                    background: "transparent",
                    border: `1px solid ${COLORS.border}`,
                    color: COLORS.text,
                    borderRadius: 8,
                    padding: "8px 14px",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  Qayta urinish
                </button>
              </div>
            ) : (
              news.items.map((it, i) => (
                <a
                  key={i}
                  href={it.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fst-news-link"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    borderBottom: i < news.items.length - 1 ? `1px solid ${COLORS.border}` : "none",
                    color: COLORS.text,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13.5, lineHeight: 1.5 }}>{it.title}</div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 11,
                        color: COLORS.textMuted,
                        marginTop: 4,
                      }}
                    >
                      <Clock size={11} />
                      {timeAgo(it.pubDate)} · {it.source}
                    </div>
                  </div>
                  <ExternalLink size={14} color={COLORS.textMuted} style={{ flexShrink: 0 }} />
                </a>
              ))
            )}
          </div>
        </div>

        <div style={{ marginTop: 30, fontSize: 11, color: COLORS.textMuted, textAlign: "center", lineHeight: 1.7 }}>
          Kurslar manbasi: currencyexchangetool.com (Forex) · XAU/USD oltin: XAUS Gold Data API · Yangiliklar: ForexLive / BabyPips / Investing.com
          <br />
          Bu vosita ta'lim maqsadida yaratilgan bo'lib, hech qanday moliyaviy kafolat bermaydi.
        </div>
      </div>
    </div>
  );
    }
