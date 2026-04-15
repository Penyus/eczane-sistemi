from django.db import models

class Ilac(models.Model):
    ilac_adi = models.CharField(max_length=255)
    barkod = models.CharField(max_length=50, unique=True)
    stok_miktari = models.IntegerField(default=0)
    kritik_stok_esigi = models.IntegerField(default=10)
    son_kullanma_tarihi = models.DateField()
    
    # Soft delete ve zaman damgaları
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.ilac_adi
class StokHareket(models.Model):
    ISLEM_TIPLERI = [
        ('GIRIS', 'Stok Girişi'),
        ('CIKIS', 'Stok Çıkışı'),
    ]

    ilac = models.ForeignKey(Ilac, on_delete=models.CASCADE, related_name='hareketler')
    miktar = models.IntegerField()
    islem_tipi = models.CharField(max_length=10, choices=ISLEM_TIPLERI)
    aciklama = models.TextField(blank=True, null=True)
    islem_tarihi = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.ilac.ilac_adi} - {self.islem_tipi} ({self.miktar})"
