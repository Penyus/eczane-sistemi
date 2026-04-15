from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import F
from django.utils import timezone
from datetime import timedelta
from .models import Ilac, StokHareket
from .serializers import IlacSerializer

class IlacViewSet(viewsets.ModelViewSet):
    queryset = Ilac.objects.filter(is_deleted=False)
    serializer_class = IlacSerializer

    # 1. KRİTİK STOK FİLTRESİ
    @action(detail=False, methods=['get'])
    def kritik_stok(self, request):
        ilaclar = Ilac.objects.filter(
            stok_miktari__lte=F('kritik_stok_esigi'),
            is_deleted=False
        )
        serializer = IlacSerializer(ilaclar, many=True)
        return Response(serializer.data)

    # 2. MİADI YAKLAŞANLAR FİLTRESİ
    @action(detail=False, methods=['get'])
    def miadi_yaklasanlar(self, request):
        bugun = timezone.now().date()
        limit_tarihi = bugun + timedelta(days=30)
        
        ilaclar = Ilac.objects.filter(
            son_kullanma_tarihi__range=[bugun, limit_tarihi],
            is_deleted=False
        )
        serializer = IlacSerializer(ilaclar, many=True)
        return Response(serializer.data)
