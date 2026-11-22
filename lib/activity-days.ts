import { dayAR } from "./date-ar"

/**
 * Shifts a calendar date (YYYY-MM-DD) by `deltaDays`. Pure calendar math
 * anchored at T00:00:00Z using UTC getters/setters only, so the result does
 * not depend on the process time zone. The input must already be an
 * Argentina calendar date.
 */
function shiftDay(dateStr: string, deltaDays: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + deltaDays)
  return d.toISOString().split("T")[0]
}

/**
 * Streak of consecutive days with at least one instant in `completions`,
 * counting backwards from `todayStr` (today in Argentina, YYYY-MM-DD).
 *
 * Each instant is grouped by its Argentina calendar day (dayAR), not its raw
 * UTC day: a session completed at 22:30 AR (01:30 UTC next day) belongs to
 * the day the member lived it.
 */
export function streakFromInstants(completions: string[], todayStr: string): number {
  const days = new Set(completions.map(dayAR))
  let streak = 0
  let cursor = todayStr
  while (days.has(cursor)) {
    streak++
    cursor = shiftDay(cursor, -1)
  }
  return streak
}

/**
 * Number of instants per Argentina calendar day for the last `days` days
 * ending at `lastDayStr` (inclusive). Index 0 is the oldest day.
 */
export function countsByDayAR(items: string[], lastDayStr: string, days = 7): number[] {
  const byDay = new Map<string, number>()
  for (const instant of items) {
    const day = dayAR(instant)
    byDay.set(day, (byDay.get(day) ?? 0) + 1)
  }
  return Array.from({ length: days }, (_, i) => byDay.get(shiftDay(lastDayStr, -(days - 1 - i))) ?? 0)
}
