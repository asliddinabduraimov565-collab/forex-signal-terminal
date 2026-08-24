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
      // Rates fetch
      const resRate = await fetch(
        `https://corsproxy.io/?${encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${selectedPair.symbol}?range=5d&interval=15m`)}`
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
        });
      }

      // News fetch
      const resNews = await fetch(
        `https://corsproxy.io/?${encodeURIComponent(`https://api.rss2json.com/v1/api.json?rss_url=https://www.forexlive.com/feed/news`)}`
      );
      const dataNews = await resNews.json();
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
        <p>Юкланмоқда...</p>
      ) : (
        <div>
          <h3>{selectedPair.name}: {rateData?.price}</h3>
          <div style={{ height: "300px", width: "100%" }}>
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
            <ul>
              {news.map((item, index) => (
                <li key={index} style={{ marginBottom: "8px" }}>
                  <a href={item.link} target="_blank" rel="noreferrer" style={{ color: "#2962ff" }}>
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
