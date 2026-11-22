import {
  buildWeek,
  formatPrescription,
  greetingFor,
  membershipStatusFor,
  todayDowAR,
} from "./memberHome"

describe("greetingFor", () => {
  it("picks the salutation by Argentina hour and appends the first name", () => {
    expect(greetingFor(8, "Gabriel Gomez")).toBe("Buenos días, Gabriel")
    expect(greetingFor(11, "Gabriel Gomez")).toBe("Buenos días, Gabriel")
    expect(greetingFor(12, "Gabriel Gomez")).toBe("Buenas tardes, Gabriel")
    expect(greetingFor(17, "Gabriel Gomez")).toBe("Buenas tardes, Gabriel")
    expect(greetingFor(18, "Gabriel Gomez")).toBe("Buenas noches, Gabriel")
    expect(greetingFor(23, "Gabriel Gomez")).toBe("Buenas noches, Gabriel")
  })

  it("omits the name when the profile has none", () => {
    expect(greetingFor(9, null)).toBe("Buenos días")
    expect(greetingFor(9, "   ")).toBe("Buenos días")
  })
})

describe("todayDowAR", () => {
  it("maps to 0 = Monday ... 6 = Sunday using the Argentina day", () => {
    expect(todayDowAR(new Date("2026-08-03T15:00:00Z"))).toBe(0) // Monday
    expect(todayDowAR(new Date("2026-08-09T15:00:00Z"))).toBe(6) // Sunday
  })

  it("still reads Sunday during the 21:00-23:59 AR window (UTC already Monday)", () => {
    expect(todayDowAR(new Date("2026-08-10T01:30:00Z"))).toBe(6)
  })
})

describe("formatPrescription", () => {
  it("shows sets x reps", () => {
    expect(formatPrescription({ sets: 3, reps: 12, reps_max: null, duration_seconds: null })).toBe("3 × 12")
  })

  it("shows a reps range when reps_max is set", () => {
    expect(formatPrescription({ sets: 4, reps: 8, reps_max: 12, duration_seconds: null })).toBe("4 × 8–12")
  })

  it("prefers duration for timed exercises", () => {
    expect(formatPrescription({ sets: 3, reps: 0, reps_max: null, duration_seconds: 45 })).toBe("3 × 45 s")
  })
})

describe("membershipStatusFor", () => {
  const now = new Date("2026-08-05T15:00:00Z")

  it("reports no membership date", () => {
    expect(membershipStatusFor(null, now)).toEqual({ kind: "none", daysLeft: null })
  })

  it("is active beyond 7 days", () => {
    expect(membershipStatusFor("2026-08-13T00:00:00.000Z", now)).toEqual({ kind: "active", daysLeft: 8 })
  })

  it("warns at exactly 7 days", () => {
    expect(membershipStatusFor("2026-08-12T00:00:00.000Z", now)).toEqual({ kind: "expiring", daysLeft: 7 })
  })

  it("warns on the expiry day itself", () => {
    expect(membershipStatusFor("2026-08-05T00:00:00.000Z", now)).toEqual({ kind: "expiring", daysLeft: 0 })
  })

  it("is expired once the day has passed", () => {
    expect(membershipStatusFor("2026-08-04T00:00:00.000Z", now)).toEqual({ kind: "expired", daysLeft: -1 })
  })
})

describe("buildWeek", () => {
  it("counts planned days (with exercises) and distinct completed days", () => {
    const week = buildWeek({ trainingDows: [0, 2, 4], completedDows: [0, 0, 2], todayDow: 3 })
    expect(week.planned).toBe(3)
    expect(week.completed).toBe(2)
  })

  it("marks each day: completed, missed, rest, pending today, future", () => {
    const week = buildWeek({ trainingDows: [0, 1, 3, 5], completedDows: [0], todayDow: 3 })
    expect(week.days.map((d) => d.status)).toEqual([
      "completed", // Mon trained
      "missed", // Tue planned, not done
      "rest", // Wed no exercises
      "today-pending", // Thu planned, not done yet
      "future", // Fri
      "future", // Sat
      "future", // Sun
    ])
    expect(week.days.map((d) => d.label)).toEqual(["L", "M", "X", "J", "V", "S", "D"])
  })

  it("marks today as rest when it has no exercises and as completed when done", () => {
    expect(buildWeek({ trainingDows: [0], completedDows: [], todayDow: 2 }).days[2].status).toBe("rest")
    expect(buildWeek({ trainingDows: [2], completedDows: [2], todayDow: 2 }).days[2].status).toBe("completed")
  })

  it("counts a completed day even if the plan has no exercises for it", () => {
    const week = buildWeek({ trainingDows: [], completedDows: [1], todayDow: 4 })
    expect(week.completed).toBe(1)
    expect(week.days[1].status).toBe("completed")
  })
})
