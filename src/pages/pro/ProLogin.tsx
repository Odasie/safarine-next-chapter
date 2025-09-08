import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useUnifiedAuth } from "@/contexts/UnifiedAuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AlertCircle } from "lucide-react";

const ProLogin = () => {
  const { user, signIn, signUpB2B, loading } = useUnifiedAuth();
  const { t, locale } = useLocale();
  const location = useLocation();
  
  // Login form state
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  
  // Register form state
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    company_name: "",
    contact_person: "",
    phone: "",
    business_registration: "",
    agency_type: "",
    country: ""
  });
  const [registerError, setRegisterError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Redirect if already authenticated with B2B access
  if (user && user.profile.user_type === 'b2b' && user.b2b?.status === 'approved' && !loading) {
    const urlParams = new URLSearchParams(location.search);
    const from = urlParams.get('from') || `/${locale}/pro/dashboard`;
    return <Navigate to={from} replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        setLoginError(error.message || 'Login failed');
      } else {
        // Successful login - redirect to intended destination
        const urlParams = new URLSearchParams(location.search);
        const from = urlParams.get('from') || `/${locale}/pro/dashboard`;
        window.location.href = from; // Force navigation to ensure proper redirect
      }
    } catch (err) {
      setLoginError('Login failed. Please try again.');
    }
    
    setLoginLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterLoading(true);

    // Input validation
    if (!registerData.email || !registerData.password || !registerData.contact_person || !registerData.company_name) {
      setRegisterError('Please fill in all required fields');
      setRegisterLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
      setRegisterError('Please enter a valid email address');
      setRegisterLoading(false);
      return;
    }

    // Password validation (consistent with edge function)
    if (registerData.password.length < 8) {
      setRegisterError('Password must be at least 8 characters long');
      setRegisterLoading(false);
      return;
    }

    try {
      const { error } = await signUpB2B({
        email: registerData.email,
        password: registerData.password,
        contactPerson: registerData.contact_person,
        companyName: registerData.company_name,
        phone: registerData.phone,
        country: registerData.country,
        agencyType: registerData.agency_type,
        businessRegistration: registerData.business_registration
      });
      
      if (error) {
        setRegisterError(error.message || 'Registration failed. Please try again.');
      } else {
        setRegisterSuccess(true);
        setRegisterData({
          email: "",
          password: "",
          company_name: "",
          contact_person: "",
          phone: "",
          business_registration: "",
          agency_type: "",
          country: ""
        });
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setRegisterError('Registration failed. Please try again.');
    }
    
    setRegisterLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t('b2b.login.pageTitle')}</title>
        <meta name="description" content={t('b2b.login.pageDescription')} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              {t('b2b.login.title')}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {t('b2b.login.subtitle')}
            </p>
          </div>

          <Card>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">{t('b2b.login.loginTab')}</TabsTrigger>
                <TabsTrigger value="register">{t('b2b.login.registerTab')}</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <CardHeader>
                  <CardTitle>{t('b2b.login.loginTitle')}</CardTitle>
                  <CardDescription>{t('b2b.login.loginDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    {loginError && (
                      <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        {loginError}
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="login-email">{t('b2b.form.email')}</Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="login-password">{t('b2b.form.password')}</Label>
                      <Input
                        id="login-password"
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={loginLoading}>
                      {loginLoading ? <LoadingSpinner size="sm" /> : t('b2b.login.loginButton')}
                    </Button>
                  </form>
                </CardContent>
              </TabsContent>

              <TabsContent value="register">
                <CardHeader>
                  <CardTitle>{t('b2b.login.registerTitle')}</CardTitle>
                  <CardDescription>{t('b2b.login.registerDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  {registerSuccess ? (
                    <div className="text-center py-6">
                      <div className="mb-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                        <h3 className="font-medium text-primary mb-2">
                          {t('b2b.register.successTitle')}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {t('b2b.register.successMessage')}
                        </p>
                      </div>
                      <Button 
                        onClick={() => setRegisterSuccess(false)}
                        variant="outline"
                      >
                        {t('b2b.register.backToRegister')}
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleRegister} className="space-y-4">
                      {registerError && (
                        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                          <AlertCircle className="h-4 w-4" />
                          {registerError}
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contact-person">{t('b2b.form.contactPerson')}</Label>
                          <Input
                            id="contact-person"
                            value={registerData.contact_person}
                            onChange={(e) => setRegisterData(prev => ({ ...prev, contact_person: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company-name">{t('b2b.form.companyName')}</Label>
                          <Input
                            id="company-name"
                            value={registerData.company_name}
                            onChange={(e) => setRegisterData(prev => ({ ...prev, company_name: e.target.value }))}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="register-email">{t('b2b.form.email')}</Label>
                        <Input
                          id="register-email"
                          type="email"
                          value={registerData.email}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="register-password">{t('b2b.form.password')}</Label>
                        <Input
                          id="register-password"
                          type="password"
                          value={registerData.password}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                          required
                          minLength={8}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">{t('b2b.form.phone')}</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={registerData.phone}
                            onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">{t('b2b.form.country')}</Label>
                          <Input
                            id="country"
                            value={registerData.country}
                            onChange={(e) => setRegisterData(prev => ({ ...prev, country: e.target.value }))}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="agency-type">{t('b2b.form.agencyType')}</Label>
                        <Select 
                          value={registerData.agency_type}
                          onValueChange={(value) => setRegisterData(prev => ({ ...prev, agency_type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t('b2b.form.selectAgencyType')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tour-operator">{t('b2b.agencyTypes.tourOperator')}</SelectItem>
                            <SelectItem value="travel-agency">{t('b2b.agencyTypes.travelAgency')}</SelectItem>
                            <SelectItem value="online-travel">{t('b2b.agencyTypes.onlineTravel')}</SelectItem>
                            <SelectItem value="corporate-travel">{t('b2b.agencyTypes.corporateTravel')}</SelectItem>
                            <SelectItem value="other">{t('b2b.agencyTypes.other')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="business-registration">{t('b2b.form.businessRegistration')}</Label>
                        <Input
                          id="business-registration"
                          value={registerData.business_registration}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, business_registration: e.target.value }))}
                        />
                      </div>
                      
                      <Button type="submit" className="w-full" disabled={registerLoading}>
                        {registerLoading ? <LoadingSpinner size="sm" /> : t('b2b.login.registerButton')}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>

          <div className="text-center mt-6">
            <Link 
              to={`/${locale}`}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ← {t('b2b.login.backToWebsite')}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProLogin;
