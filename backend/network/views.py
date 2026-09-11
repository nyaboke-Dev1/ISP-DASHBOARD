from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum

from .models import UsageStat
from .serializers import UsageStatSerializer


class UsageStatViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    filter_backends    = [filters.SearchFilter, filters.OrderingFilter]
    search_fields      = ['customer__name']
    ordering_fields    = ['date', 'download_mb', 'upload_mb']
    ordering           = ['-date']
    serializer_class   = UsageStatSerializer

    def get_queryset(self):
        qs          = UsageStat.objects.select_related('customer').all()
        customer_id = self.request.query_params.get('customer')
        date        = self.request.query_params.get('date')
        if customer_id:
            qs = qs.filter(customer_id=customer_id)
        if date:
            qs = qs.filter(date=date)
        return qs

    @action(detail=False, methods=['get'], url_path='top')
    def top_customers(self, request):
        top = (
            UsageStat.objects
            .values('customer__id', 'customer__name')
            .annotate(
                total_upload=Sum('upload_mb'),
                total_download=Sum('download_mb'),
            )
            .order_by('-total_download')[:5]
        )
        return Response(list(top))