import { dayAR, daysUntilAR, dayOfWeekAR, hourAR, mondayOfWeekAR } from "./date-ar"

describe("dayAR", () => {
  it("returns the Argentina day, not the UTC day, between 00:00 and 02:59 UTC", () => {
    // 01:30 UTC on the 3rd is 22:30 on the 2nd in Argentina.
    expect(dayAR("2026-08-03T01:30:00Z")).toBe("2026-08-02")
  })

  it("matches the UTC day at midday", () => {
    expect(dayAR(new Date("2026-08-03T15:00:00Z"))).toBe("2026-08-03")
  })
})

describe("daysUntilAR", () => {
  afterEach(() => {
    jest.useRealTimers()
  })

  it("counts calendar days from today in Argentina", () => {
    jest.useFakeTimers({ now: new Date("2026-08-01T15:00:00Z") })
    expect(daysUntilAR("2026-08-03T00:00:00.000Z")).toBe(2)
    expect(daysUntilAR("2026-08-01T00:00:00.000Z")).toBe(0)
    expect(daysUntilAR("2026-07-31T00:00:00.000Z")).toBe(-1)
  })
})

describe("hourAR", () => {
  it("returns the Argentina hour, not the UTC hour", () => {
    // 01:30 UTC is 22:30 the previous day in Argentina.
    expect(hourAR(new Date("2026-08-03T01:30:00Z"))).toBe(22)
    expect(hourAR(new Date("2026-08-03T15:00:00Z"))).toBe(12)
  })

  it("returns 0 (never 24) just after Argentina midnight", () => {
    expect(hourAR(new Date("2026-08-03T03:05:00Z"))).toBe(0)
  })
})

describe("dayOfWeekAR", () => {
  it("uses the Argentina calendar day (0 = Sunday)", () => {
    // 2026-08-03 is a Monday; 01:30 UTC is still Sunday the 2nd in Argentina.
    expect(dayOfWeekAR(new Date("2026-08-03T15:00:00Z"))).toBe(1)
    expect(dayOfWeekAR(new Date("2026-08-03T01:30:00Z"))).toBe(0)
  })
})

describe("mondayOfWeekAR", () => {
  it("returns Monday 00:00 AR as a UTC instant for a mid-week day", () => {
    // Wednesday 2026-08-05 -> Monday 2026-08-03 00:00 AR = 03:00 UTC.
    expect(mondayOfWeekAR(new Date("2026-08-05T15:00:00Z"))).toBe("2026-08-03T03:00:00.000Z")
  })

  it("returns the previous Monday on a Sunday", () => {
    expect(mondayOfWeekAR(new Date("2026-08-09T15:00:00Z"))).toBe("2026-08-03T03:00:00.000Z")
  })

  it("keeps the Sunday 21:00-23:59 AR window in the same week", () => {
    // 2026-08-10T01:30:00Z is Sunday 2026-08-09 22:30 AR: still the week of the 3rd.
    expect(mondayOfWeekAR(new Date("2026-08-10T01:30:00Z"))).toBe("2026-08-03T03:00:00.000Z")
  })

  it("starts the new week at Argentina midnight, not UTC midnight", () => {
    // 2026-08-10T02:59Z is still Sunday 23:59 AR; 03:00Z is Monday 00:00 AR.
    expect(mondayOfWeekAR(new Date("2026-08-10T02:59:00Z"))).toBe("2026-08-03T03:00:00.000Z")
    expect(mondayOfWeekAR(new Date("2026-08-10T03:00:00Z"))).toBe("2026-08-10T03:00:00.000Z")
  })
})

describe("daysUntilAR with an explicit now", () => {
  it("counts from the given instant", () => {
    expect(daysUntilAR("2026-08-10T00:00:00.000Z", new Date("2026-08-05T15:00:00Z"))).toBe(5)
  })
})
