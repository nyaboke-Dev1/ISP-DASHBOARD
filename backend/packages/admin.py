from django.contrib import admin
from .models import Package

# Register your models here.
@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ['name', 'speed_mbps', 'price', 'billing_cycle', 'is_active', 'created_at']
    list_filter  = ['is_active', 'billing_cycle']
    ordering     = ['price']