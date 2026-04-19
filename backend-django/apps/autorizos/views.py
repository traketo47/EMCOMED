from rest_framework import viewsets
from .models import Proveedor, ModeloAutorizo
from .serializers import ProveedorSerializer, ModeloAutorizoSerializer


class ProveedorViewSet(viewsets.ModelViewSet):
    queryset = Proveedor.objects.filter(activo=True)
    serializer_class = ProveedorSerializer


class ModeloAutorizoViewSet(viewsets.ModelViewSet):
    queryset = ModeloAutorizo.objects.all().select_related('ficha', 'entidad_contratada')
    serializer_class = ModeloAutorizoSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        ficha_id = self.request.query_params.get('ficha')
        if ficha_id:
            queryset = queryset.filter(ficha_id=ficha_id)
        return queryset
