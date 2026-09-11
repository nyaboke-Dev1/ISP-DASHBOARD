from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from .models import AuditLog
from .serializers import AuditLogSerializer


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated, IsAdminUser]
    filter_backends    = [filters.SearchFilter, filters.OrderingFilter]
    search_fields      = ['action', 'target_str', 'admin_user__username']
    ordering_fields    = ['timestamp']
    ordering           = ['-timestamp']
    serializer_class   = AuditLogSerializer

    def get_queryset(self):
        qs      = AuditLog.objects.select_related('admin_user').all()
        action  = self.request.query_params.get('action')
        user_id = self.request.query_params.get('user')
        if action:
            qs = qs.filter(action__icontains=action)
        if user_id:
            qs = qs.filter(admin_user_id=user_id)
        return qs