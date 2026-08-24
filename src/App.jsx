import React, { useState, useEffect, useCallback } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const PAIRS = [
  { id: "EURUSD", name: "EUR/USD", symbol: "EURUSD=X" },
  { id: "GBPUSD", name: "GBP/USD", symbol: "GBPUSD=X" },
  { id: "USDJPY", name: "USD/JPY", symbol: "JPY=X" },
  { id: "AUDUSD", name: "AUD/USD", symbol: "AUDUSD=X" },
  { id: "USDCAD", name: "USD/CAD", symbol: "CAD=X" },
  { id: "USDCHF", name: "USD/CHF", symbol: "CHF=X" },
  { id: "XAUUSD", name: "XAU/USD (Gold)", symbol: "GC=F" },
];

export default function App() {
  const [selectedPair, setSelectedPair] = useState(PAIRS[0]);
  const [rateData, setRateData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${selectedPair.symbol}?range=1d&interval=15m`;
      const resRate = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
      const dataJson = await resRate.json();
      const dataRate = JSON.parse(dataJson.contents);
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
            price: quote.close[idx] ? Number(quote.close[idx].toFixed(4)) : null,
          }))
          .filter((item) => item.price !== null);

        setChartData(formattedChart);

        const meta = result.meta;
        const currentPrice = meta.regularMarketPrice;
        const prevClose = meta.chartPreviousClose || meta.previousClose;
        const change = currentPrice - prevClose;
        const changePercent = (change / prevClose) * 100;

        // Генерация сигнала на основе изменения цены
        const signalType = change >= 0 ? "BUY (Сотиб олиш)" : "SELL (Сотиш)";
        const signalColor = change >= 0 ? "#26a69a" : "#ef5350";

        setRateData({
          price: currentPrice ? currentPrice.toFixed(4) : "N/A",
          change: change ? change.toFixed(4) : 0,
          changePercent: changePercent ? changePercent.toFixed(2) : 0,
          signalType,
          signalColor,
        });
      }

      const newsUrl = `https://api.rss2json.com/v1/api.json?rss_url=https://www.forexlive.com/feed/news`;
      const resNews = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(newsUrl)}`);
      const newsJson = await resNews.json();
      const dataNews = JSON.parse(newsJson.contents);
      if (dataNews.status === "ok") {
        setNews(dataNews.items.slice(0, 5));
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedPair]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div style={{ padding: "20px", background: "#0b0e14", color: "#fff", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <h2>Forex Signal Terminal</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        {PAIRS.map((pair) => (
          <button
            key={pair.id}
            onClick={() => setSelectedPair(pair)}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              background: selectedPair.id === pair.id ? "#2962ff" : "#1e222d",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {pair.name}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Маълумотлар юкланмоқда...</p>
      ) : (
        <div>
          {/* Сигнал панели */}
          <div style={{ background: "#1e222d", padding: "15px", borderRadius: "8px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "22px" }}>
                {selectedPair.name}: {rateData?.price}
              </h3>
              <span style={{ fontSize: "14px", color: rateData?.change >= 0 ? "#26a69a" : "#ef5350" }}>
                Ўзгариш: {rateData?.change >= 0 ? "+" : ""}{rateData?.change} ({rateData?.changePercent}%)
              </span>
            </div>
            <div style={{ background: rateData?.signalColor, padding: "10px 20px", borderRadius: "6px", fontWeight: "bold", fontSize: "16px" }}>
              Сигнал: {rateData?.signalType}
            </div>
          </div>

          <div style={{ height: "300px", width: "100%", background: "#131722", padding: "10px", borderRadius: "8px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <XAxis dataKey="time" stroke="#8a94a6" />
                <YAxis domain={["auto", "auto"]} stroke="#8a94a6" />
                <Tooltip />
                <Area type="monotone" dataKey="price" stroke="#2962ff" fill="#2962ff22" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={{ marginTop: "30px" }}>
            <h3>Бозор янгиликлари</h3>
            <ul style={{ paddingLeft: "20px" }}>
              {news.map((item, index) => (
                <li key={index} style={{ marginBottom: "10px" }}>
                  <a href={item.link} target="_blank" rel="noreferrer" style={{ color: "#2962ff", textDecoration: "none" }}>
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
