from django.contrib import admin
from .models import Customer

# Register your models here.
@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display  = ['name', 'phone', 'email', 'location', 'status', 'balance', 'package', 'created_at']
    list_filter   = ['status', 'package']
    search_fields = ['name', 'email', 'phone']
    ordering      = ['-created_at']