// Temporary debug version of the login function
// Add this to your B2BAuthContext.tsx temporarily to debug

const debugLogin = async (email: string, password: string) => {
  try {
    console.log('Starting debug login for:', email);
    
    // First test if RPC works at all
    const { data: testData, error: testError } = await supabase
      .rpc('test_rpc');
    
    console.log('Test RPC result:', testData, testError);
    
    // Now test the debug authentication function
    const { data: authData, error: authError } = await supabase
      .rpc('b2b_authenticate_debug', {
        email_param: email,
        password_param: password
      });

    console.log('Debug auth result:', authData, authError);
    
    if (authError) {
      console.error('Authentication error:', authError);
      return { error: 'Authentication failed. Please try again.' };
    }

    const authResponse = authData as {
      success: boolean;
      error?: string;
      message?: string;
      debug?: string;
      user?: any;
    };

    console.log('Parsed auth response:', authResponse);

    if (!authResponse.success) {
      // Return the specific error message from our function
      return { error: authResponse.message || 'Login failed. Please try again.' };
    }

    // Handle successful login...
    return { success: true };
    
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
};

// Replace your current login function with this temporarily:
// const login = debugLogin;
