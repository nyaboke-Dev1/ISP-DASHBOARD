from django.db import models

# Create your models here.
class Package(models.Model):

    BILLING_CHOICES = [
        ('monthly',   'Monthly'),
        ('quarterly', 'Quarterly'),
        ('annual',    'Annual'),
    ]

    name           = models.CharField(max_length=255)
    speed_mbps     = models.PositiveIntegerField()
    price          = models.DecimalField(max_digits=10, decimal_places=2)
    billing_cycle  = models.CharField(max_length=20, choices=BILLING_CHOICES, default='monthly')
    description    = models.TextField(blank=True)
    is_active      = models.BooleanField(default=True)
    created_at     = models.DateTimeField(auto_now_add=True)
    updated_at     = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['price']

    def __str__(self):
        return f"{self.name} — {self.speed_mbps} Mbps @ KES {self.price}"

    @property
    def subscriber_count(self):
        return self.customers.count()
