<!--
  Eczane Stok ve Reçete Kayıt Sistemi - README.md
  Tüm hakları saklı değildir, açık kaynaktır.
-->

<div align="center">
  <h1>💊 Eczane Stok ve Reçete Kayıt Sistemi</h1>
  <p><strong>Dijital Eczane Yönetimi | Yerel Ağda Bağımsız Çalışan Çözüm</strong></p>
  
  <!-- Rozetler (badges) - dinamik olarak güncellenebilir -->
  <img src="https://img.shields.io/badge/Python-3.12%2B-3776AB?logo=python&logoColor=white" alt="Python 3.12+">
  <img src="https://img.shields.io/badge/Django-5.x-092E20?logo=django&logoColor=white" alt="Django 5.x">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React 18">
  <img src="https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white" alt="SQLite">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License">
  <img src="https://img.shields.io/badge/Status-Development-yellow" alt="Status: Development">
</div>

---

## 📌 Proje Hakkında

**Eczane Stok ve Reçete Kayıt Sistemi**, manuel ve kağıt tabanlı eczane operasyonlarını dijital ortama taşıyan, **yerel ağda bağımsız (standalone)** çalışan bir yazılımdır. Sistem sayesinde ilaç stokları gerçek zamanlı takip edilir, reçeteler dijital arşivlenir ve eczane personelinin iş yükü azaltılır.

### 🎯 Hedefler

- **Veri bütünlüğü** ve gerçek zamanlı stok izleme
- **Proaktif uyarılar** (kritik stok, miad yaklaşan ürünler)
- **Role‑Based Access Control** (Eczacı / Kalfa rolleri)
- **Denetim ve raporlama** (işlem logları, stok hareketleri)

### 🔧 Teknoloji Yığını

| Katman | Teknoloji | Açıklama |
|--------|-----------|-----------|
| **Back‑End** | Python 3.12+, Django 5.x, Django REST Framework | RESTful API, iş mantığı, yetkilendirme |
| **Front‑End** | React 18, Vite, Bootstrap 5, React Router | Dinamik kullanıcı arayüzü, responsive tasarım |
| **Veritabanı** | SQLite | Hafif, konfigürsyonsuz, standalone |
| **Araçlar** | Git (GitFlow), Notion, Postman, pytest | Versiyon kontrol, proje yönetimi, test |

---

## 👥 Ekip ve Roller

| Birim | Ekip Üyeleri | Sorumluluk |
|-------|--------------|------------|
| **Proje Yönetimi & QA** | Mehmet | Sprint planlama, süreç denetimi, test koordinasyonu |
| **Veritabanı (DB)** | Beyza , Dovlet, Yusuf* | ER şeması, SQLite modelleri, migration |
| **Arka Uç (BE)** | Begli , Yaren, Yusuf* | API geliştirme, RBAC, audit log |
| **Ön Yüz (FE)** | Berat , Kaan, Aslı, İrem | React arayüzü, state yönetimi, API entegrasyonu |

> *Yusuf, DB ve BE arasında entegratör rolündedir.*

---

## 🗺️ 1 Aylık Yol Haritası (Sprint 1 – 4 Hafta)

| Hafta | Odak Alanı | Teslim Edilecekler |
|-------|------------|---------------------|
| **1** (30 Mart – 3 Nisan) | Kurulum, Temel Modeller, API | ✅ Repo & GitFlow<br>✅ Django proje iskeleti + SQLite<br>✅ ER diyagramı, migration<br>✅ Token auth (login/logout)<br>✅ Stok ve reçete CRUD API'leri |
| **2** (6 – 10 Nisan) | Front-End ve RBAC | ✅ React + Vite kurulumu<br>✅ Login sayfası, routing<br>✅ Stok listesi ve form ekranları<br>✅ Eczacı/Kalfa yetkilendirmesi |
| **3** (13 – 17 Nisan) | Entegrasyon & İş Mantığı | ✅ FE-BE bağlantısı (CORS, token)<br>✅ Stok hareketleri (giriş/çıkış)<br>✅ Kritik stok / miad endpoint'leri<br>✅ Reçete durum güncelleme |
| **4** (20 – 24 Nisan) | Test, Dokümantasyon, Demo | ✅ Unit test (pytest) ve UI testleri<br>✅ Audit log (işlem kayıtları)<br>✅ Swagger dokümantasyonu<br>✅ Sprint sonu demo & kullanıcı eğitimi |

---

## 🚀 Hızlı Kurulum (Geliştirme Ortamı)

### Gereksinimler
- Git, Python 3.12+, Node.js 18+
- (Opsiyonel) VS Code veya tercih ettiğiniz IDE

### 1️⃣ Repoyu Klonlayın
```bash
git clone https://github.com/Penyus/eczane-sistemi.git
cd eczane-sistemi
```

### 2️⃣ Back-End (Django)
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser   # admin hesabı oluşturun
python manage.py runserver
```

- API: [http://localhost:8000/api/v1/](http://localhost:8000/api/v1/)
- Swagger: [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)
- Admin panel: [http://localhost:8000/admin/](http://localhost:8000/admin/)

### 3️⃣ Front-End (React + Vite)
```bash
cd frontend
npm install
cp .env.example .env            # VITE_API_BASE_URL ayarlayın
npm run dev
```

- Uygulama: [http://localhost:3000](http://localhost:3000)

---

## 📚 Dokümantasyon

- API Referansı (Swagger) – Geliştirme ortamında aktif
- ER Diyagramı – Veritabanı şeması
- Veritabanı Şema Açıklaması
- Kurulum Rehberi (Detaylı)

---

## 🤝 Katkıda Bulunma (Contributing)

Proje GitFlow dal stratejisini kullanır.

develop dalından yeni bir feature dalı oluşturun:

```bash
git checkout -b feature/kisa-aciklama
```

Değişikliklerinizi yapın ve anlamlı commit mesajları yazın:

```
feat(stock): kritik stok endpoint'i eklendi
fix(auth): token süre kontrolü düzeltildi
docs(readme): kurulum adımları güncellendi
```

Dalınızı uzak repo'ya gönderin ve Pull Request (PR) açın.

PR'ınız en az bir takım üyesi tarafından onaylandıktan sonra develop dalına merge edilir.

---

## 📄 Lisans

Bu proje MIT Lisansı ile lisanslanmıştır – açık kaynak, ticari ve özel kullanıma izin verir.

<div align="center">
  <sub>💻 Geliştirme sürecinde sorularınız için takım lideri Mehmet ile iletişime geçin.</sub><br>
  <sub>🚀 İlk sprint başlangıcı: 30 Mart 2026</sub>
</div>
