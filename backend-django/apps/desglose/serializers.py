from rest_framework import serializers
from .models import DesgloseMensual, ColorFicha


class DesgloseMensualSerializer(serializers.ModelSerializer):
    total = serializers.ReadOnlyField()
    
    class Meta:
        model = DesgloseMensual
        fields = ['id', 'ficha', 'subficha', 'categoria',
                  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
                  'color', 'total', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
    
    def validate(self, data):
        """Valida que la suma de meses no exceda el valor de la categoria en la ficha"""
        ficha = data.get('ficha') or (self.instance.ficha if self.instance else None)
        subficha = data.get('subficha') or (self.instance.subficha if self.instance else None)
        categoria = data.get('categoria') or (self.instance.categoria if self.instance else None)
        
        if not (ficha or subficha) or not categoria:
            return data
        
        ref = ficha or subficha
        valor_categoria = float(getattr(ref, categoria, 0))
        
        suma_meses = sum([
            float(data.get('enero', 0)), float(data.get('febrero', 0)),
            float(data.get('marzo', 0)), float(data.get('abril', 0)),
            float(data.get('mayo', 0)), float(data.get('junio', 0)),
            float(data.get('julio', 0)), float(data.get('agosto', 0)),
            float(data.get('septiembre', 0)), float(data.get('octubre', 0)),
            float(data.get('noviembre', 0)), float(data.get('diciembre', 0)),
        ])
        
        if suma_meses > valor_categoria:
            raise serializers.ValidationError(
                f"La suma de los meses ({suma_meses}) no puede exceder el valor de la categoria ({valor_categoria})"
            )
        return data


class ColorFichaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ColorFicha
        fields = ['id', 'ficha', 'subficha', 'color']
