from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Ticket(models.Model):

    PRIORITY_CHOICES = [
        ('high',   'High'),
        ('medium', 'Medium'),
        ('low',    'Low'),
    ]

    STATUS_CHOICES = [
        ('open',        'Open'),
        ('in_progress', 'In Progress'),
        ('closed',      'Closed'),
    ]

    customer    = models.ForeignKey(
                    'customers.Customer',
                    on_delete=models.CASCADE,
                    related_name='tickets'
                  )
    assigned_to = models.ForeignKey(
                    User,
                    on_delete=models.SET_NULL,
                    null=True,
                    blank=True,
                    related_name='assigned_tickets'
                  )
    subject     = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    priority    = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    status      = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Ticket #{self.id} — {self.subject} ({self.status})"

    def close(self):
        self.status = 'closed'
        self.save()

    def assign(self, user):
        self.assigned_to = user
        self.status = 'in_progress'
        self.save()