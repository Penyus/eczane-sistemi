# stok/models.py
from django.db import models
from django.db import models
from django.contrib.auth.models import User

class Ilac(models.Model):
    barkod = models.CharField(max_length=50, unique=True, verbose_name="Barkod/Karekod")
    isim = models.CharField(max_length=150, verbose_name="İlaç Adı")
    stok_miktari = models.PositiveIntegerField(default=0, verbose_name="Stok Miktarı")
    minimum_esik = models.PositiveIntegerField(default=10, verbose_name="Kritik Stok Eşiği")
    son_kullanma_tarihi = models.DateField(verbose_name="Miad (Son Kullanma Tarihi)")

    def __str__(self):
        return f"{self.isim} - Stok: {self.stok_miktari}"
    
    
class Recete(models.Model):
    DURUM_SECENEKLERI = [
        ('BEKLIYOR', 'Bekliyor'),
        ('TESLIM_EDILDI', 'Teslim Edildi'),
    ]
    
    hasta_adi = models.CharField(max_length=100, verbose_name="Hasta Adı Soyadı")
    tc_kimlik = models.CharField(max_length=11, verbose_name="TC Kimlik No")
    # FK İlişkisi: Bir reçetede bir ilaç yazılıdır (basit tutmak adına)
    ilac = models.ForeignKey('Ilac', on_delete=models.CASCADE, verbose_name="Yazılan İlaç")
    durum = models.CharField(max_length=20, choices=DURUM_SECENEKLERI, default='BEKLIYOR')
    kaydeden_personel = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    olusturulma_tarihi = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.hasta_adi} - {self.ilac.isim} ({self.durum})"