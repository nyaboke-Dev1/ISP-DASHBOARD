from rest_framework import serializers
from .models import Subscription


class SubscriptionSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(
        source="customer.name",
        read_only=True,
    )
    package_name = serializers.CharField(
        source="package.name",
        read_only=True,
    )

    class Meta:
        model = Subscription
        fields = [
            "id",
            "customer",
            "customer_name",
            "package",
            "package_name",
            "status",
            "start_date",
            "end_date",
            "next_billing_date",
            "price_at_start",
            "billing_cycle_at_start",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "price_at_start",
            "billing_cycle_at_start",
        ]

    def validate(self, attrs):
        start_date = attrs.get(
            "start_date",
            getattr(self.instance, "start_date", None),
        )
        end_date = attrs.get(
            "end_date",
            getattr(self.instance, "end_date", None),
        )
        next_billing_date = attrs.get(
            "next_billing_date",
            getattr(self.instance, "next_billing_date", None),
        )

        if start_date and end_date and end_date < start_date:
            raise serializers.ValidationError({
                "end_date": "End date cannot be before start date."
            })

        if (
            start_date
            and next_billing_date
            and next_billing_date < start_date
        ):
            raise serializers.ValidationError({
                "next_billing_date":
                    "Next billing date cannot be before the start date."
            })
        if self.instance:
          if "customer" in attrs and attrs["customer"] != self.instance.customer:
            raise serializers.ValidationError({
            "customer": "Create a new subscription to change customers."
        })

        if "package" in attrs and attrs["package"] != self.instance.package:
          raise serializers.ValidationError({
            "package": (
                "Create a new subscription to change packages "
                "and preserve history."
            )
        })
        return attrs
