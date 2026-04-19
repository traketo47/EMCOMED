from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import FichaViewSet, SubFichaViewSet

router = DefaultRouter()
router.register(r'fichas', FichaViewSet)
router.register(r'subfichas', SubFichaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
