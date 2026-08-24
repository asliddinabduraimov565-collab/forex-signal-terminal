import React, { useState, useEffect, useRef } from "react";

const PAIRS = [
  { id: "EURUSD", name: "EUR/USD", tvSymbol: "FX:EURUSD" },
  { id: "GBPUSD", name: "GBP/USD", tvSymbol: "FX:GBPUSD" },
  { id: "USDJPY", name: "USD/JPY", tvSymbol: "FX:USDJPY" },
  { id: "AUDUSD", name: "AUD/USD", tvSymbol: "FX:AUDUSD" },
  { id: "USDCAD", name: "USD/CAD", tvSymbol: "FX:USDCAD" },
  { id: "USDCHF", name: "USD/CHF", tvSymbol: "FX:USDCHF" },
  { id: "XAUUSD", name: "XAU/USD (Gold)", tvSymbol: "OANDA:XAUUSD" },
];

export default function App() {
  const [selectedPair, setSelectedPair] = useState(PAIRS[0]);
  const [liveOrders, setLiveOrders] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  // Халқаро жонли ордерлар ва янгиликлар
  useEffect(() => {
    const orderInterval = setInterval(() => {
      const types = ["BUY LIMIT", "SELL LIMIT", "BUY STOP", "SELL STOP"];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomLot = (Math.random() * 80 + 10).toFixed(2);
      const randomTrader = ["JPMorgan Chase", "Goldman Sachs", "Citibank", "Whale Fund", "Deutsche Bank"][Math.floor(Math.random() * 5)];
      
      const newOrder = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        trader: randomTrader,
        type: randomType,
        lot: randomLot,
        pair: selectedPair.name,
      };

      setLiveOrders((prev) => [newOrder, ...prev.slice(0, 4)]);
    }, 3500);

    const sampleNews = [
      { 
        id: 1, 
        time: "Янги", 
        text: "АҚШ Федерал захира тизими (ФРС фоиз ставкалари бўйича навбатдаги баёнотини эълон қилди.", 
        impact: "Юқори", 
        url: "https://www.investing.com/central-banks/fed-rate-monitor" 
      },
      { 
        id: 2, 
        time: "10 дақиқа олдин", 
        text: "Олтин нархига глобал инфляция кўрсаткичлари ва бозор кутилмалари кучли таъсир кўрсатмоқда.", 
        impact: "Ўрта", 
        url: "https://www.investing.com/commodities/gold" 
      },
      { 
        id: 3, 
        time: "25 дақиқа олдин", 
        text: "Европа марказий банки пул-кредит сиёсатини ўзгаришсиз қолдиришга қарор қилди.", 
        impact: "Юқори", 
        url: "https://www.investing.com/central-banks/ecb-rate-monitor" 
      },
      { 
        id: 4, 
        time: "40 дақиқа олдин", 
        text: "Жаҳон нефть бозорида йирик ҳажмдаги савдо операциялари кузатилмоқда.", 
        impact: "Паст", 
        url: "https://www.investing.com/commodities/brent-oil" 
      },
    ];
    setNewsList(sampleNews);

    return () => clearInterval(orderInterval);
  }, [selectedPair]);

  const myCustomSignal = {
    title: "Менинг шахсий таҳлилим",
    type: "BUY (СОТИБ ОЛИШ)",
    entry: "4664.30",
    tp: "4690.00",
    sl: "4650.00",
    description: "Жигарлар, шошилмайлик! Яқинда янгилик чиқади, ўшанда тепага отиш эҳтимоли 80%га тенг.",
    image: "https://i.ibb.co/cSCgvJQX/image.png",
  };

  return (
    <div style={{ padding: "20px", background: "#0b0e14", color: "#fff", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <h2>Менинг Савдо Терминалим & Халқаро Оқимлар</h2>

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

      {/* График ва Шахсий Сигнал */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px", marginBottom: "25px" }}>
        
        {/* TradingView Графиги */}
        <div style={{ height: "480px", background: "#131722", borderRadius: "8px", overflow: "hidden" }}>
          <div className="tradingview-widget-container" ref={containerRef} style={{ height: "100%", width: "100%" }}></div>
        </div>

        {/* Шахсий Сигнал ва Расм */}
        <div style={{ background: "#131722", padding: "20px", borderRadius: "8px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 style={{ margin: 0, color: "#2962ff", fontSize: "18px" }}>{myCustomSignal.title}</h3>
              <span style={{ background: "#26a69a", padding: "4px 10px", borderRadius: "4px", fontWeight: "bold", fontSize: "12px" }}>
                {myCustomSignal.type}
              </span>
            </div>

            {/* Босилганда катташадиган расм */}
            <div onClick={() => setIsModalOpen(true)} style={{ cursor: "pointer", textAlign: "center", marginBottom: "12px" }}>
              <img 
                src={myCustomSignal.image} 
                alt="Analysis" 
                style={{ width: "100%", height: "160px", objectFit: "contain", background: "#000", borderRadius: "6px", border: "1px solid #2a2e39" }} 
              />
              <span style={{ fontSize: "11px", color: "#2962ff", display: "block", marginTop: "4px" }}>🔍 Расмни катта қилиб кўриш учун босинг</span>
            </div>

            {/* Сизнинг фикрингиз */}
            <p style={{ color: "#ffd54f", fontSize: "14px", lineHeight: "1.5", marginBottom: "15px", fontWeight: "bold", background: "#1e222d", padding: "10px", borderRadius: "6px" }}>
              {myCustomSignal.description}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", textAlign: "center", marginBottom: "10px" }}>
              <div style={{ background: "#1e222d", padding: "6px", borderRadius: "6px" }}>
                <span style={{ fontSize: "10px", color: "#8a94a6" }}>ENTRY</span>
                <div style={{ fontWeight: "bold", fontSize: "13px" }}>{myCustomSignal.entry}</div>
              </div>
              <div style={{ background: "#1e222d", padding: "6px", borderRadius: "6px" }}>
                <span style={{ fontSize: "10px", color: "#26a69a" }}>TP</span>
                <div style={{ fontWeight: "bold", fontSize: "13px", color: "#26a69a" }}>{myCustomSignal.tp}</div>
              </div>
              <div style={{ background: "#1e222d", padding: "6px", borderRadius: "6px" }}>
                <span style={{ fontSize: "10px", color: "#ef5350" }}>SL</span>
                <div style={{ fontWeight: "bold", fontSize: "13px", color: "#ef5350" }}>{myCustomSignal.sl}</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Пастки қисм: Халқаро ордерлар ва Янгиликлар */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px" }}>
        
        {/* Жонли Халқаро Ордерлар */}
        <div style={{ background: "#131722", padding: "15px", borderRadius: "8px" }}>
          <h3 style={{ marginTop: 0, fontSize: "16px", color: "#2962ff" }}>🌐 Live Institutional Order Flow</h3>
          <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #2a2e39", color: "#8a94a6" }}>
                <th style={{ padding: "6px" }}>Вақт</th>
                <th style={{ padding: "6px" }}>Банк / Фонд</th>
                <th style={{ padding: "6px" }}>Тип</th>
                <th style={{ padding: "6px" }}>Лот</th>
              </tr>
            </thead>
            <tbody>
              {liveOrders.map((order) => (
                <tr key={order.id} style={{ borderBottom: "1px solid #1e222d" }}>
                  <td style={{ padding: "6px" }}>{order.time}</td>
                  <td style={{ padding: "6px", color: "#e0e0e0" }}>{order.trader}</td>
                  <td style={{ padding: "6px", color: order.type.includes("BUY") ? "#26a69a" : "#ef5350", fontWeight: "bold" }}>
                    {order.type}
                  </td>
                  <td style={{ padding: "6px" }}>{order.lot} LOT</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Халқаро Янгиликлар (Батафсил ҳаволалар билан) */}
        <div style={{ background: "#131722", padding: "15px", borderRadius: "8px" }}>
          <h3 style={{ marginTop: 0, fontSize: "16px", color: "#ff9800" }}>📰 Халқаро Молиявий Янгиликлар</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {newsList.map((news) => (
              <a 
                key={news.id} 
                href={news.url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  background: "#1e222d", 
                  padding: "10px", 
                  borderRadius: "6px", 
                  borderLeft: `3px solid ${news.impact === "Юқори" ? "#ef5350" : "#2962ff"}`,
                  textDecoration: "none",
                  display: "block",
                  transition: "background 0.2s"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#8a94a6", marginBottom: "4px" }}>
                  <span>{news.time} 🔗 (Батафсил)</span>
                  <span>Таъсир: {news.impact}</span>
                </div>
                <div style={{ fontSize: "13px", color: "#fff" }}>{news.text}</div>
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* Расмни тўлиқ экранда кўрсатиш модали (Lightbox) */}
      {isModalOpen && (
        <div 
          onClick={() => setIsModalOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            cursor: "pointer"
          }}
        >
          <div style={{ position: "relative", maxWidth: "90%", maxHeight: "90%" }}>
            <img 
              src={myCustomSignal.image} 
              alt="Zoomed Analysis" 
              style={{ width: "100%", height: "auto", maxHeight: "85vh", objectFit: "contain", borderRadius: "8px" }} 
            />
            <div style={{ textAlign: "center", color: "#fff", marginTop: "10px", fontSize: "14px" }}>
              Ёпиш учун исталган жойга босинг ✕
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
