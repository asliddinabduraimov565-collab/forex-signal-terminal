<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Steam Bar | Tashkent</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #0b0c10;
            --card-bg: rgba(23, 25, 35, 0.7);
            --border-color: rgba(212, 175, 55, 0.2);
            --accent-gold: #d4af37;
            --accent-glow: rgba(212, 175, 55, 0.15);
            --text-main: #ffffff;
            --text-muted: #94a3b8;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Plus Jakarta Sans', sans-serif;
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-main);
            min-height: 100vh;
            background-image: 
                radial-gradient(circle at 10% 20%, rgba(212, 175, 55, 0.08) 0%, transparent 40%),
                radial-gradient(circle at 90% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 40%);
            padding: 20px;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
        }

        /* Header / Hero */
        .hero {
            background: linear-gradient(135deg, rgba(26, 28, 36, 0.9), rgba(15, 16, 21, 0.95));
            border: 1px solid var(--border-color);
            border-radius: 24px;
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.5);
            backdrop-filter: blur(10px);
            margin-bottom: 24px;
        }

        .hero::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; height: 3px;
            background: linear-gradient(90deg, transparent, var(--accent-gold), transparent);
        }

        .badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: var(--accent-glow);
            border: 1px solid var(--accent-gold);
            color: var(--accent-gold);
            padding: 6px 16px;
            border-radius: 50px;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 20px;
            box-shadow: 0 0 15px rgba(212, 175, 55, 0.2);
        }

        .hero h1 {
            font-size: 38px;
            font-weight: 800;
            letter-spacing: 1px;
            margin-bottom: 10px;
            background: linear-gradient(to right, #fff, #cbd5e1);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .hero p {
            color: var(--accent-gold);
            font-size: 16px;
            font-weight: 500;
        }

        /* Grid Layout */
        .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            margin-bottom: 24px;
        }

        @media (max-width: 768px) {
            .grid { grid-template-columns: 1fr; }
        }

        .card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            padding: 24px;
            backdrop-filter: blur(10px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .card:hover {
            border-color: rgba(212, 175, 55, 0.4);
            transform: translateY(-2px);
        }

        .card h3 {
            color: var(--accent-gold);
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .card p {
            color: var(--text-muted);
            font-size: 14px;
            line-height: 1.6;
        }

        /* List features */
        .feature-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            font-size: 14px;
        }

        .feature-row:last-child {
            border-bottom: none;
        }

        .feature-title {
            color: var(--text-main);
            font-weight: 600;
        }

        .feature-value {
            color: var(--text-muted);
        }

        /* Full Card */
        .full-card {
            grid-column: 1 / -1;
        }

        /* Button CTA */
        .cta-btn {
            display: block;
            width: 100%;
            background: linear-gradient(135deg, #d4af37 0%, #aa8c2c 100%);
            color: #0b0c10;
            text-align: center;
            padding: 16px;
            border-radius: 14px;
            font-weight: 800;
            text-decoration: none;
            font-size: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 10px 25px rgba(212, 175, 55, 0.3);
            transition: opacity 0.2s, transform 0.2s;
            margin-top: 20px;
        }

        .cta-btn:hover {
            opacity: 0.95;
            transform: scale(1.01);
        }

        .footer {
            text-align: center;
            padding: 20px;
            color: var(--text-muted);
            font-size: 13px;
            border-top: 1px solid rgba(255,255,255,0.05);
            margin-top: 40px;
        }
    </style>
</head>
<body>

    <div class="container">
        <!-- Hero Banner -->
        <div class="hero">
            <div class="badge">★ 4.3 (1 тыс.+ sharhlar) • Bar & Lounge</div>
            <h1>Steam Bar</h1>
            <p>Tashkent shahrining eng sara shinam maskani va unutilmas oqshomlar</p>
        </div>

        <!-- Content Grid -->
        <div class="grid">
            <!-- Biz haqimizda -->
            <div class="card">
                <h3>✨ Biz Haqimizda</h3>
                <p>Steam Bar — Toshkentdagi eng mashhur va kayfiyatli maskanlardan biri. Biz mehmonlarimizga yuqori darajadagi xizmat, mukammal muhit va unutilmas dam olish onlarigacha taqdim etamiz.</p>
            </div>

            <!-- Xususiyatlar -->
            <div class="card">
                <h3>🍸 Afzalliklarimiz</h3>
                <div class="feature-row">
                    <span class="feature-title">Terrasa:</span>
                    <span class="feature-value">Ochiq havodagi joy</span>
                </div>
                <div class="feature-row">
                    <span class="feature-title">Kokteyllar:</span>
                    <span class="feature-value">Mualliflik karta</span>
                </div>
                <div class="feature-row">
                    <span class="feature-title">Musiqa:</span>
                    <span class="feature-value">Jonli ijro oqshomlari</span>
                </div>
            </div>
        </div>

        <!-- Menyu bo'limi -->
        <div class="card full-card">
            <h3>🍽️ Asosiy Menyudan Namuna</h3>
            <div class="grid" style="margin-bottom: 0; margin-top: 15px;">
                <div>
                    <div class="feature-title" style="margin-bottom: 4px;">Signature Kokteyllar</div>
                    <p>Barasistentlar tomonidan maxsus tayyorlanadigan eksklyuziv ichimliklar.</p>
                </div>
                <div>
                    <div class="feature-title" style="margin-bottom: 4px;">Yevropa va Milliy Taomlar</div>
                    <p>Sifatli masalliqlardan tayyorlangan nafis gazak va issiq ovqatlar.</p>
                </div>
            </div>
        </div>

        <!-- Aloqa va Ish tartibi -->
        <div class="card full-card" style="margin-top: 24px;">
            <h3>📍 Aloqa va Ish Tartibi</h3>
            <div class="feature-row">
                <span class="feature-title">Holati:</span>
                <span class="feature-value" style="color: #ef4444; font-weight: 700;">Hozir yopiq (13:00 da ochiladi)</span>
            </div>
            <div class="feature-row">
                <span class="feature-title">Bog'lanish (Telefon):</span>
                <span class="feature-value" style="color: #fff; font-weight: 700;">+998 88 133 25 55</span>
            </div>
            <div class="feature-row">
                <span class="feature-title">Manzil:</span>
                <span class="feature-value">Tashkent, Steam Bar</span>
            </div>
            
            <a href="tel:+998881332555" class="cta-btn">Stol Band Qilish / Qo'ng'iroq qilish</a>
        </div>

        <div class="footer">
            Steam Bar • Barcha huquqlar himoyalangan © 2026
        </div>
    </div>

</body>
</html>
