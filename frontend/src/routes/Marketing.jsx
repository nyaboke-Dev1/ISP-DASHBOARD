import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  CreditCard,
  FileText,
  Headset,
  History,
  Network,
  Users,
  Wifi,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import heroImage from "@/assets/swiftnet-hero.jpg";
import coverageImage from "@/assets/service-coverage-illustration.png";

const capabilities = [
  {
    icon: Users,
    title: "Subscribers",
    copy: "Keep customer accounts, locations, service status and assigned plans together.",
  },
  {
    icon: Wifi,
    title: "Packages",
    copy: "See plan speeds, prices and billing cycles alongside your subscriber base.",
  },
  {
    icon: FileText,
    title: "Invoices",
    copy: "Stay on top of billing, due dates and outstanding balances.",
  },
  {
    icon: CreditCard,
    title: "Payments",
    copy: "Follow M-Pesa confirmations and manual receipts in the same place as invoices.",
  },
  {
    icon: Network,
    title: "Network usage",
    copy: "Read upload and download trends without losing sight of the customers behind them.",
  },
  {
    icon: Headset,
    title: "Support & accountability",
    copy: "Track ticket priorities and assignments, with an audit trail of staff activity.",
  },
];

export function Marketing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="relative z-20 border-b border-sidebar-border bg-sidebar text-sidebar-accent-foreground">
        <div className="mx-auto flex h-16 max-w-[88rem] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-2.5"
            aria-label="Swift-Net home"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Activity size={18} aria-hidden="true" />
            </span>

            <span className="min-w-0 leading-tight">
              <span className="block font-display text-base font-bold">
                Swift-Net
              </span>
              <span className="block text-[10px] text-sidebar-foreground">
                ISP Operations
              </span>
            </span>
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-7 text-sm font-medium text-sidebar-foreground md:flex"
          >
            <a
              href="#platform"
              className="transition-colors hover:text-sidebar-primary"
            >
              Platform
            </a>

            <a
              href="#workflow"
              className="transition-colors hover:text-sidebar-primary"
            >
              How it works
            </a>
          </nav>

          <Button asChild size="sm" className="shrink-0">
            <Link to="/login">
              Operator Login
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative isolate flex min-h-[480px] items-center overflow-hidden bg-hero text-hero-foreground sm:min-h-[540px] lg:min-h-[580px]">
          <img
            src={heroImage}
            alt="Network operations team monitoring connectivity and equipment"
            width={1600}
            height={1008}
            className="absolute inset-0 -z-20 h-full w-full object-cover object-[62%_center]"
            fetchPriority="high"
          />

          <div
            className="absolute inset-0 -z-10 bg-hero-overlay"
            aria-hidden="true"
          />

          <div className="mx-auto w-full max-w-[88rem] px-5 py-16 sm:px-8 lg:px-12">
            <div className="max-w-[42rem]">
              <p className="mb-6 flex items-center gap-2 text-xs font-bold uppercase text-primary">
                <span className="h-2 w-2 rounded-full bg-primary" />
                ISP operating system
              </p>

              <h1 className="font-display text-primary-foreground text-5xl font-bold leading-[1.06] sm:text-6xl lg:text-7xl">
                Swift-Net
              </h1>

              <p className="mt-5 max-w-[37rem] font-display text-primary-foreground text-2xl font-medium leading-tight sm:text-3xl">
                Run your whole network from one calm workspace.
              </p>

              <p className="mt-5 max-w-[34rem] leading-7 text-primary-foreground">
                Bring subscribers, service packages, billing, payments,
                traffic and support into a single workspace built for ISP
                teams.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <Link to="/dashboard">
                    Request a Tour
                    <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                </Button>

                <a
                  href="#platform"
                  className="inline-flex h-10 items-center gap-1.5 px-2 text-sm font-semibold text-hero-foreground transition hover:text-hero-accent"
                >

                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Platform capabilities */}
        <section
          id="platform"
          className="border-b border-border bg-card px-5 py-16 sm:px-8 lg:px-12 lg:py-20"
        >
          <div className="mx-auto max-w-[88rem]">
            <div className="mb-9 max-w-2xl">
              <p className="text-xs font-bold uppercase text-primary">
                The platform
              </p>

              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">
                Everything your team needs to keep service moving.
              </h2>

              <p className="mt-3 text-base leading-7 text-muted-foreground">
                See the commercial and operational picture together, rather
                than switching between disconnected records.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map(({ icon: Icon, title, copy }, index) => (
                <article
                  key={title}
                  className="min-h-48 rounded-lg border border-border bg-card p-6 shadow-card transition-colors hover:border-primary/40"
                >
                  <div className="mb-6 flex items-start justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-md bg-primary-soft text-primary">
                      <Icon size={19} aria-hidden="true" />
                    </span>

                    <span className="text-xs tabular-nums text-muted-foreground">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-semibold">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {copy}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section
          id="workflow"
          className="px-5 py-16 sm:px-8 lg:px-12 lg:py-20"
        >
          <div className="mx-auto grid max-w-[88rem] items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div className="overflow-hidden rounded-lg border border-border bg-muted">
              <img
                src={coverageImage}
                alt="Illustration of a connected service coverage area"
                loading="lazy"
                className="aspect-[4/3] h-full w-full object-cover"
              />
            </div>

            <div>
              <p className="text-xs font-bold uppercase text-primary">
                A connected workflow
              </p>

              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">
                From customer sign-up to the next support request.
              </h2>

              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Swift-Net puts the information behind each service decision
                within reach, so your team can follow the whole customer
                journey.
              </p>

              <ul className="mt-7 space-y-4 text-sm leading-6">
                {[
                  "Find a subscriber and the package they use.",
                  "Review an invoice and its related payment.",
                  "Check network activity and follow up on a support ticket.",
                  "Keep a record of changes in the audit log.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success-soft text-success">
                      <Check size={12} aria-hidden="true" />
                    </span>

                    {item}
                  </li>
                ))}
              </ul>

              
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="border-y border-border bg-card px-5 py-14 sm:px-8 lg:px-12">
          <div className="mx-auto flex max-w-[88rem] flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-primary">
                Explore Swift-Net
              </p>

              <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
                See the full operating picture.
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Take a look at the workspace screens with sample content.
              </p>
            </div>

            
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-sidebar-border bg-sidebar px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[88rem] flex-wrap items-center justify-between gap-4 text-xs text-sidebar-foreground">
          <span className="flex items-center gap-2 font-semibold text-sidebar-accent-foreground">
            <Activity
              size={16}
              className="text-sidebar-primary"
              aria-hidden="true"
            />
            Swift-Net · ISP Operations
          </span>

          <span className="flex items-center gap-4">
            <Link to="/dashboard" className="hover:text-sidebar-primary">
              Workspace
            </Link>

            <span className="flex items-center gap-1">
              <BarChart3 size={13} aria-hidden="true" />
              Operations at a glance
            </span>

            <History size={14} aria-hidden="true" />
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Marketing;