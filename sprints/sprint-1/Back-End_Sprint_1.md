## **Back-End (BE) Birimi –  (Sprint 1)**

### **Önceden Netleştirilmiş Kararlar**

| **#** | **Karar Konusu** | **Alınan Karar** |
| --- | --- | --- |
| 1 | **Web çerçevesi** | Django 5.x + Django REST Framework (DRF) 3.14+ |
| 2 | **Kimlik doğrulama** | DRF TokenAuthentication (basit, SQLite uyumlu) |
| 3 | **CORS** | `django-cors-headers` – izin verilenler: `http://localhost:3000` (FE), üretimde eczane IP’leri |
| 4 | **API versiyonlama** | `/api/v1/...` prefix |
| 5 | **Hata yanıt formatı** | `{ "success": false, "error": { "code": 400, "message": "...", "details": {} } }`; başarılı: `{ "success": true, "data": {...} }` |
| 6 | **Sayfalama** | DRF `PageNumberPagination`, varsayılan `page_size=20` |
| 7 | **Eşzamanlılık kontrolü** | İlk sprintte yok (optimistic lock sonraki sprint) |
| 8 | **Dosya yükleme** | İlk sprintte yok (kapsam dışı) |
| 9 | **Rate limiting** | Hayır (yerel ağ) |
| 10 | **Audit log** | Back-End katmanında (`audit` app ile middleware/signal) – DB’de ayrı tablo |
| 11 | **Reçete numarası** | Otomatik artan `AutoField` (basit), ancak `recete_no` unique alanı sonradan eklenebilir. İlk sprintte `id` yeterli. |
| 12 | **Soft delete** | Modellerde `is_deleted = BooleanField(default=False)`; API’ler `filter(is_deleted=False)` gösterir |
| 13 | **Django app’leri** | `users`, `stock`, `prescription`, `audit` |
| 14 | **API dokümantasyonu** | `drf-spectacular` (OpenAPI 3, Swagger/ReDoc) |
| 15 | **Unit test** | `pytest-django`; her model, view, serializer için test; kapsam hedefi %80 (tavsiye) |

---

### **1. Ortam Kurulumu ve Proje İskeleti**

### **1.1. Repo’nun Klonlanması ve Dizin Yapısı**

bash

```
git clone https://github.com/Penyus/eczane-sistemi.git
cd eczane-sistemi
mkdir backend
cd backend
```

### **1.2. Sanal Ortam ve Bağımlılıklar**

bash

```
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install django djangorestframework django-cors-headers drf-spectacular pytest-django
pip freeze > requirements.txt
```

### **1.3. Django Projesinin Başlatılması**

bash

```
django-admin startproject eczane_sistemi .
```

### **1.4. Uygulamaların (Apps) Oluşturulması**

bash

```
python manage.py startapp users
python manage.py startapp stock
python manage.py startapp prescription
python manage.py startapp audit
```

### **1.5. `settings.py` Yapılandırması**

- `INSTALLED_APPS`’e ekle:
    
    python
    
    ```
    'rest_framework',
    'corsheaders',
    'drf_spectacular',
    'users',
    'stock',
    'prescription',
    'audit',
    ```
    
- `MIDDLEWARE`’e `'corsheaders.middleware.CorsMiddleware'` (en üstte).
- `CORS_ALLOWED_ORIGINS = ["http://localhost:3000"]`
- `REST_FRAMEWORK` ayarları:
    
    python
    
    ```
    REST_FRAMEWORK = {
        'DEFAULT_AUTHENTICATION_CLASSES': [
            'rest_framework.authentication.TokenAuthentication',
        ],
        'DEFAULT_PERMISSION_CLASSES': [
            'rest_framework.permissions.IsAuthenticated',
        ],
        'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
        'PAGE_SIZE': 20,
        'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    }
    ```
    
- `SPECTACULAR_SETTINGS` (isteğe bağlı, proje adı vs.)
- `AUTH_USER_MODEL` değiştirilmeyecek (Django’nun default User modeli kullanılacak).

### **1.6. URL Yapılandırması (`eczane_sistemi/urls.py`)**

python

```
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('users.urls')),
    path('api/v1/', include('stock.urls')),
    path('api/v1/', include('prescription.urls')),
    path('api/v1/', include('audit.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
```

---

### **2. Veritabanı Modellemesi (DB Birimi ile Koordineli)**

- DB biriminin ER diyagramı onaylandıktan sonra **Yusuf** (ortak görev) modelleri yazacaktır.
- **Stock App Modelleri** (`stock/models.py`):
    - `Ilac` (id, ilac_adi, barkod, stok_miktari, kritik_stok_esigi, son_kullanma_tarihi, is_deleted, created_at, updated_at)
    - `StokHareket` (id, ilac, miktar, islem_tipi, aciklama, kullanici, islem_tarihi)
