from rest_framework import serializers
from .models import Proveedor, ModeloAutorizo


class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = ['id', 'nombre', 'activo', 'created_at']
        read_only_fields = ['created_at']


class ModeloAutorizoSerializer(serializers.ModelSerializer):
    consecutivo_completo = serializers.ReadOnlyField()
    entidad_contratada_nombre = serializers.CharField(
        source='entidad_contratada.nombre', read_only=True
    )
    ficha_numero = serializers.IntegerField(source='ficha.numero', read_only=True)
    ficha_codigo = serializers.CharField(source='ficha.codigo', read_only=True)
    ficha_descripcion = serializers.CharField(source='ficha.descripcion', read_only=True)
    
    class Meta:
        model = ModeloAutorizo
        fields = [
            'id', 'consecutivo_numero', 'consecutivo_anio', 'consecutivo_completo',
            'fecha', 'ficha', 'ficha_numero', 'ficha_codigo', 'ficha_descripcion',
            'descripcion_alcance', 'numero_contrato',
            'entidad_contratada', 'entidad_contratada_nombre', 'factura',
            'plan_aprobado_mmt', 'plan_aprobado_import',
            'valor_contrato_mmt', 'valor_contrato_import', 'componente',
            'elaborado_nombre', 'elaborado_cargo', 'elaborado_firma',
            'aprobado_nombre', 'aprobado_cargo', 'aprobado_firma',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['consecutivo_numero', 'created_at', 'updated_at']
