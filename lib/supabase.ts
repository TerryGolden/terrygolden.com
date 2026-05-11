import { createClient } from '@supabase/supabase-js';

// Initialize database client - Terry Golden's Supabase instance
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ogmcctnpxgemlvulhtom.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseKey) {
  console.warn('Supabase anon key not configured. Please set VITE_SUPABASE_ANON_KEY environment variable.');
}

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
