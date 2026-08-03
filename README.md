# SwiftNet Admin — ISP Admin Dashboard

A full-stack web application for managing Internet Service Provider operations. Built with Django REST Framework and React (Vite).

---

## Overview

SwiftNet Admin is an internal dashboard for ISP staff and administrators to manage customers, internet packages, payments, invoices, network usage, and support tickets — all from one place.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router, Axios, Recharts |
| Backend | Django 5, Django REST Framework |
| Authentication | JWT (djangorestframework-simplejwt) |
| Database | PostgreSQL |
| Cross-Origin | django-cors-headers |

---

## Features

- **Customer management** — add, edit, suspend, and reactivate customers
- **Packages & subscriptions** — manage internet plans (speed, price, billing cycle)
- **Invoices** — auto-generated monthly invoices with overdue detection
- **Payments** — record payments via M-Pesa, cash, or bank transfer
- **Network usage** — track upload/download stats per customer
- **Support tickets** — create, assign, and resolve customer issues by priority
- **Audit log** — track every admin action (who did what and when)
- **Role-based access** — Super Admin vs Support Agent permissions
- **JWT authentication** — secure login with token refresh

---

## Project Structure

```
ISP-dashboard/
├── backend/                        # Django project
│   ├── core/                       # Project settings, URLs, WSGI
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── customers/                  # Customer management app
│   ├── packages/                   # Internet packages app
│   ├── payments/                   # Invoices and payments app
│   ├── network/                    # Network usage app
│   ├── tickets/                    # Support tickets app
│   ├── venv/                       # Virtual environment (not committed)
│   ├── manage.py
│   ├── requirements.txt
│   └── .env                        # Environment variables (not committed)
│
└── frontend/                       # React project
    ├── src/
    │   ├── components/
    │   │   ├── layout/             # Sidebar, Topbar, Layout wrapper
    │   │   └── ui/                 # Reusable UI components
    │   ├── pages/                  # One file per dashboard page
    │   ├── services/               # Axios API calls (api.js)
    │   ├── context/                # AuthContext (JWT token, user)
    │   ├── hooks/                  # Custom hooks (useAuth, useFetch)
    │   ├── utils/                  # Helpers (formatCurrency, formatDate)
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 22 LTS
- PostgreSQL 15+

---

### Backend Setup

```bash
# 1. Navigate to the backend folder
cd ISP-dashboard/backend

# 2. Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create a .env file (see Environment Variables section below)

# 5. Create the PostgreSQL database
# Open psql and run:
# CREATE DATABASE isp_dashboard;

# 6. Run migrations
python manage.py migrate

# 7. Create a superuser
python manage.py createsuperuser

# 8. Start the development server
python manage.py runserver
```

The backend runs at **http://localhost:8000**

---

### Frontend Setup

```bash
# 1. Navigate to the frontend folder
cd ISP-dashboard/frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The frontend runs at **http://localhost:5173**

---

## Environment Variables

Create a `.env` file in the `backend/` folder:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DB_NAME=isp_dashboard
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
```

> Never commit the `.env` file to version control.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login/` | Obtain JWT token |
| POST | `/api/auth/refresh/` | Refresh JWT token |
| GET/POST | `/api/customers/` | List / create customers |
| GET/PUT/DELETE | `/api/customers/<id>/` | Retrieve / update / delete customer |
| GET/POST | `/api/packages/` | List / create packages |
| GET/POST | `/api/invoices/` | List / create invoices |
| GET/POST | `/api/payments/` | List / record payments |
| GET | `/api/network/usage/` | Network usage stats |
| GET/POST | `/api/tickets/` | List / create support tickets |
| GET | `/api/audit-log/` | Audit log (read-only) |

---

## Database Models

| Model | Key Fields |
|---|---|
| `Customer` | name, phone, email, location, status, balance, package |
| `Package` | name, speed_mbps, price, billing_cycle, is_active |
| `Invoice` | customer, package, amount, due_date, status |
| `Payment` | customer, invoice, amount, method, transaction_ref, paid_at |
| `UsageStat` | customer, date, upload_mb, download_mb |
| `Ticket` | customer, subject, priority, status, assigned_to |
| `AuditLog` | admin_user, action, target, ip_address, timestamp |

---

## .gitignore

Make sure your `.gitignore` includes:

```
# Backend
backend/venv/
backend/.env
backend/__pycache__/
backend/staticfiles/
backend/media/

# Frontend
frontend/node_modules/
frontend/dist/

# General
*.pyc
.DS_Store
```

---

## Author

**Eunice Nyaboke**
BSc Computer Science — Jomo Kenyatta University of Agriculture and Technology (JKUAT)
 Zindua School Alumni

---

## License

This project is for portfolio and educational purposes.
