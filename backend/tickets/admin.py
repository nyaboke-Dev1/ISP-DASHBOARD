from django.contrib import admin
from .models import Ticket

# Register your models here.
@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display  = ['id', 'customer', 'subject', 'priority', 'status', 'assigned_to', 'created_at']
    list_filter   = ['priority', 'status']
    search_fields = ['customer__name', 'subject']
    ordering      = ['-created_at']