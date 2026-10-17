
from rest_framework import serializers

from .models import Invoice
from customers.models import Customer


class InvoiceSerializer(serializers.ModelSerializer):
    customer_id = serializers.PrimaryKeyRelatedField(
        source="customer",
        queryset=Customer.objects.all(),
    )

    customer_name = serializers.CharField(
        source="customer.name",
        read_only=True,
    )

    reference = serializers.SerializerMethodField()

    class Meta:
        model = Invoice
        fields = [
            "id",
            "reference",
            "customer_id",
            "customer_name",
            "amount",
            "due_date",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "reference",
            "customer_name",
            "created_at",
            "updated_at",
        ]

    def get_reference(self, obj):
        return f"INV-{obj.id:05d}"
