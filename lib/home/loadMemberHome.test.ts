import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "../../types/database"
import { loadMemberHome } from "./loadMemberHome"

type Query = { table: string; select: string; filters: Array<[string, ...unknown[]]> }
type Result = { data: unknown; error: { message: string } | null }

/** Chainable fake of the supabase query builder that records what was asked. */
function fakeClient(respond: (q: Query) => Result) {
  const queries: Query[] = []
  const client = {
    from(table: string) {
      const q: Query = { table, select: "", filters: [] }
      queries.push(q)
      const builder: Record<string, unknown> = {}
      for (const m of ["eq", "gte", "order", "limit"]) {
        builder[m] = (...args: unknown[]) => {
          q.filters.push([m, ...args])
          return builder
        }
      }
      builder.select = (cols: string) => {
        q.select = cols
        return builder
      }
      builder.maybeSingle = () => Promise.resolve(respond(q))
      builder.then = (resolve: (r: Result) => unknown, reject: (e: unknown) => unknown) =>
        Promise.resolve(respond(q)).then(resolve, reject)
      return builder
    },
  }
  return { client: client as unknown as SupabaseClient<Database>, queries }
}

const USER = "user-1"
// Thursday 2026-08-06, 15:00 UTC = 12:00 AR -> dow 3 (0 = Monday), afternoon.
const NOW = new Date("2026-08-06T15:00:00Z")

const ok = (data: unknown): Result => ({ data, error: null })

const RECENT_WITH_TODAY = [
  { completed_at: "2026-08-06T13:00:00Z" }, // Thu (today)
  { completed_at: "2026-08-05T18:00:00Z" }, // Wed
  { completed_at: "2026-08-04T18:00:00Z" }, // Tue
  { completed_at: "2026-08-01T18:00:00Z" }, // Sat: gap on Mon 3rd breaks the streak
]

function happyPath(recent: unknown = RECENT_WITH_TODAY) {
  return (q: Query): Result => {
    if (q.table === "profiles") {
      return ok({ full_name: "Gabriel Gomez", membership_expires_at: "2026-08-20T00:00:00.000Z" })
    }
    if (q.table === "workout_plans") return ok({ id: "plan-1", name: "Hipertrofia" })
    if (q.table === "workout_plan_days" && q.select.includes("exercises(name)")) {
      return ok([
        {
          workout_plan_exercises: [
            { sets: 3, reps: 12, reps_max: null, order_index: 1, duration_seconds: null, exercises: { name: "Remo" } },
            { sets: 4, reps: 8, reps_max: 10, order_index: 0, duration_seconds: null, exercises: { name: "Press banca" } },
            { sets: 3, reps: 0, reps_max: null, order_index: 2, duration_seconds: 45, exercises: { name: "Plancha" } },
          ],
        },
      ])
    }
    if (q.table === "workout_plan_days") {
      return ok([
        { day_of_week: 0, workout_plan_exercises: [{ id: "a" }] },
        { day_of_week: 1, workout_plan_exercises: [] },
        { day_of_week: 3, workout_plan_exercises: [{ id: "b" }] },
      ])
    }
    if (q.table === "workout_sessions" && q.select === "day_of_week") {
      return ok([{ day_of_week: 0 }, { day_of_week: 0 }])
    }
    if (q.table === "workout_sessions") return ok(recent)
    throw new Error("unexpected table " + q.table)
  }
}

