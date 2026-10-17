
from django.conf import settings
from django.db import models


class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    phone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f"Profile for {self.user.username}"


class OrganizationSettings(models.Model):
    TIMEZONE_CHOICES = [
        ("africa-nairobi", "Africa/Nairobi"),
        ("africa-kampala", "Africa/Kampala"),
        ("africa-dar", "Africa/Dar es Salaam"),
        ("utc", "UTC"),
    ]

    CURRENCY_CHOICES = [
        ("kes", "Kenyan Shilling"),
        ("ugx", "Ugandan Shilling"),
        ("tzs", "Tanzanian Shilling"),
        ("usd", "US Dollar"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="organization_settings",
    )
    company = models.CharField(
        max_length=200,
        default="Swift-Net Communications",
    )
    billing_email = models.EmailField(blank=True)
    timezone = models.CharField(
        max_length=30,
        choices=TIMEZONE_CHOICES,
        default="africa-nairobi",
    )
    currency = models.CharField(
        max_length=3,
        choices=CURRENCY_CHOICES,
        default="kes",
    )
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Organization settings for {self.user.username}"


class NotificationPreferences(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notification_preferences",
    )
    invoice_overdue = models.BooleanField(default=True)
    payment_received = models.BooleanField(default=True)
    ticket_assigned = models.BooleanField(default=True)
    network_outage = models.BooleanField(default=True)
    weekly_summary = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Notification preferences for {self.user.username}"


class PaymentSettings(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="payment_settings",
    )
    paybill = models.CharField(max_length=30, blank=True)
    till = models.CharField(max_length=30, blank=True)
    callback_url = models.URLField(blank=True)
    auto_reconcile = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment settings for {self.user.username}"
