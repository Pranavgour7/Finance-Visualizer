import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount)
}

export const formatDate = (date: Date | string) => {
  const dateObject = date instanceof Date ? date : new Date(date)
  
  // Use a fixed format that will be consistent between server and client
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC", // Use UTC to avoid timezone differences
  }).format(dateObject)
}

export const getMonthName = (month: number) => {
  // Create a date object with a fixed day/year and the given month
  const date = new Date(2000, month, 1)
  // Format the month name consistently
  return date.toLocaleString("en-US", { month: "long", timeZone: "UTC" })
}

export const getCurrentMonthYear = () => {
  const now = new Date()
  return {
    month: now.getMonth(),
    year: now.getFullYear(),
  }
}
