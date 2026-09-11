from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Ticket
from .serializers import TicketSerializer
from AuditLog.utils import log_action


class TicketViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    filter_backends    = [filters.SearchFilter, filters.OrderingFilter]
    search_fields      = ['subject', 'customer__name']
    ordering_fields    = ['created_at', 'priority', 'status']
    ordering           = ['-created_at']
    serializer_class   = TicketSerializer

    def get_queryset(self):
        qs = Ticket.objects.select_related('customer', 'assigned_to').all()
        status_filter = self.request.query_params.get('status')
        priority      = self.request.query_params.get('priority')
        if status_filter:
            qs = qs.filter(status=status_filter)
        if priority:
            qs = qs.filter(priority=priority)
        return qs

    def perform_create(self, serializer):
        ticket = serializer.save()
        log_action(
            user         = self.request.user,
            action       = 'Created ticket',
            target_model = 'Ticket',
            target_str   = ticket.subject,
            target_id    = ticket.id,
            request      = self.request,
        )

    @action(detail=True, methods=['patch'], url_path='close')
    def close(self, request, pk=None):
        ticket = self.get_object()
        if ticket.status == 'closed':
            return Response(
                {'detail': 'Ticket is already closed.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        ticket.close()
        log_action(
            user         = request.user,
            action       = 'Closed ticket',
            target_model = 'Ticket',
            target_str   = ticket.subject,
            target_id    = ticket.id,
            request      = request,
        )
        return Response(TicketSerializer(ticket).data)

    @action(detail=True, methods=['patch'], url_path='assign')
    def assign(self, request, pk=None):
        ticket      = self.get_object()
        user_id     = request.data.get('assigned_to')
        if not user_id:
            return Response(
                {'detail': 'assigned_to is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        from django.contrib.auth.models import User
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response(
                {'detail': 'User not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        ticket.assign(user)
        log_action(
            user         = request.user,
            action       = f'Assigned ticket to {user.username}',
            target_model = 'Ticket',
            target_str   = ticket.subject,
            target_id    = ticket.id,
            request      = request,
        )
        return Response(TicketSerializer(ticket).data)