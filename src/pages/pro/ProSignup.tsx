import React, { useState } from 'react';
import { useSignUp } from '@clerk/clerk-react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Building, User, Mail, Phone, Globe, FileText } from 'lucide-react';

const ProSignup: React.FC = () => {
  const { signUp, isLoaded } = useSignUp();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Form data state
  const [formData, setFormData] = useState({
    // User info
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    
    // Company info
    companyName: '',
    agencyType: '',
    businessRegistration: '',
    country: '',
    message: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded) return;
    
    setIsLoading(true);
    
    try {
      // Create Clerk account with B2B metadata
      const result = await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        unsafeMetadata: {
          role: 'b2b',
          companyName: formData.companyName,
          agencyType: formData.agencyType,
          businessRegistration: formData.businessRegistration,
          country: formData.country,
          phone: formData.phone,
          message: formData.message,
          status: 'pending'
        }
      });

      // Send verification email
      await result.prepareEmailAddressVerification({
        strategy: 'email_code'
      });

      toast({
        title: 'Application Submitted Successfully',
        description: 'Please check your email to verify your account. We will review your application within 24-48 hours.',
      });

      // Redirect to verification or success page
      navigate('/pro/login');

    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error.errors?.[0]?.message || 'Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 2) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4 py-8">
      <Helmet>
        <title>B2B Registration - Safarine Professional Network</title>
        <meta name="description" content="Join Safarine's professional network for exclusive B2B rates and access" />
      </Helmet>
      
      <div className="w-full max-w-2xl">
        {/* Branding Header */}
        <div className="text-center mb-8">
          <img 
            src="/images/branding/logo-dark.webp" 
            alt="Safarine Logo" 
            className="h-12 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-900">Join Professional Network</h1>
          <p className="text-muted-foreground mt-2">
            Access exclusive B2B rates and professional travel agent resources
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {step === 1 ? <User className="h-5 w-5" /> : <Building className="h-5 w-5" />}
              {step === 1 ? 'Personal Information' : 'Company Information'}
            </CardTitle>
            <CardDescription>
              {step === 1 
                ? 'Please provide your contact details'
                : 'Tell us about your travel business'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                      minLength={8}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={nextStep}
                    className="w-full"
                    disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.password}
                  >
                    Continue to Company Information
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="agencyType">Agency Type *</Label>
                    <Select onValueChange={(value) => handleInputChange('agencyType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select agency type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="travel_agency">Travel Agency</SelectItem>
                        <SelectItem value="tour_operator">Tour Operator</SelectItem>
                        <SelectItem value="online_travel">Online Travel Agency</SelectItem>
                        <SelectItem value="corporate">Corporate Travel</SelectItem>
                        <SelectItem value="freelance">Freelance Agent</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessRegistration">Business Registration Number</Label>
                    <Input
                      id="businessRegistration"
                      type="text"
                      value={formData.businessRegistration}
                      onChange={(e) => handleInputChange('businessRegistration', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Select onValueChange={(value) => handleInputChange('country', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="GB">United Kingdom</SelectItem>
                        <SelectItem value="FR">France</SelectItem>
                        <SelectItem value="DE">Germany</SelectItem>
                        <SelectItem value="AU">Australia</SelectItem>
                        <SelectItem value="SG">Singapore</SelectItem>
                        <SelectItem value="TH">Thailand</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Tell us about your business (optional)</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Brief description of your travel business and requirements..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isLoading || !formData.companyName || !formData.agencyType || !formData.country}
                    >
                      {isLoading ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/pro/login" className="text-primary hover:text-primary/80 font-medium">
              Sign In
            </Link>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Applications are reviewed within 24-48 hours. You will receive email confirmation once approved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProSignup;