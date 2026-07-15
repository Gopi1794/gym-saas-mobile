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

  return new Date(profile.membership_expires_at) <= new Date()
}
