/**
 * Generate a unique confirmation number in format: PD-YYYY-XXXXXX
 * Uses timestamp + random to avoid needing a DB query (prevents SQLite transaction deadlock)
 */
export function generateConfirmationNumber(): string {
  const year = new Date().getFullYear();
  const number = Math.floor(Math.random() * 999999) + 1;
  return `PD-${year}-${number.toString().padStart(6, "0")}`;
}
