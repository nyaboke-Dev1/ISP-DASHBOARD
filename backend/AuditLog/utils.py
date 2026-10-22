
from .models import AuditLog


def log_action(user, action, target_model, target_str, target_id=None, request=None):
    ip = None

    if request:
        forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR", "")

        if forwarded_for:
            # Keep one IP address, not the entire comma-separated list.
            ip = forwarded_for.split(",")[0].strip()
        else:
            ip = request.META.get("REMOTE_ADDR", "").strip()

        if not ip:
            ip = None

    AuditLog.objects.create(
        admin_user=user,
        action=action,
        target_model=target_model,
        target_id=target_id,
        target_str=target_str,
        ip_address=ip,
    )
