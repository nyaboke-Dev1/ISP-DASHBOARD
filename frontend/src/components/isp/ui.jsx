import { cn } from "@/lib/utils";
import { initials } from "@/lib/isp";

/* ── Panel ─────────────────────────────────────────────────────────────── */

export function Panel({ className, children }) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-card text-card-foreground shadow-card",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function PanelHeader({ title, subtitle, action, className }) {
  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 border-b border-border px-4 py-4 sm:px-5",
        className,
      )}
    >
      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold text-foreground">{title}</h3>
        {subtitle ? (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/* ── Page header ───────────────────────────────────────────────────────── */

export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <header className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-1 text-2xl font-semibold text-foreground sm:text-[1.75rem]">{title}</h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

/* ── Status treatment ──────────────────────────────────────────────────── */

const toneClass = {
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
  neutral: "bg-muted text-muted-foreground",
};

const dotClass = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  neutral: "bg-muted-foreground",
};

export function statusTone(value) {
  const v = value.toLowerCase();
  if (["active", "paid", "closed", "low"].includes(v)) return "success";
  if (["unpaid", "pending", "open", "medium"].includes(v)) return "warning";
  if (["overdue", "suspended", "high"].includes(v)) return "danger";
  if (["in_progress", "in progress"].includes(v)) return "info";
  return "neutral";
}

export function StatusPill({ value, tone }) {
  const resolved = tone ?? statusTone(value);
  const label = value.replace(/_/g, " ");
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize",
        toneClass[resolved],
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dotClass[resolved])} aria-hidden="true" />
      {label}
    </span>
  );
}

export function PriorityDot({ priority }) {
  const tone = statusTone(priority);
  return (
    <span
      className={cn("h-2 w-2 shrink-0 rounded-full", dotClass[tone])}
      role="img"
      aria-label={`${priority} priority`}
    />
  );
}

/* ── Avatar ────────────────────────────────────────────────────────────── */

export function Monogram({ name, className }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-[11px] font-bold text-primary",
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}

/* ── Table primitives ──────────────────────────────────────────────────── */

export function TableWrap({ children }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[38rem] border-collapse text-left text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className }) {
  return (
    <th
      scope="col"
      className={cn(
        "border-b border-border bg-muted/60 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({ children, className }) {
  return (
    <td className={cn("border-b border-border px-4 py-3 align-middle text-foreground", className)}>
      {children}
    </td>
  );
}

export function EmptyRow({ colSpan, message }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-12 text-center text-sm text-muted-foreground">
        {message}
      </td>
    </tr>
  );
}