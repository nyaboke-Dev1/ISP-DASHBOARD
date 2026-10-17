
import { useEffect, useState } from "react";
import {
  KeyRound,
  ShieldCheck,
  Smartphone,
  Trash2,
  TriangleAlert,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { settingsAPI } from "@/Services/api";
import { AppShell } from "@/components/AppShell";
import {
  FieldRow,
  Monogram,
  PageHeader,
  Panel,
  PanelHeader,
  StatusPill,
} from "@/components/isp/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const inputClass = "h-9 rounded-md bg-card text-sm";

function SaveBar({ label, onSave, disabled = false, loading = false }) {
  return (
    <div className="flex justify-end border-t border-border px-4 py-3 sm:px-5">
      <Button
        size="sm"
        className="rounded-lg"
        onClick={onSave}
        disabled={disabled || loading}
      >
        {loading ? "Saving..." : label}
      </Button>
    </div>
  );
}

function getErrorMessage(error, fallback) {
  const data = error?.response?.data;

  if (typeof data?.detail === "string") return data.detail;
  if (typeof data === "string") return data;

  if (data && typeof data === "object") {
    const firstError = Object.values(data)
      .flat(Infinity)
      .find((value) => typeof value === "string");

    if (firstError) return firstError;
  }

  if (!error?.response) {
    return "Could not connect to Django. Check that the backend is running.";
  }

  return fallback;
}

const defaultOrg = {
  company: "Swift-Net Communications",
  billingEmail: "billing@swiftnet.co.ke",
  timezone: "africa-nairobi",
  currency: "kes",
};

const defaultNotifications = {
  invoiceOverdue: true,
  paymentReceived: true,
  ticketAssigned: true,
  networkOutage: true,
  weeklySummary: false,
};

const defaultPayments = {
  paybill: "",
  till: "",
  callbackUrl: "",
  autoReconcile: true,
};

export function SettingsPage() {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [org, setOrg] = useState(defaultOrg);
  const [notifications, setNotifications] = useState(defaultNotifications);
  const [payments, setPayments] = useState(defaultPayments);

  const [profileLoading, setProfileLoading] = useState(true);
  const [orgLoading, setOrgLoading] = useState(true);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [paymentsLoading, setPaymentsLoading] = useState(true);

  const [profileSaving, setProfileSaving] = useState(false);
  const [orgSaving, setOrgSaving] = useState(false);
  const [notificationsSaving, setNotificationsSaving] = useState(false);
  const [paymentsSaving, setPaymentsSaving] = useState(false);

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Danger zone confirmation state
  const [dangerAction, setDangerAction] = useState(null);

  // Preview-only controls
  const [twoFactor, setTwoFactor] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      const tasks = [
        {
          name: "Profile",
          request: settingsAPI.getProfile,
          onSuccess: (data) => {
            setProfile({
              fullName: [data.first_name, data.last_name]
                .filter(Boolean)
                .join(" "),
              email: data.email || "",
              phone: data.phone || "",
            });
          },
          onFinish: () => setProfileLoading(false),
        },
        {
          name: "Organization",
          request: settingsAPI.getOrganization,
          onSuccess: (data) => {
            setOrg({
              company: data.company ?? defaultOrg.company,
              billingEmail: data.billing_email ?? "",
              timezone: data.timezone ?? defaultOrg.timezone,
              currency: data.currency ?? defaultOrg.currency,
            });
          },
          onFinish: () => setOrgLoading(false),
        },
        {
          name: "Notifications",
          request: settingsAPI.getNotifications,
          onSuccess: (data) => {
            setNotifications({
              invoiceOverdue: data.invoice_overdue,
              paymentReceived: data.payment_received,
              ticketAssigned: data.ticket_assigned,
              networkOutage: data.network_outage,
              weeklySummary: data.weekly_summary,
            });
          },
          onFinish: () => setNotificationsLoading(false),
        },
        {
          name: "Payment settings",
          request: settingsAPI.getPayments,
          onSuccess: (data) => {
            setPayments({
              paybill: data.paybill ?? "",
              till: data.till ?? "",
              callbackUrl: data.callback_url ?? "",
              autoReconcile: data.auto_reconcile,
            });
          },
          onFinish: () => setPaymentsLoading(false),
        },
      ];

      await Promise.all(
        tasks.map(async (task) => {
          try {
            const response = await task.request();
            if (active) task.onSuccess(response.data);
          } catch (error) {
            if (active) {
              toast.error(
                `${task.name}: ${getErrorMessage(
                  error,
                  `Could not load ${task.name.toLowerCase()}.`
                )}`
              );
            }
          } finally {
            if (active) task.onFinish();
          }
        })
      );
    }

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  function updateProfileField(field, value) {
    setProfile((current) => ({ ...current, [field]: value }));
  }

  async function saveProfile() {
    if (!profile.fullName.trim() || !profile.email.trim()) {
      toast.error("Please enter your full name and email address.");
      return;
    }

    const names = profile.fullName.trim().split(/\s+/);
    const first_name = names.shift() || "";
    const last_name = names.join(" ");

    try {
      setProfileSaving(true);

      const response = await settingsAPI.updateProfile({
        first_name,
        last_name,
        email: profile.email.trim(),
        phone: profile.phone.trim(),
      });

      const data = response.data;

      setProfile({
        fullName: [data.first_name, data.last_name].filter(Boolean).join(" "),
        email: data.email || "",
        phone: data.phone || "",
      });

      toast.success("Profile saved successfully.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not save your profile."));
    } finally {
      setProfileSaving(false);
    }
  }

  async function saveOrganization() {
    if (!org.company.trim()) {
      toast.error("Please enter your company name.");
      return;
    }

    try {
      setOrgSaving(true);

      const response = await settingsAPI.updateOrganization({
        company: org.company.trim(),
        billing_email: org.billingEmail.trim(),
        timezone: org.timezone,
        currency: org.currency,
      });

      const data = response.data;

      setOrg({
        company: data.company,
        billingEmail: data.billing_email,
        timezone: data.timezone,
        currency: data.currency,
      });

      toast.success("Organization settings saved.");
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Could not save organization settings.")
      );
    } finally {
      setOrgSaving(false);
    }
  }

  async function saveNotifications() {
    try {
      setNotificationsSaving(true);

      const response = await settingsAPI.updateNotifications({
        invoice_overdue: notifications.invoiceOverdue,
        payment_received: notifications.paymentReceived,
        ticket_assigned: notifications.ticketAssigned,
        network_outage: notifications.networkOutage,
        weekly_summary: notifications.weeklySummary,
      });

      const data = response.data;

      setNotifications({
        invoiceOverdue: data.invoice_overdue,
        paymentReceived: data.payment_received,
        ticketAssigned: data.ticket_assigned,
        networkOutage: data.network_outage,
        weeklySummary: data.weekly_summary,
      });

      toast.success("Notification preferences saved.");
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Could not save notification preferences.")
      );
    } finally {
      setNotificationsSaving(false);
    }
  }

  async function savePayments() {
    try {
      setPaymentsSaving(true);

      const response = await settingsAPI.updatePayments({
        paybill: payments.paybill.trim(),
        till: payments.till.trim(),
        callback_url: payments.callbackUrl.trim(),
        auto_reconcile: payments.autoReconcile,
      });

      const data = response.data;

      setPayments({
        paybill: data.paybill ?? "",
        till: data.till ?? "",
        callbackUrl: data.callback_url ?? "",
        autoReconcile: data.auto_reconcile,
      });

      toast.success("Payment settings saved.");
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Could not save payment settings.")
      );
    } finally {
      setPaymentsSaving(false);
    }
  }

  async function savePassword() {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      toast.error("Please complete all password fields.");
      return;
    }

    if (passwordForm.newPassword.length < 12) {
      toast.error("Your new password must be at least 12 characters.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("The new passwords do not match.");
      return;
    }

    try {
      setPasswordSaving(true);

      const response = await settingsAPI.changePassword({
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword,
        confirm_password: passwordForm.confirmPassword,
      });

      toast.success(
        response.data.detail || "Password changed successfully."
      );

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Could not change your password.")
      );
    } finally {
      setPasswordSaving(false);
    }
  }

  function showPreviewMessage(section) {
    toast.info(`${section} is not connected yet`, {
      description: "This control is a preview. No backend changes have been made.",
    });
  }

  function requestDangerAction(action) {
    setDangerAction(action);
  }

  function confirmDangerAction() {
    if (dangerAction === "suspend") {
      toast.warning("Hotspot suspension is not connected.", {
        description:
          "No hotspot sessions or subscriptions have been changed.",
      });
    } else if (dangerAction === "delete") {
      toast.error("Workspace deletion is disabled.", {
        description: "No data has been deleted.",
      });
    }

    setDangerAction(null);
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Your workspace details, billing preferences and account controls in one place."
      />

      <div className="grid w-full min-w-0 items-start gap-5">
        {/* Profile */}
        <Panel className="overflow-hidden">
          <PanelHeader
            title="Profile"
            subtitle="How you appear across the workspace and in the audit log."
          />

          <div className="flex items-center gap-3 px-4 pt-4 sm:px-5">
            <Monogram
              name={profile.fullName || "User"}
              className="h-12 w-12 text-sm"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {profileLoading
                  ? "Loading profile..."
                  : profile.fullName || "Your name"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                Administrator
              </p>
            </div>
          </div>

          <div className="mt-2 divide-y divide-border">
            <FieldRow label="Full name">
              <Input
                value={profile.fullName}
                onChange={(e) => updateProfileField("fullName", e.target.value)}
                className={inputClass}
                disabled={profileLoading || profileSaving}
                autoComplete="name"
              />
            </FieldRow>

            <FieldRow label="Email address" hint="Used for sign-in and system alerts.">
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => updateProfileField("email", e.target.value)}
                className={inputClass}
                disabled={profileLoading || profileSaving}
                autoComplete="email"
              />
            </FieldRow>

            <FieldRow label="Phone number" hint="Stored in your profile for future SMS integration.">
              <Input
                type="tel"
                value={profile.phone}
                onChange={(e) => updateProfileField("phone", e.target.value)}
                className={inputClass}
                disabled={profileLoading || profileSaving}
                autoComplete="tel"
              />
            </FieldRow>
          </div>

          <SaveBar
            label="Save profile"
            onSave={saveProfile}
            disabled={profileLoading}
            loading={profileSaving}
          />
        </Panel>

        {/* Organization */}
        <Panel className="overflow-hidden">
          <PanelHeader
            title="Organization"
            subtitle="Company details shown on invoices and receipts."
            // action={<StatusPill value={orgLoading ? "Loading" : "Connected"} tone="neutral" />}
          />

          <div className="divide-y divide-border">
            <FieldRow label="Company name">
              <Input
                value={org.company}
                onChange={(e) => setOrg((current) => ({ ...current, company: e.target.value }))}
                className={inputClass}
                disabled={orgLoading || orgSaving}
              />
            </FieldRow>

            <FieldRow label="Billing email" hint="Invoice copies are intended to be sent here.">
              <Input
                type="email"
                value={org.billingEmail}
                onChange={(e) => setOrg((current) => ({ ...current, billingEmail: e.target.value }))}
                className={inputClass}
                disabled={orgLoading || orgSaving}
              />
            </FieldRow>

            <FieldRow label="Timezone">
              <Select
                value={org.timezone}
                onValueChange={(value) => setOrg((current) => ({ ...current, timezone: value }))}
                disabled={orgLoading || orgSaving}
              >
                <SelectTrigger className="h-9 rounded-lg bg-card text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="africa-nairobi">Africa/Nairobi (EAT, UTC+3)</SelectItem>
                  <SelectItem value="africa-kampala">Africa/Kampala (EAT, UTC+3)</SelectItem>
                  <SelectItem value="africa-dar">Africa/Dar es Salaam (EAT, UTC+3)</SelectItem>
                  <SelectItem value="utc">UTC</SelectItem>
                </SelectContent>
              </Select>
            </FieldRow>

            <FieldRow label="Currency">
              <Select
                value={org.currency}
                onValueChange={(value) => setOrg((current) => ({ ...current, currency: value }))}
                disabled={orgLoading || orgSaving}
              >
                <SelectTrigger className="h-9 rounded-lg bg-card text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kes">Kenyan Shilling (KES)</SelectItem>
                  <SelectItem value="ugx">Ugandan Shilling (UGX)</SelectItem>
                  <SelectItem value="tzs">Tanzanian Shilling (TZS)</SelectItem>
                  <SelectItem value="usd">US Dollar (USD)</SelectItem>
                </SelectContent>
              </Select>
            </FieldRow>
          </div>

          <SaveBar label="Save organization" onSave={saveOrganization} disabled={orgLoading} loading={orgSaving} />
        </Panel>

        {/* Notifications */}
        <Panel className="overflow-hidden">
          <PanelHeader
            title="Notifications"
            subtitle="Choose which events you would like to receive alerts about."
            // action={<StatusPill value={notificationsLoading ? "Loading" : "Connected"} tone="neutral" />}
          />

          <div className="divide-y divide-border">
            {[
              ["invoiceOverdue", "Invoice overdue", "When a customer invoice passes its due date."],
              ["paymentReceived", "Payment received", "M-Pesa confirmations and manual receipts."],
              ["ticketAssigned", "Ticket assigned to you", "New support tickets routed to your queue."],
              ["networkOutage", "Network outage", "When a POP or backhaul link goes down."],
              ["weeklySummary", "Weekly summary", "A Monday digest of revenue, usage, and tickets."],
            ].map(([key, label, hint]) => (
              <FieldRow key={key} label={label} hint={hint}>
                <div className="flex justify-end sm:justify-start">
                  <Switch
                    checked={notifications[key]}
                    onCheckedChange={(checked) => setNotifications((current) => ({ ...current, [key]: checked }))}
                    disabled={notificationsLoading || notificationsSaving}
                    aria-label={label}
                  />
                </div>
              </FieldRow>
            ))}
          </div>

          <SaveBar label="Save notifications" onSave={saveNotifications} disabled={notificationsLoading} loading={notificationsSaving} />
        </Panel>

        {/* Payments & M-Pesa */}
        <Panel className="overflow-hidden">
          <PanelHeader
            title="Payments & M-Pesa"
            subtitle="Configuration fields for reconciling customer payments."
            // action={<StatusPill value={paymentsLoading ? "Loading" : "Connected"} tone="neutral" />}
          />

          <div className="divide-y divide-border">
            <FieldRow label="Paybill number" hint="For postpaid invoice payments.">
              <Input
                value={payments.paybill}
                onChange={(e) => setPayments((current) => ({ ...current, paybill: e.target.value }))}
                className={inputClass}
                disabled={paymentsLoading || paymentsSaving}
              />
            </FieldRow>

            <FieldRow label="Till number" hint="Buy Goods till for hotspot vouchers.">
              <Input
                value={payments.till}
                onChange={(e) => setPayments((current) => ({ ...current, till: e.target.value }))}
                className={inputClass}
                disabled={paymentsLoading || paymentsSaving}
              />
            </FieldRow>

            <FieldRow label="Callback URL" hint="Where Daraja posts payment confirmations.">
              <Input
                value={payments.callbackUrl}
                onChange={(e) => setPayments((current) => ({ ...current, callbackUrl: e.target.value }))}
                className={inputClass}
                dir="ltr"
                disabled={paymentsLoading || paymentsSaving}
              />
            </FieldRow>

            <FieldRow label="Auto-reconcile" hint="Save this preference for future reconciliation integration.">
              <div className="flex justify-end sm:justify-start">
                <Switch
                  checked={payments.autoReconcile}
                  onCheckedChange={(checked) => setPayments((current) => ({ ...current, autoReconcile: checked }))}
                  disabled={paymentsLoading || paymentsSaving}
                  aria-label="Auto-reconcile payments"
                />
              </div>
            </FieldRow>
          </div>

          <SaveBar label="Save payment settings" onSave={savePayments} disabled={paymentsLoading} loading={paymentsSaving} />
        </Panel>

        {/* Security */}
        <Panel className="overflow-hidden">
          <PanelHeader
            title="Security"
            subtitle="Change your password and manage account security."
            // action={<StatusPill value="Password API" tone="neutral" />}
          />

          <div className="divide-y divide-border">
            <FieldRow label="Current password">
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  className={`${inputClass} pr-10`}
                  autoComplete="current-password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm((current) => ({ ...current, currentPassword: e.target.value }))}
                  disabled={passwordSaving}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowCurrentPassword((value) => !value)}
                  aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </FieldRow>

            <FieldRow label="New password" hint="Use a strong password of at least 12 characters.">
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className={`${inputClass} pr-10`}
                  autoComplete="new-password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm((current) => ({ ...current, newPassword: e.target.value }))}
                  disabled={passwordSaving}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowNewPassword((value) => !value)}
                  aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </FieldRow>

            <FieldRow label="Confirm new password">
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter new password"
                  className={`${inputClass} pr-10`}
                  autoComplete="new-password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm((current) => ({ ...current, confirmPassword: e.target.value }))}
                  disabled={passwordSaving}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </FieldRow>

            {/* <FieldRow label="Two-factor authentication" hint="OTP verification requires additional backend support.">
              <div className="flex items-center justify-end gap-2 sm:justify-start">
                <Switch checked={twoFactor} onCheckedChange={setTwoFactor} aria-label="Preview two-factor authentication" />
                <StatusPill value={twoFactor ? "preview on" : "preview off"} />
              </div>
            </FieldRow> */}

            <FieldRow label="Active sessions" hint="Session tracking is not implemented yet.">
              <ul className="space-y-2">
                <li className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
                  <Smartphone size={15} className="shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate text-sm text-foreground">Current browser session</span>
                  <StatusPill value="current" />
                </li>
                <li className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
                  <KeyRound size={15} className="shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate text-sm text-foreground">Other device sessions</span>
                  <Button variant="ghost" size="sm" className="h-7 rounded-lg text-xs" onClick={() => showPreviewMessage("Session revocation")}>
                    Revoke
                  </Button>
                </li>
              </ul>
            </FieldRow>
          </div>

          <SaveBar label="Change password" onSave={savePassword} loading={passwordSaving} />
        </Panel>

        {/* Danger zone */}
        <Panel className="border-destructive/40">
          <PanelHeader
            title="Danger zone"
            subtitle="Destructive actions require protected backend endpoints."
            action={<TriangleAlert size={16} className="text-destructive" aria-hidden="true" />}
          />

          <div className="divide-y divide-border">
            <FieldRow label="Suspend all hotspots" hint="Would disconnect every hotspot session.">
              <div className="flex justify-end sm:justify-start">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg border-destructive/40 text-destructive hover:bg-danger-soft"
                  onClick={() => requestDangerAction("suspend")}
                >
                  <ShieldCheck size={14} aria-hidden="true" />
                  Suspend all
                </Button>
              </div>
            </FieldRow>

            <FieldRow label="Delete workspace data" hint="Would permanently remove workspace records.">
              <div className="flex justify-end sm:justify-start">
                <Button variant="destructive" size="sm" className="rounded-lg" onClick={() => requestDangerAction("delete")}>
                  <Trash2 size={14} aria-hidden="true" />
                  Delete data
                </Button>
              </div>
            </FieldRow>
          </div>
        </Panel>
      </div>

      {/* Danger confirmation dialog */}
      {dangerAction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDangerAction(null);
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="danger-dialog-title"
            aria-describedby="danger-dialog-description"
            className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-xl"
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-full bg-destructive/10 p-2 text-destructive">
                <TriangleAlert size={20} />
              </div>
              <h2 id="danger-dialog-title" className="text-lg font-semibold">
                {dangerAction === "suspend" ? "Suspend all hotspots?" : "Delete workspace data?"}
              </h2>
            </div>

            <p id="danger-dialog-description" className="text-sm text-muted-foreground">
              {dangerAction === "suspend"
                ? "This action is not connected to router or hotspot sessions. Continuing will not disconnect anyone."
                : "Workspace deletion is disabled because it could permanently remove customer, invoice, payment, and audit records. No data will be deleted."}
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDangerAction(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDangerAction}>
                {dangerAction === "suspend" ? "Continue" : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Separator className="opacity-0" />
    </AppShell>
  );
}

export default SettingsPage;
