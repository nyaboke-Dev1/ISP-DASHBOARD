import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Gauge, Pencil, Plus, Power, Users } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PackageDialog } from "@/components/isp/package-dialog";
import { PageHeader, Panel, StatusPill } from "@/components/isp/ui";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  money,
  titleCase,
  togglePackageActive,
} from "@/lib/isp";
import {
  useActorName,
  useWorkspace,
  useWorkspaceAction,
} from "@/hooks/use-workspace";

function PackagesPage() {
  const { data, isLoading } = useWorkspace();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const actor = useActorName();

  const toggle = useWorkspaceAction(
    (pkg) => togglePackageActive(pkg, actor),
    "Package availability updated"
  );

  const packages = data?.packages ?? [];
  const customers = data?.customers ?? [];

  const subscribers = useMemo(() => {
    const map = new Map();

    for (const c of customers) {
      if (c.package_id == null) continue;

      map.set(
        c.package_id,
        (map.get(c.package_id) ?? 0) + 1
      );
    }

    return map;
  }, [customers]);

  const totalAssigned = customers.filter(
    (c) => c.package_id != null
  ).length;

  const monthlyRecurring = customers.reduce((sum, c) => {
    if (c.status !== "active") return sum;

    const pkg = packages.find(
      (p) => p.id === c.package_id
    );

    return sum + Number(pkg?.price ?? 0);
  }, 0);

  const openNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (pkg) => {
    setEditing(pkg);
    setDialogOpen(true);
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Packages"
        title="Service packages"
        description="Speeds, pricing and billing cycles for every plan you sell — plus how many subscribers are on each."
        action={
          <Button className="gap-2" onClick={openNew}>
            <Plus
              className="h-4 w-4"
              aria-hidden="true"
            />
            New package
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryTile
          label="Plans"
          value={String(packages.length)}
          hint={`${packages.filter((p) => p.is_active).length} active`}
        />

        <SummaryTile
          label="Subscribed customers"
          value={String(totalAssigned)}
          hint={`${customers.length} total accounts`}
        />

        <SummaryTile
          label="Recurring revenue"
          value={money(monthlyRecurring)}
          hint="From active subscribers"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-56 w-full rounded-xl"
            />
          ))}
        </div>
      ) : packages.length === 0 ? (
        <Panel className="px-6 py-14 text-center">
          <p className="text-sm text-muted-foreground">
            No packages yet. Create your first plan to start
            assigning it to customers.
          </p>

          <Button
            className="mt-4 gap-2"
            onClick={openNew}
          >
            <Plus
              className="h-4 w-4"
              aria-hidden="true"
            />
            New package
          </Button>
        </Panel>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {packages.map((pkg) => {
            const count = subscribers.get(pkg.id) ?? 0;

            const share = totalAssigned
              ? Math.round((count / totalAssigned) * 100)
              : 0;

            return (
              <Panel
                key={pkg.id}
                className="flex flex-col p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold text-foreground">
                      {pkg.name}
                    </h2>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Billed {titleCase(pkg.billing_cycle)}
                    </p>
                  </div>

                  <StatusPill
                    value={
                      pkg.is_active
                        ? "Active"
                        : "Inactive"
                    }
                    tone={
                      pkg.is_active
                        ? "success"
                        : "neutral"
                    }
                  />
                </div>

                <p className="mt-4 text-2xl font-semibold tabular-nums text-foreground">
                  {money(pkg.price)}

                  <span className="ml-1 text-xs font-medium text-muted-foreground">
                    / {pkg.billing_cycle}
                  </span>
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-primary-soft px-2 py-1 font-semibold text-primary">
                    <Gauge
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                    {pkg.speed_mbps} Mbps
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 font-semibold text-muted-foreground">
                    <Users
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                    {count}{" "}
                    {count === 1
                      ? "subscriber"
                      : "subscribers"}
                  </span>
                </div>

                {pkg.description ? (
                  <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                    {pkg.description}
                  </p>
                ) : null}

                <div className="mt-4">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${share}%` }}
                    />
                  </div>

                  <p className="mt-1.5 text-[11px] text-muted-foreground">
                    {share}% of subscribed customers
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => openEdit(pkg)}
                  >
                    <Pencil
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    disabled={toggle.isPending}
                    onClick={() => toggle.mutate(pkg)}
                  >
                    <Power
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    />

                    {pkg.is_active
                      ? "Deactivate"
                      : "Activate"}
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    asChild
                    className="ml-auto"
                  >
                    <Link
                      to="/customers"
                      search={{
                        q: "",
                        status: "all",
                        pkg: String(pkg.id),
                        page: 1,
                      }}
                    >
                      View subscribers
                    </Link>
                  </Button>
                </div>
              </Panel>
            );
          })}
        </div>
      )}

      <PackageDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
      />
    </AppShell>
  );
}

function SummaryTile({ label, value, hint }) {
  return (
    <Panel className="p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>

      <p className="mt-1.5 text-xl font-semibold tabular-nums text-foreground">
        {value}
      </p>

      <p className="mt-0.5 text-xs text-muted-foreground">
        {hint}
      </p>
    </Panel>
  );
}
export { PackagesPage };
