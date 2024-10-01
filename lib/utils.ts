import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const truncatePubkey = (key: string, chars: number = 3) => {
  return `${key.slice(0, chars)}...${key.slice(-chars)}`;
};
