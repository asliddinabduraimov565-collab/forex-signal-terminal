import React, { useState } from "react";

const PROPERTIES = [
  {
    id: 1,
    title: "Шинам 3 хонали квартира (Центр)",
    category: "Квартира",
    price: "$85,000",
    rooms: 3,
    area: "78 m²",
    location: "Тошкент ш., Чилонзор тумани",
    description: "Евроремонт қилинган, барча мебеллари билан бирга сотилади. Метрога яқин.",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80",
    url: "https://www.olx.uz/nedvizhimost/kvartiry/prodazha/"
  },
  {
    id: 2,
    title: "Ҳашаматли Ҳовли (Коттедж)",
    category: "Ҳовли",
    price: "$210,000",
    rooms: 6,
    area: "4.5 сотих",
    location: "Тошкент вил., Зангиота",
    description: "Янги қурилган, бассейн ва ёзги ошхонаси бор. Тинч маҳалла.",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=80",
    url: "https://www.olx.uz/nedvizhimost/doma/prodazha/"
  },
  {
    id: 3,
    title: "Бизнес учун қулай Офис жойи",
    category: "Офис",
    price: "$120,000",
    rooms: 4,
    area: "110 m²",
    location: "Тошкент ш., Миробод тумани",
    description: "Бизнес марказда, алоҳида кириш жойи ва автотураргоҳи мавжуд.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80",
    url: "https://www.olx.uz/nedvizhimost/kommercheskaya-nedvizhimost/"
  },
  {
    id: 4,
    title: "Замонавий 2 хонали студия",
    category: "Квартира",
    price: "$58,000",
    rooms: 2,
    area: "52 m²",
    location: "Тошкент ш., Юнусобод тумани",
    description: "Новая новостройка, панорамные окна, шикарный вид на город.",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80",
    url: "https://www.olx.uz/nedvizhimost/kvartiry/prodazha/"
  },
  {
    id: 5,
    title: "Яшил баҳмал диванли ва ёғоч стол қўйилган меҳмонхона интерьери",
    category: "Дизайн лойиҳа",
    price: "Махсус лойиҳа",
    rooms: 1,
    area: "Алоҳида хона",
    location: "Интерьер дизайни",
    description: "Бу сизнинг расмингиз асосида ўзгартирилган дизайн: кўк диван яшил баҳмал диванга алмаштирилди, оқ стол эса қора оёқли ёғоч столга ўзгартирилди.",
    image: "watermarked_img_17003745142212475164.png", // Ўзингизнинг расм линкингиз ёки файлингиз номи
    url: "#"
  }
];

