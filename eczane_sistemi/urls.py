# eczane_sistemi/urls.py

from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path("admin/", admin.site.urls),

    # API v1
    path("api/v1/", include("stok.urls")),

    # Token auth — React bu endpoint'e POST atarak token alacak
    path("api/v1/auth/token/", obtain_auth_token, name="api-token"),
    path("api/v1/auth/", include("rest_framework.urls")),

    # Swagger
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
]