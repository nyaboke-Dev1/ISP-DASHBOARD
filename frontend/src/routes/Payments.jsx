import { useMemo, useState } from "react";
import {
  Banknote,
  Building2,
  Plus,
  Search,
  Smartphone,
  Wallet,
} from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { PaymentDialog } from "@/components/isp/payment-dialog";

import {
  EmptyRow,
  Monogram,
  PageHeader,
  Panel,
  PanelHeader,
  StatusPill,
  TableWrap,
  Td,
  Th,
} from "@/components/isp/ui";

import { MetricCard } from "@/components/isp/metric-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import { dateTime, money } from "@/lib/isp";
import { useWorkspace } from "@/hooks/use-workspace";

const FILTERS = [
  { key: "all", label: "All methods" },
  { key: "mpesa", label: "M-Pesa" },
  { key: "cash", label: "Cash" },
  { key: "bank", label: "Bank" },
];

const METHOD_LABEL = {
  mpesa: "M-Pesa",
  cash: "Cash",
  bank: "Bank transfer",
};

function PaymentsPage() {
  const { data, isPending } = useWorkspace();

  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [recordOpen, setRecordOpen] = useState(false);

  const payments = data?.payments ?? [];
  const customers = data?.customers ?? [];
  const invoices = data?.invoices ?? [];

  const customerName = (id) =>
    customers.find((c) => c.id === id)?.name ?? "Unknown";

  const invoiceRef = (id) =>
    id
      ? invoices.find((i) => i.id === id)?.reference ?? "—"
      : "—";

  const totals = useMemo(() => {
    const sum = (method) =>
      payments
        .filter((p) => !method || p.method === method)
        .reduce((s, p) => s + Number(p.amount), 0);

    return {
      all: sum(),
      mpesa: sum("mpesa"),
      cash: sum("cash"),
      bank: sum("bank"),
    };
  }, [payments]);

  const counts = useMemo(() => {
    const map = {
      all: payments.length,
    };

    for (const p of payments) {
      map[p.method] = (map[p.method] ?? 0) + 1;
    }

    return map;
  }, [payments]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();

    return payments.filter((p) => {
      if (filter !== "all" && p.method !== filter) {
        return false;
      }

      if (!q) {
        return true;
      }

      return (
        p.transaction_ref?.toLowerCase().includes(q) ||
        customerName(p.customer_id).toLowerCase().includes(q)
      );
    });
  }, [payments, customers, filter, query]);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Payments"
        title="Collections"
        description="Every payment received, with the method and reference used to reconcile it."
        action={
          <Button
            className="gap-2"
            onClick={() => setRecordOpen(true)}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Record payment
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total collected"
          value={money(totals.all)}
          icon={Wallet}
          note={`${payments.length} payments recorded`}
          accent="success"
        />

        <MetricCard
          label="M-Pesa"
          value={money(totals.mpesa)}
          icon={Smartphone}
          note="Mobile money"
        />

        <MetricCard
          label="Cash"
          value={money(totals.cash)}
          icon={Banknote}
          note="Received at office"
          accent="warning"
        />

        <MetricCard
          label="Bank transfer"
          value={money(totals.bank)}
          icon={Building2}
          note="Direct deposits"
        />
      </div>

      <Panel>
        <PanelHeader
          title="Payment history"
          subtitle={`${rows.length} of ${payments.length} payments shown`}
          action={
            <div className="relative w-full sm:w-64">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />

              <Input
                className="pl-8"
                placeholder="Search reference or customer"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search payments"
              />
            </div>
          }
        />

        <div className="flex flex-wrap gap-2 border-b border-border px-4 py-3 sm:px-5">
          {FILTERS.map((f) => (
            <Button
              key={f.key}
              size="sm"
              variant={filter === f.key ? "default" : "outline"}
              onClick={() => setFilter(f.key)}
            >
              {f.label}

              <span className="ml-1.5 text-[11px] opacity-70">
                {counts[f.key] ?? 0}
              </span>
            </Button>
          ))}
        </div>

        {isPending ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-10 w-full"
              />
            ))}
          </div>
        ) : (
          <TableWrap>
            <thead>
              <tr>
                <Th>Customer</Th>
                <Th className="text-right">Amount</Th>
                <Th>Method</Th>
                <Th>Reference</Th>
                <Th>Invoice</Th>
                <Th>Received</Th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <EmptyRow
                  colSpan={6}
                  message="No payments match this view."
                />
              ) : (
                rows.map((p) => (
                  <tr
                    key={p.id}
                    className="transition-colors hover:bg-muted/40"
                  >
                    <Td>
                      <span className="flex items-center gap-2.5">
                        <Monogram
                          name={customerName(p.customer_id)}
                          className="h-8 w-8"
                        />

                        <span className="truncate">
                          {customerName(p.customer_id)}
                        </span>
                      </span>
                    </Td>

                    <Td className="text-right tabular-nums font-semibold">
                      {money(p.amount)}
                    </Td>

                    <Td>
                      <StatusPill
                        value={METHOD_LABEL[p.method]}
                        tone={
                          p.method === "mpesa"
                            ? "success"
                            : p.method === "cash"
                              ? "warning"
                              : "info"
                        }
                      />
                    </Td>

                    <Td className="text-muted-foreground">
                      {p.transaction_ref || "—"}
                    </Td>

                    <Td className="text-muted-foreground">
                      {invoiceRef(p.invoice_id)}
                    </Td>

                    <Td className="whitespace-nowrap text-muted-foreground">
                      {dateTime(p.paid_at)}
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </TableWrap>
        )}
      </Panel>

      <PaymentDialog
        open={recordOpen}
        onOpenChange={setRecordOpen}
        customers={customers}
        invoices={invoices}
      />
    </AppShell>
  );
}

export { PaymentsPage };

