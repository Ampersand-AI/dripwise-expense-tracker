
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import UploadPage from "./pages/UploadPage";
import ExpensesPage from "./pages/ExpensesPage";
import BudgetsPage from "./pages/BudgetsPage";
import ReportsPage from "./pages/ReportsPage";
import TaxPage from "./pages/TaxPage";
import SettingsPage from "./pages/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/budgets" element={<BudgetsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/tax" element={<TaxPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
