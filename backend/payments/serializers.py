from rest_framework import serializers
from .models import Payment
from invoices.models import Invoice
from customers.models import Customer
class PaymentSerializer(serializers.ModelSerializer):
    customer_id = serializers.PrimaryKeyRelatedField(
        source="customer",
        queryset=Customer.objects.all(),
        write_only=True,
        required=True,
    ) 
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