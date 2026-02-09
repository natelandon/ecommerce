/**
 * Application-wide constants
 */

// Authentication
export const AUTH_SIMULATED_DELAY_MS = 500;

// Product filtering
export const PRODUCT_FILTER_DEFAULTS = {
  CATEGORY: 'all',
  GENDER: 'all',
  SIZE: 'all',
  RATING: 'all',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  PRODUCT_LOAD_FAILED: 'Failed to load products. Please try again later.',
  PRODUCT_NOT_FOUND: 'Product not found.',
  CARD_ELEMENT_NOT_FOUND:
    'Payment method is not available. Please refresh the page.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const;

// UI
export const CHECKOUT_PROCESSING_DELAY_MS = 2000;
export const PAGINATION_SIZE = 12;
