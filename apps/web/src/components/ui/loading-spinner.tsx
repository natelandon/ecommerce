import React from 'react';
import { Loader2 } from '../../lib/icons';
import { cn } from '../../lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ className, size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div aria-live="polite" aria-busy="true" className="flex items-center justify-center">
      <Loader2
        className={cn('animate-spin', sizeClasses[size], className)}
        aria-label="Loading"
      />
    </div>
  );
}
