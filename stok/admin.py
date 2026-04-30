from django.contrib import admin
from .models import Ilac, StokHareket, Recete, ReceteIlac, Kategori

admin.site.register(Kategori)
admin.site.register(Ilac)
admin.site.register(StokHareket)
admin.site.register(Recete)
admin.site.register(ReceteIlac)