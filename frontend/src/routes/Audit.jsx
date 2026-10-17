import { useMemo, useState } from "react";
import { History, Search, UserCog } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import {
  EmptyRow,
  Monogram,
  PageHeader,
  Panel,
  PanelHeader,
  TableWrap,
  Td,
  Th,
} from "@/components/isp/ui";
import { MetricCard } from "@/components/isp/metric-card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { dateTime } from "@/lib/isp";
import { useWorkspace } from "@/hooks/use-workspace";
import { useRequireAuth } from "@/hooks/use-require-auth";

export function AuditPage() {
  useRequireAuth();

  const { data, isPending } = useWorkspace();
  const [query, setQuery] = useState("");

  const audits = data?.audits ?? [];

  const actors = useMemo(
    () =>
      new Set(audits.map((audit) => audit.admin_username).filter(Boolean)).size,
    [audits],
  );

  
const today = useMemo(() => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  return audits.filter(
    (audit) => audit.timestamp && new Date(audit.timestamp) >= start,
  ).length;
}, [audits]);


  const rows = useMemo(() => {
  const q = query.trim().toLowerCase();

  if (!q) return audits;

  return audits.filter((audit) =>
    [
      audit.action,
      audit.target_str,
      audit.target_model,
      audit.admin_username,
    ].some((value) =>
      String(value ?? "").toLowerCase().includes(q)
    )
  );
}, [audits, query]);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Audit log"
        title="Activity"
        description="A record of every staff action in the workspace, newest first."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          label="Recent actions"
          value={String(audits.length)}
          icon={History}
          note="Last 100 entries"
        />

        <MetricCard
          label="Today"
          value={String(today)}
          icon={History}
          note="Actions since midnight"
          accent="success"
        />

        <MetricCard
          label="Staff involved"
          value={String(actors)}
          icon={UserCog}
          note="Distinct team members"
        />
      </div>

      <Panel>
        <PanelHeader
          title="Activity trail"
          subtitle={`${rows.length} of ${audits.length} entries shown`}
          action={
            <div className="relative w-full sm:w-64">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />

              <Input
                className="pl-8"
                placeholder="Search action, target or staff"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search activity"
              />
            </div>
          }
        />

        {isPending ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        ) : (
          <TableWrap>
            <thead>
              <tr>
                <Th>Action</Th>
                <Th>Target</Th>
                <Th>Staff</Th>
                <Th>When</Th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <EmptyRow colSpan={4} message="No activity recorded yet." />
              ) : (
                rows.map((audit) => (
                  <tr
                    key={audit.id}
                    className="transition-colors hover:bg-muted/40"
                  >
                    <Td className="font-medium">{audit.action}</Td>

                    <Td className="text-muted-foreground">
                      {audit.target_str || "—"}
                    </Td>

                    <Td>
                      <span className="flex items-center gap-2.5">
                        <Monogram
                          name={audit.admin_username || "Unknown"}
                          className="h-8 w-8"
                        />

                        <span className="truncate">
                          {audit.admin_username || "Unknown"}
                        </span>
                      </span>
                    </Td>

                    <Td className="whitespace-nowrap text-muted-foreground">
                      {dateTime(audit.timestamp)}
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </TableWrap>
        )}
      </Panel>
    </AppShell>
  );
}

export default AuditPage;
