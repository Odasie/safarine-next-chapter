import { supabase } from "@/integrations/supabase/client";

/**
 * Test function to validate Supabase schema and connection
 */
export const validateSupabaseSchema = async () => {
  try {
    console.log('🔍 Testing Supabase schema connection...');
    
    // Test 1: Simple connection test
    const { data: connectionTest, error: connectionError } = await supabase
      .from('tours')
      .select('id')
      .limit(1);
    
    if (connectionError) {
      console.error('❌ Connection test failed:', connectionError);
      return { success: false, error: 'Connection failed', details: connectionError };
    }
    
    console.log('✅ Connection test passed');
    
    // Test 2: Schema validation - try to select all expected columns
    const { data: schemaTest, error: schemaError } = await supabase
      .from('tours')
      .select(`
        id,
        title_en,
        title_fr,
        status,
        published_at,
        created_at,
        updated_at
      `)
      .limit(1);
    
    if (schemaError) {
      console.error('❌ Schema test failed:', schemaError);
      return { 
        success: false, 
        error: 'Schema validation failed', 
        details: schemaError,
        message: 'This indicates a schema cache issue. Try refreshing the page or clearing browser cache.'
      };
    }
    
    console.log('✅ Schema validation passed');
    
    // Test 3: Try a minimal insert (then delete) to test write permissions
    const testTour = {
      title_en: 'Test Tour - DELETE ME',
      title_fr: 'Tour de Test - SUPPRIMEZ-MOI',
      status: 'draft',
      destination: 'Test',
      duration_days: 1,
      currency: 'THB'
    };
    
    const { data: insertTest, error: insertError } = await supabase
      .from('tours')
      .insert([testTour])
      .select('id')
      .single();
    
    if (insertError) {
      console.error('❌ Insert test failed:', insertError);
      return { 
        success: false, 
        error: 'Insert operation failed', 
        details: insertError 
      };
    }
    
    // Clean up test record
    if (insertTest?.id) {
      await supabase
        .from('tours')
        .delete()
        .eq('id', insertTest.id);
      console.log('🧹 Cleaned up test record');
    }
    
    console.log('✅ All schema tests passed!');
    return { 
      success: true, 
      message: 'Supabase schema is working correctly' 
    };
    
  } catch (error) {
    console.error('❌ Schema validation error:', error);
    return { 
      success: false, 
      error: 'Unexpected error during validation', 
      details: error 
    };
  }
};

/**
 * Quick test to check if published_at column exists
 */
export const testPublishedAtColumn = async () => {
  try {
    const { data, error } = await supabase
      .from('tours')
      .select('published_at')
      .limit(1);
      
    if (error) {
      console.error('❌ published_at column test failed:', error);
      return false;
    }
    
    console.log('✅ published_at column exists and is accessible');
    return true;
  } catch (error) {
    console.error('❌ published_at column test error:', error);
    return false;
  }
};