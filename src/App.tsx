
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import MainLayout from "@/layouts/MainLayout";
import Index from "./pages/Index";
import ToursList from "./pages/ToursList";
import TourDetail from "./pages/TourDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminImport from "./pages/AdminImport";
import AdminCSVImport from "./pages/AdminCSVImport";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <LocaleProvider>
            <CurrencyProvider>
              <Routes>
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
            </CurrencyProvider>
          </LocaleProvider>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
