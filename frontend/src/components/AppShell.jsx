import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  Boxes,
  CreditCard,
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  Network,
  Search,
  Settings,
  Ticket,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { initials } from "@/lib/isp";

const workspaceNav = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Customers", url: "/customers", icon: Users },
  { title: "Packages", url: "/packages", icon: Boxes },
  { title: "Invoices", url: "/invoices", icon: FileText },
  { title: "Payments", url: "/payments", icon: CreditCard },
  { title: "Network usage", url: "/network", icon: Network },
  { title: "Support tickets", url: "/tickets", icon: Ticket },
  { title: "Audit log", url: "/audit", icon: History },
];

const accountNav = [{ title: "Settings", url: "/settings", icon: Settings }];

function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();

  const renderItems = (items) =>
    items.map((item) => (
      <SidebarMenuItem key={item.url}>
        <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
          <Link to={item.url} className="flex items-center gap-2.5">
            <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
        <Link to="/dashboard" className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Activity size={17} aria-hidden="true" />
          </span>
          {!collapsed && (
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-sidebar-accent-foreground">
                Swift-Net
              </span>
              <span className="block truncate text-[11px] tracking-wide text-sidebar-foreground/70">
                ISP Operations
              </span>
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(workspaceNav)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(accountNav)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Network status">
              <Link to="/network" className="flex items-center gap-2.5">
                <span className="grid h-4 w-4 shrink-0 place-items-center">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-sidebar-primary" />
                </span>
                <span className="truncate text-xs">All systems nominal</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function TopBar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, logout } = useAuth();
  const [term, setTerm] = useState("");
  const { pathname } = useLocation();
  const current =
    [...workspaceNav, ...accountNav].find((item) => item.url === pathname)?.title ?? "Workspace";

  // Replace the body of this with however your Django project logs users out —
  // e.g. calling your auth API's /logout/ endpoint and clearing tokens.
  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await logout();
    navigate("/auth", { replace: true });
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-3 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <SidebarTrigger className="shrink-0" />
          <nav aria-label="Breadcrumb" className="hidden min-w-0 sm:block">
            <ol className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <li>Workspace</li>
              <li aria-hidden="true">/</li>
              <li className="truncate font-semibold text-foreground">{current}</li>
            </ol>
          </nav>
        </div>

        <form
          className="min-w-0"
          onSubmit={(event) => {
            event.preventDefault();
            const params = new URLSearchParams({ q: term, status: "all", pkg: "all", page: 1 });
            navigate(`/customers?${params.toString()}`);
          }}
        >
          <label className="relative block">
            <span className="sr-only">Search customers</span>
            <Search
              size={15}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Search customers…"
              className="h-9 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/25"
            />
          </label>
        </form>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex shrink-0 items-center gap-2 rounded-lg p-1 pr-2 text-left transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-[11px] font-bold text-primary-foreground">
              {initials(user?.fullName ?? "Staff")}
            </span>
            <span className="hidden min-w-0 md:block">
              <span className="block max-w-[9rem] truncate text-xs font-semibold text-foreground">
                {user?.fullName ?? "Staff"}
              </span>
              <span className="block max-w-[9rem] truncate text-[11px] text-muted-foreground">
                {user?.email}
              </span>
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="truncate">{user?.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => void handleSignOut()}>
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export function AppShell({ children }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main className="min-w-0 flex-1 px-3 py-5 sm:px-6 sm:py-7">
            <div className="mx-auto w-full max-w-[88rem] space-y-5">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}