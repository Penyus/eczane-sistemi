from rest_framework import serializers
from .models import Ilac

class IlacSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ilac
        fields = '__all__' # Tüm alanları (id, ad, stok, barkod vb.) getir
