from django.db import models
from django.core.validators import RegexValidator, MinValueValidator


# Lista de UEB (Provincias y Entidades) con codigos
UEB_CHOICES = [
    ('Artemisa', 'Artemisa'),
    ('Aseguramiento', 'Aseguramiento'),
    ('BNT Santiago', 'BNT Santiago'),
    ('Camaguey', 'Camaguey'),
    ('Ciego de Avila', 'Ciego de Avila'),
    ('Cienfuegos', 'Cienfuegos'),
    ('Granma', 'Granma'),
    ('Guantanamo', 'Guantanamo'),
    ('Holguin', 'Holguin'),
    ('Isla de la Juventud', 'Isla de la Juventud'),
    ('La Habana', 'La Habana'),
    ('Las Tunas', 'Las Tunas'),
    ('Matanzas', 'Matanzas'),
    ('Mayabeque', 'Mayabeque'),
    ('Operaciones', 'Operaciones'),
    ('Pinar del Rio', 'Pinar del Rio'),
    ('Plataforma', 'Plataforma'),
    ('Sancti Spiritus', 'Sancti Spiritus'),
    ('Santiago de Cuba', 'Santiago de Cuba'),
    ('Suministros Farmaceuticos', 'Suministros Farmaceuticos'),
    ('Villa Clara', 'Villa Clara'),
]

UEB_CODIGOS = {
    'Pinar del Rio': 20, 'Artemisa': 21, 'La Habana': 22, 'Matanzas': 23,
    'Cienfuegos': 24, 'Villa Clara': 25, 'Sancti Spiritus': 26,
    'Ciego de Avila': 27, 'Camaguey': 28, 'Las Tunas': 29, 'Holguin': 30,
    'Granma': 31, 'Santiago de Cuba': 32, 'Guantanamo': 33,
    'Isla de la Juventud': 34, 'Plataforma': 35, 'Operaciones': 36,
    'BNT Santiago': 38, 'Aseguramiento': 41, 'Mayabeque': 45,
    'Suministros Farmaceuticos': 46,
}


class Ficha(models.Model):
    """Ficha de Inversion - Modulo 1"""
    
    TIPO_CHOICES = [
        ('E', 'Especifica'),
        ('M', 'Multiple'),
        ('C', 'Centralizada'),
    ]
    
    numero = models.PositiveIntegerField(unique=True, help_text="Numero autoincremental")
    tipo = models.CharField(max_length=1, choices=TIPO_CHOICES)
    codigo = models.CharField(
        max_length=7,
        validators=[RegexValidator(r'^\d{7}$', 'El codigo debe tener exactamente 7 digitos')]
    )
    descripcion = models.TextField()
    fundamentacion = models.TextField()
    ueb = models.CharField(max_length=50, choices=UEB_CHOICES, blank=True, null=True)
    
    # Plan del Año (MCUP)
    cy_m = models.DecimalField(max_digits=15, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    equipo = models.DecimalField(max_digits=15, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    otros = models.DecimalField(max_digits=15, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    ppt = models.DecimalField(max_digits=15, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    importacion = models.DecimalField(max_digits=15, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    fb = models.DecimalField(max_digits=15, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    
    # Archivo adjunto
    archivo = models.FileField(upload_to='fichas/', blank=True, null=True)
    
    # Auditoria
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['numero']
        verbose_name = 'Ficha de Inversion'
        verbose_name_plural = 'Fichas de Inversion'
    
    def __str__(self):
        return f"Ficha {self.numero} - {self.descripcion[:50]}"
    
    @property
    def total(self):
        """Total = C y M + Equipo + Otros (no incluye Importacion ni FB)"""
        return float(self.cy_m) + float(self.equipo) + float(self.otros)


class SubFicha(models.Model):
    """Sub-Ficha de Inversion (para fichas tipo Multiple)"""
    
    ficha = models.ForeignKey(Ficha, on_delete=models.CASCADE, related_name='subfichas')
    numero_sub = models.PositiveIntegerField(help_text="Numero de sub-ficha (ej: 1 para 1.1)")
    codigo = models.CharField(max_length=6, help_text="Auto-generado")
    ueb = models.CharField(max_length=50, choices=UEB_CHOICES)
    # descripcion se hereda de la ficha padre pero se guarda para flexibilidad
    descripcion = models.TextField()
    fundamentacion = models.TextField(blank=True)
    
    # Plan del Año
    cy_m = models.DecimalField(max_digits=15, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    equipo = models.DecimalField(max_digits=15, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    otros = models.DecimalField(max_digits=15, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    ppt = models.DecimalField(max_digits=15, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    importacion = models.DecimalField(max_digits=15, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    fb = models.DecimalField(max_digits=15, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    
    archivo = models.FileField(upload_to='subfichas/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['ficha__numero', 'numero_sub']
        unique_together = ['ficha', 'numero_sub']
        verbose_name = 'Sub-Ficha'
        verbose_name_plural = 'Sub-Fichas'
    
    def save(self, *args, **kwargs):
        """Genera automaticamente el codigo de 6 digitos"""
        if self.ficha and self.ueb:
            ultimos_4 = self.ficha.codigo[-4:]
            ueb_codigo = UEB_CODIGOS.get(self.ueb, 0)
            self.codigo = f"{ultimos_4}{ueb_codigo:02d}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.ficha.numero}.{self.numero_sub} - {self.ueb}"
    
    @property
    def total(self):
        return float(self.cy_m) + float(self.equipo) + float(self.otros)
