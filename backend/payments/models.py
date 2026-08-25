from django.db import models

# Create your models here.
class Invoice(models.Model):

    STATUS_CHOICES = [
        ('unpaid',  'Unpaid'),
        ('paid',    'Paid'),
        ('overdue', 'Overdue'),
    ]

    customer   = models.ForeignKey(
                    'customers.Customer',
                    on_delete=models.CASCADE,
                    related_name='invoices'
                )
    amount     = models.DecimalField(max_digits=10, decimal_places=2)
    due_date   = models.DateField()
    status     = models.CharField(max_length=20, choices=STATUS_CHOICES, default='unpaid')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Invoice #{self.id} — {self.customer.name} — {self.status}"

    def mark_as_paid(self):
        self.status = 'paid'
        self.save()

    def mark_as_overdue(self):
        self.status = 'overdue'
        self.save()


class Payment(models.Model):

    METHOD_CHOICES = [
        ('mpesa', 'M-Pesa'),
        ('cash',  'Cash'),
        ('bank',  'Bank Transfer'),
    ]

    customer        = models.ForeignKey(
                        'customers.Customer',
                        on_delete=models.CASCADE,
                        related_name='payments'
                      )
    invoice         = models.ForeignKey(
                        Invoice,
                        on_delete=models.SET_NULL,
                        null=True,
                        blank=True,
                        related_name='payments'
                      )
    amount          = models.DecimalField(max_digits=10, decimal_places=2)
    method          = models.CharField(max_length=20, choices=METHOD_CHOICES, default='mpesa')
    transaction_ref = models.CharField(max_length=100, blank=True)
    paid_at         = models.DateTimeField()
    created_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-paid_at']

    def __str__(self):
        return f"Payment of KES {self.amount} by {self.customer.name} via {self.method}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.invoice:
            self.invoice.mark_as_paid()