const REAL_ESTATE_NEWS = [
  {
    id: 1,
    time: "Янги",
    text: "Марказий банк ипотека кредитлаш шартлари ва фоиз ставкалари бўйича янги ҳисобот эълон қилди.",
    impact: "Муҳим",
    url: "https://cbu.uz/uz/press_center/news/"
  },
  {
    id: 2,
    time: "1 соат олдин",
    text: "Тошкент шаҳрида янги қурилаётган уйлар нархининг ўзгариш тенденциялари таҳлили.",
    impact: "Ўрта",
    url: "https://www.gazeta.uz/uz/tag/ko-chmas-mulk/"
  },
  {
    id: 3,
    time: "3 соат олдин",
    text: "Ер участкаларини расмийлаштириш ва кадастр ҳужжатларини олиш бўйича янги тартиблар.",
    impact: "Юқори",
    url: "https://lex.uz/"
  }
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("Барчаси");
  const [activeImage, setActiveImage] = useState(null); // Расмни катта қилиб кўриш учун
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const filteredProperties = selectedCategory === "Барчаси" 
    ? PROPERTIES 
    : PROPERTIES.filter(p => p.category === selectedCategory);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("Илтимос, исмингиз ва телефон рақамингизни киритинг!");
      return;
    }
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", phone: "", message: "" });
    }, 4000);
  };

  return (
    <div style={{ padding: "20px", background: "#0b0e14", color: "#fff", minHeight: "100vh", fontFamily: "sans-serif" }}>
      
      {/* Сайт Сарлавҳаси */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", marginBottom: "25px", borderBottom: "1px solid #2a2e39", paddingBottom: "15px" }}>
        <div>
          <h2 style={{ margin: 0, color: "#4f46e5" }}>🏠 MODERN REALTOR & PROPERTY HUB</h2>
          <p style={{ margin: "5px 0 0 0", fontSize: "13px", color: "#8a94a6" }}>Тошкент шаҳри ва вилоятидаги энг ишончли кўчмас мулк объектлари</p>
        </div>
        <div style={{ background: "#1e222d", padding: "10px 16px", borderRadius: "8px", border: "1px solid #2a2e39" }}>
          <span style={{ fontSize: "12px", color: "#8a94a6" }}>Алоқа маркази: </span>
          <span style={{ color: "#22c55e", fontWeight: "bold", fontSize: "14px" }}>+998 (90) 123-45-67</span>
        </div>
      </div>

      {/* Категориялар тугмалари */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "25px", flexWrap: "wrap" }}>
        {["Барчаси", "Квартира", "Ҳовли", "Офис", "Дизайн лойиҳа"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "8px 18px",
              borderRadius: "6px",
              border: "none",
              background: selectedCategory === cat ? "#4f46e5" : "#1e222d",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "0.2s"
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Объектлар Сеткатоси (Grid) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "30px" }}>
        {filteredProperties.map((prop) => (
          <div key={prop.id} style={{ background: "#131722", borderRadius: "10px", overflow: "hidden", border: "1px solid #2a2e39", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              {/* Расмни босганда катташади */}
              <div 
                onClick={() => setActiveImage(prop.image)} 
                style={{ cursor: "pointer", position: "relative", height: "180px", overflow: "hidden" }}
              >
                <img 
                  src={prop.image} 
                  alt={prop.title} 
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }} 
                />
                <span style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(0,0,0,0.7)", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", color: "#4f46e5" }}>
                  {prop.price}
                </span>
                <span style={{ position: "absolute", bottom: "8px", left: "8px", background: "rgba(0,0,0,0.6)", padding: "2px 6px", borderRadius: "4px", fontSize: "10px", color: "#ccc" }}>
                  🔍 Катта қилиб кўриш
                </span>
              </div>

              <div style={{ padding: "15px" }}>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#fff" }}>{prop.title}</h3>
                <p style={{ margin: "0 0 10px 0", fontSize: "12px", color: "#8a94a6" }}>📍 {prop.location}</p>
                <p style={{ margin: "0 0 12px 0", fontSize: "13px", color: "#cbd5e1", lineHeight: "1.4" }}>{prop.description}</p>
                
                <div style={{ display: "flex", gap: "10px", marginBottom: "15px", fontSize: "12px" }}>
                  <span style={{ background: "#1e222d", padding: "4px 8px", borderRadius: "4px" }}>🛏 Хона: {prop.rooms}</span>
                  <span style={{ background: "#1e222d", padding: "4px 8px", borderRadius: "4px" }}>📐 Майдон: {prop.area}</span>
                </div>
              </div>
            </div>

            <div style={{ padding: "0 15px 15px 15px" }}>
              <a 
                href={prop.url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  display: "block", 
                  textAlign: "center", 
                  background: "#4f46e5", 
                  color: "#fff", 
                  padding: "8px", 
                  borderRadius: "6px", 
                  textDecoration: "none", 
                  fontSize: "13px",
                  fontWeight: "bold" 
                }}
              >
                Батафсил кўриш (Манба 🔗)
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Пастки қисм: Янгиликлар ва Мурожаат Формаси */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
        
        {/* Кўчмас Мулк Янгиликлари */}
        <div style={{ background: "#131722", padding: "20px", borderRadius: "10px", border: "1px solid #2a2e39" }}>
          <h3 style={{ marginTop: 0, fontSize: "16px", color: "#f59e0b" }}>📰 Бозор Янгиликлари & Қонунчилик</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "15px" }}>
            {REAL_ESTATE_NEWS.map((news) => (
              <a 
                key={news.id} 
                href={news.url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  background: "#1e222d", 
                  padding: "10px", 
                  borderRadius: "6px", 
                  borderLeft: "3px solid #4f46e5",
                  textDecoration: "none",
                  display: "block"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#8a94a6", marginBottom: "4px" }}>
                  <span>{news.time} 🔗</span>
                  <span>Муҳимлик: {news.impact}</span>
                </div>
                <div style={{ fontSize: "13px", color: "#fff" }}>{news.text}</div>
              </a>
            ))}
          </div>
        </div>

        {/* Уй сотиб олиш ёки сотиш учун мурожаат формаси */}
        <div style={{ background: "#131722", padding: "20px", borderRadius: "10px", border: "1px solid #2a2e39" }}>
          <h3 style={{ marginTop: 0, fontSize: "16px", color: "#22c55e" }}>📞 Мутахассисдан Бепул Маслаҳат Олиш</h3>
          
          {isSubmitted ? (
            <div style={{ background: "rgba(34, 197, 94, 0.2)", padding: "20px", borderRadius: "6px", textAlign: "center", color: "#22c55e", marginTop: "15px" }}>
              ✅ Хабарингиз қабул қилинди! Тез орада реалторомиз сиз билан боғланади.
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px" }}>
              <input 
                type="text" 
                placeholder="Исминггиз" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ padding: "10px", borderRadius: "6px", border: "1px solid #2a2e39", background: "#1e222d", color: "__fff" }}
              />
              <input 
                type="text" 
                placeholder="Телефон рақамингиз (+998 ...)" 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{ padding: "10px", borderRadius: "6px", border: "1px solid #2a2e39", background: "#1e222d", color: "#fff" }}
              />
              <textarea 
                placeholder="Қандай уй ёки квартира қидирмоқдасиз?" 
                rows="3"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                style={{ padding: "10px", borderRadius: "6px", border: "1px solid #2a2e39", background: "#1e222d", color: "#fff", resize: "none" }}
              ></textarea>
              <button 
                type="submit" 
                style={{ background: "#22c55e", color: "#000", border: "none", padding: "10px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
              >
                Ариза юбориш
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Расмни тўлиқ экранда кўрсатиш модали (Lightbox) */}
      {activeImage && (
        <div 
          onClick={() => setActiveImage(null)}
          style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.9)", display: "flex", justifyContent: "center", alignItems: "center",
            zIndex: 1000, cursor: "pointer"
          }}
        >
          <div style={{ textAlign: "center" }}>
            <img src={activeImage} alt="Zoomed" style={{ maxWidth: "90vw", maxHeight: "85vh", borderRadius: "8px", objectFit: "contain" }} />
            <div style={{ color: "#fff", marginTop: "10px", fontSize: "14px" }}>Ёпиш учун исталган жойга босинг ✕</div>
          </div>
        </div>
      )}

    </div>
  );
}
