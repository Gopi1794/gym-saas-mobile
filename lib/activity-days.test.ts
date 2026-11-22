import { countsByDayAR, streakFromInstants } from "./activity-days"

describe("streakFromInstants", () => {
  it("counts consecutive days backwards from the reference day", () => {
    const completions = [
      "2026-09-27T12:00:00Z",
      "2026-09-26T12:00:00Z",
      "2026-09-24T12:00:00Z", // breaks the streak: the 25th is missing
    ]
    expect(streakFromInstants(completions, "2026-09-27")).toBe(2)
  })

  it("counts a 01:30 UTC instant for the previous Argentina day, not the UTC day", () => {
    // 2026-09-28T01:30:00Z is 22:30 on the 27th in Argentina.
    const completions = ["2026-09-28T01:30:00Z"]
    expect(streakFromInstants(completions, "2026-09-27")).toBe(1)
    expect(streakFromInstants(completions, "2026-09-28")).toBe(0)
  })

  it("covers the whole 21:00-23:59 AR window (00:00-02:59 UTC next day)", () => {
    expect(streakFromInstants(["2026-09-28T00:00:00Z"], "2026-09-27")).toBe(1)
    expect(streakFromInstants(["2026-09-28T02:59:00Z"], "2026-09-27")).toBe(1)
    expect(streakFromInstants(["2026-09-28T03:00:00Z"], "2026-09-27")).toBe(0)
  })

  it("is 0 when the reference day has no instant", () => {
    expect(streakFromInstants(["2026-09-25T12:00:00Z"], "2026-09-27")).toBe(0)
  })

  it("is 0 for an empty list", () => {
    expect(streakFromInstants([], "2026-09-27")).toBe(0)
  })
})

describe("countsByDayAR", () => {
  it("groups by Argentina calendar day, not UTC day", () => {
    const items = ["2026-09-28T01:30:00Z", "2026-09-26T15:00:00Z"]
    expect(countsByDayAR(items, "2026-09-27", 3)).toEqual([0, 1, 1])
  })

  it("counts several instants on the same day", () => {
    expect(countsByDayAR(["2026-09-27T10:00:00Z", "2026-09-27T20:00:00Z"], "2026-09-27", 1)).toEqual([2])
  })

  it("returns 0 for days without instants", () => {
    expect(countsByDayAR([], "2026-09-27", 2)).toEqual([0, 0])
  })
})
