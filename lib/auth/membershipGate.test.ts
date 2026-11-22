import { isMembershipBlocked } from "./membershipGate"

describe("isMembershipBlocked", () => {
  it("blocks a member with an expired membership", () => {
    const blocked = isMembershipBlocked({
      role: "member",
      membership_expires_at: "2020-01-01T00:00:00.000Z",
    })
    expect(blocked).toBe(true)
  })

  it("does not block a member with an active membership", () => {
    const future = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()
    const blocked = isMembershipBlocked({ role: "member", membership_expires_at: future })
    expect(blocked).toBe(false)
  })

  it("blocks a member with no membership_expires_at set", () => {
    const blocked = isMembershipBlocked({ role: "member", membership_expires_at: null })
    expect(blocked).toBe(true)
  })

  it("never blocks staff, regardless of membership_expires_at", () => {
    expect(isMembershipBlocked({ role: "admin", membership_expires_at: null })).toBe(false)
    expect(isMembershipBlocked({ role: "trainer", membership_expires_at: "2020-01-01T00:00:00.000Z" })).toBe(false)
  })
})

// Expiry dates set by hand on the web are stored as midnight UTC of the chosen
// day. Argentina is UTC-3, so that instant is still the previous evening there.
// The gate must compare Argentina calendar days, like the web middleware does.
describe("isMembershipBlocked — Argentina calendar day", () => {
  const member = { role: "member", membership_expires_at: "2026-08-03T00:00:00.000Z" }

  afterEach(() => {
    jest.useRealTimers()
  })

  it("does not block the evening before the expiry day (01:30 UTC = 22:30 AR of the previous day)", () => {
    jest.useFakeTimers({ now: new Date("2026-08-03T01:30:00Z") })
    expect(isMembershipBlocked(member)).toBe(false)
  })

  it("does not block during the last valid day in Argentina", () => {
    jest.useFakeTimers({ now: new Date("2026-08-03T15:00:00Z") })
    expect(isMembershipBlocked(member)).toBe(false)
  })

  it("blocks once the next Argentina day starts (03:30 UTC = 00:30 AR)", () => {
    jest.useFakeTimers({ now: new Date("2026-08-04T03:30:00Z") })
    expect(isMembershipBlocked(member)).toBe(true)
  })
})
