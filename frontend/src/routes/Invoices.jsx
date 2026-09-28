import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Clock,
  FileWarning,
  Plus,
  Search,
  Wallet,
} from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { InvoiceDialog } from "@/components/isp/invoice-dialog";
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

import { longDate, money, setInvoiceStatus } from "@/lib/isp";

import {
  useActorName,
  useWorkspace,
  useWorkspaceAction,
} from "@/hooks/use-workspace";

import { useRequireAuth } from "@/hooks/use-require-auth";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "unpaid", label: "Unpaid" },
  { key: "overdue", label: "Overdue" },
  { key: "paid", label: "Paid" },
];

export function InvoicesPage() {
  //useRequireAuth();

  const { data, isPending } = useWorkspace();
  const actor = useActorName();

  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [payFor, setPayFor] = useState(null);

  const invoices = data?.invoices ?? [];
  const customers = data?.customers ?? [];

  const customerName = (id) => {
    return (
      customers.find((customer) => customer.id === id)?.name ?? "Unknown"
    );
  };

  const totals = useMemo(() => {
    const outstanding = invoices
      .filter((invoice) => invoice.status !== "paid")
      .reduce((sum, invoice) => sum + Number(invoice.amount), 0);

    const collected = invoices
      .filter((invoice) => invoice.status === "paid")
      .reduce((sum, invoice) => sum + Number(invoice.amount), 0);

    return {
      outstanding,
      collected,
      overdue: invoices.filter(
        (invoice) => invoice.status === "overdue"
      ).length,
      unpaid: invoices.filter(
        (invoice) => invoice.status === "unpaid"
      ).length,
    };
  }, [invoices]);

  const counts = useMemo(() => {
    const map = {
      all: invoices.length,
    };

    for (const invoice of invoices) {
      map[invoice.status] = (map[invoice.status] ?? 0) + 1;
    }

    return map;
  }, [invoices]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();

    return invoices.filter((invoice) => {
      if (filter !== "all" && invoice.status !== filter) {
        return false;
      }

      if (!q) {
        return true;
      }

      return (
        invoice.reference.toLowerCase().includes(q) ||
        customerName(invoice.customer_id).toLowerCase().includes(q)
      );
    });
  }, [invoices, customers, filter, query]);

  const update = useWorkspaceAction(
    ({ invoice, status }) =>
      setInvoiceStatus(invoice, status, actor),
    "Invoice updated"
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Invoices"
        title="Billing"
        description="Issued invoices, due dates and payment status across every subscriber."
        action={
          <Button
            className="gap-2"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New invoice
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Outstanding"
          value={money(totals.outstanding)}
          icon={Wallet}
          hint="Unpaid and overdue"
        />

        <MetricCard
          label="Collected"
          value={money(totals.collected)}
          icon={BadgeCheck}
          hint="Invoices marked paid"
        />

        <MetricCard
          label="Overdue"
          value={String(totals.overdue)}
          icon={FileWarning}
          hint="Needs follow-up"
          tone="danger"
        />

        <MetricCard
          label="Awaiting payment"
          value={String(totals.unpaid)}
          icon={Clock}
          hint="Not yet due"
          tone="warning"
        />
      </div>

      <Panel>
        <PanelHeader
          title="All invoices"
          subtitle={`${rows.length} of ${invoices.length} invoices shown`}
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
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Search invoices"
              />
            </div>
          }
        />

        <div className="flex flex-wrap gap-2 border-b border-border px-4 py-3 sm:px-5">
          {FILTERS.map((filterOption) => (
            <Button
              key={filterOption.key}
              size="sm"
              variant={
                filter === filterOption.key
                  ? "default"
                  : "outline"
              }
              onClick={() => setFilter(filterOption.key)}
            >
              {filterOption.label}

              <span className="ml-1.5 text-[11px] opacity-70">
                {counts[filterOption.key] ?? 0}
              </span>
            </Button>
          ))}
        </div>

        {isPending ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-10 w-full"
              />
            ))}
          </div>
        ) : (
          <TableWrap>
            <thead>
              <tr>
                <Th>Reference</Th>
                <Th>Customer</Th>
                <Th className="text-right">Amount</Th>
                <Th>Due</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <EmptyRow
                  colSpan={6}
                  message="No invoices match this view."
                />
              ) : (
                rows.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="transition-colors hover:bg-muted/40"
                  >
                    <Td className="font-semibold">
                      {invoice.reference}
                    </Td>

                    <Td>
                      <span className="flex items-center gap-2.5">
                        <Monogram
                          name={customerName(invoice.customer_id)}
                          className="h-8 w-8"
                        />

                        <span className="truncate">
                          {customerName(invoice.customer_id)}
                        </span>
                      </span>
                    </Td>

                    <Td className="text-right tabular-nums">
                      {money(invoice.amount)}
                    </Td>

                    <Td className="whitespace-nowrap text-muted-foreground">
                      {longDate(invoice.due_date)}
                    </Td>

                    <Td>
                      <StatusPill value={invoice.status} />
                    </Td>

                    <Td className="text-right">
                      <span className="inline-flex flex-wrap justify-end gap-2">
                        {invoice.status !== "paid" ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setPayFor(invoice)}
                            >
                              Record payment
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={update.isPending}
                              onClick={() =>
                                update.mutate({
                                  invoice,
                                  status: "paid",
                                })
                              }
                            >
                              Mark paid
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={update.isPending}
                            onClick={() =>
                              update.mutate({
                                invoice,
                                status: "unpaid",
                              })
                            }
                          >
                            Reopen
                          </Button>
                        )}
                      </span>
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </TableWrap>
        )}
      </Panel>

      <InvoiceDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        customers={customers}
      />

      <PaymentDialog
        open={payFor !== null}
        onOpenChange={(value) => {
          if (!value) {
            setPayFor(null);
          }
        }}
        customers={customers}
        invoices={invoices}
        presetInvoice={payFor}
      />
    </AppShell>
  );
}

