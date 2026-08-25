from django.db import models

# Create your models here.
class Customer(models.Model):

    STATUS_CHOICES = [
        ('active',    'Active'),
        ('suspended', 'Suspended'),
        ('pending',   'Pending'),
    ]

    name       = models.CharField(max_length=255)
    phone      = models.CharField(max_length=20)
    email      = models.EmailField(unique=True)
    location   = models.CharField(max_length=255)
    status     = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    balance    = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    package    = models.ForeignKey(
                    'packages.Package',
                    on_delete=models.SET_NULL,
                    null=True,
                    blank=True,
                    related_name='customers'
                )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.status})"