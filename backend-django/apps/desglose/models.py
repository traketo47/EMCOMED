from django.db import models
from django.core.validators import MinValueValidator


class DesgloseMensual(models.Model):
    """Desglose mensual del plan para fichas y sub-fichas - Modulo 2"""
    
    CATEGORIA_CHOICES = [
        ('cyM', 'C y M'),
        ('equipo', 'Equipo'),
        ('otros', 'Otros'),
        ('ppt', 'PPT'),
        ('importacion', 'Importacion'),
        ('fb', 'FB'),
    ]
    
    # Referencia a ficha o sub-ficha (una de las dos)
    ficha = models.ForeignKey(
        'fichas.Ficha', on_delete=models.CASCADE,
        related_name='desgloses', null=True, blank=True
    )
    subficha = models.ForeignKey(
        'fichas.SubFicha', on_delete=models.CASCADE,
        related_name='desgloses', null=True, blank=True
    )
    
    categoria = models.CharField(max_length=20, choices=CATEGORIA_CHOICES)
    
    # Montos por mes (Enero a Diciembre)
    enero = models.DecimalField(max_digits=15, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    febrero = models.DecimalField(max_digits=15, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    marzo = models.DecimalField(max_digits=15, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    abril = models.DecimalField(max_digits=15, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    mayo = models.DecimalField(max_digits=15, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    junio = models.DecimalField(max_digits=15, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    julio = models.DecimalField(max_digits=15, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    agosto = models.DecimalField(max_digits=15, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    septiembre = models.DecimalField(max_digits=15, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    octubre = models.DecimalField(max_digits=15, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    noviembre = models.DecimalField(max_digits=15, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    diciembre = models.DecimalField(max_digits=15, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    
    # Color de la ficha (para guia visual)
    color = models.CharField(max_length=20, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Desglose Mensual'
        verbose_name_plural = 'Desgloses Mensuales'
        constraints = [
            models.CheckConstraint(
                check=(
                    models.Q(ficha__isnull=False, subficha__isnull=True) |
                    models.Q(ficha__isnull=True, subficha__isnull=False)
                ),
                name='desglose_ficha_o_subficha'
            )
        ]
    
    def __str__(self):
        ref = self.ficha or self.subficha
        return f"Desglose {ref} - {self.get_categoria_display()}"
    
    @property
    def total(self):
        """Suma de los 12 meses"""
        return sum([
            float(self.enero), float(self.febrero), float(self.marzo),
            float(self.abril), float(self.mayo), float(self.junio),
            float(self.julio), float(self.agosto), float(self.septiembre),
            float(self.octubre), float(self.noviembre), float(self.diciembre)
        ])


class ColorFicha(models.Model):
    """Colores asignados a fichas en el Modulo 2"""
    ficha = models.OneToOneField(
        'fichas.Ficha', on_delete=models.CASCADE,
        related_name='color_asignado', null=True, blank=True
    )
    subficha = models.OneToOneField(
        'fichas.SubFicha', on_delete=models.CASCADE,
        related_name='color_asignado', null=True, blank=True
    )
    color = models.CharField(max_length=20, unique=True)
    
    class Meta:
        verbose_name = 'Color Ficha'
        verbose_name_plural = 'Colores de Fichas'
