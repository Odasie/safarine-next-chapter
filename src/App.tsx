
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { B2BAuthProvider } from "@/contexts/B2BAuthContext";
import { B2BProtectedRoute } from "@/components/b2b/B2BProtectedRoute";
import MainLayout from "@/layouts/MainLayout";
import ProLayout from "@/layouts/ProLayout";
import Index from "./pages/Index";
import ToursList from "./pages/ToursList";
import TourDetail from "./pages/TourDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminImport from "./pages/AdminImport";
import AdminCSVImport from "./pages/AdminCSVImport";
import ProLogin from "./pages/pro/ProLogin";
import ProDashboard from "./pages/pro/ProDashboard";
import ProTours from "./pages/pro/ProTours";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_relativeSplatPath: true }}>
          <LocaleProvider>
            <CurrencyProvider>
              <B2BAuthProvider>
                <Routes>
                  {/* B2B Routes */}
                  <Route path="/pro/login" element={<ProLogin />} />
                  <Route path="/:locale/pro/login" element={<ProLogin />} />
                  <Route path="/pro" element={<ProLogin />} />
                  <Route path="/:locale/pro" element={<ProLogin />} />
                  
                  {/* Protected B2B Routes */}
                  <Route path="/pro/dashboard" element={
                    <B2BProtectedRoute>
                      <ProLayout />
                    </B2BProtectedRoute>
                  }>
                    <Route index element={<ProDashboard />} />
                  </Route>
                  <Route path="/:locale/pro/dashboard" element={
                    <B2BProtectedRoute>
                      <ProLayout />
                    </B2BProtectedRoute>
                  }>
                    <Route index element={<ProDashboard />} />
                  </Route>
                  <Route path="/pro/tours" element={
                    <B2BProtectedRoute>
                      <ProLayout />
                    </B2BProtectedRoute>
                  }>
                    <Route index element={<ProTours />} />
                  </Route>
                  <Route path="/:locale/pro/tours" element={
                    <B2BProtectedRoute>
                      <ProLayout />
                    </B2BProtectedRoute>
                  }>
                    <Route index element={<ProTours />} />
                  </Route>

                  {/* Locale-specific routes */}
                  <Route path="/:locale" element={<MainLayout />}>
                    <Route index element={<Index />} />
                    <Route path="tours" element={<ToursList />} />
                    <Route path="tours/:slug" element={<TourDetail />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="admin/import" element={<AdminImport />} />
                    <Route path="admin/csv-import" element={<AdminCSVImport />} />
                  </Route>
                  
                  {/* Default routes (redirect to French) */}
                  <Route element={<MainLayout />}>
                    <Route index element={<Index />} />
                    <Route path="/tours" element={<ToursList />} />
                    <Route path="/tours/:slug" element={<TourDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/admin/import" element={<AdminImport />} />
                    <Route path="/admin/csv-import" element={<AdminCSVImport />} />
                  </Route>
                  
                  {/* Catch-all */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </B2BAuthProvider>
            </CurrencyProvider>
          </LocaleProvider>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
