import { Navigate, Route, Routes } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";

import NotFound from "./routes/NotFound";
import { LoginPage } from "./routes/Auth";
import Marketing from "./routes/Marketing";
import Dashboard from "./routes/Dashboard";
import { CustomersPage } from "./routes/Customers";
import { PackagesPage } from "./routes/Packages";

const sectionRoutes = [
  ["/dashboard", "dashboard"],
  ["/invoices", "invoices"],
  ["/payments", "payments"],
  ["/network", "network"],
  ["/tickets", "tickets"],
  ["/audit-log", "audit-log"],
  ["/settings", "settings"],
];

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Marketing />} />

      <Route path="/login" element={<LoginPage />} />

      {sectionRoutes.map(([path, section]) => (
        <Route
          key={path}
          path={path}
          element={<Dashboard section={section} />}
        />
      ))}

      <Route
        path="/customers"
        element={<CustomersPage />}
      />

      <Route
        path="/packages"
        element={<PackagesPage />}
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

