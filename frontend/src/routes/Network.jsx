import { useMemo } from "react";
import {
  Activity,
  ArrowDownToLine,
  ArrowUpFromLine,
  Gauge,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
import { Skeleton } from "@/components/ui/skeleton";
import { gb, shortDate } from "@/lib/isp";
import { useWorkspace } from "@/hooks/use-workspace";
import { useRequireAuth } from "@/hooks/use-require-auth";

export function NetworkPage() {
  //useRequireAuth();

  const { data, isPending } = useWorkspace();

  const usage = data?.usage ?? [];
  const customers = data?.customers ?? [];

  const daily = useMemo(() => {
    const map = new Map();

    for (const row of usage) {
      const entry = map.get(row.stat_date) ?? {
        date: row.stat_date,
        upload: 0,
        download: 0,
      };

      entry.upload += Number(row.upload_mb);
      entry.download += Number(row.download_mb);

      map.set(row.stat_date, entry);
    }

    return Array.from(map.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14)
      .map((d) => ({
        label: shortDate(d.date),
        upload: Number((d.upload / 1024).toFixed(2)),
        download: Number((d.download / 1024).toFixed(2)),
      }));
  }, [usage]);

  const totals = useMemo(() => {
    const upload = usage.reduce(
      (sum, row) => sum + Number(row.upload_mb),
      0
    );

    const download = usage.reduce(
      (sum, row) => sum + Number(row.download_mb),
      0
    );

    const days =
      new Set(usage.map((row) => row.stat_date)).size || 1;

    return {
      upload,
      download,
      total: upload + download,
      average: (upload + download) / days,
    };
  }, [usage]);

  const topCustomers = useMemo(() => {
    const map = new Map();

    for (const row of usage) {
      if (row.customer_id == null) continue;

      const current = map.get(row.customer_id) ?? 0;

      map.set(
        row.customer_id,
        current +
          Number(row.upload_mb) +
          Number(row.download_mb)
      );
    }

    return Array.from(map.entries())
      .map(([id, mb]) => {
        const customer = customers.find((c) => c.id === id);

        return {
          id,
          name: customer?.name ?? "Unknown",
          location: customer?.location ?? "—",
          mb,
        };
      })
      .sort((a, b) => b.mb - a.mb)
      .slice(0, 8);
  }, [usage, customers]);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Network usage"
        title="Traffic"
        description="Daily upload and download volumes across the network, and the heaviest users."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total traffic"
          value={gb(totals.total)}
          icon={Activity}
          note="All recorded days"
        />

        <MetricCard
          label="Downloaded"
          value={gb(totals.download)}
          icon={ArrowDownToLine}
          note="Inbound to customers"
          accent="success"
        />

        <MetricCard
          label="Uploaded"
          value={gb(totals.upload)}
          icon={ArrowUpFromLine}
          note="Outbound from customers"
          accent="warning"
        />

        <MetricCard
          label="Daily average"
          value={gb(totals.average)}
          icon={Gauge}
          note="Across the network"
        />
      </div>

      <Panel>
        <PanelHeader
          title="Daily volume"
          subtitle="Upload and download in GB, last 14 recorded days"
        />

        <div className="p-4 sm:p-5">
          {isPending ? (
            <Skeleton className="h-72 w-full" />
          ) : daily.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              No usage has been recorded yet.
            </p>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={daily}
                  margin={{
                    top: 8,
                    right: 8,
                    left: -12,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="netDown"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="hsl(var(--chart-1))"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="100%"
                        stopColor="hsl(var(--chart-1))"
                        stopOpacity={0}
                      />
                    </linearGradient>

                    <linearGradient
                      id="netUp"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="hsl(var(--chart-2))"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="100%"
                        stopColor="hsl(var(--chart-2))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fontSize: 11,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                  />

                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fontSize: 11,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    unit=" GB"
                    width={60}
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--card))",
                      fontSize: 12,
                    }}
                    formatter={(value, name) => [
                      `${value} GB`,
                      name,
                    ]}
                  />

                  <Legend wrapperStyle={{ fontSize: 12 }} />

                  <Area
                    type="monotone"
                    dataKey="download"
                    name="Download"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    fill="url(#netDown)"
                  />

                  <Area
                    type="monotone"
                    dataKey="upload"
                    name="Upload"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    fill="url(#netUp)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </Panel>

      <Panel>
        <PanelHeader
          title="Heaviest users"
          subtitle="Total traffic per customer"
        />

        {isPending ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <TableWrap>
            <thead>
              <tr>
                <Th>Customer</Th>
                <Th>Location</Th>
                <Th className="text-right">Total traffic</Th>
                <Th className="text-right">Share</Th>
              </tr>
            </thead>

            <tbody>
              {topCustomers.length === 0 ? (
                <EmptyRow
                  colSpan={4}
                  message="No per-customer usage recorded yet."
                />
              ) : (
                topCustomers.map((row) => (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-muted/40"
                  >
                    <Td>
                      <span className="flex items-center gap-2.5">
                        <Monogram
                          name={row.name}
                          className="h-8 w-8"
                        />

                        <span className="truncate">
                          {row.name}
                        </span>
                      </span>
                    </Td>

                    <Td className="text-muted-foreground">
                      {row.location || "—"}
                    </Td>

                    <Td className="text-right tabular-nums">
                      {gb(row.mb)}
                    </Td>

                    <Td className="text-right tabular-nums text-muted-foreground">
                      {totals.total
                        ? `${(
                            (row.mb / totals.total) *
                            100
                          ).toFixed(1)}%`
                        : "—"}
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

export default NetworkPage;

