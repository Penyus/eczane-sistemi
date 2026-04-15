# stok/models.py

from django.db import models
from django.conf import settings  # AUTH_USER_MODEL için settings kullanıyoruz,
                                   # böylece ileride custom user modele geçsek bile kod kırılmaz.

# ──────────────────────────────────────────────
# 1. KATEGORİ MODELİ
# ──────────────────────────────────────────────
class Kategori(models.Model):
    """İlaçları gruplamak için basit kategori tablosu.
    Örn: Antibiyotik, Ağrı Kesici, Vitamin"""

    ad = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Kategori Adı"
    )
    aciklama = models.TextField(
        blank=True,
        null=True,
        verbose_name="Açıklama"
    )

    class Meta:
        verbose_name = "Kategori"
        verbose_name_plural = "Kategoriler"
        ordering = ["ad"]

    def __str__(self):
        return self.ad


# ──────────────────────────────────────────────
# 2. İLAÇ MODELİ
# ──────────────────────────────────────────────
class Ilac(models.Model):
    """Eczanedeki her ilaç kaydını temsil eder.
    Soft delete ile silinen ilaçlar DB'den kaldırılmaz,
    sadece is_deleted=True yapılır."""

    ilac_adi = models.CharField(
        max_length=200,
        db_index=True,          # Arama sorguları için index (Sprint DB kararı #15)
        verbose_name="İlaç Adı"
    )
    barkod = models.CharField(
        max_length=50,
        unique=True,
        null=True,
        blank=True,
        verbose_name="Barkod / Karekod"
    )
    kategori = models.ForeignKey(
        Kategori,
        on_delete=models.SET_NULL,  # Kategori silinse bile ilaç kaybolmaz
        null=True,
        blank=True,
        related_name="ilaclar",
        verbose_name="Kategori"
    )
    stok_miktari = models.IntegerField(
        default=0,
        verbose_name="Stok Miktarı"
    )
    kritik_stok_esigi = models.IntegerField(
        default=10,
        verbose_name="Kritik Stok Eşiği"
        # Bu değerin altına düşünce uyarı endpoint'i tetiklenecek (Adım 6)
    )
    son_kullanma_tarihi = models.DateField(
        null=True,
        blank=True,
        db_index=True,              # Miad sorguları için index
        verbose_name="Son Kullanma Tarihi"
    )

    # ── Soft Delete ve Zaman Damgaları ──────────
    is_deleted = models.BooleanField(
        default=False,
        verbose_name="Silindi mi?"
        # API'ler her zaman filter(is_deleted=False) ile çalışacak (Sprint BE kararı #12)
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Oluşturulma Tarihi")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Güncellenme Tarihi")

    class Meta:
        verbose_name = "İlaç"
        verbose_name_plural = "İlaçlar"
        ordering = ["ilac_adi"]

    def __str__(self):
        return f"{self.ilac_adi} (Stok: {self.stok_miktari})"

    @property
    def kritik_mi(self):
        """Stok kritik eşiğin altına düştü mü? View'larda kullanılabilir."""
        return self.stok_miktari <= self.kritik_stok_esigi


# ──────────────────────────────────────────────
# 3. STOK HAREKET MODELİ
# ──────────────────────────────────────────────
class StokHareket(models.Model):
    """Her stok giriş/çıkış/satış işleminin kaydı.
    Bu tablo hem loglama hem de stok miktarı hesaplama için kullanılır.
    Adım 2'de bu modelin save() sinyali Ilac.stok_miktari'nı otomatik güncelleyecek."""

    ISLEM_TIPLERI = [
        ("giris", "Giriş"),
        ("cikis", "Çıkış"),
        ("satis", "Satış"),
    ]

    ilac = models.ForeignKey(
        Ilac,
        on_delete=models.PROTECT,  # İlaç silinmeden önce tüm hareketlerin temizlenmesi gerekir
        related_name="hareketler",
        verbose_name="İlaç"
    )
    miktar = models.IntegerField(
        verbose_name="Miktar"
        # Giriş → pozitif (+), Çıkış/Satış → negatif (-) olarak kaydedilecek
        # Adım 2'deki signal bu kurala göre stok_miktari'nı güncelleyecek
    )
    islem_tipi = models.CharField(
        max_length=20,
        choices=ISLEM_TIPLERI,
        db_index=True,
        verbose_name="İşlem Tipi"
    )
    aciklama = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name="Açıklama"
    )
    kullanici = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,   # Kullanıcı silinmeden hareketi korunur
        related_name="stok_hareketleri",
        verbose_name="İşlemi Yapan"
    )
    islem_tarihi = models.DateTimeField(
        auto_now_add=True,
        db_index=True,              # Tarih bazlı sorgular için index
        verbose_name="İşlem Tarihi"
    )

    class Meta:
        verbose_name = "Stok Hareketi"
        verbose_name_plural = "Stok Hareketleri"
        ordering = ["-islem_tarihi"]  # En yeni hareket önce gelsin

    def __str__(self):
        return f"{self.ilac.ilac_adi} | {self.get_islem_tipi_display()} | {self.miktar} adet"


