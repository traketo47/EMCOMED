from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import ControlAutorizo, ControlContrato
from .serializers import ControlAutorizoSerializer, ControlContratoSerializer
from apps.autorizos.models import ModeloAutorizo


class ControlAutorizoViewSet(viewsets.ModelViewSet):
    queryset = ControlAutorizo.objects.all().select_related('autorizo')
    serializer_class = ControlAutorizoSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        ficha_id = self.request.query_params.get('ficha')
        if ficha_id:
            queryset = queryset.filter(autorizo__ficha_id=ficha_id)
        return queryset
    
    @action(detail=False, methods=['get'])
    def resumen_mmt(self, request):
        """Retorna el resumen MMT (Plan, Comprometido, Pendiente) para una ficha"""
        ficha_id = request.query_params.get('ficha')
        if not ficha_id:
            return Response({'error': 'Se requiere ficha_id'}, status=400)
        
        from apps.fichas.models import Ficha
        try:
            ficha = Ficha.objects.get(pk=ficha_id)
        except Ficha.DoesNotExist:
            return Response({'error': 'Ficha no encontrada'}, status=404)
        
        # Plan (valores de la ficha)
        plan = {
            'total': ficha.total,
            'cyM': float(ficha.cyM),
            'equipo': float(ficha.equipo),
            'otros': float(ficha.otros),
        }
        
        # Comprometido (suma de autorizos relacionados)
        controles = ControlAutorizo.objects.filter(autorizo__ficha_id=ficha_id)
        comprometido = {
            'cyM': sum(float(c.cyM) for c in controles),
            'equipo': sum(float(c.equipo) for c in controles),
            'otros': sum(float(c.otros) for c in controles),
        }
        comprometido['total'] = comprometido['cyM'] + comprometido['equipo'] + comprometido['otros']
        
        # Pendiente
        pendiente = {
            'total': plan['total'] - comprometido['total'],
            'cyM': plan['cyM'] - comprometido['cyM'],
            'equipo': plan['equipo'] - comprometido['equipo'],
            'otros': plan['otros'] - comprometido['otros'],
        }
        
        return Response({
            'ficha': {
                'id': ficha.id,
                'codigo': ficha.codigo,
                'descripcion': ficha.descripcion,
            },
            'plan': plan,
            'comprometido': comprometido,
            'pendiente': pendiente,
        })


class ControlContratoViewSet(viewsets.ModelViewSet):
    queryset = ControlContrato.objects.all().select_related('proveedor')
    serializer_class = ControlContratoSerializer
    
    @action(detail=False, methods=['post'])
    def generar_desde_autorizos(self, request):
        """Genera automaticamente controles de contrato desde los autorizos existentes"""
        autorizos = ModeloAutorizo.objects.exclude(entidad_contratada__isnull=True)
        
        grupos = {}
        for autorizo in autorizos:
            key = (str(autorizo.numero_contrato), autorizo.entidad_contratada_id)
            if key not in grupos:
                grupos[key] = autorizo
        
        creados = 0
        for (num_ctto, proveedor_id), autorizo in grupos.items():
            obj, created = ControlContrato.objects.get_or_create(
                numero_contrato=num_ctto,
                proveedor_id=proveedor_id,
            )
            if created:
                creados += 1
        
        return Response({
            'mensaje': f'{creados} controles de contrato generados',
            'total_grupos': len(grupos)
        })
