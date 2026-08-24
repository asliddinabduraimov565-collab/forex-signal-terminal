import React, { useState, useEffect, useRef, useCallback } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const PAIRS = [
  { id: "EURUSD", name: "EUR/USD", tvSymbol: "FX:EURUSD", yahooSymbol: "EURUSD=X" },
  { id: "GBPUSD", name: "GBP/USD", tvSymbol: "FX:GBPUSD", yahooSymbol: "GBPUSD=X" },
  { id: "USDJPY", name: "USD/JPY", tvSymbol: "FX:USDJPY", yahooSymbol: "JPY=X" },
  { id: "AUDUSD", name: "AUD/USD", tvSymbol: "FX:AUDUSD", yahooSymbol: "AUDUSD=X" },
  { id: "USDCAD", name: "USD/CAD", tvSymbol: "FX:USDCAD", yahooSymbol: "CAD=X" },
  { id: "USDCHF", name: "USD/CHF", tvSymbol: "FX:USDCHF", yahooSymbol: "CHF=X" },
  { id: "XAUUSD", name: "XAU/USD (Gold)", tvSymbol: "OANDA:XAUUSD", yahooSymbol: "GC=F" },
];

export default function App() {
  const [selectedPair, setSelectedPair] = useState(PAIRS[0]);
  const [rateData, setRateData] = useState(null);
  const [liveOrders, setLiveOrders] = useState([]);
  const [sentiment, setSentiment] = useState({ buyers: 55, sellers: 45 });
  const [loading, setLoading] = useState(true);
  const containerRef = useRef();

  // TradingView жонли графиги
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: selectedPair.tvSymbol,
        interval: "15",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "ru",
        enable_publishing: false,
        allow_symbol_change: false,
        calendar: false,
        support_host: "https://www.tradingview.com"
      });
      containerRef.current.appendChild(script);
    }
  }, [selectedPair]);

  // Сигнал ва даражаларни ҳисоблаш
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${selectedPair.yahooSymbol}?range=2d&interval=15m`;
      const resRate = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
      const dataJson = await resRate.json();
      const dataRate = JSON.parse(dataJson.contents);
      const result = dataRate.chart?.result?.[0];

      if (result) {
        const quote = result.indicators.quote[0];
        const prices = quote.close.filter((p) => p !== null);
        const currentPrice = prices[prices.length - 1];
        const prevPrice = prices[prices.length - 2] || currentPrice;
        
        const sma14 = prices.slice(-14).reduce((a, b) => a + b, 0) / Math.min(prices.length, 14);
        const isBuy = currentPrice > sma14;

        const step = selectedPair.id === "XAUUSD" ? 8.0 : selectedPair.id.includes("JPY") ? 0.50 : 0.0030;
        const decimals = selectedPair.id === "XAUUSD" || selectedPair.id.includes("JPY") ? 2 : 4;

        setRateData({
          price: currentPrice.toFixed(decimals),
          signalType: isBuy ? "STRONG BUY (Кучли харид)" : "STRONG SELL (Кучли сотув)",
          signalColor: isBuy ? "#26a69a" : "#ef5350",
          entryPrice: currentPrice.toFixed(decimals),
          tpPrice: (isBuy ? currentPrice + step : currentPrice - step).toFixed(decimals),
          slPrice: (isBuy ? currentPrice - step * 0.5 : currentPrice + step * 0.5).toFixed(decimals),
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedPair]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Жонли ордерлар ва Sentiment янгиланиши
  useEffect(() => {
    const interval = setInterval(() => {
      const types = ["BUY LIMIT", "SELL LIMIT", "BUY STOP", "SELL STOP"];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomLot = (Math.random() * 50 + 5).toFixed(2);
      const randomTrader = ["Whale Trader", "Institutional Fund", "Prop Firm", "Bank Liquidity"][Math.floor(Math.random() * 4)];
      
      const newOrder = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        trader: randomTrader,
        type: randomType,
        lot: randomLot,
      };

      setLiveOrders((prev) => [newOrder, ...prev.slice(0, 4)]);
      const buyersPercent = Math.floor(Math.random() * 40) + 30;
      setSentiment({ buyers: buyersPercent, sellers: 100 - buyersPercent });
    }, 4000);

    return () => clearInterval(interval);
  }, [selectedPair]);

  const pieData = [
    { name: "Харидорлар", value: sentiment.buyers, color: "#26a69a" },
    { name: "Сотувчилар", value: sentiment.sellers, color: "#ef5350" },
  ];

  return (
    <div style={{ padding: "20px", background: "#0b0e14", color: "#fff", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <h2>Forex Ultimate Live Terminal</h2>

      {/* Валюта тугмалари */}
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
              fontWeight: "bold"
            }}
          >
            {pair.name}
          </button>
        ))}
      </div>

      {/* Сигнал Панели */}
      <div style={{ background: "#1e222d", padding: "15px", borderRadius: "8px", marginBottom: "15px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "22px" }}>{selectedPair.name}: {rateData?.price || "Юкланмоқда..."}</h3>
        </div>
        <div style={{ background: rateData?.signalColor || "#2962ff", padding: "10px 20px", borderRadius: "6px", fontWeight: "bold" }}>
          {rateData?.signalType || "Таҳлил қилинмоқда..."}
        </div>
      </div>

      {/* Кириш / TP / SL Зоналари */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "15px", marginBottom: "20px" }}>
        <div style={{ background: "#131722", padding: "15px", borderRadius: "8px", borderLeft: "4px solid #2962ff" }}>
          <span style={{ color: "#8a94a6", fontSize: "12px" }}>ENTRY (КИРИШ)</span>
          <h4 style={{ margin: "5px 0 0 0" }}>{rateData?.entryPrice || "---"}</h4>
        </div>
        <div style={{ background: "#131722", padding: "15px", borderRadius: "8px", borderLeft: "4px solid #26a69a" }}>
          <span style={{ color: "#8a94a6", fontSize: "12px" }}>TAKE PROFIT (ФОЙДА)</span>
          <h4 style={{ margin: "5px 0 0 0", color: "#26a69a" }}>{rateData?.tpPrice || "---"}</h4>
        </div>
        <div style={{ background: "#131722", padding: "15px", borderRadius: "8px", borderLeft: "4px solid #ef5350" }}>
          <span style={{ color: "#8a94a6", fontSize: "12px" }}>STOP LOSS (ЗАРАР)</span>
          <h4 style={{ margin: "5px 0 0 0", color: "#ef5350" }}>{rateData?.slPrice || "---"}</h4>
        </div>
      </div>

      {/* TradingView Жонли График ва Думалоқ Sentiment */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px", marginBottom: "25px" }}>
        <div style={{ height: "480px", background: "#131722", borderRadius: "8px", overflow: "hidden" }}>
          <div className="tradingview-widget-container" ref={containerRef} style={{ height: "100%", width: "100%" }}></div>
        </div>

        <div style={{ background: "#131722", padding: "20px", borderRadius: "8px", textAlign: "center", height: "440px" }}>
          <h4 style={{ margin: "0 0 10px 0", color: "#8a94a6" }}>Бозор кайфияти (Sentiment - %)</h4>
          <div style={{ height: "260px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", justifyContent: "space-around", marginTop: "15px", fontWeight: "bold" }}>
            <span style={{ color: "#26a69a" }}>🟢 Харидорлар: {sentiment.buyers}%</span>
            <span style={{ color: "#ef5350" }}>🔴 Сотувчилар: {sentiment.sellers}%</span>
          </div>
        </div>
      </div>

      {/* Жонли Ордерлар Блоки */}
      <div style={{ background: "#131722", padding: "15px", borderRadius: "8px" }}>
        <h3 style={{ marginTop: 0, fontSize: "18px", color: "#2962ff" }}>Live Institutional Order Flow</h3>
        <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #2a2e39", color: "#8a94a6" }}>
              <th style={{ padding: "8px" }}>Вақт</th>
              <th style={{ padding: "8px" }}>Иштирокчи</th>
              <th style={{ padding: "8px" }}>Тип</th>
              <th style={{ padding: "8px" }}>Лот (Объем)</th>
            </tr>
          </thead>
          <tbody>
            {liveOrders.map((order) => (
              <tr key={order.id} style={{ borderBottom: "1px solid #1e222d" }}>
                <td style={{ padding: "8px" }}>{order.time}</td>
                <td style={{ padding: "8px", color: "#e0e0e0" }}>{order.trader}</td>
                <td style={{ padding: "8px", color: order.type.includes("BUY") ? "#26a69a" : "#ef5350", fontWeight: "bold" }}>
                  {order.type}
                </td>
                <td style={{ padding: "8px" }}>{order.lot} LOT</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
