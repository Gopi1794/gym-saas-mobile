// Argentina date helpers. Mirrors the web app's lib/date-ar.ts so both
// clients agree on what "today" is for members in Argentina (UTC-3).

const TZ = "America/Argentina/Buenos_Aires"

/**
 * Argentina calendar day (YYYY-MM-DD) of a real instant.
 *
 * Builds the string from formatToParts instead of relying on a locale whose
 * default format happens to be YYYY-MM-DD, so it does not depend on which
 * locales the device's Intl implementation ships.
 */
export function dayAR(instant: Date | string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(instant))
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ""
  return `${get("year")}-${get("month")}-${get("day")}`
}

/** Today's date (YYYY-MM-DD) in Argentina. */
export function todayAR(now: Date = new Date()): string {
  return dayAR(now)
}

/** Current hour (0-23) in Argentina. Locale-independent (hourCycle h23, never "24"). */
export function hourAR(now: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(now)
  return Number(parts.find((p) => p.type === "hour")?.value ?? 0)
}

/** Day of week in Argentina (0 = Sunday ... 6 = Saturday), like JS Date.getDay(). */
export function dayOfWeekAR(now: Date = new Date()): number {
  return new Date(`${todayAR(now)}T12:00:00Z`).getUTCDay()
}

/**
 * Monday of the current Argentina week at 00:00 AR time, as a UTC ISO string
 * ready for Supabase .gte() on timestamptz columns. Argentina has no DST
 * (fixed UTC-3), so the offset is constant; the day shift uses UTC setters so
 * it does not depend on the device time zone.
 */
export function mondayOfWeekAR(now: Date = new Date()): string {
  const jsDay = dayOfWeekAR(now)
  const offset = jsDay === 0 ? -6 : 1 - jsDay
  const d = new Date(`${todayAR(now)}T00:00:00-03:00`)
  d.setUTCDate(d.getUTCDate() + offset)
  return d.toISOString()
}

/**
 * Calendar days between expiresAt and today in Argentina. Negative once the
 * expiry day has passed.
 *
 * Reads the day straight from the UTC string (before the "T") on purpose:
 * expiry dates set by hand are stored as midnight UTC of the chosen day, and
 * converting that instant to Argentina time would move it to the previous
 * day. Same rule as the web's daysUntilAR.
 */
export function daysUntilAR(expiresAt: string, now: Date = new Date()): number {
  const expiresDay = expiresAt.split("T")[0]
  return Math.round(
    (new Date(`${expiresDay}T12:00:00Z`).getTime() - new Date(`${todayAR(now)}T12:00:00Z`).getTime()) / 86_400_000,
  )
}
