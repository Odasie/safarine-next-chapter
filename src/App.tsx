
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { B2BAuthProvider } from "@/contexts/B2BAuthContext";
import { UserAuthProvider } from "@/contexts/UserAuthContext";
import { B2BProtectedRoute } from "@/components/b2b/B2BProtectedRoute";
import { UserProtectedRoute } from "@/components/auth/UserProtectedRoute";
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
import ProLogin from "./pages/pro/ProLogin";
import ProDashboard from "./pages/pro/ProDashboard";
import ProTours from "./pages/pro/ProTours";
import Auth from "./pages/Auth";
import UserProfile from "./pages/UserProfile";

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
              <UserAuthProvider>
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

                  {/* User Authentication Routes */}
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/:locale/auth" element={<Auth />} />
                  
                  {/* Locale-specific routes */}
                  <Route path="/:locale" element={<MainLayout />}>
                    <Route index element={<Index />} />
                    <Route path="tours" element={<ToursList />} />
                    <Route path="tours/:slug" element={<TourDetail />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="profile" element={
                      <UserProtectedRoute>
                        <UserProfile />
                      </UserProtectedRoute>
                    } />
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
                    <Route path="/profile" element={
                      <UserProtectedRoute>
                        <UserProfile />
                      </UserProtectedRoute>
                    } />
                    <Route path="/admin/import" element={<AdminImport />} />
                    <Route path="/admin/csv-import" element={<AdminCSVImport />} />
                    <Route path="/admin/tours" element={<TourDashboard />} />
                    <Route path="/admin/tours/create" element={<TourCreationWizard />} />
                  </Route>
                  
                  {/* Catch-all */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                </B2BAuthProvider>
              </UserAuthProvider>
            </CurrencyProvider>
          </LocaleProvider>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
