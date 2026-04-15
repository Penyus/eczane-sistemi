from django.apps import AppConfig

class StokConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'stok'

    def ready(self):
        import stok.signals
