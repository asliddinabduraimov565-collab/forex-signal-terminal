import { useState, useEffect, useCallback } from "react";
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

/* -------------------------------------------------------------------------- */
/*  Data sources                                                              */
/* -------------------------------------------------------------------------- */
const PAIRS = [
  { id: "EURUSD", name: "EUR/USD", symbol: "EURUSD=X" },
  { id: "GBPUSD", name: "GBP/USD", symbol: "GBPUSD=X" },
  { id: "USDJPY", name: "USD/JPY", symbol: "JPY=X" },
  { id: "AUDUSD", name: "AUD/USD", symbol: "AUDUSD=X" },
  { id: "USDCAD", name: "USD/CAD", symbol: "CAD=X" },
  { id: "USDCHF", name: "USD/CHF", symbol: "CHF=X" },
  { id: "XAUUSD", name: "XAU/USD (Gold)", symbol: "GC=F" },
];

const COLORS = {
  bg: "#0B0E14",
  card: "#151923",
  cardBorder: "#232A3B",
  accent: "#2962FF",
  positive: "#00E676",
  negative: "#FF5252",
  textPrimary: "#FFFFFF",
  textSecondary: "#8A94A6",
  gold: "#FFD700",
};

export default function App() {
  const [selectedPair, setSelectedPair] = useState(PAIRS[0]);
  const [rateData, setRateData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Rates
      const resRate = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${selectedPair.symbol}?range=5d&interval=15m`
      );
      const dataRate = await resRate.json();
      const result = dataRate.chart?.result?.[0];

      if (result) {
        const quote = result.indicators.quote[0];
        const timestamps = result.timestamp || [];
        const formattedChart = timestamps
          .map((t, idx) => ({
            time: new Date(t * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            price: quote.close[idx],
          }))
          .filter((item) => item.price != null);

        setChartData(formattedChart);

        const meta = result.meta;
        const currentPrice = meta.regularMarketPrice;
        const prevClose = meta.chartPreviousClose || meta.previousClose;
        const change = currentPrice - prevClose;
        const changePercent = (change / prevClose) * 100;

        setRateData({
          price: currentPrice,
          change,
          changePercent,
          high: meta.regularMarketDayHigh,
          low: meta.regularMarketDayLow,
        });
      }

      // News RSS
      const resNews = await fetch(
        `https://api.rss2json.com/v1/api.json?rss_url=https://www.forexlive.com/feed/news`
      );
      const dataNews = await resNews.json();
      if (dataNews.status === "ok") {
        setNews(dataNews.items.slice(0, 5));
      }

      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedPair]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Signal Generator Logic
  const generateSignal = () => {
    if (!rateData || chartData.length < 10) return null;

    const prices = chartData.map((d) => d.price);
    const current = rateData.price;
    const ma = prices.reduce((a, b) => a + b, 0) / prices.length;
    const high = Math.max(...prices);
    const low = Math.min(...prices);

    let type = "NEUTRAL";
    let entry = current;
    let stopLoss = 0;
    let tp1 = 0;
    let tp2 = 0;
    let tp3 = 0;
    let reasons = [];

    const diff = current - ma;
    const spread = (high - low) * 0.15;

    if (diff > 0) {
      type = "BUY";
      stopLoss = low - spread;
      const risk = entry - stopLoss;
      tp1 = entry + risk * 1.0;
      tp2 = entry + risk * 2.0;
      tp3 = entry + risk * 3.0;
      reasons.push("Нарх ҳаракатланаётган ўртача кўрсаткичдан (MA) юқорида");
      reasons.push("Юқорига йўналтирилган импульс ва харидорлар фаоллиги");
    } else if (diff < 0) {
      type = "SELL";
      stopLoss = high + spread;
      const risk = stopLoss - entry;
      tp1 = entry - risk * 1.0;
      tp2 = entry - risk * 2.0;
      tp3 = entry - risk * 3.0;
      reasons.push("Нарх ҳаракатланаётган ўртача кўрсаткичдан (MA) пастда");
      reasons.push("Пастга йўналтирилган босим ва сотувчилар фаоллиги");
    }

    const riskReward = stopLoss !== 0 ? Math.abs((tp1 - entry) / (entry - stopLoss)) : 0;

    return {
      type,
      entry,
      stopLoss,
      tp1,
      tp2,
      tp3,
      riskReward,
      support: low,
      resistance: high,
      reasons,
    };
  };

  const signal = generateSignal();

  const formatRate = (val) => {
    if (val == null) return "-";
    return selectedPair.id.includes("JPY") || selectedPair.id.includes("XAU")
      ? val.toFixed(2)
      : val.toFixed(5);
  };

  return (
    <div style={{ backgroundColor: COLORS.bg, color: COLORS.textPrimary, minHeight: "100vh", fontFamily: "Inter, sans-serif", padding: "20px" }}>
      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, borderBottom: `1px solid ${COLORS.cardBorder}`, paddingBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Activity color={COLORS.accent} size={32} />
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: "bold" }}>Forex Signal Terminal</h1>
            <p style={{ margin: 0, fontSize: 13, color: COLORS.textSecondary }}>Бозор таҳлили ва реал вақтдаги сигналлар</p>
          </div>
        </div>
        <button onClick={fetchData} style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, color: COLORS.textPrimary, padding: "8px 16px", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <RefreshCw size={16} className={loading ? "spin" : ""} /> Янгилаш
        </button>
      </header>

      {/* Pair Selectors */}
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 12, marginBottom: 20 }}>
        {PAIRS.map((pair) => (
          <button
            key={pair.id}
            onClick={() => setSelectedPair(pair)}
            style={{
              backgroundColor: selectedPair.id === pair.id ? COLORS.accent : COLORS.card,
              color: COLORS.textPrimary,
              border: `1px solid ${selectedPair.id === pair.id ? COLORS.accent : COLORS.cardBorder}`,
              borderRadius: 8,
              padding: "10px 18px",
              fontWeight: "600",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {pair.name}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
        {/* Left Column: Chart & Market Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 12, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 24 }}>{selectedPair.name}</h2>
                {rateData && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                    <span style={{ fontSize: 28, fontWeight: "bold" }}>{formatRate(rateData.price)}</span>
                    <span style={{ color: rateData.change >= 0 ? COLORS.positive : COLORS.negative, fontWeight: "600", display: "flex", alignItems: "center" }}>
                      {rateData.change >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                      {rateData.change >= 0 ? "+" : ""}{rateData.changePercent.toFixed(2)}%
                    </span>
                  </div>
                )}
              </div>
              <div style={{ textAlign: "right", color: COLORS.textSecondary, fontSize: 12 }}>
                <Clock size={14} style={{ marginRight: 4, verticalAlign: "middle" }} />
                {lastUpdated || "--:--"}
              </div>
            </div>

            {/* Chart */}
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#232A3B" />
                  <XAxis dataKey="time" stroke={COLORS.textSecondary} fontSize={12} />
                  <YAxis domain={["auto", "auto"]} stroke={COLORS.textSecondary} fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: COLORS.card, borderColor: COLORS.cardBorder }} />
                  <Line type="monotone" dataKey="price" stroke={COLORS.accent} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Signal Card */}
        <div>
          <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 12, padding: 20 }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: 18, color: COLORS.textSecondary }}>Техник Сигнал</h3>
            {signal ? (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 12, borderRadius: 8, backgroundColor: signal.type === "BUY" ? "rgba(0,230,118,0.1)" : signal.type === "SELL" ? "rgba(255,82,82,0.1)" : "rgba(255,255,255,0.05)", marginBottom: 16 }}>
                  <span style={{ fontSize: 22, fontWeight: "bold", color: signal.type === "BUY" ? COLORS.positive : signal.type === "SELL" ? COLORS.negative : COLORS.textSecondary }}>
                    {signal.type}
                  </span>
                  <span style={{ fontSize: 14, color: COLORS.textSecondary }}>15M ТФ</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                  <StatBox label="Кириш" value={formatRate(signal.entry)} />
                  <StatBox label="Stop-Loss" value={formatRate(signal.stopLoss)} color={COLORS.negative} />
                  <StatBox label="TP1 (1R)" value={formatRate(signal.tp1)} color={COLORS.positive} />
                  <StatBox label="TP2 (2R)" value={formatRate(signal.tp2)} color={COLORS.positive} />
                  <StatBox label="TP3 (3R)" value={formatRate(signal.tp3)} color={COLORS.positive} />
                  <StatBox label="Risk / Reward" value={signal.riskReward ? `1 : ${signal.riskReward.toFixed(1)}` : "-"} />
                </div>

                <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
                  <StatBox label="Support" value={formatRate(signal.support)} />
                  <StatBox label="Resistance" value={formatRate(signal.resistance)} />
                </div>

                <ul style={{ marginTop: 16, paddingLeft: 18, color: "#B7BECF", lineHeight: 1.75 }}>
                  {signal.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p style={{ color: COLORS.textSecondary }}>Сигнал ҳисобланмоқда...</p>
            )}
          </div>
        </div>
      </div>

      {/* News Section */}
      <div style={{ marginTop: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Newspaper size={18} color={COLORS.gold} />
          <h2 style={{ fontSize: 17, margin: 0, fontFamily: "Space Grotesk, sans-serif" }}>Бозор Янгиликлари</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {news.map((item, idx) => (
            <a key={idx} href={item.link} target="_blank" rel="noreferrer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, backgroundColor: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 8, color: COLORS.textPrimary, textDecoration: "none" }}>
              <span style={{ fontSize: 14 }}>{item.title}</span>
              <ExternalLink size={14} color={COLORS.textSecondary} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, color }) {
  return (
    <div style={{ backgroundColor: "#0B0E14", padding: 10, borderRadius: 6, border: "1px solid #232A3B" }}>
      <div style={{ fontSize: 11, color: "#8A94A6", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: "bold", color: color || "#FFFFFF" }}>{value}</div>
    </div>
  );
}
