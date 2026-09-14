import { Link, useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChevronRight, FileWarning, Layers, TicketCheck, Users, Wallet } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { MetricCard } from "@/components/isp/metric-card";
import {
  EmptyRow,
  Monogram,
  Panel,
  PanelHeader,
  PriorityDot,
  StatusPill,
  TableWrap,
  Td,
  Th,
} from "@/components/isp/ui";
import { useAuth } from "@/hooks/use-auth";
import { useWorkspace } from "@/hooks/use-workspace";
import { gb, money, shortDate } from "@/lib/isp";

// NOTE: document title / meta tags previously came from TanStack Router's
// `head()` option. Set them however your project already does it, e.g. with
// react-helmet-async, or just drop this useEffect in:
//
// useEffect(() => {
//   document.title = "Dashboard — Swift-Net";
// }, []);

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  // Auth guarding is assumed to be handled by a <ProtectedRoute> wrapper
  // around this route in your router config, not inside the page itself.
  const { user } = useAuth();
  const { data, isPending, isError, error } = useWorkspace();

  const packages = data?.packages ?? [];
  const customers = data?.customers ?? [];
  const invoices = data?.invoices ?? [];
  const payments = data?.payments ?? [];
  const usage = data?.usage ?? [];
  const tickets = data?.tickets ?? [];

  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const revenueThisMonth = payments
    .filter((p) => new Date(p.paid_at) >= monthStart)
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const overdue = invoices.filter((i) => i.status === "overdue");
  const overdueTotal = overdue.reduce((sum, i) => sum + Number(i.amount), 0);
  const openTickets = tickets.filter((t) => t.status !== "closed");
  const highPriority = openTickets.filter((t) => t.priority === "high").length;

  // stat_date -> date (Django field name)
  const chartData = usage.slice(-7).map((row) => ({
    label: shortDate(row.date),
    Download: Math.round(row.download_mb),
    Upload: Math.round(row.upload_mb),
  }));

  // package_id -> package (Django field name)
  const maxSubscribers = Math.max(
    1,
    ...packages.map((pkg) => customers.filter((c) => c.package === pkg.id).length),
  );

  const packageName = (id) => packages.find((pkg) => pkg.id === id)?.name ?? "Unassigned";

  const navigate = useNavigate();

  function goToCustomers(search) {
    const params = new URLSearchParams(search).toString();
    navigate(`/customers${params ? `?${params}` : ""}`);
  }

  return (
    <AppShell>
      <header className="grid gap-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
          Workspace / Dashboard
        </p>
        <h1 className="text-2xl font-semibold text-foreground sm:text-[1.75rem]">
          {greeting()}, {user?.fullName?.split(" ")[0] ?? "there"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Everything happening across your network today.
        </p>
      </header>

      {isError ? (
        <Panel className="p-5">
          <p className="text-sm text-danger">
            {error instanceof Error ? error.message : "We couldn't load your workspace."}
          </p>
        </Panel>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Active customers"
          value={isPending ? "—" : String(activeCustomers)}
          note={`${customers.length} accounts on the network`}
          icon={Users}
          accent="primary"
          trend="up"
        />
        <MetricCard
          label="Revenue this month"
          value={isPending ? "—" : money(revenueThisMonth)}
          note={`${payments.length} payments recorded`}
          icon={Wallet}
          accent="success"
          trend="up"
        />
        <MetricCard
          label="Overdue invoices"
          value={isPending ? "—" : String(overdue.length)}
          note={`${money(overdueTotal)} outstanding`}
          icon={FileWarning}
          accent="danger"
          trend="down"
        />
        <MetricCard
          label="Open tickets"
          value={isPending ? "—" : String(openTickets.length)}
          note={`${highPriority} high priority`}
          icon={TicketCheck}
          accent="warning"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Panel>
          <PanelHeader
            title="Network traffic"
            subtitle="Upload & download — last 7 days"
            action={
              <Link to="/network" className="text-xs font-semibold text-primary hover:underline">
                View details
              </Link>
            }
          />
          <div className="h-[16rem] w-full px-2 py-4 sm:h-[18rem] sm:px-4">
            {chartData.length === 0 ? (
              <p className="grid h-full place-items-center text-sm text-muted-foreground">
                No usage recorded yet.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={4}>
                  <CartesianGrid vertical={false} stroke="var(--color-border)" />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={44}
                    tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                    tickFormatter={(value) => `${Math.round(value / 1024)}GB`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "0.6rem",
                      fontSize: "0.75rem",
                      color: "var(--color-popover-foreground)",
                    }}
                    formatter={(value) => gb(Number(value))}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "0.75rem", paddingTop: "0.5rem" }}
                  />
                  <Bar dataKey="Download" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Upload" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>

        <Panel className="flex flex-col">
          <PanelHeader
            title="Package performance"
            subtitle="Subscribers by plan"
            action={
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary">
                <Layers size={16} aria-hidden="true" />
              </span>
            }
          />
          <div className="flex-1 space-y-4 px-4 py-4 sm:px-5">
            {packages.length === 0 ? (
              <p className="text-sm text-muted-foreground">No packages configured yet.</p>
            ) : (
              packages.map((pkg) => {
                const count = customers.filter((c) => c.package === pkg.id).length;
                return (
                  <div key={pkg.id}>
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-2">
                      <p className="truncate text-sm font-medium text-foreground">{pkg.name}</p>
                      <p className="numeric text-xs text-muted-foreground">
                        {count} {count === 1 ? "subscriber" : "subscribers"}
                      </p>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${Math.max(4, (count / maxSubscribers) * 100)}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {pkg.speed_mbps} Mbps · {money(pkg.price)} / {pkg.billing_cycle}
                    </p>
                  </div>
                );
              })
            )}
          </div>
          <div className="border-t border-border p-3">
            <Link
              to="/packages"
              className="flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary-soft"
            >
              Manage packages
              <ChevronRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Panel>
          <PanelHeader
            title="Recent customers"
            subtitle="Latest accounts on your network"
            action={
              <button
                type="button"
                onClick={() => goToCustomers({ q: "", status: "all", pkg: "all", page: 1 })}
                className="text-xs font-semibold text-primary hover:underline"
              >
                View all
              </button>
            }
          />
          <TableWrap>
            <thead>
              <tr>
                <Th>Customer</Th>
                <Th>Location</Th>
                <Th>Package</Th>
                <Th className="text-right">Status</Th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <EmptyRow
                  colSpan={4}
                  message={isPending ? "Loading customers…" : "No customers yet."}
                />
              ) : (
                customers.slice(0, 5).map((customer) => (
                  <tr key={customer.id} className="transition-colors hover:bg-muted/50">
                    <Td>
                      <div className="flex min-w-0 items-center gap-3">
                        <Monogram name={customer.name} />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium">{customer.name}</span>
                          <span className="numeric block truncate text-xs text-muted-foreground">
                            {customer.phone}
                          </span>
                        </span>
                      </div>
                    </Td>
                    <Td className="text-sm text-muted-foreground">{customer.location}</Td>
                    <Td className="text-sm">{packageName(customer.package)}</Td>
                    <Td className="text-right">
                      <StatusPill value={customer.status} />
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </TableWrap>
        </Panel>

        <Panel className="flex flex-col">
          <PanelHeader
            title="Open tickets"
            subtitle="Need attention"
            action={
              <Link to="/tickets" className="text-xs font-semibold text-primary hover:underline">
                View all
              </Link>
            }
          />
          <ul className="flex-1 divide-y divide-border">
            {openTickets.length === 0 ? (
              <li className="px-4 py-10 text-center text-sm text-muted-foreground">
                {isPending ? "Loading tickets…" : "No open tickets. Nice work."}
              </li>
            ) : (
              openTickets.slice(0, 5).map((ticket) => (
                <li key={ticket.id}>
                  <Link
                    to="/tickets"
                    className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50 sm:px-5"
                  >
                    <PriorityDot priority={ticket.priority} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-foreground">
                        {ticket.subject}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {ticket.reference} · {ticket.assignee}
                      </span>
                    </span>
                    <ChevronRight
                      size={15}
                      aria-hidden="true"
                      className="shrink-0 text-muted-foreground"
                    />
                  </Link>
                </li>
              ))
            )}
          </ul>
        </Panel>
      </div>
    </AppShell>
  );
}