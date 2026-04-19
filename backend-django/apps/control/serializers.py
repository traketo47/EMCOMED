from rest_framework import serializers
from .models import ControlAutorizo, ControlContrato


class ControlAutorizoSerializer(serializers.ModelSerializer):
    consecutivo = serializers.CharField(source='autorizo.consecutivo_completo', read_only=True)
    fecha_autorizo = serializers.DateField(source='autorizo.fecha', read_only=True)
    descripcion_alcance = serializers.CharField(source='autorizo.descripcion_alcance', read_only=True)
    componente = serializers.CharField(source='autorizo.componente', read_only=True)
    numero_contrato = serializers.DecimalField(
        source='autorizo.numero_contrato',
        max_digits=15, decimal_places=4, read_only=True
    )
    proveedor_nombre = serializers.CharField(
        source='autorizo.entidad_contratada.nombre', read_only=True
    )
    factura = serializers.CharField(source='autorizo.factura', read_only=True)
    
    class Meta:
        model = ControlAutorizo
        fields = [
            'id', 'autorizo', 'consecutivo', 'fecha_autorizo',
            'descripcion_alcance', 'componente', 'numero_contrato',
            'proveedor_nombre', 'factura',
            'ueb', 'cyM', 'equipo', 'otros',
            'fecha_financiamiento', 'financiamiento',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class ControlContratoSerializer(serializers.ModelSerializer):
    proveedor_nombre = serializers.CharField(source='proveedor.nombre', read_only=True)
    valor_autorizo = serializers.ReadOnlyField()
    saldo_pendiente = serializers.ReadOnlyField()
    
    class Meta:
        model = ControlContrato
        fields = [
            'id', 'numero_contrato', 'proveedor', 'proveedor_nombre',
            'inversion', 'valor_contrato', 'vigencia', 'firma_contrato',
            'ejecutado_anos_anteriores', 'valor_autorizo', 'saldo_pendiente',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
