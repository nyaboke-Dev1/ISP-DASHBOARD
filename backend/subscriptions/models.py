
from django.db import models
from django.db.models import Q


class Subscription(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("active", "Active"),
        ("suspended", "Suspended"),
        ("ended", "Ended"),
        ("cancelled", "Cancelled"),
    ]

    BILLING_CHOICES = [
        ("monthly", "Monthly"),
        ("quarterly", "Quarterly"),
        ("annual", "Annual"),
    ]

    customer = models.ForeignKey(
        "customers.Customer",
        on_delete=models.PROTECT,
        related_name="subscriptions",
    )

    package = models.ForeignKey(
        "packages.Package",
        on_delete=models.PROTECT,
        related_name="subscriptions",
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending",
    )

    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    next_billing_date = models.DateField()

    # Preserve the agreed price and billing cycle
    # even if the package changes later.
    price_at_start = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    billing_cycle_at_start = models.CharField(
        max_length=20,
        choices=BILLING_CHOICES,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["customer"],
                condition=Q(status="active"),
                name="one_active_subscription_per_customer",
            ),
        ]

    def __str__(self):
        return (
            f"{self.customer.name} - {self.package.name} "
            f"({self.status})"
        )
