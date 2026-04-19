"""URL Configuration for SGI EMCOMED"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.users.urls')),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/fichas/', include('apps.fichas.urls')),
    path('api/desglose/', include('apps.desglose.urls')),
    path('api/autorizos/', include('apps.autorizos.urls')),
    path('api/control/', include('apps.control.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
