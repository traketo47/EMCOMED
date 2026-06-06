from rest_framework import serializers
from .models import Ficha, SubFicha


class SubFichaSerializer(serializers.ModelSerializer):
    total = serializers.ReadOnlyField()
    cyM = serializers.DecimalField(source='cy_m', max_digits=15, decimal_places=2, required=False)
    
    class Meta:
        model = SubFicha
        fields = ['id', 'ficha', 'numero_sub', 'codigo', 'ueb', 'descripcion',
                  'fundamentacion', 'cyM', 'equipo', 'otros', 'ppt',
                  'importacion', 'fb', 'archivo', 'total',
                  'created_at', 'updated_at']
        read_only_fields = ['codigo', 'created_at', 'updated_at']


class FichaSerializer(serializers.ModelSerializer):
    subfichas = SubFichaSerializer(many=True, read_only=True)
    total = serializers.ReadOnlyField()
    cyM = serializers.DecimalField(source='cy_m', max_digits=15, decimal_places=2, required=False)
    
    class Meta:
        model = Ficha
        fields = ['id', 'numero', 'tipo', 'codigo', 'descripcion',
                  'fundamentacion', 'ueb', 'cyM', 'equipo', 'otros',
                  'ppt', 'importacion', 'fb', 'archivo', 'total',
                  'subfichas', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
    
    def validate_codigo(self, value):
        if not value.isdigit() or len(value) != 7:
            raise serializers.ValidationError("El codigo debe tener exactamente 7 digitos")
        return value
    
    def validate(self, data):
        # Validacion PPT vs otros campos
        ppt = float(data.get('ppt', 0))
        cy_m = float(data.get('cy_m', 0))
        equipo = float(data.get('equipo', 0))
        otros = float(data.get('otros', 0))
        
        if ppt > 0 and (cy_m > 0 or equipo > 0 or otros > 0):
            raise serializers.ValidationError(
                "Si PPT tiene valor, no se pueden llenar C y M, Equipo, Otros"
            )
        return data
