
import { Navigate, Route, Routes } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

import NotFound from "./routes/NotFound";
import { LoginPage } from "./routes/Auth";
import Marketing from "./routes/Marketing";
import Dashboard from "./routes/Dashboard";
import { CustomersPage } from "./routes/Customers";
import { PackagesPage } from "./routes/Packages";
import { InvoicesPage } from "./routes/Invoices";
import { PaymentsPage } from "./routes/Payments";
import { TicketsPage } from "./routes/Tickets";
import { NetworkPage } from "./routes/Network";
import { AuditPage } from "./routes/Audit";
import { SettingsPage } from "./routes/Settings";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Marketing />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/dashboard"
        element={<Dashboard section="dashboard" />}
      />

      <Route path="/customers" element={<CustomersPage />} />
      <Route path="/packages" element={<PackagesPage />} />
      <Route path="/invoices" element={<InvoicesPage />} />
      <Route path="/payments" element={<PaymentsPage />} />
      <Route path="/network" element={<NetworkPage />} />
      <Route path="/tickets" element={<TicketsPage />} />
      <Route path="/audit" element={<AuditPage />} />
      <Route path="/settings" element={<SettingsPage />} />

      <Route path="/404" element={<NotFound />} />

      {/* Unknown URLs show the not-found page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster position="top-right" richColors />
          <AppRoutes />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
