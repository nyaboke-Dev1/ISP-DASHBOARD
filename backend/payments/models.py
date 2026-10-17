from django.db import models
class Payment(models.Model):
    METHOD_CHOICES = [
        ("mpesa", "M-Pesa"),
        ("cash", "Cash"),
        ("bank", "Bank Transfer"),
    ]
    invoice = models.ForeignKey(
    "invoices.Invoice",
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name="invoices",
)
    customer = models.ForeignKey(
        "customers.Customer",
        on_delete=models.CASCADE,
        related_name="payments",
    )

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(
        max_length=20,
        choices=METHOD_CHOICES,
        default="mpesa",
    )
    transaction_ref = models.CharField(max_length=100, blank=True)
    paid_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-paid_at"]

    def __str__(self):
        return (
            f"Payment of KES {self.amount} "
            f"by {self.customer.name} via {self.method}"
        )
