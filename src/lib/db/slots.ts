import type { Groomer } from "./schema";

/**
 * Generate time slots for a given date and groomers
 * Slots are 9 AM - 5 PM MST, 1-hour blocks
 */
export function generateTimeSlots(
  date: Date,
  groomers: Groomer[]
): Array<{ groomerId: string; startTime: Date; endTime: Date }> {
  const slots: Array<{ groomerId: string; startTime: Date; endTime: Date }> =
    [];

  // Set date to MST (UTC-7) - 9 AM to 5 PM
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  // Generate slots for each groomer
  for (const groomer of groomers) {
    // 9 AM to 5 PM (8 slots, 9:00, 10:00, ..., 16:00)
    for (let hour = 9; hour < 17; hour++) {
      // Create date in MST (UTC-7)
      // Note: JavaScript Date uses local time, so we'll work in UTC
      // MST is UTC-7, so 9 AM MST = 4 PM UTC (16:00)
      const startTime = new Date(Date.UTC(year, month, day, hour + 7, 0, 0));
      const endTime = new Date(Date.UTC(year, month, day, hour + 8, 0, 0));

      slots.push({
        groomerId: groomer.id,
        startTime,
        endTime,
      });
    }
  }

  return slots;
}

/**
 * Format slot ID: {groomerId}-{startTime}
 */
export function formatSlotId(groomerId: string, startTime: Date): string {
  return `${groomerId}-${startTime.toISOString()}`;
}

/**
 * Parse slot ID to extract groomer ID and start time
 * Format: {groomerId}-{startTimeISO}
 * UUID format: 8-4-4-4-12 (36 chars including dashes)
 * ISO date format: YYYY-MM-DDTHH:mm:ss.sssZ
 */
export function parseSlotId(
  slotId: string
): { groomerId: string; startTime: Date } | null {
  // Find the last occurrence of "-" before the ISO date
  // ISO date starts with YYYY (4 digits), so look for pattern: -YYYY
  const isoDateMatch = slotId.match(/-(\d{4}-\d{2}-\d{2}T)/);
  if (!isoDateMatch || isoDateMatch.index === undefined) return null;

  // Extract groomer ID (everything before the dash before the year)
  const groomerId = slotId.substring(0, isoDateMatch.index);
  
  // Extract date string (everything from the year onwards)
  const dateString = slotId.substring(isoDateMatch.index + 1); // +1 to skip the dash

  const startTime = new Date(dateString);
  if (isNaN(startTime.getTime())) return null;

  return {
    groomerId,
    startTime,
  };
}
