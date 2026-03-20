import { type ClassValue, clsx } from 'clsx';

function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export { cn };
