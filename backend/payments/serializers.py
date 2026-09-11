from rest_framework import serializers
from .models import Invoice, Payment
from customers.models import Customer


class InvoiceSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)

    class Meta:
        model  = Invoice
        fields = [
            'id', 'customer', 'customer_name', 'amount',
            'due_date', 'status', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('Amount must be greater than zero.')
        return value


class PaymentSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    invoice_id    = serializers.PrimaryKeyRelatedField(
        source='invoice',
        queryset=Invoice.objects.all(),
        required=False,
        allow_null=True,
    )

    class Meta:
        model  = Payment
        fields = [
            'id', 'customer', 'customer_name', 'invoice_id',
            'amount', 'method', 'transaction_ref', 'paid_at',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('Amount must be greater than zero.')
        return value

    def validate_method(self, value):
        valid = ['mpesa', 'cash', 'bank']
        if value.lower() not in valid:
            raise serializers.ValidationError(f'Method must be one of: {", ".join(valid)}')
        return value