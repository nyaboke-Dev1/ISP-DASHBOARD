from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Ticket
from customers.models import Customer

class TicketSerializer(serializers.ModelSerializer):
    customer_id = serializers.PrimaryKeyRelatedField(
    source="customer",
    queryset=Customer.objects.all(),
    write_only=True,
    required=True,
)
    customer_name  = serializers.CharField(source='customer.name',         read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.username', read_only=True)
    

    class Meta:
        model  = Ticket
        fields = [
            'id', 'customer', 'customer_name', 'assigned_to',
            'assigned_to_name', 'subject', 'description',
            'priority', 'status', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_priority(self, value):
        valid = ['high', 'medium', 'low']
        if value.lower() not in valid:
            raise serializers.ValidationError(f'Priority must be one of: {", ".join(valid)}')
        return value