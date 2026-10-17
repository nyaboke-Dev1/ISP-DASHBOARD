import calendar
from datetime import date

from django.db import transaction
from rest_framework import serializers

from .models import Customer
from packages.models import Package
from subscriptions.models import Subscription


class PackageMinimalSerializer(serializers.ModelSerializer):
    """Lightweight package information embedded in customer responses."""

    class Meta:
        model = Package
        fields = ["id", "name", "speed_mbps", "price"]


class CustomerSerializer(serializers.ModelSerializer):
    package_id = serializers.PrimaryKeyRelatedField(
        source="package",
        queryset=Package.objects.all(),
        required=False,
        allow_null=True,
        write_only=True,
    )

    package_detail = PackageMinimalSerializer(
        source="package",
        read_only=True,
    )

    start_date = serializers.DateField(write_only=True, required=False)
    end_date = serializers.DateField(write_only=True, required=False)

    class Meta:
        model = Customer
        fields = [
            "id",
            "name",
            "phone",
            "email",
            "location",
            "status",
            "balance",
            "package",
            "package_id",
            "package_detail",
            "start_date",
            "end_date",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate(self, attrs):
        package = attrs.get(
            "package",
            getattr(self.instance, "package", None),
        )

        start_date = attrs.get("start_date")
        end_date = attrs.get("end_date")

        if package and not self.instance:
            if not start_date:
                raise serializers.ValidationError({
                    "start_date": "A subscription start date is required."
                })

            if not end_date:
                raise serializers.ValidationError({
                    "end_date": "A subscription expiry date is required."
                })

        if start_date and end_date and end_date < start_date:
            raise serializers.ValidationError({
                "end_date": "Expiry date cannot be before the start date."
            })

        return attrs

    def validate_email(self, value):
        qs = Customer.objects.filter(email=value)

        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)

        if qs.exists():
            raise serializers.ValidationError(
                "A customer with this email already exists."
            )

        return value

    def validate_balance(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "Balance cannot be negative."
            )

        return value

    @transaction.atomic
    def create(self, validated_data):
        start_date = validated_data.pop("start_date", None)
        end_date = validated_data.pop("end_date", None)

        customer = super().create(validated_data)
        package = customer.package

        if package:
            # Use the package billing cycle if the model provides one.
            cycle = getattr(package, "billing_cycle", "monthly")

            if cycle not in ("monthly", "quarterly", "annual"):
                cycle = "monthly"

            months = {
                "monthly": 1,
                "quarterly": 3,
                "annual": 12,
            }[cycle]

            month_index = start_date.month - 1 + months
            next_year = start_date.year + month_index // 12
            next_month = month_index % 12 + 1

            next_billing_date = date(
                next_year,
                next_month,
                min(
                    start_date.day,
                    calendar.monthrange(next_year, next_month)[1],
                ),
            )

            subscription_status = customer.status

            if start_date > date.today():
                subscription_status = "pending"

            if subscription_status not in (
                "pending",
                "active",
                "suspended",
                "ended",
                "cancelled",
            ):
                subscription_status = "pending"

            Subscription.objects.create(
                customer=customer,
                package=package,
                status=subscription_status,
                start_date=start_date,
                end_date=end_date,
                next_billing_date=next_billing_date,
                price_at_start=package.price,
                billing_cycle_at_start=cycle,
            )

        return customer


class CustomerListSerializer(serializers.ModelSerializer):
    """Customer information used by the customer list endpoint."""

    package_name = serializers.CharField(
        source="package.name",
        read_only=True,
        allow_null=True,
    )

    class Meta:
        model = Customer
        fields = [
            "id",
            "name",
            "phone",
            "email",
            "location",
            "status",
            "balance",
            "package",
            "package_name",
            "created_at",
        ]
