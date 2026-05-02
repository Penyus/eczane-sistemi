# stok/signals.py

from django.db import transaction
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.exceptions import ValidationError

from .models import StokHareket, Ilac


@receiver(post_save, sender=StokHareket)
def stok_miktari_guncelle(sender, instance, created, **kwargs):
    """
    Yeni bir StokHareket kaydı oluşturulduğunda tetiklenir.
    
    - Sadece yeni kayıtlarda (created=True) çalışır.
    - Mevcut hareketi güncellemek stok tutarsızlığına yol açar,
      bu yüzden update işlemlerine izin vermiyoruz.
    - select_for_update() ile aynı anda iki işlem aynı ilacın
      stok miktarını değiştirmeye çalışırsa biri bekletilir (race condition önlemi).
    """
    if not created:
        return  # Sadece yeni hareket oluştururken çalış, güncelleme yapma

    with transaction.atomic():
        # Satırı kilitle — eş zamanlı isteklerde veri tutarlılığını korur
        ilac = Ilac.objects.select_for_update().get(pk=instance.ilac.pk)

        if instance.islem_tipi == "giris":
            # Giriş: stoğa ekle (miktar pozitif olmalı)
            if instance.miktar <= 0:
                raise ValidationError("Giriş işleminde miktar pozitif olmalıdır.")
            ilac.stok_miktari += instance.miktar

        elif instance.islem_tipi in ("cikis", "satis"):
            # Çıkış/Satış: stoktan düş (miktar pozitif girilir, biz eksi yaparız)
            if instance.miktar <= 0:
                raise ValidationError("Çıkış/Satış işleminde miktar pozitif olmalıdır.")
            if ilac.stok_miktari < instance.miktar:
                raise ValidationError(
                    f"Yetersiz stok! Mevcut: {ilac.stok_miktari}, "
                    f"İstenen: {instance.miktar}"
                )
            ilac.stok_miktari -= instance.miktar

        # Sadece stok_miktari alanını güncelle, diğer alanlara dokunma
        ilac.save(update_fields=["stok_miktari", "updated_at"])
        # stok/apps.py
from django.apps import AppConfig


class StokConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'stok'

    def ready(self):
        # Signal'ları kaydet — sunucu ayağa kalktığında otomatik tetiklenir
        import stok.signals  # noqa: F401
        