export interface ParsedSupabaseError {
  userMessage: string;
  originalError: any;
  shouldRetry: boolean;
  requiresAuth: boolean;
}

export function parseSupabaseError(error: any): ParsedSupabaseError {
  // Default response
  const result: ParsedSupabaseError = {
    userMessage: 'An unexpected error occurred. Please try again.',
    originalError: error,
    shouldRetry: true,
    requiresAuth: false,
  };

  // Handle null/undefined errors
  if (!error) {
    return result;
  }

  // Extract error message from various error formats
  const errorMessage = error?.message || error?.error_description || error?.msg || String(error);
  const errorCode = error?.code || error?.status;

  // Network/Connection errors
  if (error?.message?.includes('fetch') || error?.message?.includes('network') || errorCode === 'NETWORK_ERROR') {
    result.userMessage = 'Connection failed. Please check your internet connection.';
    result.shouldRetry = true;
    return result;
  }

  // RLS Policy violations (PostgreSQL error code 42501)
  if (errorCode === '42501' || errorMessage.includes('row-level security') || errorMessage.includes('permission denied')) {
    result.userMessage = 'Permission denied. Please check your access rights.';
    result.shouldRetry = false;
    result.requiresAuth = true;
    return result;
  }

  // Authentication errors (PGRST301, JWT errors)
  if (errorCode === 'PGRST301' || errorMessage.includes('JWT') || errorMessage.includes('authentication') || errorMessage.includes('token expired')) {
    result.userMessage = 'Authentication expired. Please sign in again.';
    result.shouldRetry = false;
    result.requiresAuth = true;
    return result;
  }

  // Database constraint violations (23xxx PostgreSQL codes)
  if (String(errorCode).startsWith('23') || errorMessage.includes('constraint') || errorMessage.includes('violates')) {
    result.userMessage = 'Data validation failed. Please check your input.';
    result.shouldRetry = false;
    return result;
  }

  // Schema errors (PGRST204 - no relation)
  if (errorCode === 'PGRST204' || errorMessage.includes('relation') || errorMessage.includes('does not exist')) {
    result.userMessage = 'Database schema error. Please refresh and try again.';
    result.shouldRetry = true;
    return result;
  }

  // Rate limiting
  if (errorCode === 429 || errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) {
    result.userMessage = 'Too many requests. Please wait and try again.';
    result.shouldRetry = true;
    return result;
  }

  // Timeout errors
  if (errorMessage.includes('timeout') || errorCode === 'ETIMEDOUT') {
    result.userMessage = 'Request timed out. Please try again.';
    result.shouldRetry = true;
    return result;
  }

  // Generic Supabase/PostgreSQL errors - use the error message if it's user-friendly
  if (errorMessage && errorMessage.length < 100 && !errorMessage.includes('stacktrace')) {
    result.userMessage = errorMessage;
  }

  return result;
}
