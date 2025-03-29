import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { setupDarkMode } from "@/lib/utils";
import { useAuth } from "@clerk/clerk-react";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import UploadPage from "./pages/UploadPage";
import ExpensesPage from "./pages/ExpensesPage";
import BudgetsPage from "./pages/BudgetsPage";
import ReportsPage from "./pages/ReportsPage";
import TaxPage from "./pages/TaxPage";
import SettingsPage from "./pages/SettingsPage";

// Auth Components
import SignInPage from "./components/auth/SignInPage";
import SignUpPage from "./components/auth/SignUpPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Setup dark mode on component mount
    setupDarkMode();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/sign-in/*" element={<SignInPage />} />
              <Route path="/sign-up/*" element={<SignUpPage />} />
              
              {/* Protected routes */}
              <Route 
                path="/upload" 
                element={
                  <ProtectedRoute>
                    <UploadPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/expenses" 
                element={
                  <ProtectedRoute>
                    <ExpensesPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/budgets" 
                element={
                  <ProtectedRoute>
                    <BudgetsPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/reports" 
                element={
                  <ProtectedRoute>
                    <ReportsPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/tax" 
                element={
                  <ProtectedRoute>
                    <TaxPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
