import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import heroImage from "@/assets/swiftnet-hero.jpg";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    toast.info("Enter your login credentials.", {
      description: "The operator service has not been connected yet.",
    });
  }

  return (
    <main className="min-h-screen bg-background lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="flex min-h-[560px] flex-col px-5 py-7 sm:px-10 lg:min-h-screen lg:px-14 lg:py-10 xl:px-20">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex min-w-0 items-center gap-2.5 text-foreground"
            aria-label="Swift-Net home"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Activity size={18} aria-hidden="true" />
            </span>

            <span className="font-display text-base font-bold">
              Swift-Net
            </span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Back to site
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-12 lg:py-16">
          <p className="flex items-center gap-2 text-xs font-bold uppercase text-primary">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Operator access
          </p>

          <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            Welcome back to Swift-Net.
          </h1>

          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Sign in to your ISP operations workspace.
          </p>

          {/* <div
            className="mt-7 border-l-2 border-primary bg-primary-soft/60 px-4 py-3 text-sm leading-6 text-foreground"
            role="status"
          >
            Preview only — sign-in is not connected. Please don’t enter real
            credentials.
          </div> */}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>

              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="off"
                placeholder="Your operator username"
                required
                className="h-11 bg-card px-3.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <div className="relative">
                <LockKeyhole
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />

                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="off"
                  placeholder="Enter your password"
                  required
                  className="h-11 bg-card pl-10 pr-11"
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  title={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-1 top-1 h-9 w-9 text-muted-foreground hover:text-primary"
                >
                  {showPassword ? (
                    <EyeOff aria-hidden="true" />
                  ) : (
                    <Eye aria-hidden="true" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="h-11 w-full font-semibold"
            >
              Sign in
              <ArrowRight aria-hidden="true" />
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Operator access · Workspace preview
          </p>
        </div>
      </section>

      <aside className="relative isolate hidden min-h-screen flex-col justify-between overflow-hidden bg-hero p-10 text-hero-foreground lg:flex xl:p-16">
        <img
          src={heroImage}
          alt="Network operations team monitoring connectivity"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[62%_center]"
        />

        <div
          className="absolute inset-0 -z-10 bg-hero-overlay"
          aria-hidden="true"
        />

        <span className="text-xs font-bold uppercase text-hero-accent">
          ISP Operations
        </span>

        <div className="max-w-lg">
          <h2 className="font-display text-4xl font-semibold leading-tight text-white xl:text-5xl">
            One clear view of the business behind your network.
          </h2>

          <p className="mt-5 max-w-md text-sm leading-7 text-primary-foreground">
            Subscribers, billing, network activity and support in one calm
            workspace.
          </p>
        </div>

        <p className="flex items-center gap-2 text-xs font-medium text-primary-foreground">
          <ShieldCheck
            size={16}
            className="text-hero-accent"
            aria-hidden="true"
          />
          Swift-Net · ISP Operations
        </p>
      </aside>
    </main>
  );
}
