## **Netleştirilmesi Gereken Sorular ve Alınan Kararlar**

| **#** | **Soru** | **Alınan Karar (Projeye En Uygun)** |
| --- | --- | --- |
| 1 | **GitHub repo’ya FE kodu nerede yer alacak?** | Repo kökünde `/frontend` klasörü. Back-End kodu `/backend` klasöründe. Böylece tek repo’da hem FE hem BE. |
| 2 | **FE hangi portta çalışacak?** | Vite dev server: `http://localhost:3000`. BE: `http://localhost:8000`. CORS ayarları BE’de yapıldı. |
| 3 | **API base URL nasıl yönetilecek?** | `.env` dosyasında `VITE_API_BASE_URL=http://localhost:8000/api/v1`. Vite ile `import.meta.env.VITE_API_BASE_URL` kullanılacak. |
| 4 | **Token (authentication) nerede saklanacak?** | `localStorage` (basit). Token’ı `Authorization: Token <token>` header’ı ile API’ye gönder. Çıkış yapınca token silinecek. |
| 5 | **FE routing yapısı (protected routes)?** | React Router v6. `PrivateRoute` wrapper: token yoksa login’e yönlendir. Rol bazlı (eczacı/kalfa) sayfa gösterimi yapılacak. |
| 6 | **Form yönetimi ve validasyon?** | `react-hook-form` + `zod` (şema validasyonu). BE ile aynı validasyon kuralları (zorunlu alanlar, veri tipleri) FE’de de uygulanacak. |
| 7 | **Hata mesajları nasıl gösterilecek?** | Toast bildirimleri (react-hot-toast). API’den gelen `error.message` doğrudan gösterilecek. Ağ hatası durumunda “Bağlantı hatası” gibi genel mesaj. |
| 8 | **Yükleme durumları (loading) nasıl yönetilecek?** | Butonlarda `disabled` ve “Yükleniyor...” metni, sayfalarda skeleton loader veya spinner (tercihen skeleton). |
| 9 | **Responsive tasarımda tablo görünümü?** | Masaüstünde tablo, mobilde kart görünümü (Bootstrap’ın responsive tablo sarmalayıcısı veya özel kart dönüşümü). |
| 10 | **Klavye kısayolları (hızlı veri girişi) gerekli mi?** | İlk sprintte sadece Enter ile form gönderme. Daha gelişmiş kısayollar sonraki sprintlere bırakılacak. |
| 11 | **Sayfa yenilemede state korunacak mı?** | SPA olduğu için state’ler context’te tutuluyor. Ancak sayfa yenilenirse token varsa oturum açık kalır, veriler yeniden çekilir. |
| 12 | **Dosya yükleme (reçete fotoğrafı) ilk sprintte var mı?** | Hayır, kapsam dışı. Sadece veri girişi. |
| 13 | **FE testleri hangi sprintte başlayacak?** | Sprint 2’de Jest + React Testing Library. Sprint 1’de test yok, sadece manuel test. |
| 14 | **State management (context) hangi verileri tutacak?** | `AuthContext`: kullanıcı, token, rol. `StockContext`: stok listesi, kritik stok sayısı. `PrescriptionContext`: reçete listesi. Her context kendi API servisini çağıracak. |
| 15 | **FE deployment (ilk fazda) nasıl yapılacak?** | Geliştirme aşamasında `npm run dev`. Üretim için `npm run build` ile statik dosyalar üretilir, bunlar Django’nun statik dosya servisi veya ayrı bir web sunucusu (nginx) ile yayınlanabilir. Sprint 1 sonunda sadece development ortamı çalışır durumda olacak. |

---

## **Front-End (FE) Birimi – Detaylı Geliştirme Adımları (Sprint 1)**

### **1. GitHub Repo’dan Proje Yapısının Kurulması**

- Repo’yu klonla: `git clone https://github.com/Penyus/eczane-sistemi.git`
- Kök dizinde `/frontend` klasörü oluştur.
- **Vite + React kurulumu (frontend klasörü içinde):**
    
    bash
    
    ```
    npm create vite@latest . -- --template react
    ```
    
- Bağımlılıklar: `npm install react-router-dom bootstrap react-hot-toast react-hook-form zod @hookform/resolvers`
- Geliştirme script’leri: `package.json` içinde `"dev": "vite --port 3000"`

### **2. Dizin Yapısının Oluşturulması**

text

```
frontend/
├── src/
│   ├── components/       # Ortak UI bileşenleri (Button, Input, Modal, Table, Card, LoadingSpinner)
│   ├── features/         # Modül bazlı (auth, stock, prescription)
│   │   ├── auth/
│   │   │   ├── components/ (LoginForm)
│   │   │   ├── pages/ (LoginPage)
│   │   │   └── context/ (AuthContext)
│   │   ├── stock/
│   │   │   ├── components/ (StockTable, StockForm, KritikStockAlert)
│   │   │   ├── pages/ (StockListPage, StockAddPage)
│   │   │   └── context/ (StockContext)
│   │   └── prescription/
│   │       ├── components/ (ReceteTable, ReceteForm, DurumBadge)
│   │       ├── pages/ (ReceteListPage, ReceteAddPage)
│   │       └── context/ (PrescriptionContext)
│   ├── services/         # API çağrıları (api.js, authService.js, stockService.js, prescriptionService.js)
│   ├── utils/            # Yardımcı fonksiyonlar (formatDate, validateTC, vs.)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env                  # VITE_API_BASE_URL
├── index.html
└── package.json
```

