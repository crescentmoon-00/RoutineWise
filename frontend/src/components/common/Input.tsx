import React from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-on-surface">
          {label}
        </label>
      )}
      <input
        className={cn(
          'input-field',
          error && 'ring-2 ring-error',
          className
        )}
        {...props}
      />
      {(error || helperText) && (
        <p className={cn('text-xs', error ? 'text-error' : 'text-on-surface-variant')}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export const Textarea: React.FC<InputProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
  label,
  error,
  helperText,
  className,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-on-surface">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'input-field min-h-[120px]',
          error && 'ring-2 ring-error',
          className
        )}
        {...props}
      />
      {(error || helperText) && (
        <p className={cn('text-xs', error ? 'text-error' : 'text-on-surface-variant')}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};
