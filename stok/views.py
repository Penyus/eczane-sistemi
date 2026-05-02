# stok/views.py

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction

from .models import Kategori, Ilac, StokHareket, Recete, ReceteIlac
from .serializers import (
    KategoriSerializer,
    IlacSerializer,
    StokHareketSerializer,
    ReceteSerializer,
    ReceteIlacSerializer,
)


# ──────────────────────────────────────────────
# 1. KATEGORİ
# ──────────────────────────────────────────────
class KategoriViewSet(viewsets.ModelViewSet):
    """
    Kategori CRUD işlemleri.
    list, create, retrieve, update, destroy → otomatik gelir.
    """
    queryset = Kategori.objects.all().order_by("ad")
    serializer_class = KategoriSerializer
    permission_classes = [IsAuthenticated]


# ──────────────────────────────────────────────
# 2. İLAÇ
# ──────────────────────────────────────────────
class IlacViewSet(viewsets.ModelViewSet):
    """
    İlaç CRUD işlemleri.
    Soft delete uygulanır — gerçekten silinmez, is_deleted=True yapılır.
    Listeleme her zaman is_deleted=False olanları döndürür.
    """
    serializer_class = IlacSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Silinmemiş ilaçları getir, kategori bilgisini tek sorguda çek
        qs = Ilac.objects.filter(is_deleted=False).select_related("kategori")

        # Opsiyonel filtreleme: ?kategori=1 veya ?arama=aspirin
        kategori = self.request.query_params.get("kategori")
        arama = self.request.query_params.get("arama")

        if kategori:
            qs = qs.filter(kategori_id=kategori)
        if arama:
            qs = qs.filter(ilac_adi__icontains=arama)

        return qs

    def destroy(self, request, *args, **kwargs):
        """
        Gerçek silme yerine soft delete uygula.
        DELETE /api/v1/ilaclar/1/ → is_deleted=True yapar
        """
        ilac = self.get_object()
        ilac.is_deleted = True
        ilac.save(update_fields=["is_deleted", "updated_at"])
        return Response(
            {"detail": f"{ilac.ilac_adi} silindi (soft delete)."},
            status=status.HTTP_200_OK
        )


# ──────────────────────────────────────────────
# 3. STOK HAREKETİ
# ──────────────────────────────────────────────
class StokHareketViewSet(viewsets.ModelViewSet):
    """
    Stok giriş/çıkış/satış işlemleri.
    Yeni hareket oluşturunca signal otomatik stok_miktari günceller.
    Hareket kaydı hiçbir zaman silinemez — audit log özelliği.
    """
    serializer_class = StokHareketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = StokHareket.objects.select_related("ilac", "kullanici").order_by("-islem_tarihi")

        # Opsiyonel filtreleme: ?ilac=1 veya ?islem_tipi=giris
        ilac = self.request.query_params.get("ilac")
        islem_tipi = self.request.query_params.get("islem_tipi")

        if ilac:
            qs = qs.filter(ilac_id=ilac)
        if islem_tipi:
            qs = qs.filter(islem_tipi=islem_tipi)

        return qs

    def perform_create(self, serializer):
        """
        Hareketi kaydederken kullanıcıyı otomatik set et.
        Signal burada tetiklenir ve stok_miktari güncellenir.
        """
        with transaction.atomic():
            serializer.save(kullanici=self.request.user)

    def destroy(self, request, *args, **kwargs):
        """Stok hareketi silinemez — veri bütünlüğü için."""
        return Response(
            {"detail": "Stok hareketleri silinemez."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )

    def update(self, request, *args, **kwargs):
        """Stok hareketi güncellenemez — sadece yeni hareket oluşturulabilir."""
        return Response(
            {"detail": "Stok hareketleri güncellenemez."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )


# ──────────────────────────────────────────────
# 4. REÇETE
# ──────────────────────────────────────────────
class ReceteViewSet(viewsets.ModelViewSet):
    """
    Reçete CRUD işlemleri.
    Soft delete uygulanır.
    """
    serializer_class = ReceteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Recete.objects.filter(is_deleted=False).select_related(
            "kaydeden"
        ).prefetch_related(
            "recete_ilaclar__ilac"   # Nested ilaçları tek sorguda çek
        ).order_by("-recete_tarihi")

        # Opsiyonel filtreleme: ?durum=bekliyor
        durum = self.request.query_params.get("durum")
        if durum:
            qs = qs.filter(durum=durum)

        return qs

    def perform_create(self, serializer):
        """Reçeteyi kaydederken kullanıcıyı otomatik set et."""
        serializer.save(kaydeden=self.request.user)

    def destroy(self, request, *args, **kwargs):
        """Soft delete."""
        recete = self.get_object()
        recete.is_deleted = True
        recete.save(update_fields=["is_deleted", "updated_at"])
        return Response(
            {"detail": "Reçete silindi (soft delete)."},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=["post"], url_path="teslim-et")
    def teslim_et(self, request, pk=None):
        """
        POST /api/v1/receteler/1/teslim-et/
        Reçete durumunu 'teslim_edildi' yapar.
        """
        recete = self.get_object()
        if recete.durum == "teslim_edildi":
            return Response(
                {"detail": "Reçete zaten teslim edildi."},
                status=status.HTTP_400_BAD_REQUEST
            )
        recete.durum = "teslim_edildi"
        recete.save(update_fields=["durum", "updated_at"])
        return Response({"detail": "Reçete teslim edildi."}, status=status.HTTP_200_OK)


# ──────────────────────────────────────────────
# 5. REÇETE İLACI
# ──────────────────────────────────────────────
class ReceteIlacViewSet(viewsets.ModelViewSet):
    """
    Bir reçeteye ilaç ekleme/çıkarma işlemleri.
    URL: /api/v1/receteler/{recete_id}/ilaclar/
    """
    serializer_class = ReceteIlacSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ReceteIlac.objects.filter(
            recete_id=self.kwargs["recete_pk"]
        ).select_related("ilac")

    def perform_create(self, serializer):
        recete_id = self.kwargs["recete_pk"]
        serializer.save(recete_id=recete_id)