import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatChatDate(date: Date): string {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date >= today) {
    return formatTime(date)
  } else if (date >= yesterday) {
    return "Yesterday"
  } else {
    // Format as DD-MMM-YY
    return `${date.getDate()}-${getShortMonth(date)}-${String(date.getFullYear()).slice(2)}`
  }
}

export function formatMessageTime(date: Date): string {
  return formatTime(date)
}

function formatTime(date: Date): string {
  let hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? "" : ""

  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}${ampm}`
}

function getShortMonth(date: Date): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return months[date.getMonth()]
}
