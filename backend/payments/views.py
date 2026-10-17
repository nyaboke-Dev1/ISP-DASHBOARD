from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

from .models import Payment
from .serializers import PaymentSerializer
from AuditLog.utils import log_action

class PaymentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    filter_backends    = [filters.SearchFilter, filters.OrderingFilter]
    search_fields      = ['customer__name', 'transaction_ref']
    ordering_fields    = ['paid_at', 'amount']
    ordering           = ['-paid_at']
    serializer_class   = PaymentSerializer

    def get_queryset(self):
        return Payment.objects.select_related('customer', 'invoice').all()

    def perform_create(self, serializer):
        payment = serializer.save()
        log_action(
            user         = self.request.user,
            action       = 'Recorded payment',
            target_model = 'Payment',
            target_str   = f'KES {payment.amount} from {payment.customer.name}',
            target_id    = payment.id,
            request      = self.request,
        )