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
