from django.contrib import admin
from .models import DesgloseMensual, ColorFicha


@admin.register(DesgloseMensual)
class DesgloseMensualAdmin(admin.ModelAdmin):
    list_display = ['id', 'ficha', 'subficha', 'categoria', 'total']
    list_filter = ['categoria']


@admin.register(ColorFicha)
class ColorFichaAdmin(admin.ModelAdmin):
    list_display = ['id', 'ficha', 'subficha', 'color']
