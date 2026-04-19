"""ASGI config for sgi_emcomed project."""
import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sgi_emcomed.settings')
application = get_asgi_application()
