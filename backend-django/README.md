# SGI EMCOMED - Backend Django

Backend para el Sistema de Gestion de Inversiones de EMCOMED, desarrollado con Django 5 y Django REST Framework.

## Requisitos Previos

- Python 3.10 o superior
- pip
- virtualenv (recomendado)
- PostgreSQL (opcional, por defecto usa SQLite)

## Instalacion

### 1. Crear entorno virtual

\`\`\`bash
cd backend-django
python -m venv venv
\`\`\`

### 2. Activar entorno virtual

**Windows:**
\`\`\`bash
venv\Scripts\activate
\`\`\`

**Linux/Mac:**
\`\`\`bash
source venv/bin/activate
\`\`\`

### 3. Instalar dependencias

\`\`\`bash
pip install -r requirements.txt
\`\`\`

### 4. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y ajusta los valores:

\`\`\`bash
cp .env.example .env
\`\`\`

### 5. Ejecutar migraciones

\`\`\`bash
python manage.py makemigrations users
python manage.py makemigrations fichas
python manage.py makemigrations desglose
python manage.py makemigrations autorizos
python manage.py makemigrations control
python manage.py migrate
\`\`\`

### 6. Crear superusuario

\`\`\`bash
python manage.py createsuperuser
\`\`\`

### 7. Ejecutar servidor

\`\`\`bash
python manage.py runserver
\`\`\`

El servidor estara disponible en `http://localhost:8000`

- Admin panel: `http://localhost:8000/admin/`
- API: `http://localhost:8000/api/`

## Estructura del Proyecto

\`\`\`
backend-django/
├── sgi_emcomed/          # Configuracion del proyecto
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   ├── users/            # Autenticacion y usuarios
│   ├── fichas/           # Modulo 1 - Plan de Inversion
│   ├── desglose/         # Modulo 2 - Desglose por Meses
│   ├── autorizos/        # Modulo 3 - Modelos de Autorizo
│   └── control/          # Modulo 4 - Control Autorizo/Contrato
├── manage.py
├── requirements.txt
└── README.md
\`\`\`

## Endpoints API

### Autenticacion
- `POST /api/auth/login/` - Login (obtener token JWT)
- `POST /api/auth/token/refresh/` - Refrescar token
- `GET /api/auth/users/me/` - Usuario actual
- `POST /api/auth/users/register/` - Registrar usuario

### Modulo 1 - Fichas
- `GET/POST /api/fichas/fichas/` - Listar/Crear fichas
- `GET/PUT/DELETE /api/fichas/fichas/{id}/` - Detalle/Actualizar/Eliminar
- `GET /api/fichas/fichas/{id}/subfichas/` - Sub-fichas de una ficha
- `GET/POST /api/fichas/subfichas/` - Listar/Crear sub-fichas

### Modulo 2 - Desglose
- `GET/POST /api/desglose/mensual/` - Desgloses mensuales
- `GET/POST /api/desglose/colores/` - Colores de fichas

### Modulo 3 - Autorizos
- `GET/POST /api/autorizos/proveedores/` - Proveedores
- `GET/POST /api/autorizos/modelos/` - Modelos de autorizo

### Modulo 4 - Control
- `GET/POST /api/control/autorizos/` - Control de autorizos
- `GET /api/control/autorizos/resumen_mmt/?ficha={id}` - Resumen MMT
- `GET/POST /api/control/contratos/` - Control de contratos
- `POST /api/control/contratos/generar_desde_autorizos/` - Generar automaticamente

## Conexion con Frontend

El frontend Next.js debe hacer peticiones a `http://localhost:8000/api/` incluyendo el token JWT en el header:

\`\`\`javascript
headers: {
  'Authorization': 'Bearer ' + token,
  'Content-Type': 'application/json'
}
\`\`\`

## Base de Datos

Por defecto usa SQLite. Para usar PostgreSQL, descomenta la configuracion en `settings.py` y ajusta las credenciales.
