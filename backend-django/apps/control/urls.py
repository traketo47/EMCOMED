from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ControlAutorizoViewSet, ControlContratoViewSet

router = DefaultRouter()
router.register(r'autorizos', ControlAutorizoViewSet)
router.register(r'contratos', ControlContratoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
