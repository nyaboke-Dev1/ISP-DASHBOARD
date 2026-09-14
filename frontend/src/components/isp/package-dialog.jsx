import { useEffect, useState } from "react";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { savePackage } from "@/lib/isp";
import {
  useActorName,
  useWorkspaceAction,
} from "@/hooks/use-workspace";

const packageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80),

  speed_mbps: z
    .number({ message: "Enter the speed in Mbps" })
    .int("Speed must be a whole number")
    .min(1, "Speed must be at least 1 Mbps")
    .max(10000, "Speed looks too high"),

  price: z
    .number({ message: "Enter the price in KES" })
    .min(0, "Price cannot be negative")
    .max(10000000, "Price looks too high"),

  billing_cycle: z
    .string()
    .trim()
    .min(1),

  description: z
    .string()
    .trim()
    .max(300, "Keep the description under 300 characters"),

  is_active: z.boolean(),
});

const emptyForm = {
  name: "",
  speed: "",
  price: "",
  billing_cycle: "monthly",
  description: "",
  is_active: true,
};

export function PackageDialog({
  open,
  onOpenChange,
  editing,
}) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const actor = useActorName();

  const save = useWorkspaceAction(
    (input) =>
      savePackage(
        input,
        editing?.id ?? null,
        actor
      ),
    editing
      ? "Package updated"
      : "Package created"
  );

  useEffect(() => {
    if (!open) return;

    setErrors({});

    setForm(
      editing
        ? {
            name: editing.name,
            speed: String(editing.speed_mbps),
            price: String(editing.price),
            billing_cycle:
              editing.billing_cycle || "monthly",
            description:
              editing.description ?? "",
            is_active: editing.is_active,
          }
        : emptyForm
    );
  }, [open, editing]);

  const set = (patch) => {
    setForm((prev) => ({
      ...prev,
      ...patch,
    }));

    setErrors({});
  };

  const submit = (e) => {
    e.preventDefault();

    const parsed = packageSchema.safeParse({
      name: form.name,

      speed_mbps:
        form.speed === ""
          ? Number.NaN
          : Number(form.speed),

      price:
        form.price === ""
          ? Number.NaN
          : Number(form.price),

      billing_cycle: form.billing_cycle,
      description: form.description,
      is_active: form.is_active,
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

    save.mutate(parsed.data, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editing
              ? "Edit package"
              : "New package"}
          </DialogTitle>

          <DialogDescription>
            {editing
              ? "Changes apply everywhere this plan is used, including customer records."
              : "Active plans become selectable when adding or editing a customer."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={submit}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-1.5">
            <Label htmlFor="pkg-name">
              Package name
            </Label>

            <Input
              id="pkg-name"
              value={form.name}
              onChange={(e) =>
                set({
                  name: e.target.value,
                })
              }
              placeholder="e.g. Home Premium"
              autoFocus
              aria-invalid={!!errors.name}
            />

            {errors.name ? (
              <FieldError
                message={errors.name}
              />
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="pkg-speed">
                Speed (Mbps)
              </Label>

              <Input
                id="pkg-speed"
                value={form.speed}
                onChange={(e) =>
                  set({
                    speed: e.target.value,
                  })
                }
                inputMode="numeric"
                placeholder="20"
                aria-invalid={
                  !!errors.speed_mbps
                }
              />

              {errors.speed_mbps ? (
                <FieldError
                  message={errors.speed_mbps}
                />
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pkg-price">
                Price (KES)
              </Label>

              <Input
                id="pkg-price"
                value={form.price}
                onChange={(e) =>
                  set({
                    price: e.target.value,
                  })
                }
                inputMode="decimal"
                placeholder="3500"
                aria-invalid={
                  !!errors.price
                }
              />

              {errors.price ? (
                <FieldError
                  message={errors.price}
                />
              ) : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pkg-cycle">
              Billing cycle
            </Label>

            <Select
              value={form.billing_cycle}
              onValueChange={(value) =>
                set({
                  billing_cycle: value,
                })
              }
            >
              <SelectTrigger id="pkg-cycle">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="monthly">
                  Monthly
                </SelectItem>

                <SelectItem value="quarterly">
                  Quarterly
                </SelectItem>

                <SelectItem value="yearly">
                  Yearly
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pkg-description">
              Description
            </Label>

            <Textarea
              id="pkg-description"
              value={form.description}
              onChange={(e) =>
                set({
                  description: e.target.value,
                })
              }
              placeholder="What subscribers get on this plan"
              rows={3}
              aria-invalid={
                !!errors.description
              }
            />

            {errors.description ? (
              <FieldError
                message={errors.description}
              />
            ) : null}
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
            <div>
              <Label htmlFor="pkg-active">
                Active
              </Label>

              <p className="text-xs text-muted-foreground">
                Only active plans can be assigned
                to customers.
              </p>
            </div>

            <Switch
              id="pkg-active"
              checked={form.is_active}
              onCheckedChange={(value) =>
                set({
                  is_active: value,
                })
              }
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onOpenChange(false)
              }
              disabled={save.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={save.isPending}
            >
              {save.isPending
                ? "Saving…"
                : editing
                ? "Save changes"
                : "Create package"}
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
