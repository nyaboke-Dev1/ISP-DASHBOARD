from rest_framework import serializers
from .models import Customer
from packages.models import Package


class PackageMinimalSerializer(serializers.ModelSerializer):
    """Lightweight package info embedded in customer responses."""
    class Meta:
        model   = Package
        fields  = ['id', 'name', 'speed_mbps', 'price']


class CustomerSerializer(serializers.ModelSerializer):
    package_detail = PackageMinimalSerializer(source='package', read_only=True)

    class Meta:
        model  = Customer
        fields = [
            'id', 'name', 'phone', 'email', 'location',
            'status', 'balance', 'package', 'package_detail',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_email(self, value):
        """Ensure email is unique but allow updating the same customer."""
        qs = Customer.objects.filter(email=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError('A customer with this email already exists.')
        return value

    def validate_balance(self, value):
        if value < 0:
            raise serializers.ValidationError('Balance cannot be negative.')
        return value


class CustomerListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views."""
    package_name = serializers.CharField(source='package.name', read_only=True)

    class Meta:
        model  = Customer
        fields = [
            'id', 'name', 'phone', 'email', 'location',
            'status', 'balance', 'package', 'package_name',
            'created_at',
        ]