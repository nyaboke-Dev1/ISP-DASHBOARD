
from rest_framework import viewsets
from rest_framework.exceptions import ValidationError

from .models import Subscription
from .serializers import SubscriptionSerializer


class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.select_related(
        "customer",
        "package",
    ).all()

    serializer_class = SubscriptionSerializer

    def perform_create(self, serializer):
        customer = serializer.validated_data["customer"]
        package = serializer.validated_data["package"]
        status = serializer.validated_data.get("status", "pending")

        if status == "active" and Subscription.objects.filter(
            customer=customer,
            status="active",
        ).exists():
            raise ValidationError({
                "customer": (
                    "This customer already has an active subscription."
                )
            })

        serializer.save(
            price_at_start=package.price,
            billing_cycle_at_start=package.billing_cycle,
        )
