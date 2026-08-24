import React, { useState, useEffect, useRef } from "react";

const PAIRS = [
  { id: "BTCUSD", name: "Bitcoin (Binance Live)", tvSymbol: "BINANCE:BTCUSDT", isCrypto: true, symbol: "btcusdt" },
  { id: "EURUSD", name: "EUR/USD", tvSymbol: "FX:EURUSD", isCrypto: false },
  { id: "GBPUSD", name: "GBP/USD", tvSymbol: "FX:GBPUSD", isCrypto: false },
  { id: "XAUUSD", name: "XAU/USD (Gold)", tvSymbol: "OANDA:XAUUSD", isCrypto: false },
];

export default function App() {
  const [selectedPair, setSelectedPair] = useState(PAIRS[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Binance / Live Trade ва Order Book стейтлари
  const [bids, setBids] = useState([]); // Харидорлар
  const [asks, setAsks] = useState([]); // Сотувчилар
  const [recentTrades, setRecentTrades] = useState([]); // Жонли битимлар
  const [currentPrice, setCurrentPrice] = useState("96450.00");
  const [priceChange, setPriceChange] = useState("+2.4%");

  const containerRef = useRef();
  const calendarRef = useRef();

  // TradingView Графиги
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

  // TradingView Иқтисодий тақвими
  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.innerHTML = "";
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        colorTheme: "dark",
        isTransparent: false,
        width: "100%",
        height: "400px",
        locale: "ru",
        importanceFilter: "-1,0,1",
        currencyFilter: "USD,EUR,GBP,JPY"
      });
      calendarRef.current.appendChild(script);
    }
  }, []);

  // BINANCE WEBSOCKET ва СИМУЛЯЦИЯ (Лайв Трейдлар ва Ордер Бук)
  useEffect(() => {
    if (selectedPair.isCrypto) {
      // Binance WebSocket орқали жонли тикли маълумот
      const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${selectedPair.symbol}@trade`);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const price = parseFloat(data.p).toFixed(2);
        const qty = parseFloat(data.q).toFixed(4);
        const isBuyerMaker = data.m; // true = SELL, false = BUY
        const side = isBuyerMaker ? "SELL" : "BUY";
        const time = new Date(data.T).toLocaleTimeString();

        setCurrentPrice(price);

        // Жонли трейдлар оқими
        setRecentTrades((prev) => [
          { id: data.t, price, qty, side, time },
          ...prev.slice(0, 11),
        ]);

        // Ордер бук симуляцияси
        const basePrice = parseFloat(price);
        const newAsks = Array.from({ length: 6 }, (_, i) => ({
          price: (basePrice + (i + 1) * 2.5).toFixed(2),
          qty: (Math.random() * 1.5 + 0.1).toFixed(3),
        })).reverse();

        const newBids = Array.from({ length: 6 }, (_, i) => ({
          price: (basePrice - (i + 1) * 2.5).toFixed(2),
          qty: (Math.random() * 1.5 + 0.1).toFixed(3),
        }));

        setAsks(newAsks);
        setBids(newBids);
      };

      return () => ws.close();
    } else {
      // Forex / Gold учун жонли оқим симуляцияси
      const base = selectedPair.id === "XAUUSD" ? 2650.0 : 1.0850;
      const interval = setInterval(() => {
        const randomDiff = (Math.random() - 0.5) * (selectedPair.id === "XAUUSD" ? 1.5 : 0.001);
        const price = (base + randomDiff).toFixed(selectedPair.id === "XAUUSD" ? 2 : 4);
        const qty = (Math.random() * 10 + 0.5).toFixed(2);
        const side = Math.random() > 0.5 ? "BUY" : "SELL";
        const time = new Date().toLocaleTimeString();

        setCurrentPrice(price);

        setRecentTrades((prev) => [
          { id: Date.now(), price, qty, side, time },
          ...prev.slice(0, 11),
        ]);

        const baseP = parseFloat(price);
        const step = selectedPair.id === "XAUUSD" ? 0.5 : 0.0003;

        setAsks(Array.from({ length: 6 }, (_, i) => ({
          price: (baseP + (i + 1) * step).toFixed(selectedPair.id === "XAUUSD" ? 2 : 4),
          qty: (Math.random() * 15 + 1).toFixed(2),
        })).reverse());

        setBids(Array.from({ length: 6 }, (_, i) => ({
          price: (baseP - (i + 1) * step).toFixed(selectedPair.id === "XAUUSD" ? 2 : 4),
          qty: (Math.random() * 15 + 1).toFixed(2),
        })));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [selectedPair]);

  const myCustomSignal = {
    title: "Менинг Шахсий Таҳлилим",
    type: "BUY (СОТИБ ОЛИШ)",
    entry: "4664.30",
    tp: "4690.00",
    sl: "4650.00",
    description: "Бозорда кучли харидорлар босими сезилмоқда. Шамлар ўсиш томон шаклланмоқда!",
    image: "https://i.ibb.co/cSCgvJQX/image.png",
  };

  return (
    <div style={{ padding: "20px", background: "#0b0e14", color: "#fff", minHeight: "100vh", fontFamily: "sans-serif" }}>
      
      {/* Шапка / Хедер */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", marginBottom: "15px" }}>
        <h2>⚡ BINANCE STYLE LIVE TRADING TERMINAL</h2>
        <div style={{ background: "#1e222d", padding: "8px 14px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "10px", border: "1px solid #2a2e39" }}>
          <span style={{ fontSize: "12px", color: "#8a94a6" }}>Бозор Кайфияти (Fear & Greed):</span>
          <span style={{ background: "#26a69a", color: "#fff", padding: "3px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>
            72 (Кучли Ишонч / Greed)
          </span>
        </div>
      </div>

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
              background: selectedPair.id === pair.id ? "#f0b90b" : "#1e222d",
              color: selectedPair.id === pair.id ? "#000" : "#fff",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            {pair.name}
          </button>
        ))}
      </div>

      {/* График ва Шахсий сигнал */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px", marginBottom: "25px" }}>
        <div style={{ height: "480px", background: "#131722", borderRadius: "8px", overflow: "hidden" }}>
          <div className="tradingview-widget-container" ref={containerRef} style={{ height: "100%", width: "100%" }}></div>
        </div>

        <div style={{ background: "#131722", padding: "20px", borderRadius: "8px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 style={{ margin: 0, color: "#f0b90b", fontSize: "18px" }}>{myCustomSignal.title}</h3>
              <span style={{ background: "#26a69a", padding: "4px 10px", borderRadius: "4px", fontWeight: "bold", fontSize: "12px" }}>
                {myCustomSignal.type}
              </span>
            </div>

            <div onClick={() => setIsModalOpen(true)} style={{ cursor: "pointer", textAlign: "center", marginBottom: "12px" }}>
              <img 
                src={myCustomSignal.image} 
                alt="Analysis" 
                style={{ width: "100%", height: "160px", objectFit: "contain", background: "#000", borderRadius: "6px", border: "1px solid #2a2e39" }} 
              />
              <span style={{ fontSize: "11px", color: "#f0b90b", display: "block", marginTop: "4px" }}>🔍 Катта қилиб кўриш учун босинг</span>
            </div>

            <p style={{ color: "#ffd54f", fontSize: "13px", lineHeight: "1.4", marginBottom: "15px", background: "#1e222d", padding: "10px", borderRadius: "6px" }}>
              {myCustomSignal.description}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", textAlign: "center" }}>
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

      {/* 🔥 BINANCE STYLE: БИРЖА СТАКАНИ ВА ЛАЙВ ТРЕЙДЛАР (ORDER BOOK & LIVE TRADES) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px", marginBottom: "25px" }}>
        
        {/* BINANCE ORDER BOOK (Ордерлар Китоби) */}
        <div style={{ background: "#131722", padding: "15px", borderRadius: "8px" }}>
          <h3 style={{ marginTop: 0, fontSize: "15px", color: "#f0b90b" }}>📊 Ордерлар Китоби (Order Book)</h3>
          
          <div style={{ display: "flex", justifyContent: "space-between", color: "#8a94a6", fontSize: "11px", marginBottom: "8px", borderBottom: "1px solid #2a2e39", pb: "4px" }}>
            <span>Нарх (Price)</span>
            <span>Миқдор (Size)</span>
          </div>

          {/* Сотувчилар - Қизил (Asks) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            {asks.map((ask, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", background: "rgba(239, 83, 80, 0.1)", padding: "2px 4px", borderRadius: "3px" }}>
                <span style={{ color: "#ef5350", fontWeight: "bold" }}>{ask.price}</span>
                <span style={{ color: "#d1d4dc" }}>{ask.qty}</span>
              </div>
            ))}
          </div>

          {/* Жонли Текширув Нархи */}
          <div style={{ textAlign: "center", padding: "10px 0", margin: "8px 0", background: "#1e222d", borderRadius: "6px", border: "1px solid #2a2e39" }}>
            <span style={{ fontSize: "18px", fontWeight: "bold", color: "#26a69a" }}>{currentPrice} </span>
            <span style={{ fontSize: "12px", color: "#26a69a" }}>{priceChange}</span>
          </div>

          {/* Харидорлар - Яшил (Bids) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            {bids.map((bid, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", background: "rgba(38, 166, 154, 0.1)", padding: "2px 4px", borderRadius: "3px" }}>
                <span style={{ color: "#26a69a", fontWeight: "bold" }}>{bid.price}</span>
                <span style={{ color: "#d1d4dc" }}>{bid.qty}</span>
              </div>
            ))}
          </div>
        </div>

        {/* BINANCE LIVE TRADES (Жонли Харид ва Сотувлар Оқими) */}
        <div style={{ background: "#131722", padding: "15px", borderRadius: "8px" }}>
          <h3 style={{ marginTop: 0, fontSize: "15px", color: "#f0b90b" }}>🔥 Жонли Трейдлар (Live Market Trades)</h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", color: "#8a94a6", fontSize: "11px", marginBottom: "8px", borderBottom: "1px solid #2a2e39", paddingBottom: "4px" }}>
            <span>Нарх</span>
            <span>Миқдор</span>
            <span style={{ textAlign: "right" }}>Вақт</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxHeight: "330px", overflowY: "hidden" }}>
            {recentTrades.map((trade) => (
              <div 
                key={trade.id} 
                style={{ 
                  display: "grid", 
                  gridTemplateColumns: "1fr 1fr 1fr", 
                  fontSize: "12px", 
                  padding: "3px 0",
                  borderBottom: "1px solid #1e222d"
                }}
              >
                <span style={{ color: trade.side === "BUY" ? "#26a69a" : "#ef5350", fontWeight: "bold" }}>
                  {trade.price}
                </span>
                <span style={{ color: "#fff" }}>{trade.qty}</span>
                <span style={{ textAlign: "right", color: "#8a94a6", fontSize: "11px" }}>{trade.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Иқтисодий Тақвим */}
      <div style={{ background: "#131722", padding: "15px", borderRadius: "8px" }}>
        <h3 style={{ marginTop: 0, fontSize: "15px", color: "#2962ff" }}>📅 Иқтисодий Тақвим (Economic Calendar)</h3>
        <div className="tradingview-widget-container" ref={calendarRef} style={{ width: "100%", height: "400px" }}></div>
      </div>

      {/* Расмни каттайтириш Модали */}
      {isModalOpen && (
        <div 
          onClick={() => setIsModalOpen(false)}
          style={{
            position: "fixed",
            top: 0, left: 0, width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.9)",
            display: "flex", justifyContent: "center", alignItems: "center",
            zIndex: 1000, cursor: "pointer"
          }}
        >
          <img src={myCustomSignal.image} alt="Zoomed" style={{ maxWidth: "90%", maxHeight: "85vh", borderRadius: "8px" }} />
        </div>
      )}

    </div>
  );
}
