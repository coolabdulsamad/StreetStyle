import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number) {
  if (isNaN(amount)) return '';
  return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 0 })}`;
}

export function getRandomItemsFromArray<T>(array: T[], count: number): T[] {
  if (count >= array.length) {
    return [...array];
  }
  
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  return `${text.slice(0, maxLength)}...`;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
