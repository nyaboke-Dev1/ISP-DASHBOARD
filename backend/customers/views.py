from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from .models import Customer
from .serializers import CustomerSerializer, CustomerListSerializer
from AuditLog.utils import log_action


class CustomerViewSet(viewsets.ModelViewSet):
    queryset           = Customer.objects.select_related('package').all()
    permission_classes = [IsAuthenticated]
    filter_backends    = [filters.SearchFilter, filters.OrderingFilter]
    search_fields      = ['name', 'email', 'phone', 'location']
    ordering_fields    = ['name', 'created_at', 'status', 'balance']
    ordering           = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return CustomerListSerializer
        return CustomerSerializer

    def perform_create(self, serializer):
        customer = serializer.save()
        log_action(
            user         = self.request.user,
            action       = 'Created customer',
            target_model = 'Customer',
            target_str   = customer.name,
            target_id    = customer.id,
            request      = self.request,
        )

    def perform_update(self, serializer):
        customer = serializer.save()
        log_action(
            user         = self.request.user,
            action       = 'Updated customer',
            target_model = 'Customer',
            target_str   = customer.name,
            target_id    = customer.id,
            request      = self.request,
        )

    def perform_destroy(self, instance):
        log_action(
            user         = self.request.user,
            action       = 'Deleted customer',
            target_model = 'Customer',
            target_str   = instance.name,
            target_id    = instance.id,
            request      = self.request,
        )
        instance.delete()

    @action(detail=True, methods=['patch'], url_path='suspend')
    def suspend(self, request, pk=None):
        customer = self.get_object()
        if customer.status == 'suspended':
            return Response(
                {'detail': 'Customer is already suspended.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        customer.status = 'suspended'
        customer.save()
        log_action(
            user         = request.user,
            action       = 'Suspended customer',
            target_model = 'Customer',
            target_str   = customer.name,
            target_id    = customer.id,
            request      = request,
        )
        return Response(CustomerSerializer(customer).data)

    @action(detail=True, methods=['patch'], url_path='reactivate')
    def reactivate(self, request, pk=None):
        customer = self.get_object()
        if customer.status == 'active':
            return Response(
                {'detail': 'Customer is already active.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        customer.status = 'active'
        customer.save()
        log_action(
            user         = request.user,
            action       = 'Reactivated customer',
            target_model = 'Customer',
            target_str   = customer.name,
            target_id    = customer.id,
            request      = request,
        )
        return Response(CustomerSerializer(customer).data)