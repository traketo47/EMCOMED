"""WSGI config for sgi_emcomed project."""
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sgi_emcomed.settings')
application = get_wsgi_application()
