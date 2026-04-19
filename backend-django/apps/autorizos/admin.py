from django.contrib import admin
from .models import Proveedor, ModeloAutorizo, ConsecutivoGlobal


@admin.register(Proveedor)
class ProveedorAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'activo']
    list_filter = ['activo']
    search_fields = ['nombre']


@admin.register(ModeloAutorizo)
class ModeloAutorizoAdmin(admin.ModelAdmin):
    list_display = ['consecutivo_completo', 'fecha', 'ficha', 'entidad_contratada', 'componente']
    list_filter = ['consecutivo_anio', 'componente']
    search_fields = ['descripcion_alcance', 'factura']
    readonly_fields = ['consecutivo_numero']


@admin.register(ConsecutivoGlobal)
class ConsecutivoGlobalAdmin(admin.ModelAdmin):
    list_display = ['id', 'ultimo_consecutivo']
