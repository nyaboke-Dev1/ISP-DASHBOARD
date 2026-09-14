import os
import django
import random
from datetime import date, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from django.contrib.auth.models import User
from customers.models import Customer
from packages.models import Package
from payments.models import Invoice, Payment
from tickets.models import Ticket
from network.models import UsageStat

print("Clearing existing data...")
UsageStat.objects.all().delete()
Ticket.objects.all().delete()
Payment.objects.all().delete()
Invoice.objects.all().delete()
Customer.objects.all().delete()
Package.objects.all().delete()

print("Creating packages...")
packages = [
    Package.objects.create(
        name='Home Basic',
        speed_mbps=10,
        price=2500,
        billing_cycle='monthly',
        description='Reliable everyday connectivity for homes and small households.',
        is_active=True,
    ),
    Package.objects.create(
        name='Home Premium',
        speed_mbps=20,
        price=4500,
        billing_cycle='monthly',
        description='Faster streaming and work-from-home connectivity.',
        is_active=True,
    ),
    Package.objects.create(
        name='Business Pro',
        speed_mbps=50,
        price=10500,
        billing_cycle='monthly',
        description='Priority bandwidth for growing businesses.',
        is_active=True,
    ),
]

print("Creating customers...")
customers_data = [
    ('John Kamau',     '0712345678', 'john.k@gmail.com',    'Westlands, Nairobi',  packages[0], 'active'),
    ('Mary Wanjiku',   '0722987654', 'mary.w@outlook.com',  'Kilimani, Nairobi',   packages[1], 'active'),
    ('David Otieno',   '0733112233', 'david.o@yahoo.com',   'Ruiru, Kiambu',       packages[0], 'suspended'),
    ('Sarah Mutua',    '0700554433', 'sarah.m@gmail.com',   'Section 9, Thika',    packages[2], 'active'),
    ('Kevin Omari',    '0711223344', 'kevin.o@gmail.com',   'South B, Nairobi',    packages[1], 'pending'),
    ('Alice Njeri',    '0755667788', 'alice.n@gmail.com',   'Kasarani, Nairobi',   packages[0], 'active'),
    ('Brian Kipkorir', '0788990011', 'brian.k@gmail.com',   'Kikuyu, Kiambu',      packages[1], 'active'),
    ('Grace Achieng',  '0744332211', 'grace.a@gmail.com',   'Embakasi, Nairobi',   packages[0], 'active'),
    ('Peter Otieno',   '0799112233', 'peter.o@gmail.com',   'Langata, Nairobi',    packages[2], 'active'),
    ('Esther Kamau',   '0711445566', 'esther.k@gmail.com',  'Thika Road, Nairobi', packages[1], 'active'),
]

customers = []
for name, phone, email, location, package, status in customers_data:
    c = Customer.objects.create(
        name=name,
        phone=phone,
        email=email,
        location=location,
        package=package,
        status=status,
        balance=0 if status == 'active' else random.choice([2500, 4500, 10500]),
    )
    customers.append(c)

print("Creating invoices...")
today = date.today()
invoices = []
for i, customer in enumerate(customers):
    status_choices = ['paid', 'paid', 'unpaid', 'overdue']
    inv_status = random.choice(status_choices)
    inv = Invoice.objects.create(
        customer=customer,
        amount=customer.package.price,
        due_date=today - timedelta(days=random.randint(0, 30)),
        status=inv_status,
    )
    invoices.append(inv)

print("Creating payments...")
mpesa_refs = [
    'QHJ7K2LM9P', 'RLM3N4OP5Q', 'ABC1D2EF3G',
    'XYZ9W8V7U6', 'MNO5P4Q3R2', 'STU1V2W3X4',
    'DEF6G7H8I9', 'JKL0M1N2O3',
]

for i, invoice in enumerate(invoices):
    if invoice.status == 'paid':
        Payment.objects.create(
            customer=invoice.customer,
            invoice=invoice,
            amount=invoice.amount,
            method=random.choice(['mpesa', 'mpesa', 'mpesa', 'cash', 'bank']),
            transaction_ref=random.choice(mpesa_refs),
            paid_at=today - timedelta(days=random.randint(1, 15)),
        )

print("Creating support tickets...")
tickets_data = [
    (customers[1], 'Internet connection dropping',  'high',   'open',        'Tech Support'),
    (customers[2], 'Suspension query',              'medium', 'open',        'Billing'),
    (customers[4], 'New installation status',       'low',    'open',        'Admin'),
    (customers[0], 'Router upgrade request',        'low',    'closed',      'Admin'),
    (customers[3], 'Slow speeds on Business Pro',   'high',   'open',        'Tech Support'),
    (customers[5], 'Billing discrepancy',           'medium', 'in_progress', 'Billing'),
    (customers[6], 'Wi-Fi coverage issue',          'low',    'closed',      'Tech Support'),
]

admin_user = User.objects.get(username='eunicenyaboke')

for customer, subject, priority, status, assignee in tickets_data:
    Ticket.objects.create(
        customer=customer,
        assigned_to=admin_user,
        subject=subject,
        priority=priority,
        status=status,
    )

print("Creating network usage stats...")
for day_offset in range(7):
    stat_date = today - timedelta(days=6 - day_offset)
    for customer in customers:
        UsageStat.objects.create(
            customer=customer,
            date=stat_date,
            upload_mb=random.randint(1000, 8000),
            download_mb=random.randint(10000, 50000),
        )

print("Done! Database seeded successfully.")
print(f"  Packages:  {Package.objects.count()}")
print(f"  Customers: {Customer.objects.count()}")
print(f"  Invoices:  {Invoice.objects.count()}")
print(f"  Payments:  {Payment.objects.count()}")
print(f"  Tickets:   {Ticket.objects.count()}")
print(f"  Usage:     {UsageStat.objects.count()}")