from django.contrib import admin
from .models import UsageStat

# Register your models here.
@admin.register(UsageStat)
class UsageStatAdmin(admin.ModelAdmin):
    list_display  = ['customer', 'date', 'upload_mb', 'download_mb', 'created_at']
    list_filter   = ['date']
    search_fields = ['customer__name']
    ordering      = ['-date']