import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines Tailwind classes safely with proper precedence
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

