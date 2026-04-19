from django.db import models
from django.core.validators import MinValueValidator


class Proveedor(models.Model):
    """Proveedores (Entidades Contratadas)"""
    nombre = models.CharField(max_length=200, unique=True)
    activo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['nombre']
        verbose_name = 'Proveedor'
        verbose_name_plural = 'Proveedores'
    
    def __str__(self):
        return self.nombre


class ConsecutivoGlobal(models.Model):
    """Contador global de consecutivo para autorizos - no se reinicia"""
    ultimo_consecutivo = models.PositiveIntegerField(default=0)
    
    class Meta:
        verbose_name = 'Consecutivo Global'
        verbose_name_plural = 'Consecutivos Globales'
    
    @classmethod
    def obtener_siguiente(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        obj.ultimo_consecutivo += 1
        obj.save()
        return obj.ultimo_consecutivo


class ModeloAutorizo(models.Model):
    """Modelo de Autorizo/Control de Inversiones - Modulo 3"""
    
    COMPONENTE_CHOICES = [
        ('cyM', 'C y M (Cuent 265)'),
        ('equip', 'EQUIP (Cuenta 266/290)'),
        ('ppt', 'PPT (Cuenta 279)'),
        ('otros', 'OTROS (Cuenta 269)'),
    ]
    
    # Identificacion
    consecutivo_numero = models.PositiveIntegerField(unique=True, help_text="Numero consecutivo")
    consecutivo_anio = models.PositiveIntegerField(help_text="Año del consecutivo")
    fecha = models.DateField()
    
    # Relacion con ficha
    ficha = models.ForeignKey(
        'fichas.Ficha', on_delete=models.SET_NULL,
        related_name='autorizos', null=True
    )
    
    # Contenido
    descripcion_alcance = models.TextField()
    numero_contrato = models.DecimalField(
        max_digits=15, decimal_places=4,
        validators=[MinValueValidator(0.0001)]
    )
    entidad_contratada = models.ForeignKey(
        Proveedor, on_delete=models.SET_NULL,
        related_name='autorizos', null=True
    )
    factura = models.CharField(max_length=100, blank=True)
    
    # Plan Aprobado
    plan_aprobado_mmt = models.DecimalField(max_digits=15, decimal_places=4, default=0)
    plan_aprobado_import = models.DecimalField(max_digits=15, decimal_places=4, default=0)
    
    # Valor del Contrato
    valor_contrato_mmt = models.DecimalField(max_digits=15, decimal_places=4, default=0)
    valor_contrato_import = models.DecimalField(max_digits=15, decimal_places=4, default=0)
    
    # Componente seleccionado (solo uno)
    componente = models.CharField(max_length=10, choices=COMPONENTE_CHOICES)
    
    # Firmas
    elaborado_nombre = models.CharField(max_length=150, blank=True)
    elaborado_cargo = models.CharField(max_length=150, blank=True)
    elaborado_firma = models.TextField(blank=True, help_text="Firma digital en base64")
    
    aprobado_nombre = models.CharField(max_length=150, blank=True)
    aprobado_cargo = models.CharField(max_length=150, blank=True)
    aprobado_firma = models.TextField(blank=True, help_text="Firma digital en base64")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-consecutivo_anio', '-consecutivo_numero']
        verbose_name = 'Modelo de Autorizo'
        verbose_name_plural = 'Modelos de Autorizo'
    
    def __str__(self):
        return f"Autorizo {self.consecutivo_numero},{self.consecutivo_anio}"
    
    @property
    def consecutivo_completo(self):
        return f"{self.consecutivo_numero},{self.consecutivo_anio}"
    
    def save(self, *args, **kwargs):
        """Asigna automaticamente el consecutivo al crear"""
        if not self.consecutivo_numero:
            self.consecutivo_numero = ConsecutivoGlobal.obtener_siguiente()
        super().save(*args, **kwargs)
