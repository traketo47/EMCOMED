from rest_framework import viewsets
from .models import DesgloseMensual, ColorFicha
from .serializers import DesgloseMensualSerializer, ColorFichaSerializer


class DesgloseMensualViewSet(viewsets.ModelViewSet):
    queryset = DesgloseMensual.objects.all()
    serializer_class = DesgloseMensualSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        ficha_id = self.request.query_params.get('ficha')
        subficha_id = self.request.query_params.get('subficha')
        if ficha_id:
            queryset = queryset.filter(ficha_id=ficha_id)
        if subficha_id:
            queryset = queryset.filter(subficha_id=subficha_id)
        return queryset


class ColorFichaViewSet(viewsets.ModelViewSet):
    queryset = ColorFicha.objects.all()
    serializer_class = ColorFichaSerializer
