import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  LifeBuoy,
  Loader2,
  Plus,
  Search,
} from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { TicketDialog } from "@/components/isp/ticket-dialog";
import {
  Monogram,
  PageHeader,
  Panel,
  PanelHeader,
  PriorityDot,
  StatusPill,
} from "@/components/isp/ui";
import { MetricCard } from "@/components/isp/metric-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  dateTime,
  setTicketStatus,
  titleCase,
} from "@/lib/isp";
import {
  useActorName,
  useWorkspace,
  useWorkspaceAction,
} from "@/hooks/use-workspace";
import { useRequireAuth } from "@/hooks/use-require-auth";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "open", label: "Open" },
  { key: "in_progress", label: "In progress" },
  { key: "closed", label: "Closed" },
];

export function TicketsPage() {
  //useRequireAuth();

  const { data, isPending } = useWorkspace();
  const actor = useActorName();

  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const tickets = data?.tickets ?? [];
  const customers = data?.customers ?? [];

  const customerName = (id) =>
    customers.find((c) => c.id === id)?.name ?? "Unknown";

  const counts = useMemo(() => {
    const map = {
      all: tickets.length,
    };

    for (const ticket of tickets) {
      map[ticket.status] = (map[ticket.status] ?? 0) + 1;
    }

    return map;
  }, [tickets]);

  const highPriority = tickets.filter(
    (ticket) =>
      ticket.priority === "high" &&
      ticket.status !== "closed"
  ).length;

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();

    return tickets.filter((ticket) => {
      if (
        filter !== "all" &&
        ticket.status !== filter
      ) {
        return false;
      }

      if (!q) {
        return true;
      }

      return (
        ticket.reference.toLowerCase().includes(q) ||
        ticket.subject.toLowerCase().includes(q) ||
        customerName(ticket.customer_id)
          .toLowerCase()
          .includes(q)
      );
    });
  }, [tickets, customers, filter, query]);

  const update = useWorkspaceAction(
    ({ ticket, status }) =>
      setTicketStatus(ticket, status, actor),
    "Ticket updated"
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Support tickets"
        title="Support desk"
        description="Customer issues with their priority, assignee and current progress."
        action={
          <Button
            className="gap-2"
            onClick={() => setCreateOpen(true)}
          >
            <Plus
              className="h-4 w-4"
              aria-hidden="true"
            />
            New ticket
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Open"
          value={String(counts.open ?? 0)}
          icon={LifeBuoy}
          note="Waiting to be picked up"
          accent="warning"
        />

        <MetricCard
          label="In progress"
          value={String(counts.in_progress ?? 0)}
          icon={Loader2}
          note="Being worked on"
        />

        <MetricCard
          label="Closed"
          value={String(counts.closed ?? 0)}
          icon={CheckCircle2}
          note="Resolved tickets"
          accent="success"
        />

        <MetricCard
          label="High priority"
          value={String(highPriority)}
          icon={AlertTriangle}
          note="Needs attention now"
          accent="danger"
        />
      </div>

      <Panel>
        <PanelHeader
          title="All tickets"
          subtitle={`${rows.length} of ${tickets.length} tickets shown`}
          action={
            <div className="relative w-full sm:w-64">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />

              <Input
                className="pl-8"
                placeholder="Search subject, reference or customer"
                value={query}
                onChange={(e) =>
                  setQuery(e.target.value)
                }
                aria-label="Search tickets"
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
              onClick={() =>
                setFilter(filterOption.key)
              }
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
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-20 w-full"
              />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <p className="px-5 py-14 text-center text-sm text-muted-foreground">
            No tickets match this view.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((ticket) => (
              <li
                key={ticket.id}
                className="px-4 py-4 transition-colors hover:bg-muted/40 sm:px-5"
              >
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <PriorityDot
                        priority={ticket.priority}
                      />

                      <span className="text-sm font-semibold text-foreground">
                        {ticket.subject}
                      </span>

                      <StatusPill
                        value={ticket.status}
                      />
                    </div>

                    {ticket.description ? (
                      <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                        {ticket.description}
                      </p>
                    ) : null}

                    <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Monogram
                          name={customerName(
                            ticket.customer_id
                          )}
                          className="h-6 w-6 text-[10px]"
                        />

                        {customerName(
                          ticket.customer_id
                        )}
                      </span>

                      <span>{ticket.reference}</span>

                      <span>
                        {titleCase(ticket.priority)} priority
                      </span>

                      <span>
                        Assigned to {ticket.assignee}
                      </span>

                      <span>
                        {dateTime(ticket.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    {ticket.status !== "in_progress" &&
                    ticket.status !== "closed" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={update.isPending}
                        onClick={() =>
                          update.mutate({
                            ticket,
                            status: "in_progress",
                          })
                        }
                      >
                        Start work
                      </Button>
                    ) : null}

                    {ticket.status !== "closed" ? (
                      <Button
                        size="sm"
                        disabled={update.isPending}
                        onClick={() =>
                          update.mutate({
                            ticket,
                            status: "closed",
                          })
                        }
                      >
                        Close
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={update.isPending}
                        onClick={() =>
                          update.mutate({
                            ticket,
                            status: "open",
                          })
                        }
                      >
                        Reopen
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <TicketDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        customers={customers}
      />
    </AppShell>
  );
}

export default TicketsPage;
