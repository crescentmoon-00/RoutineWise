import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'lg' | 'xl' | 'child';
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  hover = false,
  onClick,
}) => {
  const variantClasses = {
    default: 'card',
    lg: 'card-lg',
    xl: 'card-xl',
    child: 'card-child',
  };

  const baseClasses = variantClasses[variant];

  return (
    <div
      className={cn(
        baseClasses,
        hover && 'hover:shadow-elevation-high transition-shadow',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
