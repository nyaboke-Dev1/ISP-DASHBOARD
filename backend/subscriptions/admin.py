
from django.contrib import admin
from .models import Subscription


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = (
        "customer",
        "package",
        "status",
        "start_date",
        "end_date",
        "next_billing_date",
        "price_at_start",
    )

    list_filter = ("status", "package", "billing_cycle_at_start")
    search_fields = ("customer__name", "customer__email")
    date_hierarchy = "start_date"