- **Prescription App Modelleri** (`prescription/models.py`):
    - `Recete` (id, hasta_ad_soyad, hasta_tc, doktor_ad_soyad, doktor_diploma_no, recete_tarihi, durum, is_deleted, created_at, updated_at)
    - `ReceteIlac` (id, recete, ilac, kullanilan_miktar, talimat)
- **Audit App Modeli** (`audit/models.py`):
    - `AuditLog` (id, user, action, model_name, object_id, old_data, new_data, timestamp)
- **Users App**: Django built-in kullanıldığından ek model yok; sadece serializer ve view.

**Migration İşlemleri:**

bash

```
python manage.py makemigrations stock prescription audit
python manage.py migrate
```

---

### **3. Serializer ve ViewSet’lerin Geliştirilmesi**

### **3.1. Users App**

- `users/serializers.py`: `UserSerializer` (id, username, email, first_name, last_name, groups), `GroupSerializer`
- `users/views.py`: `UserViewSet` (list, create, update, destroy – sadece eczacı yetkisi), `GroupViewSet` (listeleme)
- `users/urls.py`: router ile `/users`, `/groups`

### **3.2. Stock App**

- `stock/serializers.py`: `IlacSerializer` (tüm alanlar), `StokHareketSerializer` (ilac_id, miktar, islem_tipi, aciklama)
- `stock/views.py`:
    - `IlacViewSet`: CRUD, ek olarak `kritik_stok()` ve `miad_yaklasan()` custom actions (GET)
    - `StokHareketViewSet`: list, create (perform_create içinde ilac.stok_miktari güncellenecek)
- `stock/urls.py`: router ile kayıt

### **3.3. Prescription App**

- `prescription/serializers.py`: `ReceteSerializer` (recete_ilaclar nested), `ReceteIlacSerializer`
- `prescription/views.py`:
    - `ReceteViewSet`: CRUD, `durum_guncelle` custom action (PATCH)
    - `ReceteIlacViewSet` (isteğe bağlı, genellikle ReceteSerializer içinde yönetilir)
- `prescription/urls.py`: router ile kayıt

### **3.4. Audit App**

- `audit/serializers.py`: `AuditLogSerializer`
- `audit/views.py`: `AuditLogViewSet` (sadece listeleme, sadece eczacı yetkisi)
- `audit/urls.py`: router ile `/audit-logs`

---

### **4. Yetkilendirme (RBAC) – Permission Sınıfları**

- `users/permissions.py`:
    
    python
    
    ```
    from rest_framework import permissions
    
    class IsEczaci(permissions.BasePermission):
        def has_permission(self, request, view):
            return request.user.groups.filter(name='Eczaci').exists()
    
    class IsKalfa(permissions.BasePermission):
        def has_permission(self, request, view):
            return request.user.groups.filter(name='Kalfa').exists()
    ```
    
- **ViewSet’lere uygulama**:
    - `UserViewSet`, `AuditLogViewSet`: `[IsAuthenticated, IsEczaci]`
    - `IlacViewSet`: eczacı tüm işlemler; kalfa için `get_permissions` override edilerek: `list`, `retrieve`, `update` (stok miktarı güncelleme) izni, `create`, `destroy` izni yok.
    - `StokHareketViewSet`: eczacı ve kalfa oluşturabilir (stok giriş/çıkış). Listeleme her ikisine de açık.
    - `ReceteViewSet`: eczacı ve kalfa (kalfa ekleme, durum güncelleme yapabilir).
- **Grupların oluşturulması** (data migration veya shell):
    
    python
    
    ```
    from django.contrib.auth.models import Group
    Group.objects.get_or_create(name='Eczaci')
    Group.objects.get_or_create(name='Kalfa')
    ```
    

---

### **5. İş Mantığı (Business Logic)**

### **5.1. Stok Miktarı Güncelleme (StokHareket oluşturulduğunda)**

- `StokHareketViewSet` içinde `perform_create` metodunu override et:
    
    python
    
    ```
    def perform_create(self, serializer):
        hareket = serializer.save(kullanici=self.request.user)
        ilac = hareket.ilac
        ilac.stok_miktari += hareket.miktar   # miktar pozitif veya negatif
        ilac.save()
    ```
    

### **5.2. Kritik Stok Endpoint’i**

- `IlacViewSet` içinde `@action(detail=False, methods=['get'])`
    
    python
    
    ```
    def kritik_stok(self, request):
        ilaclar = self.get_queryset().filter(stok_miktari__lte=F('kritik_stok_esigi'))
        serializer = self.get_serializer(ilaclar, many=True)
        return Response(serializer.data)
    ```
    

