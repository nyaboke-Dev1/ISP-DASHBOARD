from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class AuditLog(models.Model):

    admin_user   = models.ForeignKey(
                     User,
                     on_delete=models.SET_NULL,
                     null=True,
                     related_name='audit_logs'
                   )
    action       = models.CharField(max_length=255)
    target_model = models.CharField(max_length=100)
    target_id    = models.PositiveIntegerField(null=True, blank=True)
    target_str   = models.CharField(max_length=255, blank=True)
    ip_address   = models.GenericIPAddressField(null=True, blank=True)
    timestamp    = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.admin_user} — {self.action} — {self.timestamp}"