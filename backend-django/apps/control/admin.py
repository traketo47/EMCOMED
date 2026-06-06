from django.contrib import admin
from .models import ControlAutorizo, ControlContrato


@admin.register(ControlAutorizo)
class ControlAutorizoAdmin(admin.ModelAdmin):
    list_display = ['autorizo', 'ueb', 'cy_m', 'equipo', 'otros', 'financiamiento']
    list_filter = ['ueb']


@admin.register(ControlContrato)
class ControlContratoAdmin(admin.ModelAdmin):
    list_display = ['numero_contrato', 'proveedor', 'valor_contrato', 'vigencia']
    search_fields = ['numero_contrato']