describe("loadMemberHome", () => {
  it("builds the view model from the member's data", async () => {
    const { client } = fakeClient(happyPath())
    const home = await loadMemberHome(client, USER, NOW)

    expect(home.greeting).toBe("Buenas tardes, Gabriel")
    expect(home.membership).toEqual({ kind: "active", daysLeft: 14 })
    expect(home.plan).toEqual({
      name: "Hipertrofia",
      dayName: "Jueves",
      exercises: [
        { name: "Press banca", prescription: "4 × 8–10" },
        { name: "Remo", prescription: "3 × 12" },
        { name: "Plancha", prescription: "3 × 45 s" },
      ],
    })
    expect(home.week?.planned).toBe(2) // Mon and Thu have exercises; Tue is empty
    expect(home.week?.completed).toBe(1) // two Monday sessions = one distinct day
    expect(home.week?.days[3].status).toBe("today-pending")
    expect(home.streak).toBe(3)
  })

  it("scopes every query to the member", async () => {
    const { client, queries } = fakeClient(happyPath())
    await loadMemberHome(client, USER, NOW)

    const byTable = (t: string) => queries.filter((q) => q.table === t)
    expect(byTable("profiles")[0].filters).toContainEqual(["eq", "id", USER])
    expect(byTable("workout_plans")[0].filters).toContainEqual(["eq", "assigned_to", USER])
    expect(byTable("workout_plans")[0].filters).toContainEqual(["eq", "is_template", false])
    expect(byTable("workout_sessions")).toHaveLength(2)
    for (const q of byTable("workout_sessions")) {
      expect(q.filters).toContainEqual(["eq", "user_id", USER])
    }
    expect(byTable("workout_plan_days")).toHaveLength(2)
    for (const q of byTable("workout_plan_days")) {
      expect(q.filters).toContainEqual(["eq", "plan_id", "plan-1"])
    }
    const todayQuery = byTable("workout_plan_days").find((q) => q.select.includes("exercises(name)"))!
    expect(todayQuery.filters).toContainEqual(["eq", "day_of_week", 3])
  })

  it("limits this week's sessions to Monday 00:00 AR onwards", async () => {
    const { client, queries } = fakeClient(happyPath())
    await loadMemberHome(client, USER, NOW)

    const week = queries.find((q) => q.table === "workout_sessions" && q.select === "day_of_week")!
    expect(week.filters).toContainEqual(["gte", "completed_at", "2026-08-03T03:00:00.000Z"])
  })

  it("returns plan null (and no week) when no plan is assigned, still loading the streak", async () => {
    const base = happyPath()
    const { client, queries } = fakeClient((q) => (q.table === "workout_plans" ? ok(null) : base(q)))
    const home = await loadMemberHome(client, USER, NOW)

    expect(home.plan).toBeNull()
    expect(home.week).toBeNull()
    expect(home.streak).toBe(3)
    expect(queries.some((q) => q.table === "workout_plan_days")).toBe(false)
  })

  it("returns an empty exercise list for a rest day", async () => {
    const base = happyPath()
    const { client } = fakeClient((q) =>
      q.table === "workout_plan_days" && q.select.includes("exercises(name)") ? ok([]) : base(q),
    )
    const home = await loadMemberHome(client, USER, NOW)

    expect(home.plan).toEqual({ name: "Hipertrofia", dayName: "Jueves", exercises: [] })
  })

  it("has a streak of 0 until the member trains today (same rule as the web)", async () => {
    const { client } = fakeClient(happyPath([{ completed_at: "2026-08-05T18:00:00Z" }]))
    expect((await loadMemberHome(client, USER, NOW)).streak).toBe(0)
  })

  it("uses the Argentina day at night: 22:30 AR still counts for Thursday", async () => {
    const lateNow = new Date("2026-08-07T01:30:00Z") // Thu 22:30 AR, already Fri in UTC
    const { client } = fakeClient(happyPath([{ completed_at: "2026-08-07T01:00:00Z" }]))
    const home = await loadMemberHome(client, USER, lateNow)

    expect(home.greeting).toBe("Buenas noches, Gabriel")
    expect(home.plan?.dayName).toBe("Jueves")
    expect(home.streak).toBe(1)
  })

  it("handles a profile without name or membership date", async () => {
    const base = happyPath()
    const { client } = fakeClient((q) =>
      q.table === "profiles" ? ok({ full_name: null, membership_expires_at: null }) : base(q),
    )
    const home = await loadMemberHome(client, USER, NOW)

    expect(home.greeting).toBe("Buenas tardes")
    expect(home.membership).toEqual({ kind: "none", daysLeft: null })
  })

  it("throws when a query fails", async () => {
    const base = happyPath()
    const { client } = fakeClient((q) =>
      q.table === "workout_plans" ? { data: null, error: { message: "boom" } } : base(q),
    )
    await expect(loadMemberHome(client, USER, NOW)).rejects.toThrow("boom")
  })
})
