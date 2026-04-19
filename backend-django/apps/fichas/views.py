from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction

from .models import Ficha, SubFicha
from .serializers import FichaSerializer, SubFichaSerializer


class FichaViewSet(viewsets.ModelViewSet):
    queryset = Ficha.objects.all().prefetch_related('subfichas')
    serializer_class = FichaSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        tipo = self.request.query_params.get('tipo')
        if tipo:
            queryset = queryset.filter(tipo=tipo)
        return queryset
    
    @transaction.atomic
    def perform_destroy(self, instance):
        """Al eliminar, renumera las fichas restantes"""
        numero_eliminado = instance.numero
        instance.delete()
        # Renumerar las fichas posteriores
        Ficha.objects.filter(numero__gt=numero_eliminado).update(
            numero=models.F('numero') - 1
        )
    
    @action(detail=True, methods=['get'])
    def subfichas(self, request, pk=None):
        ficha = self.get_object()
        subfichas = ficha.subfichas.all()
        serializer = SubFichaSerializer(subfichas, many=True)
        return Response(serializer.data)


class SubFichaViewSet(viewsets.ModelViewSet):
    queryset = SubFicha.objects.all()
    serializer_class = SubFichaSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        ficha_id = self.request.query_params.get('ficha')
        if ficha_id:
            queryset = queryset.filter(ficha_id=ficha_id)
        return queryset


# Fix import for F expression
from django.db import models
