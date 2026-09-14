import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Search,
  Ban,
  RotateCcw,
} from "lucide-react";

import { AddCustomerDialog } from "@/components/isp/add-customer-dialog";
import { AppShell } from "@/components/AppShell";

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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Skeleton } from "@/components/ui/skeleton";

import {
  longDate,
  money,
  shortDate,
  titleCase,
  updateCustomerStatus,
} from "@/lib/isp";

import {
  useActorName,
  useWorkspace,
  useWorkspaceAction,
} from "@/hooks/use-workspace";

const PAGE_SIZE = 8;

function CustomersPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") || "";
  const status = searchParams.get("status") || "all";
  const pkg = searchParams.get("pkg") || "all";

  const pageParam = Number(searchParams.get("page"));
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  const { data, isLoading } = useWorkspace();

  const [selected, setSelected] = useState(null);

  const setSearch = (patch) => {
    const next = new URLSearchParams(searchParams);

    Object.entries(patch).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    });

    setSearchParams(next, { replace: true });
  };

  const packages = data?.packages ?? [];

  const packageName = (id) =>
    packages.find((p) => p.id === id)?.name ?? "No package";

  const filtered = useMemo(() => {
    const customers = data?.customers ?? [];
    const term = q.trim().toLowerCase();

    return customers.filter((customer) => {
      if (status !== "all" && customer.status !== status) {
        return false;
      }

      if (pkg !== "all" && String(customer.package_id) !== pkg) {
        return false;
      }

      if (!term) {
        return true;
      }

      return [
        customer.name,
        customer.phone,
        customer.email,
        customer.location,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [data, q, status, pkg]);

  const pageCount = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const safePage = Math.min(
    Math.max(1, page),
    pageCount
  );

  const rows = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const counts = useMemo(() => {
    const customers = data?.customers ?? [];

    return {
      total: customers.length,
      active: customers.filter(
        (customer) => customer.status === "active"
      ).length,
      pending: customers.filter(
        (customer) => customer.status === "pending"
      ).length,
      suspended: customers.filter(
        (customer) => customer.status === "suspended"
      ).length,
    };
  }, [data]);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Customers"
        title="Subscribers"
        description="Every account on your network — search, filter and open any customer for the full picture."
        action={<AddCustomerDialog packages={packages} />}
      />

      {/* Status quick-filters */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          ["all", counts.total, "All"],
          ["active", counts.active, "Active"],
          ["pending", counts.pending, "Pending"],
          ["suspended", counts.suspended, "Suspended"],
        ].map(([value, count, label]) => (
          <button
            key={value}
            type="button"
            onClick={() =>
              setSearch({
                status: value,
                page: 1,
              })
            }
            className={
              status === value
                ? "inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                : "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
            }
          >
            {label}

            <span
              className={
                status === value
                  ? "opacity-80"
                  : "text-muted-foreground/70"
              }
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      <Panel>
        <PanelHeader
          title="Customer list"
          subtitle={`${filtered.length} of ${counts.total} subscribers`}
        />

        {/* Filters */}
        <div className="grid grid-cols-1 gap-3 border-b border-border px-4 py-3 sm:grid-cols-[minmax(0,1fr)_12rem_12rem] sm:px-5">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />

            <Input
              value={q}
              onChange={(event) =>
                setSearch({
                  q: event.target.value,
                  page: 1,
                })
              }
              placeholder="Search name, phone, email or location…"
              className="pl-9"
              aria-label="Search customers"
            />
          </div>

          <Select
            value={pkg}
            onValueChange={(value) =>
              setSearch({
                pkg: value,
                page: 1,
              })
            }
          >
            <SelectTrigger aria-label="Filter by package">
              <SelectValue placeholder="All packages" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">
                All packages
              </SelectItem>

              {packages.map((p) => (
                <SelectItem
                  key={p.id}
                  value={String(p.id)}
                >
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={status}
            onValueChange={(value) =>
              setSearch({
                status: value,
                page: 1,
              })
            }
          >
            <SelectTrigger aria-label="Filter by status">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">
                All statuses
              </SelectItem>
              <SelectItem value="active">
                Active
              </SelectItem>
              <SelectItem value="pending">
                Pending
              </SelectItem>
              <SelectItem value="suspended">
                Suspended
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TableWrap>
          <thead>
            <tr>
              <Th>Customer</Th>
              <Th>Location</Th>
              <Th>Package</Th>
              <Th className="text-right">Balance</Th>
              <Th>Status</Th>
              <Th>Joined</Th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td
                    colSpan={6}
                    className="px-4 py-2"
                  >
                    <Skeleton className="h-8 w-full" />
                  </td>
                </tr>
              ))
            ) : rows.length === 0 ? (
              <EmptyRow
                colSpan={6}
                message="No customers match these filters."
              />
            ) : (
              rows.map((customer) => (
                <tr
                  key={customer.id}
                  className="cursor-pointer transition-colors hover:bg-muted/50"
                  onClick={() => setSelected(customer)}
                >
                  <Td>
                    <div className="flex items-center gap-3">
                      <Monogram name={customer.name} />

                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">
                          {customer.name}
                        </p>

                        <p className="truncate text-xs text-muted-foreground">
                          {customer.phone}
                        </p>
                      </div>
                    </div>
                  </Td>

                  <Td className="text-muted-foreground">
                    {customer.location}
                  </Td>

                  <Td>
                    <span className="inline-flex rounded-md bg-primary-soft px-2 py-1 text-[11px] font-semibold text-primary">
                      {packageName(customer.package_id)}
                    </span>
                  </Td>

                  <Td className="text-right font-medium tabular-nums">
                    {money(customer.balance)}
                  </Td>

                  <Td>
                    <StatusPill value={customer.status} />
                  </Td>

                  <Td className="text-muted-foreground">
                    {shortDate(customer.created_at)}
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </TableWrap>

        {/* Pagination */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <p className="text-xs text-muted-foreground">
            Page {safePage} of {pageCount}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              disabled={safePage <= 1}
              onClick={() =>
                setSearch({
                  page: safePage - 1,
                })
              }
            >
              <ChevronLeft
                className="h-4 w-4"
                aria-hidden="true"
              />
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              disabled={safePage >= pageCount}
              onClick={() =>
                setSearch({
                  page: safePage + 1,
                })
              }
            >
              Next

              <ChevronRight
                className="h-4 w-4"
                aria-hidden="true"
              />
            </Button>
          </div>
        </div>
      </Panel>

      <CustomerDetail
        customer={selected}
        onClose={() => setSelected(null)}
        packageName={packageName}
      />
    </AppShell>
  );
}

function CustomerDetail({
  customer,
  onClose,
  packageName,
}) {
  const { data } = useWorkspace();
  const actor = useActorName();

  const statusAction = useWorkspaceAction(
    (status) =>
      updateCustomerStatus(
        customer,
        status,
        actor
      ),
    "Customer status updated"
  );

  const invoices = (data?.invoices ?? []).filter(
    (invoice) =>
      invoice.customer_id === customer?.id
  );

  const payments = (data?.payments ?? []).filter(
    (payment) =>
      payment.customer_id === customer?.id
  );

  const tickets = (data?.tickets ?? []).filter(
    (ticket) =>
      ticket.customer_id === customer?.id
  );

  return (
    <Sheet
      open={customer !== null}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <SheetContent
        side="right"
        className="w-full overflow-y-auto sm:max-w-md"
      >
        {customer ? (
          <>
            <SheetHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <Monogram
                  name={customer.name}
                  className="h-11 w-11 text-sm"
                />

                <div className="min-w-0">
                  <SheetTitle className="truncate">
                    {customer.name}
                  </SheetTitle>

                  <SheetDescription>
                    Customer since{" "}
                    {longDate(customer.created_at)}
                  </SheetDescription>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StatusPill value={customer.status} />

                <span className="inline-flex rounded-md bg-primary-soft px-2 py-1 text-[11px] font-semibold text-primary">
                  {packageName(customer.package_id)}
                </span>
              </div>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* Contact */}
              <section className="space-y-2 rounded-xl border border-border p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Contact
                </h3>

                <p className="flex items-center gap-2 text-sm text-foreground">
                  <Phone
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  {customer.phone}
                </p>

                <p className="flex items-center gap-2 text-sm text-foreground">
                  <Mail
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  {customer.email}
                </p>

                <p className="flex items-center gap-2 text-sm text-foreground">
                  <MapPin
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  {customer.location}
                </p>
              </section>

              {/* Balance */}
              <section className="flex items-center justify-between rounded-xl border border-border p-4">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Outstanding balance
                  </h3>

                  <p className="mt-1 text-xl font-semibold tabular-nums text-foreground">
                    {money(customer.balance)}
                  </p>
                </div>

                {customer.status === "suspended" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    disabled={statusAction.isPending}
                    onClick={() =>
                      statusAction.mutate("active")
                    }
                  >
                    <RotateCcw
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                    Reactivate
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-danger"
                    disabled={statusAction.isPending}
                    onClick={() =>
                      statusAction.mutate("suspended")
                    }
                  >
                    <Ban
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                    Suspend
                  </Button>
                )}
              </section>

              {/* Invoices */}
              <DetailSection
                title="Invoices"
                empty="No invoices yet."
              >
                {invoices.map((invoice) => (
                  <li
                    key={invoice.id}
                    className="flex items-center justify-between gap-2 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {invoice.reference}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Due {shortDate(invoice.due_date)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium tabular-nums">
                        {money(invoice.amount)}
                      </span>

                      <StatusPill value={invoice.status} />
                    </div>
                  </li>
                ))}
              </DetailSection>

              {/* Payments */}
              <DetailSection
                title="Payments"
                empty="No payments recorded."
              >
                {payments.map((payment) => (
                  <li
                    key={payment.id}
                    className="flex items-center justify-between gap-2 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {payment.transaction_ref ||
                          titleCase(payment.method)}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {shortDate(payment.paid_at)}
                      </p>
                    </div>

                    <span className="text-sm font-medium tabular-nums text-success">
                      {money(payment.amount)}
                    </span>
                  </li>
                ))}
              </DetailSection>

              {/* Tickets */}
              <DetailSection
                title="Support tickets"
                empty="No tickets for this customer."
              >
                {tickets.map((ticket) => (
                  <li
                    key={ticket.id}
                    className="flex items-center justify-between gap-2 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {ticket.subject}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {ticket.reference} ·{" "}
                        {titleCase(ticket.priority)} priority
                      </p>
                    </div>

                    <StatusPill value={ticket.status} />
                  </li>
                ))}
              </DetailSection>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function DetailSection({
  title,
  empty,
  children,
}) {
  const items = Array.isArray(children)
    ? children
    : [children];

  const hasItems =
    items.length > 0 && items.some(Boolean);

  return (
    <section className="rounded-xl border border-border p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>

      {hasItems ? (
        <ul className="divide-y divide-border">
          {children}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          {empty}
        </p>
      )}
    </section>
  );
}

export { CustomersPage };
