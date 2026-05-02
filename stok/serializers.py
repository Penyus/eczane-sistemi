# stok/serializers.py

from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import Kategori, Ilac, StokHareket, Recete, ReceteIlac

User = get_user_model()


# ──────────────────────────────────────────────
# YARDIMCI — Kullanıcı özet serializer
# ──────────────────────────────────────────────
class KullaniciozetSerializer(serializers.ModelSerializer):
    """
    Sadece okuma amaçlı, başka serializer'lar içinde
    kullanıcıyı göstermek için kullanılır.
    Şifre gibi hassas alanları kesinlikle döndürmez.
    """
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name"]
        read_only_fields = fields


# ──────────────────────────────────────────────
# 1. KATEGORİ
# ──────────────────────────────────────────────
class KategoriSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kategori
        fields = ["id", "ad", "aciklama"]


# ──────────────────────────────────────────────
# 2. İLAÇ
# ──────────────────────────────────────────────
class IlacSerializer(serializers.ModelSerializer):
    """
    İlaç listesi ve detay için kullanılır.
    kritik_mi → modeldeki @property'den otomatik gelir, yazılamaz.
    kategori_adi → ForeignKey'in string gösterimi, ekstra sorgu yapmaz.
    """
    kritik_mi = serializers.BooleanField(read_only=True)
    kategori_adi = serializers.CharField(
        source="kategori.ad",
        read_only=True,
        allow_null=True
    )

    class Meta:
        model = Ilac
        fields = [
            "id",
            "ilac_adi",
            "barkod",
            "kategori",        # yazma için FK id
            "kategori_adi",    # okuma için isim
            "stok_miktari",
            "kritik_stok_esigi",
            "kritik_mi",
            "son_kullanma_tarihi",
            "is_deleted",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["stok_miktari", "kritik_mi", "created_at", "updated_at"]

    def validate_kritik_stok_esigi(self, value):
        """Kritik eşik negatif olamaz."""
        if value < 0:
            raise serializers.ValidationError("Kritik stok eşiği negatif olamaz.")
        return value


# ──────────────────────────────────────────────
# 3. STOK HAREKETİ
# ──────────────────────────────────────────────
class StokHareketSerializer(serializers.ModelSerializer):
    """
    Stok giriş/çıkış/satış işlemleri için.
    kullanici alanı otomatik doldurulur (perform_create'de set edilecek).
    ilac_adi → response'da ilaç ismini de döndürür, ekstra sorgu yapmaz.
    """
    kullanici = KullaniciozetSerializer(read_only=True)
    ilac_adi = serializers.CharField(source="ilac.ilac_adi", read_only=True)

    class Meta:
        model = StokHareket
        fields = [
            "id",
            "ilac",         # yazma için FK id
            "ilac_adi",     # okuma için isim
            "miktar",
            "islem_tipi",
            "aciklama",
            "kullanici",
            "islem_tarihi",
        ]
        read_only_fields = ["kullanici", "islem_tarihi"]

    def validate_miktar(self, value):
        """Miktar her zaman pozitif girilmeli — signal zaten çıkışta eksi yapar."""
        if value <= 0:
            raise serializers.ValidationError("Miktar sıfırdan büyük olmalıdır.")
        return value


# ──────────────────────────────────────────────
# 4. REÇETE İLACI (ara tablo)
# ──────────────────────────────────────────────
class ReceteIlacSerializer(serializers.ModelSerializer):
    ilac_adi = serializers.CharField(source="ilac.ilac_adi", read_only=True)

    class Meta:
        model = ReceteIlac
        fields = ["id", "ilac", "ilac_adi", "kullanilan_miktar", "talimat"]


# ──────────────────────────────────────────────
# 5. REÇETE
# ──────────────────────────────────────────────
class ReceteSerializer(serializers.ModelSerializer):
    """
    Reçete okurken içindeki ilaçları da (nested) döndürür.
    Yazarken sadece temel reçete alanları alınır,
    ilaçlar ayrı endpoint üzerinden eklenir.
    """
    recete_ilaclar = ReceteIlacSerializer(many=True, read_only=True)
    kaydeden = KullaniciozetSerializer(read_only=True)
    durum_goster = serializers.CharField(source="get_durum_display", read_only=True)

    class Meta:
        model = Recete
        fields = [
            "id",
            "hasta_ad_soyad",
            "hasta_tc",
            "doktor_ad_soyad",
            "doktor_diploma_no",
            "recete_tarihi",
            "durum",
            "durum_goster",
            "kaydeden",
            "recete_ilaclar",
            "is_deleted",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["kaydeden", "created_at", "updated_at"]

    def validate_hasta_tc(self, value):
        """TC kimlik no girilmişse tam 11 hane olmalı."""
        if value and len(value) != 11:
            raise serializers.ValidationError("TC kimlik numarası 11 haneli olmalıdır.")
        if value and not value.isdigit():
            raise serializers.ValidationError("TC kimlik numarası sadece rakamlardan oluşmalıdır.")
        return value