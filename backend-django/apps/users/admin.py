from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'role', 'cargo', 'is_active']
    list_filter = ['role', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    
    fieldsets = UserAdmin.fieldsets + (
        ('Informacion SGI', {'fields': ('role', 'cargo')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Informacion SGI', {'fields': ('email', 'role', 'cargo')}),
    )
