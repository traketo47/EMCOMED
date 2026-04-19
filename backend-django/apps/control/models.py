from django.db import models
from django.core.validators import MinValueValidator


class ControlAutorizo(models.Model):
    """Control de Autorizo - Datos adicionales por autorizo - Modulo 4 Seccion 1"""
    
    autorizo = models.OneToOneField(
        'autorizos.ModeloAutorizo',
        on_delete=models.CASCADE,
        related_name='control'
    )
    
    # UEB seleccionable
    ueb = models.CharField(max_length=50, blank=True)
    
    # Valores por componente (solo se edita el componente marcado en el autorizo)
    cyM = models.DecimalField(max_digits=15, decimal_places=4, default=0, validators=[MinValueValidator(0)])
    equipo = models.DecimalField(max_digits=15, decimal_places=4, default=0, validators=[MinValueValidator(0)])
    otros = models.DecimalField(max_digits=15, decimal_places=4, default=0, validators=[MinValueValidator(0)])
    
    # Financiamiento
    fecha_financiamiento = models.DateField(null=True, blank=True)
    financiamiento = models.DecimalField(max_digits=15, decimal_places=4, default=0, validators=[MinValueValidator(0)])
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Control de Autorizo'
        verbose_name_plural = 'Controles de Autorizo'
    
    def __str__(self):
        return f"Control {self.autorizo.consecutivo_completo}"


class ControlContrato(models.Model):
    """Control de Contrato - Trazabilidad de contratos y autorizos - Modulo 4 Seccion 2"""
    
    # Agrupacion por numero de contrato + proveedor
    numero_contrato = models.CharField(max_length=100)
    proveedor = models.ForeignKey(
        'autorizos.Proveedor',
        on_delete=models.SET_NULL,
        null=True,
        related_name='controles_contrato'
    )
    
    # Campos editables por usuario
    inversion = models.TextField(blank=True, help_text="Descripcion de la inversion")
    valor_contrato = models.DecimalField(max_digits=15, decimal_places=4, default=0)
    vigencia = models.CharField(max_length=200, blank=True)
    firma_contrato = models.CharField(max_length=100, blank=True)
    ejecutado_anos_anteriores = models.DecimalField(
        max_digits=15, decimal_places=4, default=0,
        validators=[MinValueValidator(0)]
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['numero_contrato', 'proveedor']
        verbose_name = 'Control de Contrato'
        verbose_name_plural = 'Controles de Contrato'
    
    def __str__(self):
        return f"Ctto {self.numero_contrato} - {self.proveedor}"
    
    @property
    def valor_autorizo(self):
        """Suma de valores de autorizos con mismo No. Ctto y Proveedor"""
        from apps.autorizos.models import ModeloAutorizo
        autorizos = ModeloAutorizo.objects.filter(
            numero_contrato=self.numero_contrato,
            entidad_contratada=self.proveedor
        )
        total = 0
        for autorizo in autorizos:
            if hasattr(autorizo, 'control'):
                total += float(autorizo.control.cyM) + float(autorizo.control.equipo) + float(autorizo.control.otros)
        return total
    
    @property
    def saldo_pendiente(self):
        return float(self.valor_contrato) - self.valor_autorizo - float(self.ejecutado_anos_anteriores)
