import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Activate dark mode by default for the entire application
export function setupDarkMode() {
  // Add dark class to html element
  document.documentElement.classList.add('dark');
}
