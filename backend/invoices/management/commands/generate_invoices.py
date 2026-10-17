
import calendar

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from invoices.models import Invoice
from subscriptions.models import Subscription


def add_billing_cycle(billing_date, billing_cycle):
    """Advance a date by one billing cycle, preserving valid month-end dates."""
    if billing_cycle == "monthly":
        months_to_add = 1
    elif billing_cycle == "quarterly":
        months_to_add = 3
    elif billing_cycle == "annual":
        months_to_add = 12
    else:
        raise ValueError(
            f"Unsupported billing cycle: {billing_cycle}"
        )

    month_index = billing_date.month - 1 + months_to_add
    year = billing_date.year + month_index // 12
    month = month_index % 12 + 1

    # For example, January 31 advances to February's last day.
    day = min(
        billing_date.day,
        calendar.monthrange(year, month)[1],
    )

    return billing_date.replace(
        year=year,
        month=month,
        day=day,
    )


class Command(BaseCommand):
    help = "Generate invoices for subscriptions whose billing dates have arrived."

    def handle(self, *args, **options):
        today = timezone.localdate()
        created_count = 0
        checked_count = 0

        subscriptions = (
            Subscription.objects
            .filter(status="active", next_billing_date__lte=today)
            .order_by("next_billing_date")
        )

        for subscription_id in subscriptions.values_list("id", flat=True):
            with transaction.atomic():
                subscription = (
                    Subscription.objects
                    .select_for_update()
                    .filter(pk=subscription_id, status="active")
                    .first()
                )

                if not subscription:
                    continue

                while subscription.next_billing_date <= today:
                    billing_date = subscription.next_billing_date

                    # Do not generate a new billing period after
                    # the subscription's recorded end date.
                    if (
                        subscription.end_date
                        and billing_date > subscription.end_date
                    ):
                        subscription.status = "ended"
                        subscription.save(
                            update_fields=["status", "updated_at"]
                        )
                        break

                    _, created = Invoice.objects.get_or_create(
                        subscription=subscription,
                        billing_period_start=billing_date,
                        defaults={
                            "customer": subscription.customer,
                            "amount": subscription.price_at_start,
                            "due_date": billing_date,
                            "status": "unpaid",
                        },
                    )

                    checked_count += 1

                    if created:
                        created_count += 1
                        self.stdout.write(
                            f"Created invoice for "
                            f"{subscription.customer.name}: "
                            f"{billing_date} — "
                            f"{subscription.price_at_start}"
                        )

                    subscription.next_billing_date = add_billing_cycle(
                        billing_date,
                        subscription.billing_cycle_at_start,
                    )

                subscription.save(
                    update_fields=["next_billing_date", "updated_at"]
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"Finished. Checked {checked_count} billing periods; "
                f"created {created_count} new invoices."
            )
        )
