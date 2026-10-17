from django.db import models
from django.db.models import Q

class Invoice(models.Model):
    STATUS_CHOICES = [
        ("unpaid", "Unpaid"),
        ("paid", "Paid"),
        ("overdue", "Overdue"),
    ]

    customer = models.ForeignKey(
        "customers.Customer",
        on_delete=models.CASCADE,
        related_name="invoices",
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="unpaid",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    subscription = models.ForeignKey(
        "subscriptions.Subscription",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="invoices",
    )

    # NEW: identifies the billing period being charged
    billing_period_start = models.DateField(null=True, blank=True)

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="unpaid",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    subscription = models.ForeignKey(
        "subscriptions.Subscription",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="invoices",
)

    billing_period_start = models.DateField(
        null=True,
        blank=True,
)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["subscription", "billing_period_start"],
                condition=Q(
                    subscription__isnull=False,
                    billing_period_start__isnull=False,
                ),
                name="unique_subscription_invoice_period",
            ),
        ]

    def __str__(self):
        return f"Invoice #{self.pk} - {self.customer.name}"

    def mark_as_paid(self):
        self.status = "paid"
        self.save(update_fields=["status", "updated_at"])

    def mark_as_overdue(self):
        self.status = "overdue"
        self.save(update_fields=["status", "updated_at"])