# ──────────────────────────────────────────────
# 4. REÇETE MODELİ
# ──────────────────────────────────────────────
class Recete(models.Model):
    """Hastaya ait reçete kaydı.
    Bir reçetede birden fazla ilaç olabilir → ReceteIlac ara tablosu (aşağıda)."""

    DURUM_SECENEKLERI = [
        ("bekliyor", "Bekliyor"),
        ("teslim_edildi", "Teslim Edildi"),
    ]

    hasta_ad_soyad = models.CharField(
        max_length=100,
        verbose_name="Hasta Adı Soyadı"
    )
    hasta_tc = models.CharField(
        max_length=11,
        blank=True,
        null=True,
        verbose_name="TC Kimlik No"
    )
    doktor_ad_soyad = models.CharField(
        max_length=100,
        verbose_name="Doktor Adı Soyadı"
    )
    doktor_diploma_no = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        verbose_name="Doktor Diploma No"
    )
    recete_tarihi = models.DateField(
        db_index=True,
        verbose_name="Reçete Tarihi"
    )
    durum = models.CharField(
        max_length=20,
        choices=DURUM_SECENEKLERI,
        default="bekliyor",
        db_index=True,
        verbose_name="Durum"
    )
    kaydeden = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="receteler",
        verbose_name="Kaydeden Personel"
    )

    # ── Soft Delete ve Zaman Damgaları ──────────
    is_deleted = models.BooleanField(default=False, verbose_name="Silindi mi?")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Oluşturulma Tarihi")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Güncellenme Tarihi")

    class Meta:
        verbose_name = "Reçete"
        verbose_name_plural = "Reçeteler"
        ordering = ["-recete_tarihi"]

    def __str__(self):
        return f"{self.hasta_ad_soyad} | {self.recete_tarihi} | {self.get_durum_display()}"


# ──────────────────────────────────────────────
# 5. REÇETE-İLAÇ ARA TABLOSU
# ──────────────────────────────────────────────
class ReceteIlac(models.Model):
    """Bir reçetedeki her ilaç satırını temsil eder.
    Reçete ↔ İlaç arasındaki M2M ilişkiyi, ek alanlarla (miktar, talimat) kurar."""

    recete = models.ForeignKey(
        Recete,
        on_delete=models.CASCADE,   # Reçete silinirse ilaç satırları da silinir
        related_name="recete_ilaclar",
        verbose_name="Reçete"
    )
    ilac = models.ForeignKey(
        Ilac,
        on_delete=models.PROTECT,   # İlaç kaydı silinmeden önce reçetelerden çıkarılmalı
        related_name="recete_satirlari",
        verbose_name="İlaç"
    )
    kullanilan_miktar = models.IntegerField(
        default=1,
        verbose_name="Kullanılan Miktar"
    )
    talimat = models.TextField(
        blank=True,
        null=True,
        verbose_name="Kullanım Talimatı"
        # Örn: "Günde 3 kez, yemekten sonra"
    )

    class Meta:
        verbose_name = "Reçete İlacı"
        verbose_name_plural = "Reçete İlaçları"
        # Aynı reçetede aynı ilaç tekrar yazılamaz
        unique_together = [("recete", "ilac")]

    def __str__(self):
        return f"{self.recete} → {self.ilac.ilac_adi} x{self.kullanilan_miktar}"