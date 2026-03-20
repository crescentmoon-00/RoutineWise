import React from 'react';
import { cn } from '../../utils/cn';

interface ChipProps {
  children: React.ReactNode;
  variant?: 'health' | 'school' | 'chore' | 'default';
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  children,
  variant = 'default',
  className,
}) => {
  const variantClasses = {
    health: 'chip-health',
    school: 'chip-school',
    chore: 'chip-chore',
    default: 'bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-bold uppercase',
  };

  return (
    <span className={cn(variantClasses[variant], className)}>
      {children}
    </span>
  );
};
