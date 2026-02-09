/**
 * Custom hook for shared form validation logic
 * Reduces DRY violations across LoginPage, SignupPage, and CheckoutPage
 */

import React from 'react';
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateRequired,
  type ValidationResult,
} from '../lib/validation';

export interface FormErrors {
  [key: string]: string | null;
}

export interface UseFormValidationOptions {
  email?: boolean;
  password?: boolean;
  confirmPassword?: boolean;
  name?: boolean;
}

/**
 * Custom hook for managing form validation state
 * @param options - Fields to validate
 * @returns validation state and functions
 */
export function useFormValidation(options: UseFormValidationOptions = {}) {
  const [errors, setErrors] = React.useState<FormErrors>({});

  const validateField = (
    fieldName: string,
    value: string,
    confirmValue?: string,
  ): ValidationResult => {
    switch (fieldName) {
      case 'email':
        return validateEmail(value);
      case 'password':
        return validatePassword(value);
      case 'confirmPassword':
        return validatePasswordMatch(value, confirmValue || '');
      case 'name':
        return validateRequired(value, 'Name');
      default:
        return { isValid: true };
    }
  };

  const validate = (
    fieldName: string,
    value: string,
    confirmValue?: string,
  ): boolean => {
    const result = validateField(fieldName, value, confirmValue);

    setErrors((prev) => ({
      ...prev,
      [fieldName]: result.error || null,
    }));

    return result.isValid;
  };

  const validateAll = (
    values: Record<string, string>,
    confirmPasswordValue?: string,
  ): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.entries(values).forEach(([fieldName, value]) => {
      const result = validateField(
        fieldName,
        value,
        fieldName === 'confirmPassword' ? confirmPasswordValue : undefined,
      );
      if (!result.isValid) {
        newErrors[fieldName] = result.error || null;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const clearError = (fieldName: string): void => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
  };

  const clearAllErrors = (): void => {
    setErrors({});
  };

  return {
    errors,
    validate,
    validateAll,
    clearError,
    clearAllErrors,
  };
}
