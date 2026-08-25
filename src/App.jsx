import React from 'react';

export default function App() {
  return (
    <div style={{
      backgroundColor: '#07080a',
      color: '#ffffff',
      minHeight: '100vh',
      padding: '24px 16px',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        
        {/* Header Banner */}
        <div style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #151821 0%, #0b0c10 100%)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '28px',
          padding: '50px 30px',
          textAlign: 'center',
          marginBottom: '24px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.7)',
          overflow: 'hidden'
        }}>
          {/* Orqa fondagi yorug'lik effekti */}
          <div style={{
            position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)',
            width: '200px', height: '200px', background: 'rgba(212, 175, 55, 0.15)',
            filter: 'blur(60px)', borderRadius: '50%', zIndex: '0'
          }}></div>

          <div style={{ position: 'relative', zIndex: '1' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              color: '#d4af37',
              padding: '6px 18px',
              borderRadius: '50px',
              fontSize: '13px',
              fontWeight: '700',
              marginBottom: '20px',
              letterSpacing: '0.5px'
            }}>
              ★ 4.3 (1 тыс.+ sharhlar) • Bar & Lounge
            </div>
            
            <h1 style={{ 
              fontSize: '42px', 
              fontWeight: '800', 
              marginBottom: '12px', 
              letterSpacing: '1px',
              background: 'linear-gradient(to right, #ffffff, #d4af37)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              STEAM BAR
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '16px', fontWeight: '400', maxWidth: '500px', margin: '0 auto' }}>
              Tashkent shahrining eng shinam, yevropacha va milliy taomlar uyg'unlashgan maskani
            </p>
          </div>
        </div>

        {/* Xususiyatlar Grid (Terrasa, Kokteyl, Musiqa) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: '#12141c', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🌿</div>
            <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px' }}>Terrasa</div>
            <div style={{ color: '#94a3b8', fontSize: '13px' }}>Ochiq havodagi shinam joy</div>
          </div>
          <div style={{ background: '#12141c', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🍸</div>
            <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px' }}>Kokteyllar</div>
            <div style={{ color: '#94a3b8', fontSize: '13px' }}>Mualliflik bar kartasi</div>
          </div>
          <div style={{ background: '#12141c', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎵</div>
            <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px' }}>Jonli Musiqa</div>
            <div style={{ color: '#94a3b8', fontSize: '13px' }}>Unutilmas oqshomlar</div>
          </div>
        </div>

        {/* Menyu va Taomlar */}
        <div style={{
          background: '#12141c',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          borderRadius: '24px',
          padding: '28px',
          marginBottom: '24px'
        }}>
          <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            🍽️ Maxsus Menyudan Namuna
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '6px', color: '#fff' }}>Signature Kokteyllar</div>
              <div style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.5' }}>Barasistentlarimiz tomonidan tayyorlanadigan eksklyuziv ichimliklar to'plami.</div>
            </div>
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '6px', color: '#fff' }}>Yevropa va Milliy Taomlar</div>
              <div style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.5' }}>Sifatli mahsulotlardan tayyorlangan nafis gazak va issiq ovqatlar.</div>
            </div>
          </div>
        </div>

        {/* Aloqa va Ish tartibi */}
        <div style={{
          background: '#12141c',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          borderRadius: '24px',
          padding: '28px'
        }}>
          <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            📍 Aloqa va Ish Tartibi
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '14px' }}>
            <span style={{ color: '#94a3b8', fontWeight: '500' }}>Ish tartibi:</span>
            <span style={{ color: '#ef4444', fontWeight: '700' }}>Hozir yopiq (13:00 da ochiladi)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '14px' }}>
            <span style={{ color: '#94a3b8', fontWeight: '500' }}>Telefon raqam:</span>
            <span style={{ color: '#fff', fontWeight: '700' }}>+998 88 133 25 55</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: '14px' }}>
            <span style={{ color: '#94a3b8', fontWeight: '500' }}>Manzil:</span>
            <span style={{ color: '#fff', fontWeight: '600' }}>Tashkent, Steam Bar</span>
          </div>
          
          <a href="tel:+998881332555" style={{
            display: 'block',
            width: '100%',
            background: 'linear-gradient(135deg, #d4af37 0%, #aa8c2c 100%)',
            color: '#07080a',
            textAlign: 'center',
            padding: '16px',
            borderRadius: '16px',
            fontWeight: '800',
            textDecoration: 'none',
            fontSize: '15px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginTop: '24px',
            boxShadow: '0 10px 25px rgba(212, 175, 55, 0.3)'
          }}>
            Stol Band Qilish / Qo'ng'iroq qilish
          </a>
        </div>

        <div style={{ textAlign: 'center', padding: '24px', color: '#64748b', fontSize: '12px', marginTop: '20px' }}>
          Steam Bar • Barcha huquqlar himoyalangan © 2026
        </div>

      </div>
    </div>
  );
}
