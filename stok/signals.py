from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import StokHareket

@receiver(post_save, sender=StokHareket)
def stok_miktarini_guncelle(sender, instance, created, **kwargs):
    print("DEBUG: Sinyal tetiklendi!")
    
    # SADECE YENİ BİR HAREKET EKLENDİĞİNDE ÇALIŞIR
    if created:
        ilac = instance.ilac
        if instance.islem_tipi == 'GIRIS':
            ilac.stok_miktari += instance.miktar
        elif instance.islem_tipi == 'CIKIS':
            ilac.stok_miktari -= instance.miktar
        
        ilac.save()
        print(f"DEBUG: {ilac.ilac_adi} güncellendi! Yeni miktar: {ilac.stok_miktari}")
