from django.db import models

# Create your models here.
class UsageStat(models.Model):

    customer    = models.ForeignKey(
                    'customers.Customer',
                    on_delete=models.CASCADE,
                    related_name='usage_stats'
                  )
    date        = models.DateField()
    upload_mb   = models.FloatField(default=0)
    download_mb = models.FloatField(default=0)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']
        unique_together = ['customer', 'date']

    def __str__(self):
        return f"{self.customer.name} — {self.date}"

    @property
    def total_mb(self):
        return self.upload_mb + self.download_mb

    @property
    def total_gb(self):
        return round(self.total_mb / 1024, 2)