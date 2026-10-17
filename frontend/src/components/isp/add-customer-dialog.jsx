import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createCustomer } from "@/lib/isp";
import {
  useActorName,
  useWorkspaceAction,
} from "@/hooks/use-workspace";

// Get today's date in local time as YYYY-MM-DD.
const getToday = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// Create a fresh form whenever the dialog opens.
const createEmptyForm = () => ({
  name: "",
  phone: "",
  email: "",
  location: "",
  packageId: "none",
  status: "pending",
  start_date: getToday(),
  end_date: "",
});

const customerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100),

    phone: z
      .string()
      .trim()
      .min(9, "Phone must be at least 9 digits")
      .max(20)
      .regex(
        /^[+0-9()\-\s]+$/,
        "Enter a valid phone number"
      ),

    email: z
      .string()
      .trim()
      .email("Enter a valid email address")
      .max(255),

    location: z
      .string()
      .trim()
      .min(2, "Location is required")
      .max(150),

    package_id: z.number().nullable(),

    status: z.enum(["active", "pending"]),

    start_date: z
      .string()
      .min(1, "Start date is required"),

    end_date: z
      .string()
      .min(1, "Expiry date is required"),
  })
  .refine(
    (data) => data.end_date >= data.start_date,
    {
      message: "Expiry date cannot be before the start date",
      path: ["end_date"],
    }
  );

export function AddCustomerDialog({ packages }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(createEmptyForm());
  const [errors, setErrors] = useState({});

  const actor = useActorName();

  const create = useWorkspaceAction(
    (input) => createCustomer(input, actor),
    "Customer added"
  );

  useEffect(() => {
    if (open) {
      setForm(createEmptyForm());
      setErrors({});
    }
  }, [open]);

  const set = (patch) => {
    setForm((previous) => ({
      ...previous,
      ...patch,
    }));

    const key = Object.keys(patch)[0];

    if (key) {
      setErrors((previous) => ({
        ...previous,
        [key]: undefined,
      }));
    }
  };

  const submit = (event) => {
    event.preventDefault();

    const parsed = customerSchema.safeParse({
      name: form.name,
      phone: form.phone,
      email: form.email,
      location: form.location,
      package_id:
        form.packageId === "none"
          ? null
          : Number(form.packageId),
      status: form.status,
      start_date: form.start_date,
      end_date: form.end_date,
    });

    if (!parsed.success) {
      const next = {};

      for (const issue of parsed.error.issues) {
        const field = issue.path[0];

        if (field && !next[field]) {
          next[field] = issue.message;
        }
      }

      setErrors(next);
      return;
    }

    create.mutate(parsed.data, {
      onSuccess: () => setOpen(false),
    });
  };

  const activePackages = packages.filter(
    (pkg) => pkg.is_active
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus
            className="h-4 w-4"
            aria-hidden="true"
          />
          Add customer
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add customer</DialogTitle>

          <DialogDescription>
            Create a new subscriber account and set their
            subscription period.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={submit}
          className="space-y-4"
          noValidate
        >
          {/* Full name */}
          <div className="space-y-1.5">
            <Label htmlFor="customer-name">
              Full name
            </Label>

            <Input
              id="customer-name"
              value={form.name}
              onChange={(event) =>
                set({ name: event.target.value })
              }
              placeholder="e.g. Jane Wanjiku"
              autoFocus
              aria-invalid={!!errors.name}
              required
            />

            {errors.name ? (
              <FieldError message={errors.name} />
            ) : null}
          </div>

          {/* Phone and Email */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="customer-phone">
                Phone
              </Label>

              <Input
                id="customer-phone"
                value={form.phone}
                onChange={(event) =>
                  set({ phone: event.target.value })
                }
                placeholder="0712 345 678"
                inputMode="tel"
                aria-invalid={!!errors.phone}
                required
              />

              {errors.phone ? (
                <FieldError message={errors.phone} />
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="customer-email">
                Email
              </Label>

              <Input
                id="customer-email"
                type="email"
                value={form.email}
                onChange={(event) =>
                  set({ email: event.target.value })
                }
                placeholder="jane@example.com"
                aria-invalid={!!errors.email}
                required
              />

              {errors.email ? (
                <FieldError message={errors.email} />
              ) : null}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <Label htmlFor="customer-location">
              Location
            </Label>

            <Input
              id="customer-location"
              value={form.location}
              onChange={(event) =>
                set({ location: event.target.value })
              }
              placeholder="e.g. South B, Nairobi"
              aria-invalid={!!errors.location}
              required
            />

            {errors.location ? (
              <FieldError message={errors.location} />
            ) : null}
          </div>

          {/* Plan and Status */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="customer-package">
                Plan
              </Label>

              <Select
                value={form.packageId}
                onValueChange={(value) =>
                  set({ packageId: value })
                }
              >
                <SelectTrigger id="customer-package">
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="none">
                    No package
                  </SelectItem>

                  {activePackages.map((pkg) => (
                    <SelectItem
                      key={pkg.id}
                      value={String(pkg.id)}
                    >
                      {pkg.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="customer-status">
                Initial status
              </Label>

              <Select
                value={form.status}
                onValueChange={(value) =>
                  set({ status: value })
                }
              >
                <SelectTrigger id="customer-status">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="pending">
                    Pending
                  </SelectItem>

                  <SelectItem value="active">
                    Active
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Subscription period */}
          <div className="space-y-1.5 pt-2">
            <h3 className="text-sm font-semibold">
              Subscription period
            </h3>

            <p className="text-xs text-muted-foreground">
              Set the date the subscription begins and the
              date it expires.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="subscription-start-date">
                Start date
              </Label>

              <Input
                id="subscription-start-date"
                type="date"
                value={form.start_date}
                onChange={(event) =>
                  set({ start_date: event.target.value })
                }
                aria-invalid={!!errors.start_date}
                required
              />

              {errors.start_date ? (
                <FieldError message={errors.start_date} />
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="subscription-expiry-date">
                Expiry date
              </Label>

              <Input
                id="subscription-expiry-date"
                type="date"
                value={form.end_date}
                min={form.start_date || undefined}
                onChange={(event) =>
                  set({ end_date: event.target.value })
                }
                aria-invalid={!!errors.end_date}
                required
              />

              {errors.end_date ? (
                <FieldError message={errors.end_date} />
              ) : null}
            </div>
          </div>

          {/* Actions */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={create.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={create.isPending}
            >
              {create.isPending
                ? "Adding…"
                : "Add customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FieldError({ message }) {
  return (
    <p
      role="alert"
      className="text-xs font-medium text-danger"
    >
      {message}
    </p>
  );
}