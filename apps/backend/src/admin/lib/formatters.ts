/**
 * Formatting utilities for Admin UI
 */

// Format currency amount (Medusa stores in whole units)
export function formatMoney(amount: number, currencyCode: string = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(amount)
}

// Format date
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }
  return new Intl.DateTimeFormat("en-US", options || defaultOptions).format(new Date(date))
}

// Format date with time
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date))
}

// Format relative time (e.g., "2 days ago")
export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 30) {
    return formatDate(date)
  } else if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
  } else if (diffMins > 0) {
    return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`
  } else {
    return "Just now"
  }
}

// Format percentage
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

// Format number with commas
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value)
}

// Format compact number (e.g., 1.2K, 3.4M)
export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  }).format(value)
}

// Get status color for badges
export function getStatusColor(status: string): "green" | "red" | "orange" | "blue" | "grey" | "purple" {
  const statusColors: Record<string, "green" | "red" | "orange" | "blue" | "grey" | "purple"> = {
    // General statuses
    active: "green",
    completed: "green",
    confirmed: "green",
    approved: "green",
    verified: "green",
    fulfilled: "green",
    delivered: "green",
    paid: "green",
    
    // Warning statuses
    pending: "orange",
    pending_approval: "orange",
    processing: "orange",
    in_progress: "orange",
    trialing: "orange",
    partially_fulfilled: "orange",
    past_due: "orange",
    
    // Info statuses
    draft: "blue",
    sent: "blue",
    viewed: "blue",
    shipped: "blue",
    
    // Danger statuses
    cancelled: "red",
    rejected: "red",
    expired: "red",
    suspended: "red",
    inactive: "red",
    failed: "red",
    no_show: "red",
    refunded: "red",
    
    // Neutral statuses
    paused: "grey",
    closed: "grey",
    
    // Special statuses
    converted: "purple",
    accepted: "purple",
  }
  
  return statusColors[status] || "grey"
}

// Format status label (convert snake_case to Title Case)
export function formatStatusLabel(status: string): string {
  return status
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Format tier label with icon
export function getTierInfo(tier: string): { label: string; color: string } {
  const tiers: Record<string, { label: string; color: string }> = {
    bronze: { label: "Bronze", color: "#CD7F32" },
    silver: { label: "Silver", color: "#C0C0C0" },
    gold: { label: "Gold", color: "#FFD700" },
    platinum: { label: "Platinum", color: "#E5E4E2" },
  }
  
  return tiers[tier] || { label: tier, color: "#666" }
}

// Format duration in minutes to human readable
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (mins === 0) {
    return `${hours} hr`
  }
  return `${hours} hr ${mins} min`
}

// Format time slot (e.g., "09:00" to "9:00 AM")
export function formatTimeSlot(time: string): string {
  const [hours, minutes] = time.split(":").map(Number)
  const period = hours >= 12 ? "PM" : "AM"
  const hour12 = hours % 12 || 12
  return `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`
}

// Get day of week name
export function getDayName(dayOfWeek: number): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  return days[dayOfWeek] || ""
}

// Truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + "..."
}
