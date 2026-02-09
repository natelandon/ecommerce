function getApiBaseUrl(): string {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    return process.env.VITE_API_URL || 'http://localhost:4000';
  }

  // For Vite environment, this will work at runtime
  // In tests, the condition above will return early
  try {
    // @ts-ignore
    const url = __import__('').meta.env.VITE_API_URL;
    return url || 'http://localhost:4000';
  } catch {
    return 'http://localhost:4000';
  }
}

export const API_BASE_URL = getApiBaseUrl();
