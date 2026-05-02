# stok/permissions.py

from rest_framework.permissions import BasePermission, SAFE_METHODS


def kullanici_eczaci_mi(user):
    """Kullanıcı Eczacı grubunda mı?"""
    return user.groups.filter(name="Eczaci").exists()


def kullanici_kalfa_mi(user):
    """Kullanıcı Kalfa grubunda mı?"""
    return user.groups.filter(name="Kalfa").exists()


class EczaciVeyaKalfaPermission(BasePermission):
    """
    Sisteme giriş yapmış, Eczacı VEYA Kalfa grubunda olan
    herkes erişebilir. Grup dışındaki kullanıcılar (admin hariç)
    erişemez.
    """
    message = "Bu işlem için Eczacı veya Kalfa rolü gereklidir."

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.is_superuser:
            return True  # Admin her şeye erişebilir
        return kullanici_eczaci_mi(request.user) or kullanici_kalfa_mi(request.user)


class SadeceEczaciPermission(BasePermission):
    """
    Sadece Eczacı grubundaki kullanıcılar erişebilir.
    Kalfa bu permission gerektiren endpoint'lere erişemez.
    Kullanım: ilaç silme, reçete silme, kategori yönetimi
    """
    message = "Bu işlem için Eczacı rolü gereklidir."

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.is_superuser:
            return True
        return kullanici_eczaci_mi(request.user)


class KalfaOkuyabilirEczaciYazabilirPermission(BasePermission):
    """
    Kalfa → sadece okuyabilir (GET, HEAD, OPTIONS)
    Eczacı → okuyabilir + yazabilir (POST, PUT, PATCH, DELETE)
    """
    message = "Yazma işlemleri için Eczacı rolü gereklidir."

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.is_superuser:
            return True
        if request.method in SAFE_METHODS:
            # GET isteği → Eczacı veya Kalfa okuyabilir
            return kullanici_eczaci_mi(request.user) or kullanici_kalfa_mi(request.user)
        # POST/PUT/PATCH/DELETE → sadece Eczacı
        return kullanici_eczaci_mi(request.user)