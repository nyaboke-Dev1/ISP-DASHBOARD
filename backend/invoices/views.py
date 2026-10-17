from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Invoice
from .serializers import InvoiceSerializer


class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]

    queryset = Invoice.objects.select_related("customer").all()

    @action(detail=True, methods=["post", "patch"], url_path="mark-paid")
    def mark_paid(self, request, pk=None):
        invoice = self.get_object()
        invoice.mark_as_paid()

        return Response(
            self.get_serializer(invoice).data,
            status=status.HTTP_200_OK,
        )
