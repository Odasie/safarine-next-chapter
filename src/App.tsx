import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { UnifiedAuthProvider } from "@/contexts/UnifiedAuthContext";
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
import { TourDashboard } from "./pages/admin/TourDashboard";
import { TourCreationWizard } from "./pages/admin/TourCreationWizard";
import AdminDashboard from "./pages/admin/AdminDashboard";
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
              <UnifiedAuthProvider>
                <Routes>
                  {/* B2B Routes - No authentication required */}
                  <Route path="/pro" element={
                    <ProLayout>
                      <ProDashboard />
                    </ProLayout>
                  } />
                  <Route path="/:locale/pro" element={
                    <ProLayout>
                      <ProDashboard />
                    </ProLayout>
                  } />
                  <Route path="/pro/dashboard" element={
                    <ProLayout>
                      <ProDashboard />
                    </ProLayout>
                  } />
                  <Route path="/:locale/pro/dashboard" element={
                    <ProLayout>
                      <ProDashboard />
                    </ProLayout>
                  } />
                  <Route path="/pro/tours" element={
                    <ProLayout>
                      <ProTours />
                    </ProLayout>
                  } />
                  <Route path="/:locale/pro/tours" element={
                    <ProLayout>
                      <ProTours />
                    </ProLayout>
                  } />

                  {/* Admin Routes - No authentication required */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/:locale/admin" element={<AdminDashboard />} />
                  
                  {/* Locale-specific routes */}
                  <Route path="/:locale" element={<MainLayout />}>
                    <Route index element={<Index />} />
                    <Route path="tours" element={<ToursList />} />
                    <Route path="tours/:slug" element={<TourDetail />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="admin/import" element={<AdminImport />} />
                    <Route path="admin/csv-import" element={<AdminCSVImport />} />
                    <Route path="admin/tours" element={<TourDashboard />} />
                    <Route path="admin/tours/create" element={<TourCreationWizard />} />
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
                    <Route path="/admin/tours" element={<TourDashboard />} />
                    <Route path="/admin/tours/create" element={<TourCreationWizard />} />
                  </Route>
                  
                  {/* Catch-all */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </UnifiedAuthProvider>
            </CurrencyProvider>
          </LocaleProvider>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;