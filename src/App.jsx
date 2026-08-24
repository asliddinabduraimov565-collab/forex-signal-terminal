import React, { useState, useEffect, useCallback } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

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
  const [liveOrders, setLiveOrders] = useState([]);
  const [sentiment, setSentiment] = useState({ buyers: 50, sellers: 50 });
  const [loading, setLoading] = useState(true);

  // Жонли ордерлар ва Sentiment (Харидор/Сотувчи фоизи) генерацияси
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
        pair: selectedPair.name,
      };

      setLiveOrders((prev) => [newOrder, ...prev.slice(0, 4)]);
      
      // Фоизларни жонли динамик ўзгартириб туриш
      const buyersPercent = Math.floor(Math.random() * 40) + 30; // 30% - 70%
      setSentiment({ buyers: buyersPercent, sellers: 100 - buyersPercent });
    }, 4000);

    return () => clearInterval(interval);
  }, [selectedPair]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${selectedPair.symbol}?range=5d&interval=1h`;
      const resRate = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
      const dataJson = await resRate.json();
      const dataRate = JSON.parse(dataJson.contents);
      const result = dataRate.chart?.result?.[0];

      if (result) {
        const quote = result.indicators.quote[0];
        const timestamps = result.timestamp || [];
        const prices = quote.close.filter((p) => p !== null);

        const formattedChart = timestamps
          .map((t, idx) => ({
            time: new Date(t * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            price: quote.close[idx] ? Number(quote.close[idx].toFixed(4)) : null,
          }))
          .filter((item) => item.price !== null);

        setChartData(formattedChart);

        const currentPrice = prices[prices.length - 1];
        const prevPrice = prices[prices.length - 2] || currentPrice;
        
        const sma14 = prices.slice(-14).reduce((a, b) => a + b, 0) / Math.min(prices.length, 14);
        
        const isBuy = currentPrice > sma14;
        const signalType = isBuy ? "STRONG BUY (Кучли харид)" : "STRONG SELL (Кучли сотув)";
        const signalColor = isBuy ? "#26a69a" : "#ef5350";

        const step = selectedPair.id === "XAUUSD" ? 8.0 : selectedPair.id.includes("JPY") ? 0.50 : 0.0030;
        const decimals = selectedPair.id === "XAUUSD" || selectedPair.id.includes("JPY") ? 2 : 4;

        setRateData({
          price: currentPrice.toFixed(decimals),
          change: (currentPrice - prevPrice).toFixed(decimals),
          signalType,
          signalColor,
          entryPrice: currentPrice.toFixed(decimals),
          tpPrice: (isBuy ? currentPrice + step : currentPrice - step).toFixed(decimals),
          slPrice: (isBuy ? currentPrice - step * 0.5 : currentPrice + step * 0.5).toFixed(decimals),
        });
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

  const pieData = [
    { name: "Харидорлар (Buyers)", value: sentiment.buyers, color: "#26a69a" },
    { name: "Сотувчилар (Sellers)", value: sentiment.sellers, color: "#ef5350" },
  ];

  return (
    <div style={{ padding: "20px", background: "#0b0e14", color: "#fff", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <h2>Forex Signal & Sentiment Terminal Pro</h2>

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
        <p>Бозор индикаторлари ва фоизлар аниқланмоқда...</p>
      ) : (
        <div>
          {/* Асосий савдо панели ва Сигнал */}
          <div style={{ background: "#1e222d", padding: "15px", borderRadius: "8px", marginBottom: "15px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "22px" }}>{selectedPair.name}: {rateData?.price}</h3>
            </div>
            <div style={{ background: rateData?.signalColor, padding: "10px 20px", borderRadius: "6px", fontWeight: "bold" }}>
              {rateData?.signalType}
            </div>
          </div>

          {/* Кириш/Чиқиш зоналари */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "15px", marginBottom: "20px" }}>
            <div style={{ background: "#131722", padding: "15px", borderRadius: "8px", borderLeft: "4px solid #2962ff" }}>
              <span style={{ color: "#8a94a6", fontSize: "12px" }}>ENTRY</span>
              <h4 style={{ margin: "5px 0 0 0" }}>{rateData?.entryPrice}</h4>
            </div>
            <div style={{ background: "#131722", padding: "15px", borderRadius: "8px", borderLeft: "4px solid #26a69a" }}>
              <span style={{ color: "#8a94a6", fontSize: "12px" }}>TAKE PROFIT</span>
              <h4 style={{ margin: "5px 0 0 0", color: "#26a69a" }}>{rateData?.tpPrice}</h4>
            </div>
            <div style={{ background: "#131722", padding: "15px", borderRadius: "8px", borderLeft: "4px solid #ef5350" }}>
              <span style={{ color: "#8a94a6", fontSize: "12px" }}>STOP LOSS</span>
              <h4 style={{ margin: "5px 0 0 0", color: "#ef5350" }}>{rateData?.slPrice}</h4>
            </div>
          </div>

          {/* График ва Думалоқ Sentiment Индикатори (Ёнма-ён) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginBottom: "25px" }}>
            
            {/* График */}
            <div style={{ height: "300px", background: "#131722", padding: "10px", borderRadius: "8px" }}>
              <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#8a94a6" }}>Нарх графиги (1H)</h4>
              <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={chartData}>
                  <XAxis dataKey="time" stroke="#8a94a6" />
                  <YAxis domain={["auto", "auto"]} stroke="#8a94a6" />
                  <Tooltip />
                  <Area type="monotone" dataKey="price" stroke="#2962ff" fill="#2962ff22" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Думалоқ Харидор / Сотувчи индикатори */}
            <div style={{ background: "#131722", padding: "15px", borderRadius: "8px", textAlign: "center" }}>
              <h4 style={{ margin: "0 0 10px 0", fontSize: "15px", color: "#8a94a6" }}>
                Бозор кайфияти (Sentiment - %): {selectedPair.name}
              </h4>
              <div style={{ height: "180px", width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={50} outerRadius={75} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: "flex", justifyContent: "space-around", marginTop: "10px", fontWeight: "bold" }}>
                <span style={{ color: "#26a69a" }}>🟢 Харидорлар: {sentiment.buyers}%</span>
                <span style={{ color: "#ef5350" }}>🔴 Сотувчилар: {sentiment.sellers}%</span>
              </div>
            </div>

          </div>

          {/* Институционал ордерлар блоки */}
          <div style={{ background: "#131722", padding: "15px", borderRadius: "8px" }}>
            <h3 style={{ marginTop: 0, fontSize: "18px", color: "#2962ff" }}>Live Order Flow (Жонли катта ордерлар)</h3>
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
      )}
    </div>
  );
}
