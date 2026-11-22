import { daysUntilAR } from "../date-ar"

type ProfileForGate = {
  role: string
  membership_expires_at: string | null
}

export function isMembershipBlocked(profile: ProfileForGate): boolean {
  if (profile.role === "admin" || profile.role === "trainer") {
    return false
  }

  if (!profile.membership_expires_at) {
    return true
  }

  // Compare Argentina calendar days, not instants: the member keeps access
  // through the whole expiry day, matching the web middleware.
  return daysUntilAR(profile.membership_expires_at) < 0
}
