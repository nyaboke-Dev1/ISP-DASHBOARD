import { Navigate, Route, Routes } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";

import NotFound from "./routes/NotFound";
import { LoginPage } from "./routes/Auth";
import  Marketing  from "./routes/Marketing";
import  Dashboard  from "./routes/Dashboard";
import { CustomersPage } from "./routes/Customers";
import { PackagesPage } from "./routes/Packages";
import { InvoicesPage } from "./routes/Invoices";
import { PaymentsPage } from "./routes/Payments";
import {TicketsPage} from "./routes/Tickets";
import {NetworkPage} from "./routes/Network";
import {AuditPage} from "./routes/Audit";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Marketing />} />

      <Route path="/login" element={<LoginPage />} />

      {/* Dashboard-style pages */}
      <Route
        path="/dashboard"
        element={<Dashboard section="dashboard" />}
      />

      <Route
        path="/settings"
        element={<Dashboard section="settings" />}
      />

      {/* Individual pages */}
      <Route
        path="/customers"
        element={<CustomersPage />}
      />

      <Route
        path="/packages"
        element={<PackagesPage />}
      />

      <Route
        path="/invoices"
        element={<InvoicesPage />}
      />

      <Route
        path="/payments"
        element={<PaymentsPage />}
      />

      <Route
        path="/network"
        element={<NetworkPage />}
      />

      <Route
        path="/tickets"
        element={<TicketsPage />}
      />

      <Route
        path="/audit"
        element={<AuditPage />}
      />

      <Route
        path="/404"
        element={<NotFound />}
      />

      <Route
        path="*"
        element={<Navigate to="/404" replace />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster position="top-right" richColors />
            <AppRoutes />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

