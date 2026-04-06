## **Veritabanı (DB) Birimi –  (Sprint 1)**

### **Önceden Netleştirilmiş Kararlar**

| **#** | **Karar Konusu** | **Alınan Karar** |
| --- | --- | --- |
| 1 | **VTYS** | SQLite (Django varsayılanı, standalone) |
| 2 | **Tablo isimlendirme** | `app_model` formatında, tekil, küçük harf, alt çizgi |
| 3 | **Birincil anahtar** | `id` (AutoField, otomatik artan) |
| 4 | **Soft delete** | `is_deleted` (BooleanField, default=False) – tüm önemli tablolarda |
| 5 | **Zaman damgaları** | `created_at`, `updated_at` (DateTimeField, auto_now_add ve auto_now) – tüm tablolarda |
| 6 | **Audit log** | DB’de tablo yok, Back-End katmanında tutulacak (model veya signal) |
| 7 | **Kullanıcı/yetki** | Django built-in `auth_user`, `auth_group`, `auth_permission` (genişletme yok) |
| 8 | **Barkod alanı** | `barkod` CharField(max_length=50, unique=True, null=True, blank=True) |
| 9 | **Reçete hasta/doktor** | Basit metin alanları (normalizasyon sonraki sprintlerde) |
| 10 | **Stok hareket tablosu** | Ayrı `StokHareket` tablosu (giriş/çıkış/satış logu) |
| 11 | **Miad (SKT)** | `son_kullanma_tarihi` (DateField, null=True) |
| 12 | **Kritik stok eşiği** | `kritik_stok_eşiği` (IntegerField, default=10) |
| 13 | **Yedekleme** | Sprint 1’de manuel kopyalama yeterli (daha sonra script eklenebilir) |
| 14 | **Migration yönetimi** | Yusuf (ortak görev) tarafından yapılacak |
| 15 | **İndeksler** | `barkod`, `ilac_adi`, `recete_tarihi`, `stok_hareket.islem_tarihi`, `auth_user.username` |

---

### **1. Veritabanı Şema Tasarımı (ER Diyagramı)**

Aşağıdaki tablolar (Django modellerine dönüşecek) tasarlanacaktır.

### **1.1. Kullanıcı ve Yetki (Django built-in)**

- `auth_user` (id, username, password, email, first_name, last_name, is_active, date_joined, ...)
- `auth_group` (id, name)
- `auth_user_groups` (user_id, group_id) – many-to-many ilişki

### **1.2. Stok Yönetimi (`stock` app)**

**Tablo: `stock_ilac`**

| **Alan** | **Tip** | **Kısıt** | **Açıklama** |
| --- | --- | --- | --- |
| id | AutoField | PK |  |
| ilac_adi | CharField(200) | Not null |  |
| barkod | CharField(50) | Unique, null |  |
| stok_miktari | IntegerField | Default 0 |  |
| kritik_stok_eşiği | IntegerField | Default 10 |  |
| son_kullanma_tarihi | DateField | Null |  |
| is_deleted | BooleanField | Default False | Soft delete |
| created_at | DateTimeField | Auto now add |  |
| updated_at | DateTimeField | Auto now |  |

**Tablo: `stock_stokhareket`**

| **Alan** | **Tip** | **Kısıt** | **Açıklama** |
| --- | --- | --- | --- |
| id | AutoField | PK |  |
| ilac | ForeignKey(Ilac) | On_delete=PROTECT |  |
| miktar | IntegerField | Pozitif/negatif | Giriş (+), çıkış (-) |
| islem_tipi | CharField(20) | Choices: giris, cikis, satis |  |
| aciklama | CharField(255) | Null |  |
| kullanici | ForeignKey(auth_user) | On_delete=PROTECT | İşlemi yapan |
| islem_tarihi | DateTimeField | Auto now add |  |
| created_at | DateTimeField | Auto now add | (opsiyonel, islem_tarihi yeterli) |

### **1.3. Reçete Yönetimi (`prescription` app)**

**Tablo: `prescription_recete`**

| **Alan** | **Tip** | **Kısıt** | **Açıklama** |
| --- | --- | --- | --- |
| id | AutoField | PK |  |
| recete_no | CharField(20) | Unique, otomatik üretilebilir | İlk sprintte AutoField da olabilir, ancak unique bir alan önerilir |
| hasta_ad_soyad | CharField(100) | Not null |  |
| hasta_tc | CharField(11) | Null, blank | İleride kullanılabilir |
| doktor_ad_soyad | CharField(100) | Not null |  |
| doktor_diploma_no | CharField(50) | Null |  |
| recete_tarihi | DateField | Not null |  |
| durum | CharField(20) | Choices: bekliyor, teslim_edildi | Default: bekliyor |
| is_deleted | BooleanField | Default False |  |
| created_at | DateTimeField | Auto now add |  |
| updated_at | DateTimeField | Auto now |  |

**Tablo: `prescription_receteilac`** (Reçete-İlaç ilişkisi)

