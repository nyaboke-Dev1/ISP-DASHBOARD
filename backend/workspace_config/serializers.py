from .models import OrganizationSettings

from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import (
    UserProfile,
    OrganizationSettings,
    NotificationPreferences,
    PaymentSettings,
)

User = get_user_model()


class ProfileSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)

    def update(self, instance, validated_data):
        profile, _ = UserProfile.objects.get_or_create(user=instance)

        for field in ("first_name", "last_name", "email"):
            if field in validated_data:
                setattr(instance, field, validated_data[field])

        instance.save()

        if "phone" in validated_data:
            profile.phone = validated_data["phone"]
            profile.save()

        return instance

    def to_representation(self, instance):
        profile, _ = UserProfile.objects.get_or_create(user=instance)

        return {
            "first_name": instance.first_name,
            "last_name": instance.last_name,
            "email": instance.email,
            "phone": profile.phone,
        }


class OrganizationSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationSettings
        fields = ["company", "billing_email", "timezone", "currency"]


class NotificationPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationPreferences
        fields = [
            "invoice_overdue",
            "payment_received",
            "ticket_assigned",
            "network_outage",
            "weekly_summary",
        ]


class PaymentSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentSettings
        fields = ["paybill", "till", "callback_url", "auto_reconcile"]
        
class OrganizationSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationSettings
        fields = [
            "company",
            "billing_email",
            "timezone",
            "currency",
            "updated_at",
        ]
        read_only_fields = ["updated_at"]        
