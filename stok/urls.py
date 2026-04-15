from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IlacViewSet

router = DefaultRouter()
router.register(r'ilaclar', IlacViewSet, basename='ilac')

urlpatterns = [
    path('', include(router.urls)),
]
