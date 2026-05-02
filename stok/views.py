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
from .permissions import (
    SadeceEczaciPermission,
    KalfaOkuyabilirEczaciYazabilirPermission,
    EczaciVeyaKalfaPermission,
)


# ──────────────────────────────────────────────
# 1. KATEGORİ
# ──────────────────────────────────────────────
class KategoriViewSet(viewsets.ModelViewSet):
    """
    Kategori yönetimi sadece Eczacıya aittir.
    Kalfa kategorileri göremez, ekleyemez, silemez.
    """
    queryset = Kategori.objects.all().order_by("ad")
    serializer_class = KategoriSerializer
    permission_classes = [SadeceEczaciPermission]


# ──────────────────────────────────────────────
# 2. İLAÇ
# ──────────────────────────────────────────────
class IlacViewSet(viewsets.ModelViewSet):
    """
    Kalfa ilaçları görebilir ama ekleyemez/silemez/güncelleyemez.
    Eczacı tüm işlemleri yapabilir.
    """
    serializer_class = IlacSerializer
    permission_classes = [KalfaOkuyabilirEczaciYazabilirPermission]

    def get_queryset(self):
        qs = Ilac.objects.filter(is_deleted=False).select_related("kategori")
        kategori = self.request.query_params.get("kategori")
        arama = self.request.query_params.get("arama")
        if kategori:
            qs = qs.filter(kategori_id=kategori)
        if arama:
            qs = qs.filter(ilac_adi__icontains=arama)
        return qs

    def destroy(self, request, *args, **kwargs):
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
    Kalfa stok hareketi oluşturabilir (satış yapabilir).
    Eczacı tüm işlemleri görebilir ve yapabilir.
    Hiçbir hareket silinemez veya güncellenemez.
    """
    serializer_class = StokHareketSerializer
    permission_classes = [EczaciVeyaKalfaPermission]

    def get_queryset(self):
        qs = StokHareket.objects.select_related(
            "ilac", "kullanici"
        ).order_by("-islem_tarihi")
        ilac = self.request.query_params.get("ilac")
        islem_tipi = self.request.query_params.get("islem_tipi")
        if ilac:
            qs = qs.filter(ilac_id=ilac)
        if islem_tipi:
            qs = qs.filter(islem_tipi=islem_tipi)
        return qs

    def perform_create(self, serializer):
        with transaction.atomic():
            serializer.save(kullanici=self.request.user)

    def destroy(self, request, *args, **kwargs):
        return Response(
            {"detail": "Stok hareketleri silinemez."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )

    def update(self, request, *args, **kwargs):
        return Response(
            {"detail": "Stok hareketleri güncellenemez."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )


# ──────────────────────────────────────────────
# 4. REÇETE
# ──────────────────────────────────────────────
class ReceteViewSet(viewsets.ModelViewSet):
    """
    Kalfa reçete görebilir ve oluşturabilir.
    Silme işlemi sadece Eczacıya aittir.
    """
    serializer_class = ReceteSerializer
    permission_classes = [EczaciVeyaKalfaPermission]

    def get_queryset(self):
        qs = Recete.objects.filter(is_deleted=False).select_related(
            "kaydeden"
        ).prefetch_related(
            "recete_ilaclar__ilac"
        ).order_by("-recete_tarihi")
        durum = self.request.query_params.get("durum")
        if durum:
            qs = qs.filter(durum=durum)
        return qs

    def perform_create(self, serializer):
        serializer.save(kaydeden=self.request.user)

    def destroy(self, request, *args, **kwargs):
        """Soft delete — sadece Eczacı yapabilir."""
        if not request.user.is_superuser:
            from .permissions import kullanici_eczaci_mi
            if not kullanici_eczaci_mi(request.user):
                return Response(
                    {"detail": "Reçete silme işlemi için Eczacı rolü gereklidir."},
                    status=status.HTTP_403_FORBIDDEN
                )
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
        Kalfa da teslim işlemi yapabilir.
        """
        recete = self.get_object()
        if recete.durum == "teslim_edildi":
            return Response(
                {"detail": "Reçete zaten teslim edildi."},
                status=status.HTTP_400_BAD_REQUEST
            )
        recete.durum = "teslim_edildi"
        recete.save(update_fields=["durum", "updated_at"])
        return Response(
            {"detail": "Reçete teslim edildi."},
            status=status.HTTP_200_OK
        )


# ──────────────────────────────────────────────
# 5. REÇETE İLACI
# ──────────────────────────────────────────────
class ReceteIlacViewSet(viewsets.ModelViewSet):
    """Reçeteye ilaç ekleme/çıkarma — Eczacı ve Kalfa yapabilir."""
    serializer_class = ReceteIlacSerializer
    permission_classes = [EczaciVeyaKalfaPermission]

    def get_queryset(self):
        return ReceteIlac.objects.filter(
            recete_id=self.kwargs["recete_pk"]
        ).select_related("ilac")

    def perform_create(self, serializer):
        recete_id = self.kwargs["recete_pk"]
        serializer.save(recete_id=recete_id)