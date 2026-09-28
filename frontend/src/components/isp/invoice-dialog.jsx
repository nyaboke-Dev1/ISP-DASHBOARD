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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createInvoice } from "@/lib/isp";
import {
  useActorName,
  useWorkspaceAction,
} from "@/hooks/use-workspace";

const schema = z.object({
  customer_id: z
    .number()
    .int()
    .positive("Choose a customer"),

  amount: z
    .number()
    .min(1, "Amount must be at least KES 1")
    .max(10_000_000),

  due_date: z
    .string()
    .min(10, "Choose a due date"),

  status: z.enum(["unpaid", "paid", "overdue"]),
});

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function InvoiceDialog({
  open,
  onOpenChange,
  customers,
  presetCustomerId,
}) {
  const actor = useActorName();

  const [customerId, setCustomerId] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState(today());
  const [status, setStatus] = useState("unpaid");
  const [errors, setErrors] = useState({});

  const create = useWorkspaceAction(
    (input) => createInvoice(input, actor),
    "Invoice created"
  );

  useEffect(() => {
    if (!open) return;

    setCustomerId(
      presetCustomerId ? String(presetCustomerId) : ""
    );

    setAmount("");
    setDueDate(today());
    setStatus("unpaid");
    setErrors({});
  }, [open, presetCustomerId]);

  const submit = (event) => {
    event.preventDefault();

    const parsed = schema.safeParse({
      customer_id: Number(customerId),
      amount: Number(amount),
      due_date: dueDate,
      status,
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
          <DialogTitle>New invoice</DialogTitle>

          <DialogDescription>
            Issue an invoice to a subscriber. A reference number
            is generated automatically.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={submit}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-1.5">
            <Label htmlFor="invoice-customer">
              Customer
            </Label>

            <Select
              value={customerId}
              onValueChange={setCustomerId}
            >
              <SelectTrigger id="invoice-customer">
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>

              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem
                    key={customer.id}
                    value={String(customer.id)}
                  >
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.customer_id ? (
              <FieldError message={errors.customer_id} />
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="invoice-amount">
                Amount (KES)
              </Label>

              <Input
                id="invoice-amount"
                inputMode="decimal"
                value={amount}
                onChange={(event) =>
                  setAmount(event.target.value)
                }
                placeholder="3500"
                aria-invalid={!!errors.amount}
              />

              {errors.amount ? (
                <FieldError message={errors.amount} />
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="invoice-due">
                Due date
              </Label>

              <Input
                id="invoice-due"
                type="date"
                value={dueDate}
                onChange={(event) =>
                  setDueDate(event.target.value)
                }
                aria-invalid={!!errors.due_date}
              />

              {errors.due_date ? (
                <FieldError message={errors.due_date} />
              ) : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="invoice-status">
              Status
            </Label>

            <Select
              value={status}
              onValueChange={setStatus}
            >
              <SelectTrigger id="invoice-status">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="unpaid">
                  Unpaid
                </SelectItem>

                <SelectItem value="paid">
                  Paid
                </SelectItem>

                <SelectItem value="overdue">
                  Overdue
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={create.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={create.isPending}
            >
              {create.isPending
                ? "Creating…"
                : "Create invoice"}
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

