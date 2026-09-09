import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import NotFound from "./pages/NotFound";
import { LoginPage, RegisterPage } from "./pages/Auth";
import Console from "./pages/Console";
import Marketing from "./pages/Marketing";

const sectionRoutes = [
  ["/dashboard", "dashboard"],
  ["/clients", "clients"],
  ["/packages", "packages"],
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
      <Route path="/register" element={<RegisterPage />} />
      {sectionRoutes.map(([path, section]) => (
        <Route key={path} path={path} element={<Console section={section} />} />
      ))}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster position="top-right" richColors />
            <AppRoutes />
          </TooltipProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
