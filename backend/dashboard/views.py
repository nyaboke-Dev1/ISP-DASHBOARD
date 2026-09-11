from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta

from customers.models import Customer
from packages.models import Package
from payments.models import Invoice, Payment
from tickets.models import Ticket
from network.models import UsageStat


class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # ── Customers ─────────────────────────────────────────
        active_customers    = Customer.objects.filter(status='active').count()
        suspended_customers = Customer.objects.filter(status='suspended').count()
        pending_customers   = Customer.objects.filter(status='pending').count()
        total_customers     = Customer.objects.count()

        # ── Revenue (current month) ────────────────────────────
        now         = timezone.now()
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        monthly_revenue = Payment.objects.filter(
            paid_at__gte=month_start
        ).aggregate(total=Sum('amount'))['total'] or 0

        # ── Invoices ───────────────────────────────────────────
        overdue_invoices = Invoice.objects.filter(status='overdue').count()
        unpaid_invoices  = Invoice.objects.filter(status='unpaid').count()
        paid_invoices    = Invoice.objects.filter(status='paid').count()

        # ── Tickets ────────────────────────────────────────────
        open_tickets     = Ticket.objects.filter(status='open').count()
        in_progress      = Ticket.objects.filter(status='in_progress').count()
        closed_tickets   = Ticket.objects.filter(status='closed').count()

        # ── Package performance ────────────────────────────────
        packages = Package.objects.prefetch_related('customers').all()
        package_performance = [
            {
                'id':               p.id,
                'name':             p.name,
                'speed_mbps':       p.speed_mbps,
                'price':            str(p.price),
                'subscriber_count': p.customers.count(),
                'is_active':        p.is_active,
            }
            for p in packages
        ]

        # ── Recent customers (last 5) ──────────────────────────
        recent_customers = list(
            Customer.objects.select_related('package')
            .order_by('-created_at')[:5]
            .values(
                'id', 'name', 'phone', 'email',
                'location', 'status', 'balance',
                'package__name', 'created_at',
            )
        )

        # ── Network usage (last 7 days) ────────────────────────
        seven_days_ago = now - timedelta(days=7)
        usage = list(
            UsageStat.objects.filter(date__gte=seven_days_ago)
            .values('date')
            .annotate(
                total_upload=Sum('upload_mb'),
                total_download=Sum('download_mb'),
            )
            .order_by('date')
        )

        return Response({
            # KPI cards
            'active_customers':     active_customers,
            'suspended_customers':  suspended_customers,
            'pending_customers':    pending_customers,
            'total_customers':      total_customers,
            'current_month_revenue': float(monthly_revenue),
            'overdue_invoices':     overdue_invoices,
            'unpaid_invoices':      unpaid_invoices,
            'paid_invoices':        paid_invoices,
            'open_tickets':         open_tickets,
            'in_progress_tickets':  in_progress,
            'closed_tickets':       closed_tickets,

            # Detailed sections
            'package_performance':  package_performance,
            'recent_customers':     recent_customers,
            'usage':                usage,
        })
