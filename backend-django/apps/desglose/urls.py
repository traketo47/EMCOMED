from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import DesgloseMensualViewSet, ColorFichaViewSet

router = DefaultRouter()
router.register(r'mensual', DesgloseMensualViewSet)
router.register(r'colores', ColorFichaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
