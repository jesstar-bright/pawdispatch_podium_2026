/**
 * Validation utilities for API routes
 */

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  // Flexible phone validation - just check it's not empty and has some digits
  const phoneRegex = /[\d\s\-\(\)\+]{7,}/;
  return phoneRegex.test(phone);
}

export function validateDate(dateString: string): {
  valid: boolean;
  error?: string;
} {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return { valid: false, error: "Invalid date format" };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 3);

  if (date < today) {
    return { valid: false, error: "Date cannot be in the past" };
  }

  if (date > maxDate) {
    return { valid: false, error: "Date must be within 3 days from today" };
  }

  return { valid: true };
}

export function validateUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
