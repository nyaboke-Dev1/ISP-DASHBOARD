from django.contrib import admin
from .models import Payment

# Register your models here.
# @admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display  = ['id', 'customer', 'invoice', 'amount', 'method', 'transaction_ref', 'paid_at']
    list_filter   = ['method']
    search_fields = ['customer__name', 'transaction_ref']
    ordering      = ['-paid_at']