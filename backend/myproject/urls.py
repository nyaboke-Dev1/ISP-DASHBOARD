from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView,
)

urlpatterns = [
    # Django admin
    path('admin/', admin.site.urls),

    # Auth endpoints
    path('api/auth/login/',   TokenObtainPairView.as_view(),  name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(),     name='token_refresh'),
    path('api/auth/logout/',  TokenBlacklistView.as_view(),   name='token_blacklist'),

    # App endpoints
    path('api/customers/',  include('customers.urls')),
    path('api/packages/',   include('packages.urls')),
    path('api/',   include('payments.urls')),
    path('api/network/',    include('network.urls')),
    path('api/tickets/',    include('tickets.urls')),
    path('api/AuditLog/',  include('AuditLog.urls')),
    path('api/dashboard/', include('dashboard.urls')),
]
