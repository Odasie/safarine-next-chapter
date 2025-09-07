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

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('b2b_users')
      .select('email')
      .eq('email', sanitizedData.email)
      .single();

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password using PostgreSQL's crypt function (server-side)
    const { data: hashedResult, error: hashError } = await supabase
      .rpc('crypt', {
        password: sanitizedData.password,
        salt: await generateSalt()
      });

    if (hashError) {
      console.error('Password hashing error:', hashError);
      throw new Error('Registration failed - security error');
    }

    // Insert user with hashed password
    const { data: newUser, error: insertError } = await supabase
      .from('b2b_users')
      .insert({
        email: sanitizedData.email,
        password_hash: hashedResult,
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
      console.error('User insertion error:', insertError);
      throw new Error('Registration failed');
    }

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
          email: newUser.email,
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

// Generate secure salt for password hashing
async function generateSalt(): Promise<string> {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return '$2a$10$' + btoa(String.fromCharCode(...bytes)).slice(0, 22);
}