
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.contrib.auth.hashers import check_password

from rest_framework.authentication import BasicAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication


from rest_framework import serializers, status

from .models import OrganizationSettings
from .serializers import OrganizationSettingsSerializer


from .models import (
    OrganizationSettings,
    NotificationPreferences,
    PaymentSettings,
)
from .serializers import (
    ProfileSerializer,
    OrganizationSettingsSerializer,
    NotificationPreferencesSerializer,
    PaymentSettingsSerializer,
)


class UserSettingsView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    model = None
    serializer_class = None

    def get_settings(self, user):
        settings_object, _ = self.model.objects.get_or_create(user=user)
        return settings_object

    def get(self, request):
        settings_object = self.get_settings(request.user)
        serializer = self.serializer_class(settings_object)
        return Response(serializer.data)

    def patch(self, request):
        settings_object = self.get_settings(request.user)
        serializer = self.serializer_class(
            settings_object,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ProfileSettingsView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(instance=request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = ProfileSerializer(
            instance=request.user,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class OrganizationSettingsView(UserSettingsView):
    model = OrganizationSettings
    serializer_class = OrganizationSettingsSerializer


class NotificationSettingsView(UserSettingsView):
    model = NotificationPreferences
    serializer_class = NotificationPreferencesSerializer


class PaymentSettingsView(UserSettingsView):
    model = PaymentSettings
    serializer_class = PaymentSettingsSerializer
    

class ChangePasswordView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        current_password = request.data.get("current_password", "")
        new_password = request.data.get("new_password", "")
        confirm_password = request.data.get("confirm_password", "")

        if not all([current_password, new_password, confirm_password]):
            return Response(
                {"detail": "Please complete all password fields."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = request.user

        if not check_password(current_password, user.password):
            return Response(
                {"current_password": ["Your current password is incorrect."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if new_password != confirm_password:
            return Response(
                {"confirm_password": ["The new passwords do not match."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            validate_password(new_password, user=user)
        except DjangoValidationError as error:
            return Response(
                {"new_password": list(error.messages)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if check_password(new_password, user.password):
            return Response(
                {"new_password": ["Choose a password different from your current one."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save(update_fields=["password"])

        return Response(
            {"detail": "Password changed successfully. Please sign in again if necessary."},
            status=status.HTTP_200_OK,
        )

class OrganizationSettingsView(APIView):
    authentication_classes = [JWTAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        settings, _ = OrganizationSettings.objects.get_or_create(
            user=request.user
        )
        serializer = OrganizationSettingsSerializer(settings)
        return Response(serializer.data)

    def patch(self, request):
        settings, _ = OrganizationSettings.objects.get_or_create(
            user=request.user
        )
        serializer = OrganizationSettingsSerializer(
            settings,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

