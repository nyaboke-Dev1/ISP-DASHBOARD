
import { useState } from "react";
import { KeyRound, ShieldCheck, Smartphone, Trash2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

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

function SaveBar({ label, onSave }) {
  return (
    <div className="flex justify-end border-t border-border px-4 py-3 sm:px-5">
      <Button
        size="sm"
        className="rounded-lg"
        onClick={onSave}
      >
        {label}
      </Button>
    </div>
  );
}

export function SettingsPage() {
  const [profile, setProfile] = useState({
    fullName: "Onkundi Nyaboke",
    email: "onkundi@swiftnet.co.ke",
    phone: "+254 712 345 678",
  });

  const [org, setOrg] = useState({
    company: "Swift-Net Communications",
    billingEmail: "billing@swiftnet.co.ke",
    timezone: "africa-nairobi",
    currency: "kes",
  });

  const [notifications, setNotifications] = useState({
    invoiceOverdue: true,
    paymentReceived: true,
    ticketAssigned: true,
    networkOutage: true,
    weeklySummary: false,
  });

  const [payments, setPayments] = useState({
    paybill: "522 300",
    till: "8891 204",
    callbackUrl: "https://api.swiftnet.co.ke/mpesa/callback",
    autoReconcile: true,
  });

  const [twoFactor, setTwoFactor] = useState(false);

  const saved = (what) => () =>
    toast.info(`${what} preview updated`, {
      description:
        "This workspace is a preview; changes are not saved to an account yet.",
    });

  return (
    <AppShell>
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Your workspace details, billing preferences and account controls in one place."
      />

      <div className="flex items-start gap-3 border-l-2 border-primary bg-primary-soft/60 px-4 py-3 text-sm text-foreground">
        <span className="font-semibold">Preview workspace</span>
        <span className="text-muted-foreground">
          Changes on this page are not saved to an account yet.
        </span>
      </div>

      <div className="grid w-full min-w-0 items-start gap-5">

        {/* Profile */}
        <Panel className="overflow-hidden">
          <PanelHeader
            title="Profile"
            subtitle="How you appear across the workspace and in the audit log."
          />

          <div className="flex items-center gap-3 px-4 pt-4 sm:px-5">
            <Monogram
              name={profile.fullName}
              className="h-12 w-12 text-sm"
            />

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {profile.fullName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                Administrator
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="ml-auto rounded-lg"
              onClick={saved("Photo")}
            >
              Change photo
            </Button>
          </div>

          <div className="mt-2 divide-y divide-border">
            <FieldRow label="Full name">
              <Input
                value={profile.fullName}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    fullName: e.target.value,
                  })
                }
                className={inputClass}
              />
            </FieldRow>

            <FieldRow
              label="Email address"
              hint="Used for sign-in and system alerts."
            >
              <Input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    email: e.target.value,
                  })
                }
                className={inputClass}
              />
            </FieldRow>

            <FieldRow
              label="Phone number"
              hint="Safaricom number for SMS alerts."
            >
              <Input
                value={profile.phone}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    phone: e.target.value,
                  })
                }
                className={inputClass}
              />
            </FieldRow>
          </div>

          <SaveBar
            label="Save profile"
            onSave={saved("Profile")}
          />
        </Panel>

        {/* Organization */}
        <Panel className="overflow-hidden">
          <PanelHeader
            title="Organization"
            subtitle="Company details shown on invoices and receipts."
          />

          <div className="divide-y divide-border">
            <FieldRow label="Company name">
              <Input
                value={org.company}
                onChange={(e) =>
                  setOrg({
                    ...org,
                    company: e.target.value,
                  })
                }
                className={inputClass}
              />
            </FieldRow>

            <FieldRow
              label="Billing email"
              hint="Invoice copies are sent here."
            >
              <Input
                type="email"
                value={org.billingEmail}
                onChange={(e) =>
                  setOrg({
                    ...org,
                    billingEmail: e.target.value,
                  })
                }
                className={inputClass}
              />
            </FieldRow>

            <FieldRow label="Timezone">
              <Select
                value={org.timezone}
                onValueChange={(v) =>
                  setOrg({
                    ...org,
                    timezone: v,
                  })
                }
              >
                <SelectTrigger className="h-9 rounded-lg bg-card text-sm">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="africa-nairobi">
                    Africa/Nairobi (EAT, UTC+3)
                  </SelectItem>
                  <SelectItem value="africa-kampala">
                    Africa/Kampala (EAT, UTC+3)
                  </SelectItem>
                  <SelectItem value="africa-dar">
                    Africa/Dar es Salaam (EAT, UTC+3)
                  </SelectItem>
                  <SelectItem value="utc">UTC</SelectItem>
                </SelectContent>
              </Select>
            </FieldRow>

            <FieldRow label="Currency">
              <Select
                value={org.currency}
                onValueChange={(v) =>
                  setOrg({
                    ...org,
                    currency: v,
                  })
                }
              >
                <SelectTrigger className="h-9 rounded-lg bg-card text-sm">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="kes">
                    Kenyan Shilling (KES)
                  </SelectItem>
                  <SelectItem value="ugx">
                    Ugandan Shilling (UGX)
                  </SelectItem>
                  <SelectItem value="tzs">
                    Tanzanian Shilling (TZS)
                  </SelectItem>
                  <SelectItem value="usd">
                    US Dollar (USD)
                  </SelectItem>
                </SelectContent>
              </Select>
            </FieldRow>
          </div>

          <SaveBar
            label="Save organization"
            onSave={saved("Organization")}
          />
        </Panel>

        {/* Notifications */}
        <Panel className="overflow-hidden">
          <PanelHeader
            title="Notifications"
            subtitle="Choose which events reach your email and phone."
          />

          <div className="divide-y divide-border">
            {[
              [
                "invoiceOverdue",
                "Invoice overdue",
                "When a customer invoice passes its due date.",
              ],
              [
                "paymentReceived",
                "Payment received",
                "M-Pesa confirmations and manual receipts.",
              ],
              [
                "ticketAssigned",
                "Ticket assigned to you",
                "New support tickets routed to your queue.",
              ],
              [
                "networkOutage",
                "Network outage",
                "When a POP or backhaul link goes down.",
              ],
              [
                "weeklySummary",
                "Weekly summary",
                "A Monday digest of revenue, usage, and tickets.",
              ],
            ].map(([key, label, hint]) => (
              <FieldRow
                key={key}
                label={label}
                hint={hint}
              >
                <div className="flex justify-end sm:justify-start">
                  <Switch
                    checked={notifications[key]}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        [key]: checked,
                      })
                    }
                    aria-label={label}
                  />
                </div>
              </FieldRow>
            ))}
          </div>

          <SaveBar
            label="Save notifications"
            onSave={saved("Notification preferences")}
          />
        </Panel>

        {/* Payments & M-Pesa */}
        <Panel className="overflow-hidden">
          <PanelHeader
            title="Payments & M-Pesa"
            subtitle="Preview fields for reconciling customer payments."
            action={
              <StatusPill
                value="Preview"
                tone="neutral"
              />
            }
          />

          <div className="divide-y divide-border">
            <FieldRow
              label="Paybill number"
              hint="For postpaid invoice payments."
            >
              <Input
                value={payments.paybill}
                onChange={(e) =>
                  setPayments({
                    ...payments,
                    paybill: e.target.value,
                  })
                }
                className={inputClass}
              />
            </FieldRow>

            <FieldRow
              label="Till number"
              hint="Buy Goods till for hotspot vouchers."
            >
              <Input
                value={payments.till}
                onChange={(e) =>
                  setPayments({
                    ...payments,
                    till: e.target.value,
                  })
                }
                className={inputClass}
              />
            </FieldRow>

            <FieldRow
              label="Callback URL"
              hint="Where Daraja posts confirmations."
            >
              <Input
                value={payments.callbackUrl}
                onChange={(e) =>
                  setPayments({
                    ...payments,
                    callbackUrl: e.target.value,
                  })
                }
                className={inputClass}
                dir="ltr"
              />
            </FieldRow>

            <FieldRow
              label="Auto-reconcile"
              hint="Match confirmations to open invoices automatically."
            >
              <div className="flex justify-end sm:justify-start">
                <Switch
                  checked={payments.autoReconcile}
                  onCheckedChange={(checked) =>
                    setPayments({
                      ...payments,
                      autoReconcile: checked,
                    })
                  }
                  aria-label="Auto-reconcile payments"
                />
              </div>
            </FieldRow>
          </div>

          <SaveBar
            label="Save payment settings"
            onSave={saved("Payment settings")}
          />
        </Panel>

        {/* Security */}
        <Panel>
          <PanelHeader
            title="Security"
            subtitle="Preview of password, two-factor authentication, and session controls."
          />

          <div className="divide-y divide-border">
            <FieldRow label="Current password">
              <Input
                type="password"
                placeholder="••••••••"
                className={inputClass}
                autoComplete="current-password"
              />
            </FieldRow>

            <FieldRow
              label="New password"
              hint="At least 12 characters."
            >
              <Input
                type="password"
                placeholder="••••••••"
                className={inputClass}
                autoComplete="new-password"
              />
            </FieldRow>

            <FieldRow
              label="Two-factor authentication"
              hint="Require an OTP at sign-in."
            >
              <div className="flex items-center justify-end gap-2 sm:justify-start">
                <Switch
                  checked={twoFactor}
                  onCheckedChange={setTwoFactor}
                  aria-label="Two-factor authentication"
                />
                <StatusPill
                  value={twoFactor ? "enabled" : "disabled"}
                />
              </div>
            </FieldRow>

            <FieldRow
              label="Active sessions"
              hint="Devices currently signed in."
            >
              <ul className="space-y-2">
                <li className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
                  <Smartphone
                    size={15}
                    className="shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />

                  <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                    Chrome on Windows · Nairobi
                  </span>

                  <StatusPill value="active" />
                </li>

                <li className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
                  <KeyRound
                    size={15}
                    className="shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />

                  <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                    Android app · Last seen 2 days ago
                  </span>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 rounded-lg text-xs"
                    onClick={saved("Session revoked")}
                  >
                    Revoke
                  </Button>
                </li>
              </ul>
            </FieldRow>
          </div>

          <SaveBar
            label="Update security"
            onSave={saved("Security settings")}
          />
        </Panel>

        {/* Danger zone */}
        <Panel className="border-destructive/40">
          <PanelHeader
            title="Danger zone"
            subtitle="Irreversible actions — proceed with care."
            action={
              <TriangleAlert
                size={16}
                className="text-destructive"
                aria-hidden="true"
              />
            }
          />

          <div className="divide-y divide-border">
            <FieldRow
              label="Suspend all hotspots"
              hint="Immediately disconnects every hotspot session."
            >
              <div className="flex justify-end sm:justify-start">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg border-destructive/40 text-destructive hover:bg-danger-soft"
                  onClick={() =>
                    toast.warning(
                      "Hotspot suspension requires the backend."
                    )
                  }
                >
                  <ShieldCheck
                    size={14}
                    aria-hidden="true"
                  />
                  Suspend all
                </Button>
              </div>
            </FieldRow>

            <FieldRow
              label="Delete workspace data"
              hint="Removes all customers, invoices, and logs."
            >
              <div className="flex justify-end sm:justify-start">
                <Button
                  variant="destructive"
                  size="sm"
                  className="rounded-lg"
                  onClick={() =>
                    toast.error(
                      "Workspace deletion is disabled in this preview."
                    )
                  }
                >
                  <Trash2
                    size={14}
                    aria-hidden="true"
                  />
                  Delete data
                </Button>
              </div>
            </FieldRow>
          </div>
        </Panel>
      </div>

      <Separator className="opacity-0" />
    </AppShell>
  );
}

export default SettingsPage;