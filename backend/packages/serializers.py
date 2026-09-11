from rest_framework import serializers
from .models import Package


class PackageSerializer(serializers.ModelSerializer):
    subscriber_count = serializers.IntegerField(read_only=True)

    class Meta:
        model  = Package
        fields = [
            'id', 'name', 'speed_mbps', 'price',
            'billing_cycle', 'description', 'is_active',
            'subscriber_count', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError('Price must be greater than zero.')
        return value

    def validate_speed_mbps(self, value):
        if value <= 0:
            raise serializers.ValidationError('Speed must be greater than zero.')
        return value