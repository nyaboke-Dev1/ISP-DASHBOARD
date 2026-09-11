from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsageStatViewSet

router = DefaultRouter()
router.register(r'usage', UsageStatViewSet, basename='usage')

urlpatterns = [
    path('', include(router.urls)),
]