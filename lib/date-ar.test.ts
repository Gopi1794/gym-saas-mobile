import { dayAR, daysUntilAR } from "./date-ar"

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
