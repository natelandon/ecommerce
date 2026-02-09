export const PASSWORD_MIN_LENGTH = 6;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateEmail(email: string): ValidationResult {
  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  return { isValid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return {
      isValid: false,
      error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
    };
  }
  return { isValid: true };
}

export function validatePasswordMatch(
  password: string,
  confirmPassword: string,
): ValidationResult {
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }
  return { isValid: true };
}

export function validateRequired(
  value: string,
  fieldName: string,
): ValidationResult {
  if (!value.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true };
}
