from django.contrib import admin
from .models import Ficha, SubFicha


class SubFichaInline(admin.TabularInline):
    model = SubFicha
    extra = 0
    readonly_fields = ['codigo']


@admin.register(Ficha)
class FichaAdmin(admin.ModelAdmin):
    list_display = ['numero', 'tipo', 'codigo', 'descripcion_corta', 'ueb', 'total']
    list_filter = ['tipo', 'ueb']
    search_fields = ['codigo', 'descripcion']
    inlines = [SubFichaInline]
    
    def descripcion_corta(self, obj):
        return obj.descripcion[:50]
    descripcion_corta.short_description = 'Descripcion'


@admin.register(SubFicha)
class SubFichaAdmin(admin.ModelAdmin):
    list_display = ['ficha', 'numero_sub', 'codigo', 'ueb', 'total']
    list_filter = ['ueb']
    readonly_fields = ['codigo']
