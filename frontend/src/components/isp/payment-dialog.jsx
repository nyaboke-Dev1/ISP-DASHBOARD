import { useEffect, useMemo, useState } from "react";
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

import { money, recordPayment } from "@/lib/isp";

import {
  useActorName,
  useWorkspaceAction,
} from "@/hooks/use-workspace";

const schema = z.object({
  customer_id: z
    .number()
    .int()
    .positive("Choose a customer"),

  invoice_id: z
    .number()
    .int()
    .positive()
    .nullable(),

  amount: z
    .number()
    .min(1, "Amount must be at least KES 1")
    .max(10_000_000),

  method: z.enum(["mpesa", "cash", "bank"]),

  transaction_ref: z
    .string()
    .trim()
    .max(60),
});

export function PaymentDialog({
  open,
  onOpenChange,
  customers,
  invoices,
  presetInvoice,
}) {
  const actor = useActorName();

  const [customerId, setCustomerId] = useState("");
  const [invoiceId, setInvoiceId] = useState("none");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("mpesa");
  const [reference, setReference] = useState("");
  const [errors, setErrors] = useState({});

  const record = useWorkspaceAction(
    (input) => recordPayment(input, actor),
    "Payment recorded"
  );

  useEffect(() => {
    if (!open) return;

    setCustomerId(
      presetInvoice
        ? String(presetInvoice.customer_id)
        : ""
    );

    setInvoiceId(
      presetInvoice
        ? String(presetInvoice.id)
        : "none"
    );

    setAmount(
      presetInvoice
        ? String(presetInvoice.amount)
        : ""
    );

    setMethod("mpesa");
    setReference("");
    setErrors({});
  }, [open, presetInvoice]);

  const openInvoices = useMemo(
    () =>
      invoices.filter(
        (invoice) =>
          invoice.status !== "paid" &&
          String(invoice.customer_id) === customerId
      ),
    [invoices, customerId]
  );

  const submit = (event) => {
    event.preventDefault();

    const parsed = schema.safeParse({
      customer_id: Number(customerId),
      invoice_id:
        invoiceId === "none"
          ? null
          : Number(invoiceId),
      amount: Number(amount),
      method,
      transaction_ref: reference,
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

    record.mutate(parsed.data, {
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
            Record payment
          </DialogTitle>

          <DialogDescription>
            Log money received. Linking an invoice marks
            that invoice as paid.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={submit}
          className="space-y-4"
          noValidate
        >
          {/* Customer */}
          <div className="space-y-1.5">
            <Label htmlFor="payment-customer">
              Customer
            </Label>

            <Select
              value={customerId}
              onValueChange={(value) => {
                setCustomerId(value);
                setInvoiceId("none");
              }}
            >
              <SelectTrigger id="payment-customer">
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
              <FieldError
                message={errors.customer_id}
              />
            ) : null}
          </div>

          {/* Invoice */}
          <div className="space-y-1.5">
            <Label htmlFor="payment-invoice">
              Invoice
            </Label>

            <Select
              value={invoiceId}
              onValueChange={setInvoiceId}
            >
              <SelectTrigger id="payment-invoice">
                <SelectValue placeholder="No invoice" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="none">
                  Not linked to an invoice
                </SelectItem>

                {openInvoices.map((invoice) => (
                  <SelectItem
                    key={invoice.id}
                    value={String(invoice.id)}
                  >
                    {invoice.reference} —{" "}
                    {money(invoice.amount)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount and method */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="payment-amount">
                Amount (KES)
              </Label>

              <Input
                id="payment-amount"
                inputMode="decimal"
                value={amount}
                onChange={(event) =>
                  setAmount(event.target.value)
                }
                placeholder="3500"
                aria-invalid={!!errors.amount}
              />

              {errors.amount ? (
                <FieldError
                  message={errors.amount}
                />
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="payment-method">
                Method
              </Label>

              <Select
                value={method}
                onValueChange={setMethod}
              >
                <SelectTrigger id="payment-method">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="mpesa">
                    M-Pesa
                  </SelectItem>

                  <SelectItem value="cash">
                    Cash
                  </SelectItem>

                  <SelectItem value="bank">
                    Bank transfer
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Transaction reference */}
          <div className="space-y-1.5">
            <Label htmlFor="payment-ref">
              Transaction reference
            </Label>

            <Input
              id="payment-ref"
              value={reference}
              onChange={(event) =>
                setReference(event.target.value)
              }
              placeholder="e.g. QGH7XKL2PM"
            />
          </div>

          {/* Actions */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={record.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={record.isPending}
            >
              {record.isPending
                ? "Saving…"
                : "Record payment"}
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