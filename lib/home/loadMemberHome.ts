import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "../../types/database"
import { streakFromInstants } from "../activity-days"
import { hourAR, mondayOfWeekAR, todayAR } from "../date-ar"
import {
  buildWeek,
  dayNameAR,
  formatPrescription,
  greetingFor,
  membershipStatusFor,
  todayDowAR,
  type HomePlan,
  type MemberHomeData,
  type WeekSummary,
} from "./memberHome"

type Client = SupabaseClient<Database>

/** Same cap as the web dashboard: enough history for any realistic streak. */
const STREAK_SESSIONS = 60

function unwrap<T>(res: { data: T; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message)
  return res.data
}

/**
 * Loads everything the member home needs. Every query is scoped to `userId`
 * (RLS is the real boundary; the filters keep the intent explicit and the
 * result correct if a policy is ever widened for staff).
 */
export async function loadMemberHome(client: Client, userId: string, now: Date = new Date()): Promise<MemberHomeData> {
  const todayDow = todayDowAR(now)

  const [profile, plan, recent] = await Promise.all([
    client.from("profiles").select("full_name, membership_expires_at").eq("id", userId).maybeSingle().then(unwrap),
    client
      .from("workout_plans")
      .select("id, name")
      .eq("assigned_to", userId)
      .eq("is_template", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(unwrap),
    client
      .from("workout_sessions")
      .select("completed_at")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false })
      .limit(STREAK_SESSIONS)
      .then(unwrap),
  ])

  let homePlan: HomePlan | null = null
  let week: WeekSummary | null = null

  if (plan) {
    const [todayDays, allDays, weekSessions] = await Promise.all([
      client
        .from("workout_plan_days")
        .select("workout_plan_exercises(sets, reps, reps_max, order_index, duration_seconds, exercises(name))")
        .eq("plan_id", plan.id)
        .eq("day_of_week", todayDow)
        .then(unwrap),
      client.from("workout_plan_days").select("day_of_week, workout_plan_exercises(id)").eq("plan_id", plan.id).then(unwrap),
      client
        .from("workout_sessions")
        .select("day_of_week")
        .eq("user_id", userId)
        .gte("completed_at", mondayOfWeekAR(now))
        .then(unwrap),
    ])

    const exercises = (todayDays ?? [])
      .flatMap((d) => d.workout_plan_exercises ?? [])
      .sort((a, b) => a.order_index - b.order_index)
      .map((pe) => ({ name: pe.exercises?.name ?? "Ejercicio", prescription: formatPrescription(pe) }))

    homePlan = { name: plan.name, dayName: dayNameAR(now), exercises }

    week = buildWeek({
      trainingDows: (allDays ?? []).filter((d) => (d.workout_plan_exercises ?? []).length > 0).map((d) => d.day_of_week),
      completedDows: (weekSessions ?? []).map((s) => s.day_of_week),
      todayDow,
    })
  }

  return {
    greeting: greetingFor(hourAR(now), profile?.full_name ?? null),
    membership: membershipStatusFor(profile?.membership_expires_at ?? null, now),
    plan: homePlan,
    week,
    streak: streakFromInstants(
      (recent ?? []).map((s) => s.completed_at),
      todayAR(now),
    ),
  }
}
