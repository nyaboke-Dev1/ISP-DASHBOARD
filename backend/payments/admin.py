from django.contrib import admin
from .models import Invoice, Payment

# Register your models here.
@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display  = ['id', 'customer', 'amount', 'due_date', 'status', 'created_at']
    list_filter   = ['status']
    search_fields = ['customer__name']
    ordering      = ['-created_at']


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display  = ['id', 'customer', 'invoice', 'amount', 'method', 'transaction_ref', 'paid_at']
    list_filter   = ['method']
    search_fields = ['customer__name', 'transaction_ref']
    ordering      = ['-paid_at']