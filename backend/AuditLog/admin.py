from django.contrib import admin
from .models import AuditLog

# Register your models here.
@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display    = ['timestamp', 'admin_user', 'action', 'target_model', 'target_str', 'ip_address']
    list_filter     = ['action', 'target_model']
    search_fields   = ['admin_user__username', 'action', 'target_str']
    ordering        = ['-timestamp']
    readonly_fields = ['admin_user', 'action', 'target_model', 'target_id', 'target_str', 'ip_address', 'timestamp']

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False