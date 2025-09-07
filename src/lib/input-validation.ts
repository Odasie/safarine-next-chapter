/**
 * Input validation and sanitization utilities for security
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedValue?: string;
}

/**
 * Sanitize HTML input to prevent XSS attacks
 */
export const sanitizeHtml = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

/**
 * Validate and sanitize email input
 */
export const validateEmail = (email: string): ValidationResult => {
  const sanitized = sanitizeHtml(email.toLowerCase().trim());
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!sanitized) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!emailRegex.test(sanitized)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  if (sanitized.length > 254) {
    return { isValid: false, error: 'Email address is too long' };
  }
  
  return { isValid: true, sanitizedValue: sanitized };
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }
  
  if (password.length > 128) {
    return { isValid: false, error: 'Password is too long' };
  }
  
  // Check for at least one uppercase, lowercase, number, and special character
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
    return { 
      isValid: false, 
      error: 'Password must contain at least one uppercase letter, lowercase letter, number, and special character' 
    };
  }
  
  return { isValid: true, sanitizedValue: password };
};

/**
 * Validate and sanitize text input
 */
export const validateText = (
  text: string, 
  fieldName: string, 
  options: { 
    required?: boolean; 
    minLength?: number; 
    maxLength?: number; 
    allowSpecialChars?: boolean;
  } = {}
): ValidationResult => {
  const { required = false, minLength = 0, maxLength = 255, allowSpecialChars = true } = options;
  
  let sanitized = sanitizeHtml(text.trim());
  
  if (required && !sanitized) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (sanitized.length < minLength) {
    return { isValid: false, error: `${fieldName} must be at least ${minLength} characters long` };
  }
  
  if (sanitized.length > maxLength) {
    return { isValid: false, error: `${fieldName} must be no more than ${maxLength} characters long` };
  }
  
  if (!allowSpecialChars) {
    const hasSpecialChars = /[<>{}()[\]\\\/\'"`;=]/.test(sanitized);
    if (hasSpecialChars) {
      return { isValid: false, error: `${fieldName} contains invalid characters` };
    }
  }
  
  return { isValid: true, sanitizedValue: sanitized };
};

/**
 * Validate phone number
 */
export const validatePhone = (phone: string): ValidationResult => {
  const sanitized = sanitizeHtml(phone.trim().replace(/[^\d+\-\s()]/g, ''));
  
  if (!sanitized) {
    return { isValid: true, sanitizedValue: '' }; // Phone is optional
  }
  
  // Basic international phone number validation
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,15}$/;
  
  if (!phoneRegex.test(sanitized)) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }
  
  return { isValid: true, sanitizedValue: sanitized };
};

/**
 * Validate company name
 */
export const validateCompanyName = (name: string): ValidationResult => {
  return validateText(name, 'Company name', {
    required: true,
    minLength: 2,
    maxLength: 100,
    allowSpecialChars: true
  });
};

/**
 * Validate contact person name
 */
export const validateContactPerson = (name: string): ValidationResult => {
  return validateText(name, 'Contact person', {
    required: true,
    minLength: 2,
    maxLength: 50,
    allowSpecialChars: false
  });
};

/**
 * Validate country name
 */
export const validateCountry = (country: string): ValidationResult => {
  if (!country.trim()) {
    return { isValid: true, sanitizedValue: '' }; // Country is optional
  }
  
  return validateText(country, 'Country', {
    required: false,
    minLength: 2,
    maxLength: 50,
    allowSpecialChars: false
  });
};

/**
 * Rate limiting check (client-side helper)
 */
export const checkRateLimit = (key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const attempts = JSON.parse(localStorage.getItem(`rate_limit_${key}`) || '[]');
  
  // Remove old attempts outside the window
  const recentAttempts = attempts.filter((timestamp: number) => now - timestamp < windowMs);
  
  if (recentAttempts.length >= maxAttempts) {
    return false; // Rate limit exceeded
  }
  
  // Add current attempt
  recentAttempts.push(now);
  localStorage.setItem(`rate_limit_${key}`, JSON.stringify(recentAttempts));
  
  return true; // Within rate limit
};

/**
 * Clean up old rate limit data
 */
export const cleanupRateLimitData = (): void => {
  const keys = Object.keys(localStorage).filter(key => key.startsWith('rate_limit_'));
  keys.forEach(key => {
    const attempts = JSON.parse(localStorage.getItem(key) || '[]');
    const now = Date.now();
    const recentAttempts = attempts.filter((timestamp: number) => now - timestamp < 300000); // 5 minutes
    
    if (recentAttempts.length === 0) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(recentAttempts));
    }
  });
};