### **5.3. Miad Yaklaşan Endpoint’i**

- `@action(detail=False, methods=['get'])`, query parametresi `gun` (varsayılan 30)
    
    python
    
    ```
    def miad_yaklasan(self, request):
        gun = int(request.query_params.get('gun', 30))
        bugun = timezone.now().date()
        sinir = bugun + timedelta(days=gun)
        ilaclar = self.get_queryset().filter(son_kullanma_tarihi__lte=sinir, son_kullanma_tarihi__gte=bugun)
        serializer = self.get_serializer(ilaclar, many=True)
        return Response(serializer.data)
    ```
    

### **5.4. Reçete Durum Güncelleme**

- `ReceteViewSet` içinde `@action(detail=True, methods=['patch'])`
    
    python
    
    ```
    def durum_guncelle(self, request, pk=None):
        recete = self.get_object()
        new_durum = request.data.get('durum')
        if new_durum in dict(Recete.DURUM_CHOICES):
            recete.durum = new_durum
            recete.save()
            return Response({'status': 'updated'})
        return Response({'error': 'Geçersiz durum'}, status=400)
    ```
    

### **5.5. Audit Log (Middleware veya Signal)**

- **Signal yaklaşımı** (daha temiz): `django.db.models.signals.post_save` ve `pre_delete` ile `AuditLog` oluştur.
- `audit/signals.py`:
    
    python
    
    ```
    @receiver(post_save)
    def log_save(sender, instance, created, **kwargs):
        if sender in [Ilac, Recete, StokHareket, User]:
            action = 'CREATE' if created else 'UPDATE'
            # ... kaydet
    ```
    
- `apps.py` içinde `ready()` metodunda signal’ları import et.

---

### **6. API Endpoint’leri ve Dokümantasyon**

### **6.1. Endpoint Listesi (Özet)**

| **Method** | **Endpoint** | **Açıklama** | **Yetki** |
| --- | --- | --- | --- |
| POST | `/api/v1/auth/login/` | Token al | Herkes |
| POST | `/api/v1/auth/logout/` | Token sil | Giriş yapmış |
| GET | `/api/v1/users/` | Kullanıcı listesi | Eczacı |
| POST | `/api/v1/users/` | Yeni kalfa oluştur | Eczacı |
| GET | `/api/v1/stock/` | İlaç listesi | Eczacı, Kalfa |
| POST | `/api/v1/stock/` | İlaç ekle | Eczacı |
| PUT/PATCH | `/api/v1/stock/{id}/` | İlaç güncelle | Eczacı (tüm alanlar), Kalfa (sadece stok_miktari?) – Kalfa için ayrı bir endpoint veya izin kontrolü |
| DELETE | `/api/v1/stock/{id}/` | İlaç sil (soft) | Eczacı |
| GET | `/api/v1/stock/kritik_stok/` | Kritik stok listesi | Eczacı, Kalfa |
| GET | `/api/v1/stock/miad_yaklasan/?gun=30` | Miad yaklaşan | Eczacı, Kalfa |
| POST | `/api/v1/stock/hareket/` | Stok giriş/çıkış | Eczacı, Kalfa |
| GET | `/api/v1/prescription/` | Reçete listesi | Eczacı, Kalfa |
| POST | `/api/v1/prescription/` | Reçete ekle | Eczacı, Kalfa |
| PATCH | `/api/v1/prescription/{id}/durum_guncelle/` | Durum güncelle | Eczacı, Kalfa |
| GET | `/api/v1/audit-logs/` | Denetim kayıtları | Eczacı |
| GET | `/api/docs/` | Swagger UI | Herkes (geliştirme) |

### **6.2. Token Authentication İşlemleri**

- `users/views.py` içinde `obtain_auth_token` (DRF hazır) kullanılacak.
- Login endpoint’i: `POST /api/v1/auth/login/` (username, password) → token döner.
- Logout: token’ı silmek için `Token.objects.filter(key=token).delete()` yapan bir view.

### **6.3. Dokümantasyon**

- `drf-spectacular` sayesinde `/api/docs/` adresinde Swagger arayüzü.
- FE ekibi buradan API’leri inceleyebilir.

---

### **7. Unit Testler (pytest-django)**

- Her app için `tests.py` veya `tests/` klasörü.
- **Zorunlu testler**:
    - Model testleri (str, constraints)
    - Serializer validasyonları
    - ViewSet testleri (authenticated, permission, CRUD)
    - İş mantığı (stok güncelleme, kritik stok, miad)
