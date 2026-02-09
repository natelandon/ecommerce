import React from 'react';
import { AlertCircle } from '../../lib/icons';

interface FormErrorProps {
  message: string;
}

export function FormError({ message }: FormErrorProps) {
  return (
    <div
      className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded flex items-center gap-2"
      role="alert"
      aria-live="polite"
    >
      <AlertCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
