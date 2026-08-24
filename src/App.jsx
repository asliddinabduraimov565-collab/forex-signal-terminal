import React, { useState, useEffect, useRef } from "react";

const PAIRS = [
  { id: "EURUSD", name: "EUR/USD", symbol: "FX:EURUSD" },
  { id: "GBPUSD", name: "GBP/USD", symbol: "FX:GBPUSD" },
  { id: "USDJPY", name: "USD/JPY", symbol: "FX:USDJPY" },
  { id: "AUDUSD", name: "AUD/USD", symbol: "FX:AUDUSD" },
  { id: "USDCAD", name: "USD/CAD", symbol: "FX:USDCAD" },
  { id: "USDCHF", name: "USD/CHF", symbol: "FX:USDCHF" },
  { id: "XAUUSD", name: "XAU/USD (Gold)", symbol: "OANDA:XAUUSD" },
];

export default function App() {
  const [selectedPair, setSelectedPair] = useState(PAIRS[0]);
  const containerRef = useRef();

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: selectedPair.symbol,
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

  return (
    <div style={{ padding: "20px", background: "#0b0e14", color: "#fff", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <h2>Forex Real-Time Trading Terminal</h2>

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

      <div style={{ height: "600px", width: "100%", background: "#131722", borderRadius: "8px", overflow: "hidden" }}>
        <div className="tradingview-widget-container" ref={containerRef} style={{ height: "100%", width: "100%" }}></div>
      </div>
    </div>
  );
}