| **Alan** | **Tip** | **Kısıt** | **Açıklama** |
| --- | --- | --- | --- |
| id | AutoField | PK |  |
| recete | ForeignKey(Recete) | On_delete=CASCADE |  |
| ilac | ForeignKey(Ilac) | On_delete=PROTECT |  |
| kullanilan_miktar | IntegerField | Default 1 |  |
| talimat | TextField | Null | Kullanım talimatı |

### **1.4. Audit Log (Back-End tarafından oluşturulacak – DB birimi sadece bilgilendirme)**

- Back-End ekibi `audit` app’i oluşturacak ve `AuditLog` modelini yazacak. DB birimi bu modelin varlığını bilmeli, ancak tasarımını yapmayacak (BE sorumluluğu). Yine de ER diyagramında gösterilebilir.

---

### **2. ER Diyagramının Çizilmesi ve Onaylanması**

- **Araç:** [draw.io](https://draw.io/) veya [dbdiagram.io](https://dbdiagram.io/) (tercih: [dbdiagram.io](https://dbdiagram.io/) – DSL ile hızlı).
- **Çıktı:** PDF/PNG olarak `/docs/er_diagram.png` repo’ya eklenecek.
- **İlişkilerin gösterilmesi:**
    - `stock_stokhareket.ilac` → `stock_ilac.id` (PROTECT)
    - `stock_stokhareket.kullanici` → `auth_user.id` (PROTECT)
    - `prescription_receteilac.recete` → `prescription_recete.id` (CASCADE)
    - `prescription_receteilac.ilac` → `stock_ilac.id` (PROTECT)
- **Onay süreci:** Beyza (DB lideri) taslağı hazırlar, Mehmet ve Yusuf onaylar. Onay sonrası final sürüm repo’ya konur.

---

### **3. Veri Tipleri ve Kısıtlamaların Detaylandırılması**

- **Metin alanları maksimum uzunluklar:**
    - ilac_adi: 200
    - barkod: 50
    - hasta_ad_soyad: 100
    - doktor_ad_soyad: 100
    - recete_no: 20 (otomatik oluşturma için format `RX{year}{seq}` düşünülebilir, ancak ilk sprintte integer auto-increment da yeterli)
- **Choices:**
    - `islem_tipi`: [('giris', 'Giriş'), ('cikis', 'Çıkış'), ('satis', 'Satış')]
    - `durum`: [('bekliyor', 'Bekliyor'), ('teslim_edildi', 'Teslim Edildi')]
- **Varsayılan değerler:**
    - `stok_miktari`: 0
    - `kritik_stok_eşiği`: 10
    - `is_deleted`: False
    - `durum`: 'bekliyor'

---

### **4. Index ve Performans Optimizasyonları**

- Django’da `db_index=True` eklenecek alanlar:
    - `stock_ilac.barkod` (unique olduğu için otomatik index)
    - `stock_ilac.ilac_adi` (arama için)
    - `stock_ilac.son_kullanma_tarihi` (miad sorguları)
    - `stock_stokhareket.islem_tarihi`
    - `prescription_recete.recete_tarihi`
    - `prescription_recete.durum`
    - `auth_user.username` (Django zaten indexler)

---

### **5. Models.py’ye Dönüşüm (Yusuf liderliğinde)**

- DB birimi ER diyagramını ve alan listesini tamamladıktan sonra **Yusuf** ilgili app’lerin `models.py` dosyalarını yazacak.
- Her app için ayrı models.py (stock, prescription). users app’i için Django built-in kullanılacağından ek model yok.
- Örnek kod (stock/models.py):

python

```
from django.db import models
from django.conf import settings

class Ilac(models.Model):
    ilac_adi = models.CharField(max_length=200)
    barkod = models.CharField(max_length=50, unique=True, null=True, blank=True)
    stok_miktari = models.IntegerField(default=0)
    kritik_stok_esigi = models.IntegerField(default=10)
    son_kullanma_tarihi = models.DateField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.ilac_adi

class StokHareket(models.Model):
    ISLEM_TIPLERI = [
        ('giris', 'Giriş'),
        ('cikis', 'Çıkış'),
        ('satis', 'Satış'),
    ]
    ilac = models.ForeignKey(Ilac, on_delete=models.PROTECT, related_name='hareketler')
    miktar = models.IntegerField()
    islem_tipi = models.CharField(max_length=20, choices=ISLEM_TIPLERI)
    aciklama = models.CharField(max_length=255, blank=True, null=True)
    kullanici = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    islem_tarihi = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.ilac.ilac_adi} -{self.miktar} -{self.islem_tipi}"
```

- Benzer şekilde prescription app modelleri yazılacak.
- **Migration işlemleri:**
    
    bash
    
    ```
    python manage.py makemigrations stock prescription
    python manage.py migrate
    ```
    

---

### **6. Test Verilerinin (Fixtures) Hazırlanması**

- Örnek veriler JSON formatında hazırlanacak:
    - 2 kullanıcı (eczacı ve kalfa) – ancak kullanıcı oluşturma Django shell veya admin panel ile yapılabilir. Fixture olarak `auth_user` eklenebilir, ancak şifre hash’leme sorun olabilir. **Alternatif:** `python manage.py dumpdata` ile mevcut verileri çıkarmak yerine, `initial_data.json` içinde yalnızca ilaç, stok hareketi ve reçete örnekleri tutulacak. Kullanıcılar manuel olarak `createsuperuser` ile oluşturulacak.
- Önerilen fixture içeriği:
    - 5 ilaç (parol, aspird, vb.)
    - 2 stok hareketi (giriş)
    - 1 reçete (bekliyor durumda)
- Fixture’ı yükleme: `python manage.py loaddata initial_data.json`

---

### **7. DB – Back-End Entegrasyon Testi**

- Yusuf, migration sonrası Django shell üzerinde model CRUD işlemlerini test edecek.
- Admin panel (`/admin`) üzerinden tüm modellerin görüntülenip düzenlenebildiğini kontrol edecek.
- Back-End ekibi (Begli, Yaren) ile birlikte API’lerin veritabanına doğru yazdığını test edecek (örneğin POST /api/v1/stock/ ile yeni ilaç eklenmesi).

---

### **8. Dokümantasyon ve Repo’ya Yükleme**

- ER diyagramı (PDF/PNG) `/docs/` klasörüne eklenecek.
- Tablo şeması açıklaması (Markdown) `/docs/database_schema.md` olarak yazılacak.
- Migration dosyaları (`/backend/stock/migrations/`, `/backend/prescription/migrations/`) repo’da yer alacak.
- Tüm DB ekibi kendi görevlerini tamamladıktan sonra `develop` branch’ine pull request açacak.

---

## **Kişi Bazlı Görev Atamaları (Veritabanı Birimi)**

| **Kişi** | **Görevler** | **Teslim Çıktısı** |
| --- | --- | --- |
| **Beyza** (DB Lideri) | - ER diyagramının çizilmesi ([draw.io/dbdiagram](https://draw.io/dbdiagram)).- Tablolar arası ilişkilerin (PK/FK) tanımlanması.- Normalizasyon kontrolleri (3NF).- Veri tipleri ve kısıtlamaların belirlenmesi.- Onay için Mehmet ve Yusuf’a sunulması.- Dokümantasyonun yazılması (`database_schema.md`). | ER diyagramı (PDF/PNG), şema dokümanı (MD) |
| **Dovlet** | - Stok modülü tablolarının (`Ilac`, `StokHareket`) detaylandırılması.- Kritik stok ve miad takibi için gerekli alanların belirlenmesi.- Örnek SQL sorguları yazılması (kritik stok listesi, miad yaklaşan).- Fixture (test verisi) hazırlanmasına yardım. | Alan listesi, örnek sorgular, fixture veri önerileri |
| **Yusuf** (Entegratör – DB+BE) | - DB biriminin hazırladığı şemayı Django `models.py` sınıflarına dönüştürmek (stock, prescription).- Migration işlemlerini yapmak (`makemigrations`, `migrate`).- Admin panelde modellerin kayıtlı olduğunu test etmek.- Fixture (`initial_data.json`) hazırlamak ve yüklemek.- DB-BE arası uyumu sağlamak (Begli ile birlikte). | `models.py` (stock, prescription), migration dosyaları, `initial_data.json` |

---

## **Zaman Planı (Sprint 1 – 5 iş günü)**

| **Gün** | **Yapılacak İş** | **Sorumlu** |
| --- | --- | --- |
| **Gün 1** | ER diyagramı taslağının çizilmesi, tabloların ve ilişkilerin belirlenmesi. | Beyza, Dovlet |
| **Gün 2** | ER diyagramının gözden geçirilmesi, onay alınması (Mehmet, Yusuf). Gerekli düzeltmelerin yapılması. | Beyza, Mehmet, Yusuf |
| **Gün 3** | Yusuf’un `models.py` dönüşümü (stock, prescription). İlk migration oluşturulması. | Yusuf |
| **Gün 4** | Migration’ların SQLite’a uygulanması, admin panel kayıtları, fixture verilerin hazırlanması ve yüklenmesi. | Yusuf, Dovlet |
| **Gün 5** | DB-BE entegrasyon testi (Begli ile birlikte), dokümantasyonun tamamlanması, repo’ya yükleme. | Tüm DB ekibi + Begli |

---

## **Teslim Edilecek Çıktılar (Sprint 1 Sonu)**

- **ER diyagramı** (PDF/PNG) – `/docs/er_diagram.png`
- **Şema dokümanı** (Markdown) – `/docs/database_schema.md`
- **Django modelleri** (`stock/models.py`, `prescription/models.py`)
- **Migration dosyaları** (`/backend/stock/migrations/`, `/backend/prescription/migrations/`)
- **Fixture verisi** (`/backend/fixtures/initial_data.json`)
- **Admin panel üzerinden tüm modellerin görüntülenebildiğine dair test raporu**