### **3. API Servis Katmanının Yazılması**

- `src/services/api.js` – axios veya fetch wrapper. Token’ı localStorage’dan al, header’a ekle.
- `authService.js`: `login(username, password)`, `logout()`, `getCurrentUser()`.
- `stockService.js`: `getStockList(params)`, `addStock(data)`, `updateStock(id, data)`, `deleteStock(id)`, `getKritikStock()`, `getMiadYaklasan(gun)`.
- `prescriptionService.js`: `getReceteList()`, `addRecete(data)`, `updateReceteDurum(id, durum)`.

**Mock veri stratejisi (BE hazır olana kadar):**

- `services/mock/` klasörü altında JSON dosyaları veya `json-server` kullanılacak. Ancak BE ile paralel geliştirme için `api.js` içinde `import.meta.env.VITE_USE_MOCK === 'true'` kontrolü ile mock fonksiyonları çağırabiliriz. Daha basit: BE hazır olana kadar `stockService.js` içindeki fonksiyonlar `Promise.resolve(mockData)` döndürsün. Sonra base URL değiştirilir.

### **4. Context’lerin Kurulması (State Yönetimi)**

- **AuthContext:**
    - `user`, `token`, `role` state’leri.
    - `login()`: API’ye istek atar, başarılıysa token ve user’ı kaydeder, localStorage’a yazar.
    - `logout()`: state’i temizler, localStorage’dan token’ı siler.
    - `isAuthenticated`, `isEczaci`, `isKalfa` helper’ları.
- **StockContext:**
    - `stockList`, `loading`, `error`.
    - `fetchStockList()`, `addStock()`, `updateStock()`, `deleteStock()` (yetki kontrolü yapılır).
    - `kritikStockList` ve `miadYaklasanList` computed (veya ayrı API çağrısı).
- **PrescriptionContext:**
    - `prescriptionList`, `loading`, `error`.
    - `fetchPrescriptions()`, `addPrescription()`, `updatePrescriptionStatus()`.

### **5. Routing ve Sayfa Yapısı**

- `App.jsx` içinde `BrowserRouter`, `Routes`, `Route`.
- **Public Route:** `/login`
- **Private Route wrapper:** `/dashboard`, `/stock`, `/prescription` gibi rotalar. Token kontrolü yapar, yoksa `/login`’e yönlendirir.
- **Rol bazlı sayfalar:** Eczacılar `/users` sayfasını görebilir (kullanıcı listesi ve yeni kalfa ekleme). Kalfalar bu sayfayı görmez. Bunu `PrivateRoute` içinde kontrol edebiliriz.

**Sayfalar (Pages):**

- `LoginPage` – sadece giriş formu.
- `DashboardPage` – özet kartlar (toplam ilaç sayısı, kritik stok sayısı, bekleyen reçete sayısı), son hareketler.
- `StockListPage` – stok tablosu (arama, filtreleme, sayfalama), yeni ilaç ekleme butonu (eczacı için), düzenleme/silme butonları.
- `StockAddPage` / `StockEditPage` – form (ilaç adı, barkod, stok miktarı, kritik eşik, son kullanma tarihi).
- `PrescriptionListPage` – reçete listesi, durum filtresi, yeni reçete butonu.
- `PrescriptionAddPage` – reçete formu (hasta bilgileri, doktor bilgileri, ilaç seçimi (dropdown) ve kullanım talimatı). İlaç listesi StockContext’ten çekilecek.
- `UserListPage` (sadece eczacı) – kullanıcıları listele, yeni kalfa ekle, sil.

### **6. Ortak Bileşenlerin Geliştirilmesi**

- `Button` (variant: primary, secondary, danger), `Input`, `Select`, `Modal`, `Table`, `Card`, `LoadingSpinner`, `SkeletonTable`.
- `Navbar` (marka, menü linkleri, kullanıcı adı ve rol, çıkış butonu) – responsive (mobilde hamburger menü).
- `Sidebar` (isteğe bağlı, ancak navbar yeterli olabilir). Karar: navbar + altında içerik.

### **7. Form Yönetimi ve Validasyon (react-hook-form + zod)**

- Her form için şema (zod):
    - Login: `{ username: string.min(1), password: string.min(1) }`
    - İlaç: `{ ilac_adi: string.min(2), barkod: string.optional(), stok_miktari: number.int().min(0), kritik_stok_eşiği: number.int().min(0), son_kullanma_tarihi: date }`
    - Reçete: `{ hasta_ad_soyad: string, doktor_ad_soyad: string, recete_tarihi: date, ilaclar: array of { ilac_id, kullanilan_miktar, talimat } }`
