import React from 'react';

export default function App() {
  return (
    <div style={{
      backgroundColor: '#0b0c10',
      color: '#ffffff',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Hero Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(26, 28, 36, 0.9), rgba(15, 16, 21, 0.95))',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          borderRadius: '24px',
          padding: '40px 30px',
          textAlign: 'center',
          marginBottom: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
        }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(212, 175, 55, 0.15)',
            border: '1px solid #d4af37',
            color: '#d4af37',
            padding: '6px 16px',
            borderRadius: '50px',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '20px'
          }}>
            ★ 4.3 (1 тыс.+ sharhlar) • Bar & Lounge
          </div>
          <h1 style={{ fontSize: '38px', fontWeight: '800', marginBottom: '10px', color: '#fff' }}>Steam Bar</h1>
          <p style={{ color: '#d4af37', fontSize: '16px', fontWeight: '500' }}>Tashkent shahrining eng sara shinam maskani va unutilmas oqshomlar</p>
        </div>

        {/* Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          
          {/* Biz haqimizda */}
          <div style={{
            background: 'rgba(23, 25, 35, 0.7)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            borderRadius: '20px',
            padding: '24px'
          }}>
            <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '16px', textTransform: 'uppercase' }}>✨ Biz Haqimizda</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6' }}>
              Steam Bar — Toshkentdagi eng mashhur va kayfiyatli maskanlardan biri. Biz mehmonlarimizga yuqori darajadagi xizmat, mukammal muhit taqdim etamiz.
            </p>
          </div>

          {/* Afzalliklar */}
          <div style={{
            background: 'rgba(23, 25, 35, 0.7)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            borderRadius: '20px',
            padding: '24px'
          }}>
            <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '16px', textTransform: 'uppercase' }}>🍸 Afzalliklarimiz</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '14px' }}>
              <span style={{ fontWeight: '600' }}>Terrasa:</span>
              <span style={{ color: '#94a3b8' }}>Ochiq havodagi joy</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '14px' }}>
              <span style={{ fontWeight: '600' }}>Kokteyllar:</span>
              <span style={{ color: '#94a3b8' }}>Mualliflik karta</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px' }}>
              <span style={{ fontWeight: '600' }}>Musiqa:</span>
              <span style={{ color: '#94a3b8' }}>Jonli ijro oqshomlari</span>
            </div>
          </div>

        </div>

        {/* Aloqa va Ish tartibi */}
        <div style={{
          background: 'rgba(23, 25, 35, 0.7)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          borderRadius: '20px',
          padding: '24px'
        }}>
          <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '16px', textTransform: 'uppercase' }}>📍 Aloqa va Ish Tartibi</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '14px' }}>
            <span style={{ fontWeight: '600' }}>Holati:</span>
            <span style={{ color: '#ef4444', fontWeight: '700' }}>Hozir yopiq (13:00 da ochiladi)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '14px' }}>
            <span style={{ fontWeight: '600' }}>Telefon:</span>
            <span style={{ color: '#fff', fontWeight: '700' }}>+998 88 133 25 55</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '14px' }}>
            <span style={{ fontWeight: '600' }}>Manzil:</span>
            <span style={{ color: '#94a3b8' }}>Tashkent, Steam Bar</span>
          </div>
          
          <a href="tel:+998881332555" style={{
            display: 'block',
            width: '100%',
            background: 'linear-gradient(135deg, #d4af37 0%, #aa8c2c 100% )',
            color: '#0b0c10',
            textAlign: 'center',
            padding: '16px',
            borderRadius: '14px',
            fontWeight: '800',
            textDecoration: 'none',
            fontSize: '15px',
            textTransform: 'uppercase',
            marginTop: '20px'
          }}>
            Stol Band Qilish / Qo'ng'iroq qilish
          </a>
        </div>

        <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '13px', marginTop: '40px' }}>
          Steam Bar • Barcha huquqlar himoyalangan © 2026
        </div>

      </div>
    </div>
  );
}
