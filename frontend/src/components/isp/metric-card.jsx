import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

const accentClass = {
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  danger: "bg-danger-soft text-danger",
  warning: "bg-warning-soft text-warning",
};

export function MetricCard({ label, value, note, icon: Icon, accent = "primary", trend }) {
  const TrendIcon = trend === "down" ? ArrowDownRight : ArrowUpRight;
  return (
    <article className="rounded-xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-raised sm:p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-muted-foreground">{label}</p>
          <p className="numeric mt-2 truncate text-2xl font-semibold text-foreground">{value}</p>
        </div>
        <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg", accentClass[accent])}>
          <Icon size={17} aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
        {trend ? (
          <TrendIcon
            size={13}
            aria-hidden="true"
            className={trend === "down" ? "text-danger" : "text-success"}
          />
        ) : null}
        <span className="truncate">{note}</span>
      </p>
    </article>
  );
}