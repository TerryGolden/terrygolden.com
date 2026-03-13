import { createClient } from '@supabase/supabase-js';

// Initialize database client
const supabaseUrl = 'https://jguuqjejqdiubvuzyesm.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjU5YTI1OTgxLWUzNmUtNDc5OS1hNzc3LTlmMmQzNWM3YmIyYyJ9.eyJwcm9qZWN0SWQiOiJqZ3V1cWplanFkaXVidnV6eWVzbSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY0MTczNzA3LCJleHAiOjIwNzk1MzM3MDcsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.lV3q6L4gZJu4a1QHC3RjXTeiehgkHARwSdUexICHXYQ';
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Safe wrapper for edge function calls
 * Returns null instead of throwing errors when edge functions aren't available
 */
export const safeInvokeFunction = async (
  functionName: string, 
  options?: { body?: any }
): Promise<{ data: any; error: any }> => {
  try {
    const response = await supabase.functions.invoke(functionName, options);
    
    // Check if response is HTML (error page) instead of JSON
    if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE')) {
      console.warn(`Edge function "${functionName}" returned HTML - function may not be deployed`);
      return { data: null, error: { message: 'Edge function not available' } };
    }
    
    return response;
  } catch (error: any) {
    // Handle JSON parse errors (when HTML is returned instead of JSON)
    if (error?.message?.includes('Unexpected token')) {
      console.warn(`Edge function "${functionName}" is not available`);
      return { data: null, error: { message: 'Edge function not available' } };
    }
    
    console.warn(`Edge function "${functionName}" failed:`, error?.message);
    return { data: null, error };
  }
};

export { supabase };
