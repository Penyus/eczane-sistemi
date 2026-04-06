Bu rehber, **Eczane Stok ve Reçete Kayıt Sistemi** projesine başlamak için gerekli adımları içerir. Tüm ekip üyeleri (Back-End, Front-End, Veritabanı) bu adımları takip ederek geliştirme ortamını kurabilir.

---

## **1. Gereksinimler**

### **Ortak Gereksinimler**

- **Git** (v2.30+): [İndir](https://git-scm.com/downloads)
- **GitHub hesabı** (takım üyesi olarak repo’ya eklenmiş olmalısınız)
- **VS Code** (önerilen) veya tercih ettiğiniz IDE

### **Back-End ve Veritabanı Ekibi İçin**

- **Python 3.12+** (3.12 veya 3.13) – [İndir](https://python.org/)
- **pip** (Python ile gelir)
- **virtualenv** (isteğe bağlı, `python -m venv` kullanacağız)

### **Front-End Ekibi İçin**

- **Node.js 18+** (LTS önerilir) – [İndir](https://nodejs.org/)
- **npm** (Node.js ile gelir) veya **yarn**

---

## **2. GitHub Reposu ve Erişim**

- **Repo URL:** `https://github.com/Penyus/eczane-sistemi.git`
- **Varsayılan dal (branch):** `develop` (tüm geliştirmeler buradan feature dalı açılarak yapılır)
- **Ana dal:** `main` (sadece sprint sonlarında güncellenir)

### **2.1. Repo’yu Klonlama**

bash

```
git clone https://github.com/Penyus/eczane-sistemi.git
cd eczane-sistemi
```

### **2.2. Uzak Dalları Görme ve Develop Dalına Geçme**

bash

```
git branch -a                # tüm uzak dalları listele
git checkout develop         # develop dalına geç
git pull origin develop      # en son güncellemeleri çek
```

### **2.3. Feature Dalı Oluşturma (Her Görev İçin)**

Her yeni görev veya hata düzeltmesi için ayrı bir feature dalı açın.

bash

```
# Örnek: stok modülü için
git checkout -b feature/be-stok-modulu
# veya front-end için
git checkout -b feature/fe-login-sayfasi
```

**Dal adlandırma kuralı:** `feature/<kisa-aciklama>` veya `bugfix/<aciklama>`

---

## **3. Proje Dizini Yapısı (Klonlandıktan Sonra)**

text

```
eczane-sistemi/
├── backend/                 # Django projesi
│   ├── eczane_sistemi/      # ana proje ayarları
│   ├── users/               # kullanıcı ve auth uygulaması
│   ├── stock/               # stok yönetimi
│   ├── prescription/        # reçete yönetimi
│   ├── audit/               # log tutma
│   ├── manage.py
│   └── requirements.txt
├── frontend/                # React + Vite projesi
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── .env
├── docs/                    # dokümantasyon (ER diyagramı, şema, vs.)
└── README.md
```

> **Not:** Eğer bu klasörler boşsa veya yoksa, lütfen takım liderine (Mehmet) bildirin. İlk kurulumu o yapacaktır.
> 

---

## **4. Back-End ve Veritabanı Ekibi İçin Kurulum**

### **4.1. Sanal Ortam Oluşturma ve Aktifleştirme**

bash

```
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate
```

### **4.2. Bağımlılıkları Yükleme**

bash

```
pip install -r requirements.txt
```

Eğer `requirements.txt` henüz yoksa (ilk kurulumda), şu komutla oluşturun:

bash

```
pip install django djangorestframework django-cors-headers drf-spectacular pytest-django
pip freeze > requirements.txt
```

### **4.3. Veritabanı Migration’larını Uygulama**

bash

```
python manage.py makemigrations
python manage.py migrate
```

### **4.4. Süper Kullanıcı (Admin) Oluşturma**

bash

```
python manage.py createsuperuser
# Kullanıcı adı: admin, e-posta: admin@eczane.com, şifre: admin123 (örnek)
```

### **4.5. Test Verilerini Yükleme (Varsa)**

bash

```
python manage.py loaddata initial_data.json   # fixture varsa
```

### **4.6. Geliştirme Sunucusunu Çalıştırma**

bash

```
python manage.py runserver
```

- API adresi: `http://localhost:8000/api/v1/`
- Admin panel: `http://localhost:8000/admin/`
- Swagger dokümantasyonu: `http://localhost:8000/api/docs/`

### **4.7. Testleri Çalıştırma**

bash

```
pytest
# veya coverage ile
pytest --cov=. --cov-report=html
```

---

## **5. Front-End Ekibi İçin Kurulum**

### **5.1. Bağımlılıkları Yükleme**

bash

```
cd frontend
npm install
```

### **5.2. Ortam Değişkenleri (`.env` dosyası)**

`.env` dosyasını oluşturun (varsa zaten repo’da olmalı, yoksa el ile ekleyin):

env

```
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_USE_MOCK=false   # Back-End hazır değilse true yapın, mock data kullanın
```

### **5.3. Geliştirme Sunucusunu Çalıştırma**

bash

```
npm run dev
```

- Uygulama adresi: `http://localhost:3000`
- Vite HMR (Hot Module Replacement) aktif olacaktır.

### **5.4. Production Build (İleride kullanılacak)**

bash

```
npm run build
```

Statik dosyalar `dist/` klasöründe oluşur.

### **5.5. Linting ve Format Kontrolü**

bash

```
npm run lint        # ESLint
npm run format      # Prettier (eğer tanımlandıysa)
```

---

## **6. Git İş Akışı (GitFlow) – Tüm Ekip İçin**

### **6.1. Günlük Çalışma Döngüsü**

1. **Her gün başında** `develop` dalındaki güncellemeleri kendi feature dalınıza alın:
    
    bash
    
    ```
    git checkout develop
    git pull origin develop
    git checkout feature/benim-dalim
    git merge develop   # veya rebase
    ```
    
2. **Değişiklikleri kaydedin** (anlamlı commit mesajları ile):
    
    bash
    
    ```
    git add .
    git commit -m "feat(stock): kritik stok endpoint'i eklendi"
    ```
    
    **Commit mesaj formatı:**
    
    - `feat(alan): yeni özellik`
    - `fix(alan): hata düzeltmesi`
    - `docs(alan): dokümantasyon güncellemesi`
    - `style(alan): kod stili (noktalama, boşluk)`
    - `refactor(alan): yeniden düzenleme`
    - `test(alan): test ekleme/güncelleme`
    - `chore(alan): yapılandırma, bağımlılık`
    
    Örnekler:
    
    - `feat(stock): ilaç CRUD API'leri tamamlandı`
    - `fix(auth): token süresi kontrolü eklendi`
    - `docs(readme): kurulum adımları güncellendi`
3. **Feature dalınızı uzak repo’ya gönderin:**
    
    bash
    
    ```
    git push origin feature/benim-dalim
    ```
    

### **6.2. Pull Request (PR) Süreci**

- GitHub web arayüzünde `feature/benim-dalim` dalından `develop` dalına **Pull Request** açın.
- PR açıklamasına yaptığınız işi ve test adımlarını yazın.
- En az bir takım arkadaşınızın **review** yapmasını bekleyin.
- Onay aldıktan sonra Mehmet (veya yetkili) merge işlemini yapar.

### **6.3. Sık Kullanılan Git Komutları**

| **Amaç** | **Komut** |
| --- | --- |
| Dal listesi | `git branch -a` |
| Yeni dal oluştur ve geç | `git checkout -b feature/yeni-dal` |
| Dal değiştir | `git checkout develop` |
| Son durumu çek | `git pull origin develop` |
| Değişiklikleri gönder | `git push origin feature/dal-adı` |
| Commit’leri birleştir (merge) | `git merge feature/dal-adı` |

---

## **7. Sık Karşılaşılan Sorunlar ve Çözümleri**

### **7.1. `ModuleNotFoundError: No module named '...'` (Back-End)**

- Sanal ortamın aktif olduğundan emin olun: `which python` (Linux/macOS) veya `where python` (Windows)
- `pip install -r requirements.txt` ile eksikleri yükleyin.

### **7.2. CORS Hatası (Front-End’den API’ye istek atarken)**

- Back-End `settings.py` dosyasında `CORS_ALLOWED_ORIGINS` içinde `http://localhost:3000` olduğunu kontrol edin.
- Back-End sunucusunu yeniden başlatın.

### **7.3. `python manage.py` komutu çalışmıyor**

- `cd backend` klasöründe olduğunuzdan emin olun.
- Sanal ortam aktif değilse aktive edin.

### **7.4. `npm run dev` çalışmıyor (Front-End)**

- Node.js sürümünü kontrol edin: `node -v` (18+ olmalı)
- `node_modules` klasörünü silip `npm install` yeniden yapın.

### **7.5. Yetki hatası: `permission denied` (Git push)**

- GitHub’a SSH ile bağlandığınızdan emin olun veya HTTPS kullanıyorsanız token girin.
- `git remote -v` ile URL’yi kontrol edin.

---

## **8. İletişim ve Yardım**

- **Takım Lideri (Mehmet):** Proje yönetimi, QA, git akışı soruları
- **Back-End Koordinatörü (Begli)**
- **Front-End Koordinatörü (Berat)**
- **Veritabanı Koordinatörü (Beyza)**

> **Not:** Geliştirme ortamında herhangi bir sorun yaşarsanız önce takım içi WhatsApp/Telegram grubuna yazın. Çözülemezse Mehmet’e bildirin.
> 

---

## **9. İlk Kez Kuracaklar İçin Hızlı Kontrol Listesi**

- GitHub repo’sunu klonladım.
- `develop` dalına geçtim.
- Kendi feature dalımı oluşturdum.
- Back-End ise: sanal ortam kurdum, bağımlılıkları yükledim, migrate yaptım, runserver çalışıyor.
- Front-End ise: `npm install` yaptım, `.env` dosyasını oluşturdum, `npm run dev` çalışıyor.
- İlk commit’imi yapıp push’ladım.
- Pull Request açtım (işim bitince).

---

Bu rehberi **sık kullanılanlar** arasına kaydedin. Her sprint başında gözden geçirin. Başarılar!