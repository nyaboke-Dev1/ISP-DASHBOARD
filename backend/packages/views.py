from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count

from .models import Package
from .serializers import PackageSerializer
from AuditLog.utils import log_action


class PackageViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    filter_backends    = [filters.SearchFilter, filters.OrderingFilter]
    search_fields      = ['name']
    ordering_fields    = ['name', 'price', 'speed_mbps']
    ordering           = ['price']

    def get_queryset(self):
        return Package.objects.annotate(
            subscriber_count=Count('customers')
        ).all()

    def get_serializer_class(self):
        return PackageSerializer

    def perform_create(self, serializer):
        package = serializer.save()
        log_action(
            user         = self.request.user,
            action       = 'Created package',
            target_model = 'Package',
            target_str   = package.name,
            target_id    = package.id,
            request      = self.request,
        )

    def perform_update(self, serializer):
        package = serializer.save()
        log_action(
            user         = self.request.user,
            action       = 'Updated package',
            target_model = 'Package',
            target_str   = package.name,
            target_id    = package.id,
            request      = self.request,
        )

    def perform_destroy(self, instance):
        log_action(
            user         = self.request.user,
            action       = 'Deleted package',
            target_model = 'Package',
            target_str   = instance.name,
            target_id    = instance.id,
            request      = self.request,
        )
        instance.delete()

    @action(detail=True, methods=['patch'], url_path='toggle')
    def toggle(self, request, pk=None):
        package = self.get_object()
        package.is_active = not package.is_active
        package.save()
        log_action(
            user         = request.user,
            action       = f"{'Activated' if package.is_active else 'Deactivated'} package",
            target_model = 'Package',
            target_str   = package.name,
            target_id    = package.id,
            request      = request,
        )
        return Response(PackageSerializer(package).data)