- Örnek (`stock/tests.py`):
    
    python
    
    ```
    import pytest
    from rest_framework.test import APIClient
    from django.contrib.auth.models import User
    
    @pytest.mark.django_db
    def test_kritik_stok_endpoint():
        client = APIClient()
        user = User.objects.create_user(username='test', password='test')
        client.force_authenticate(user=user)
        response = client.get('/api/v1/stock/kritik_stok/')
        assert response.status_code == 200
    ```
    
- Coverage: `pytest --cov=. --cov-report=html`

---

### **8. Entegrasyon ve Teslimat**

### **8.1. DB Entegrasyon Testi**

- Yusuf, migration’ların sorunsuz çalıştığını ve modellerin admin panelde göründüğünü test eder.
- Basit bir ilaç ekleme işlemi (Django shell veya admin) yapılır.

### **8.2. FE ile Entegrasyon**

- FE ekibi kendi mock ortamından gerçek BE’ye geçtiğinde CORS ve token mekanizması test edilir.
- Mehmet koordinasyonunda uçtan uca (E2E) test yapılır: login → stok ekle → reçete kaydet → stok miktarı kontrolü.

### **8.3. Git İş Akışı**

- Feature branch’ler: `feature/be-auth`, `feature/be-stock`, `feature/be-prescription`, `feature/be-audit`
- Pull request → code review → merge to `develop`
- Sprint sonunda `main` branch’i güncelle, tag `v1.0-sprint1`

---

## **Kişi Bazlı Görev Atamaları (Back-End Birimi)**

| **Kişi** | **Görevler** | **Teslim Çıktısı** |
| --- | --- | --- |
| **Begli** | - Proje kurulumu (Django, DRF, CORS, spectactular).- `users` app (auth, token, user viewset, gruplar).- API router ve URL yapılandırması.- `audit` app (model, signal, viewset).- Swagger dokümantasyonunun ayarlanması.- Unit test altyapısı (pytest). | Çalışan Django projesi, auth sistemi, audit log, Swagger UI |
| **Yaren** | - `stock` app modelleri, serializer, viewset.- Stok hareketi ile miktar güncelleme iş mantığı.- Kritik stok ve miad yaklaşan endpoint’leri.- `stock` app unit testleri.- DB biriminden gelen şemaya uygun model yazımı (Yusuf ile birlikte). | Stock API’leri (CRUD, hareket, özel filtreler) |
| **Yusuf** (Entegratör) | - DB biriminin ER şemasını `stock` ve `prescription` modellerine dönüştürmek.- Migration işlemleri.- `prescription` app modelleri, serializer, viewset.- Reçete durum güncelleme ve reçete-ilaç ilişkisi.- Yetkilendirme (permission sınıfları) – `IsEczaci`, `IsKalfa`.- BE-DB entegrasyon testi. | `models.py` (stock, prescription), migration’lar, prescription API’leri, permission’lar |

**Ortak Sorumluluklar**:

- Kod stillendirme (PEP8, `black` veya `flake8`).
- Git commit mesajları anlamlı.
- Haftalık ilerleme toplantısına katılım.

---

## **Zaman Planı (Sprint 1 – 5 iş günü)**

| **Gün** | **Yapılacak İş** | **Sorumlu** |
| --- | --- | --- |
| **Gün 1** | Proje kurulumu, `users` app (auth, token, gruplar), CORS, DRF ayarları. | Begli |
| **Gün 2** | DB şemasının modellere dönüşümü (Yusuf), `stock` app modelleri ve temel CRUD (Yaren). | Yusuf, Yaren |
| **Gün 3** | `stock` iş mantığı (stok hareketi, kritik stok, miad), `prescription` app modelleri ve CRUD (Yusuf). | Yaren, Yusuf |
| **Gün 4** | Yetkilendirme (permission’lar), `audit` app ve signal, API dokümantasyonu (Swagger), unit test yazımına başlama. | Begli, (Yusuf yardım) |
| **Gün 5** | Testlerin tamamlanması, hata düzeltmeleri, FE ile entegrasyon için hazırlık, dokümanların repo’ya eklenmesi. | Tüm BE ekibi |

---

## **Teslim Edilecek Çıktılar (Sprint 1 Sonu)**

- [ ]  **Django projesi** (`/backend`) çalışır durumda.
- [ ]  **Tüm API endpoint’leri** (Postman veya Swagger ile test edilebilir).
- [ ]  **Token authentication** ve **RBAC** (eczacı/kalfa) çalışıyor.
- [ ]  **Audit log** (her değişiklik kaydediliyor).
- [ ]  **Unit testler** (en az kritik yollar için yazılmış).
- [ ]  **Swagger dokümantasyonu** (`/api/docs/`).
- [ ]  **README.md** (kurulum, çalıştırma, environment değişkenleri).