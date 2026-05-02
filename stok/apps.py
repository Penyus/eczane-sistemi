# stok/apps.py
from django.apps import AppConfig


class StokConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'stok'

    def ready(self):
        # Adım 2'de signals.py yazınca bu satır aktif olacak
        import stok.signals  # noqa: F401