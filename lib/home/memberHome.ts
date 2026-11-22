import { daysUntilAR, dayOfWeekAR } from "../date-ar"

export type MembershipStatus =
  | { kind: "none"; daysLeft: null }
  | { kind: "active" | "expiring" | "expired"; daysLeft: number }

export type DayStatus = "completed" | "missed" | "rest" | "today-pending" | "future"

export type WeekDay = { label: string; status: DayStatus }

export type WeekSummary = {
  days: WeekDay[] // Monday .. Sunday
  planned: number // plan days that have exercises
  completed: number // distinct days this week with a completed session
}

export type HomeExercise = { name: string; prescription: string }

export type HomePlan = {
  name: string
  dayName: string
  exercises: HomeExercise[] // empty = rest day (plan exists, nothing scheduled today)
}

export type MemberHomeData = {
  greeting: string
  membership: MembershipStatus
  plan: HomePlan | null // null = no plan assigned
  week: WeekSummary | null // null when there is no plan
  streak: number
}

const DAY_SHORT = ["L", "M", "X", "J", "V", "S", "D"]
const DAY_NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

/** Membership warning threshold, same as the web's renew card. */
export const EXPIRING_DAYS = 7

export function greetingFor(hour: number, fullName: string | null): string {
  const salutation = hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches"
  const firstName = fullName?.trim().split(/\s+/)[0]
  return firstName ? `${salutation}, ${firstName}` : salutation
}

/** Day index used by the plans: 0 = Monday ... 6 = Sunday, in Argentina. */
export function todayDowAR(now: Date): number {
  return (dayOfWeekAR(now) + 6) % 7
}

/** Spanish name of today's weekday in Argentina. */
export function dayNameAR(now: Date): string {
  return DAY_NAMES[dayOfWeekAR(now)]
}

export function formatPrescription(ex: {
  sets: number
  reps: number
  reps_max: number | null
  duration_seconds: number | null
}): string {
  if (ex.duration_seconds != null) return `${ex.sets} × ${ex.duration_seconds} s`
  if (ex.reps_max != null) return `${ex.sets} × ${ex.reps}–${ex.reps_max}`
  return `${ex.sets} × ${ex.reps}`
}

export function membershipStatusFor(expiresAt: string | null, now: Date): MembershipStatus {
  if (!expiresAt) return { kind: "none", daysLeft: null }
  const daysLeft = daysUntilAR(expiresAt, now)
  if (daysLeft < 0) return { kind: "expired", daysLeft }
  return { kind: daysLeft <= EXPIRING_DAYS ? "expiring" : "active", daysLeft }
}

function dayStatus(dow: number, todayDow: number, training: Set<number>, completed: Set<number>): DayStatus {
  if (completed.has(dow)) return "completed"
  if (dow === todayDow) return training.has(dow) ? "today-pending" : "rest"
  if (dow < todayDow) return training.has(dow) ? "missed" : "rest"
  return "future"
}

export function buildWeek(input: { trainingDows: number[]; completedDows: number[]; todayDow: number }): WeekSummary {
  const training = new Set(input.trainingDows)
  const completed = new Set(input.completedDows)
  return {
    days: DAY_SHORT.map((label, dow) => ({
      label,
      status: dayStatus(dow, input.todayDow, training, completed),
    })),
    planned: training.size,
    completed: completed.size,
  }
}
