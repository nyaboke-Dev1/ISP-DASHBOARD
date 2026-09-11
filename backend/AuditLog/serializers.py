from rest_framework import serializers
from .models import AuditLog


class AuditLogSerializer(serializers.ModelSerializer):
    admin_username = serializers.CharField(source='admin_user.username', read_only=True)

    class Meta:
        model  = AuditLog
        fields = [
            'id', 'admin_user', 'admin_username', 'action',
            'target_model', 'target_id', 'target_str',
            'ip_address', 'timestamp',
        ]
        read_only_fields = fields