- Form submit’te API servisini çağır, başarılı olursa toast bildirimi, sayfayı yenile veya yönlendir.

### **8. API Entegrasyonu (Gerçek BE’ye Geçiş)**

- `.env` dosyasında `VITE_API_BASE_URL=http://localhost:8000/api/v1`
- Tüm servislerde fetch/axios kullanarak bu base URL’e istek at.
- Token’ı `Authorization: Token ${token}` header’ına ekle.
- Hata yakalama: 401 ise logout yapıp login’e yönlendir. 403 ise “Yetkiniz yok” toast’ı. 404, 500 gibi hataları toast ile göster.

### **9. Responsive Tasarım ve Stil**

- Bootstrap 5’in grid sistemi kullanılacak.
- `index.css` veya `App.scss` içinde özel stiller (renkler, fontlar).
- Mobil görünümde tablolar `table-responsive` sınıfı ile yatay kaydırılabilir. Daha iyi deneyim için küçük ekranda tablo yerine kart listesi (isteğe bağlı, sprint 1 için yeterli değilse tablo kaydırma yeterlidir).
- Navbar collapse (Bootstrap navbar).

### **10. Git İş Akışı ve Teslimat**

- Feature branch: `feature/frontend-login`, `feature/frontend-stock` vb.
- Pull request oluştur, Mehmet veya ekip lideri onayıyla `develop` branch’ine merge.
- Sprint sonunda `main` branch’i güncelle ve `git tag v1.0-sprint1` ekle.

---

## **Kişi Bazlı Görev Atamaları (Front-End Birimi)**

| **Kişi** | **Görevler** | **Teslim Çıktısı** | **Notlar** |
| --- | --- | --- | --- |
| **Berat**  | - Proje yapısını kurma (Vite, klasörler, bağımlılıklar).- API servis katmanını yazma (`api.js`, `authService`, `stockService`, `prescriptionService`).- `AuthContext` ve login sayfası.- `PrivateRoute` ve routing yapısı.- BE ile API sözleşmesi görüşmeleri (Mehmet, Begli).- Entegrasyon testlerini yönetme. | Çalışan FE projesi, auth yapısı, routing, servisler |  |
| **Kaan** | - `StockContext` ve `StockListPage` (tablo, arama, filtre, sayfalama).- Kritik stok ve miad yaklaşan bileşenleri (kartlar veya uyarılar).- `StockForm` (ekleme/düzenleme) modal veya sayfa.- Stokla ilgili API servislerinin kullanımı. | Stock modülü (listeleme, ekleme, güncelleme, silme) | Stok odaklı. |
| **Aslı** | - `PrescriptionContext` ve `PrescriptionListPage` (tablo, durum filtresi).- `PrescriptionForm` (reçete ekleme, ilaç seçimi dropdown, talimat).- Reçete durum güncelleme (buton veya select).- Reçete API servisleri entegrasyonu. | Reçete modülü (listeleme, ekleme, durum güncelleme) | Reçete odaklı. |
| **İrem** | - `DashboardPage` (özet kartlar, son hareketler).- `Navbar` ve responsive layout (Bootstrap).- Ortak UI bileşenleri (Button, Input, Modal, LoadingSpinner, Toast bildirimleri).- `UserListPage` (sadece eczacılar için) – kullanıcı listesi ve yeni kalfa ekleme formu.- Tüm sayfalarda hata ve yükleme durumlarını yönetme. | Dashboard, navbar, ortak bileşenler, kullanıcı yönetimi (eczacıya özel) | UI/UX ve genel layout. |

**Ortak Sorumluluklar (Tüm FE Ekibi):**

- Kod stillendirme (ESLint + Prettier – Mehmet belirleyecek).
- GitFlow kullanımı (feature branch’ler, anlamlı commit mesajları).
- Haftalık toplantılarda ilerleme gösterme.

---

## **Zaman Planı (Sprint 1 – Tahmini 5 iş günü)**

| **Gün** | **Yapılacak İş** |
| --- | --- |
| 1 | Proje kurulumu (Vite, klasör yapısı, bağımlılıklar), API servis katmanı (mock ile), `AuthContext` ve login sayfası, routing. |
| 2 | `StockContext` ve stok listeleme sayfası (tablo, arama, sayfalama). Stok ekleme/düzenleme formu (modal). |
| 3 | `PrescriptionContext` ve reçete listeleme, reçete ekleme formu (ilaç seçimi dropdown ile). Reçete durum güncelleme. |
| 4 | Dashboard sayfası (özet kartlar), navbar, responsive düzenlemeler, ortak bileşenler, toast bildirimleri. |
| 5 | `UserListPage` (eczacı için), hata ve yükleme durumlarının tamamlanması, BE entegrasyonu (gerçek API’ye geçiş), test ve hata düzeltmeleri. |

---