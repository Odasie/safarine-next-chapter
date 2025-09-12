import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { UnifiedAuthProvider } from "@/contexts/ClerkAuthContext";
import { AdminProtectedRoute } from "@/components/auth/AdminProtectedRoute";
import { B2BProtectedRoute } from "@/components/auth/B2BProtectedRoute";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ProLogin from "./pages/pro/ProLogin";
import ProSignup from "./pages/pro/ProSignup";
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
                  {/* B2B Authentication Routes */}
                  <Route path="/pro/login" element={<ProLogin />} />
                  <Route path="/pro/signup" element={<ProSignup />} />
                  
                  {/* Protected B2B Routes */}
                  <Route path="/pro" element={
                    <B2BProtectedRoute>
                      <ProLayout>
                        <ProDashboard />
                      </ProLayout>
                    </B2BProtectedRoute>
                  } />
                  <Route path="/:locale/pro" element={
                    <B2BProtectedRoute>
                      <ProLayout>
                        <ProDashboard />
                      </ProLayout>
                    </B2BProtectedRoute>
                  } />
                  <Route path="/pro/dashboard" element={
                    <B2BProtectedRoute>
                      <ProLayout>
                        <ProDashboard />
                      </ProLayout>
                    </B2BProtectedRoute>
                  } />
                  <Route path="/:locale/pro/dashboard" element={
                    <B2BProtectedRoute>
                      <ProLayout>
                        <ProDashboard />
                      </ProLayout>
                    </B2BProtectedRoute>
                  } />
                  <Route path="/pro/tours" element={
                    <B2BProtectedRoute>
                      <ProLayout>
                        <ProTours />
                      </ProLayout>
                    </B2BProtectedRoute>
                  } />
                  <Route path="/:locale/pro/tours" element={
                    <B2BProtectedRoute>
                      <ProLayout>
                        <ProTours />
                      </ProLayout>
                    </B2BProtectedRoute>
                  } />

                  {/* Admin Authentication Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  
                  {/* Protected Admin Routes */}
                  <Route path="/admin" element={
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  } />
                  <Route path="/:locale/admin" element={
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  } />
                  
                  {/* Locale-specific routes */}
                  <Route path="/:locale" element={<MainLayout />}>
                    <Route index element={<Index />} />
                    <Route path="tours" element={<ToursList />} />
                    <Route path="tours/:slug" element={<TourDetail />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="admin/import" element={
                      <AdminProtectedRoute>
                        <AdminImport />
                      </AdminProtectedRoute>
                    } />
                    <Route path="admin/csv-import" element={
                      <AdminProtectedRoute>
                        <AdminCSVImport />
                      </AdminProtectedRoute>
                    } />
                    <Route path="admin/tours" element={
                      <AdminProtectedRoute>
                        <TourDashboard />
                      </AdminProtectedRoute>
                    } />
                    <Route path="admin/tours/create" element={
                      <AdminProtectedRoute>
                        <TourCreationWizard />
                      </AdminProtectedRoute>
                    } />
                  </Route>
                  
                  {/* Default routes (redirect to French) */}
                  <Route element={<MainLayout />}>
                    <Route index element={<Index />} />
                    <Route path="/tours" element={<ToursList />} />
                    <Route path="/tours/:slug" element={<TourDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/admin/import" element={
                      <AdminProtectedRoute>
                        <AdminImport />
                      </AdminProtectedRoute>
                    } />
                    <Route path="/admin/csv-import" element={
                      <AdminProtectedRoute>
                        <AdminCSVImport />
                      </AdminProtectedRoute>
                    } />
                    <Route path="/admin/tours" element={
                      <AdminProtectedRoute>
                        <TourDashboard />
                      </AdminProtectedRoute>
                    } />
                    <Route path="/admin/tours/create" element={
                      <AdminProtectedRoute>
                        <TourCreationWizard />
                      </AdminProtectedRoute>
                    } />
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