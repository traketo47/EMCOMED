from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ProveedorViewSet, ModeloAutorizoViewSet

router = DefaultRouter()
router.register(r'proveedores', ProveedorViewSet)
router.register(r'modelos', ModeloAutorizoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
