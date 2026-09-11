from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

from .models import Invoice, Payment
from .serializers import InvoiceSerializer, PaymentSerializer
from AuditLog.utils import log_action


class InvoiceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    filter_backends    = [filters.SearchFilter, filters.OrderingFilter]
    search_fields      = ['customer__name']
    ordering_fields    = ['due_date', 'amount', 'status', 'created_at']
    ordering           = ['-created_at']
    serializer_class   = InvoiceSerializer

    def get_queryset(self):
        qs     = Invoice.objects.select_related('customer').all()
        status = self.request.query_params.get('status')
        if status:
            qs = qs.filter(status=status)
        return qs

    def perform_create(self, serializer):
        invoice = serializer.save()
        log_action(
            user         = self.request.user,
            action       = 'Created invoice',
            target_model = 'Invoice',
            target_str   = f'Invoice #{invoice.id} — {invoice.customer.name}',
            target_id    = invoice.id,
            request      = self.request,
        )

    @action(detail=True, methods=['patch'], url_path='pay')
    def pay(self, request, pk=None):
        invoice = self.get_object()
        if invoice.status == 'paid':
            return Response(
                {'detail': 'Invoice is already paid.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        invoice.mark_as_paid()
        log_action(
            user         = request.user,
            action       = 'Marked invoice as paid',
            target_model = 'Invoice',
            target_str   = f'Invoice #{invoice.id} — {invoice.customer.name}',
            target_id    = invoice.id,
            request      = request,
        )
        return Response(InvoiceSerializer(invoice).data)

    @action(detail=True, methods=['patch'], url_path='overdue')
    def mark_overdue(self, request, pk=None):
        invoice = self.get_object()
        invoice.mark_as_overdue()
        return Response(InvoiceSerializer(invoice).data)


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