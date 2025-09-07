import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RegisterData {
  email: string;
  password: string;
  contactPerson: string;
  companyName: string;
  phone?: string;
  country?: string;
  agencyType?: string;
  businessRegistration?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    const registerData: RegisterData = await req.json();
    
    // Input validation
    if (!registerData.email || !registerData.password || !registerData.contactPerson || !registerData.companyName) {
      throw new Error('Missing required fields');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
      throw new Error('Invalid email format');
    }

    // Password strength validation
    if (registerData.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // Sanitize inputs
    const sanitizedData = {
      email: registerData.email.toLowerCase().trim(),
      password: registerData.password,
      contactPerson: registerData.contactPerson.trim(),
      companyName: registerData.companyName.trim(),
      phone: registerData.phone?.trim(),
      country: registerData.country?.trim(),
      agencyType: registerData.agencyType?.trim(),
      businessRegistration: registerData.businessRegistration?.trim(),
    };

    // Parse contact person into first name and last name
    const nameParts = sanitizedData.contactPerson.split(' ');
    const firstName = nameParts[0] || sanitizedData.contactPerson;
    const lastName = nameParts.slice(1).join(' ') || '';

    // Create Supabase Auth user first
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: sanitizedData.email,
      password: sanitizedData.password,
      email_confirm: false, // Auto-confirm for B2B users
      user_metadata: {
        user_type: 'b2b',
        first_name: firstName,
        last_name: lastName,
        phone: sanitizedData.phone,
        country: sanitizedData.country,
        company_name: sanitizedData.companyName,
        contact_person: sanitizedData.contactPerson
      }
    });

    if (authError || !authData.user) {
      console.error('Auth user creation error:', authError);
      if (authError?.message.includes('already registered')) {
        throw new Error('User with this email already exists');
      }
      throw new Error('Registration failed - auth error');
    }

    console.log('Auth user created successfully:', authData.user.id);

    // Create user profile for unified auth system
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        user_type: 'b2b',
        first_name: firstName,
        last_name: lastName,
        phone: sanitizedData.phone,
        country: sanitizedData.country
      });

    if (profileError) {
      console.error('User profile creation error:', profileError);
      // Clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw new Error('Registration failed - profile creation error');
    }

    console.log('User profile created successfully');

    // Create B2B user record linked to auth user
    const { data: newUser, error: insertError } = await supabase
      .from('b2b_users')
      .insert({
        user_id: authData.user.id,
        contact_person: sanitizedData.contactPerson,
        company_name: sanitizedData.companyName,
        phone: sanitizedData.phone,
        country: sanitizedData.country,
        agency_type: sanitizedData.agencyType,
        business_registration: sanitizedData.businessRegistration,
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) {
      console.error('B2B user insertion error:', insertError);
      // Clean up auth user if B2B record fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw new Error('Registration failed');
    }

    console.log('B2B user created successfully:', newUser.id);

    // Trigger registration email notification
    const { error: emailError } = await supabase
      .rpc('send_b2b_registration_email', {
        user_email: sanitizedData.email,
        contact_person: sanitizedData.contactPerson,
        company_name: sanitizedData.companyName
      });

    if (emailError) {
      console.error('Email notification error:', emailError);
      // Don't fail registration if email fails
    }

    console.log(`New B2B registration: ${sanitizedData.companyName} (${sanitizedData.email})`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Registration successful. Your account is pending approval.',
        user: {
          id: newUser.id,
          user_id: newUser.user_id,
          company_name: newUser.company_name,
          status: newUser.status
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Registration error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Registration failed'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});