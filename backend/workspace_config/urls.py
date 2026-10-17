
from django.urls import path

from .views import (
    ProfileSettingsView,
    OrganizationSettingsView,
    NotificationSettingsView,
    PaymentSettingsView,
    ChangePasswordView,

)

urlpatterns = [
    path("profile/", ProfileSettingsView.as_view(), name="settings-profile"),
    path("organization/", OrganizationSettingsView.as_view(), name="settings-organization"),
    path("notifications/", NotificationSettingsView.as_view(), name="settings-notifications"),
    path("payments/", PaymentSettingsView.as_view(), name="settings-payments"),
    path("change-password/", ChangePasswordView.as_view(), name="settings-change-password"),
    path("organization/", OrganizationSettingsView.as_view(),name="settings-organization",
    ),

]
