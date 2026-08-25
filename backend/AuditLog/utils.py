from .models import AuditLog


def log_action(user, action, target_model, target_str, target_id=None, request=None):
    ip = None
    if request:
        ip = (request.META.get('HTTP_X_FORWARDED_FOR') or
              request.META.get('REMOTE_ADDR'))

    AuditLog.objects.create(
        admin_user   = user,
        action       = action,
        target_model = target_model,
        target_id    = target_id,
        target_str   = target_str,
        ip_address   = ip,
    )