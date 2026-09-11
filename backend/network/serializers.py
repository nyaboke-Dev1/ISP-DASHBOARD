from rest_framework import serializers
from .models import UsageStat


class UsageStatSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    total_mb      = serializers.FloatField(read_only=True)
    total_gb      = serializers.FloatField(read_only=True)

    class Meta:
        model  = UsageStat
        fields = [
            'id', 'customer', 'customer_name', 'date',
            'upload_mb', 'download_mb', 'total_mb', 'total_gb',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']