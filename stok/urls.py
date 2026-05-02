# stok/urls.py

from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers as nested_routers
from django.urls import path, include

from .views import (
    KategoriViewSet,
    IlacViewSet,
    StokHareketViewSet,
    ReceteViewSet,
    ReceteIlacViewSet,
)

# Ana router
router = DefaultRouter()
router.register(r"kategoriler", KategoriViewSet, basename="kategori")
router.register(r"ilaclar", IlacViewSet, basename="ilac")
router.register(r"stok-hareketleri", StokHareketViewSet, basename="stokhareket")
router.register(r"receteler", ReceteViewSet, basename="recete")

# Nested router: /api/v1/receteler/{recete_pk}/ilaclar/
recete_router = nested_routers.NestedDefaultRouter(router, r"receteler", lookup="recete")
recete_router.register(r"ilaclar", ReceteIlacViewSet, basename="recete-ilac")

urlpatterns = [
    path("", include(router.urls)),
    path("", include(recete_router.urls)),
]