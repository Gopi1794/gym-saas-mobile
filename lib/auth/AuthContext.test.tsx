import React from "react"
import { render, waitFor, act, fireEvent } from "@testing-library/react-native"
import { Text, Pressable } from "react-native"
import { AuthProvider, useAuth } from "./AuthContext"
import { supabase } from "../supabase/client"
import { authenticateWithBiometrics, getBiometricPreference } from "./biometric"

jest.mock("../supabase/client", () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn(),
  },
}))

jest.mock("./biometric", () => ({
  getBiometricPreference: jest.fn(),
  authenticateWithBiometrics: jest.fn(),
}))

function Probe() {
  const { session, loading, membershipBlocked } = useAuth()
  return (
    <Text testID="probe">
      {JSON.stringify({ hasSession: !!session, loading, membershipBlocked })}
    </Text>
  )
}

function mockProfileQuery(profile: { role: string; membership_expires_at: string | null }) {
  ;(supabase.from as jest.Mock).mockReturnValue({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: profile, error: null }),
  })
}

function mockDelayedProfileQuery(
  profile: { role: string; membership_expires_at: string | null },
  resolvers: { resolve: () => void }[]
) {
  ;(supabase.from as jest.Mock).mockReturnValue({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(
      () =>
        new Promise((resolve) => {
          resolvers.push({ resolve: () => resolve({ data: profile, error: null }) })
        })
    ),
  })
}

function ProbeWithSignOut() {
  const { session, loading, membershipBlocked, signOut } = useAuth()
  return (
    <>
      <Text testID="probe">
        {JSON.stringify({ hasSession: !!session, loading, membershipBlocked })}
      </Text>
      <Pressable testID="signout" onPress={() => signOut()} />
    </>
  )
}

describe("AuthProvider", () => {
  beforeEach(() => jest.clearAllMocks())

  it("starts with loading=true and no session when nothing is stored", async () => {
    ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: null } })
    ;(getBiometricPreference as jest.Mock).mockResolvedValue(false)

    const { getByTestId } = render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    )

    await waitFor(() => {
      const parsed = JSON.parse(getByTestId("probe").props.children)
      expect(parsed.loading).toBe(false)
      expect(parsed.hasSession).toBe(false)
    })
  })

  it("blocks navigation when biometrics are enabled but authentication fails", async () => {
    const fakeSession = { user: { id: "user-1" } }
    ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: fakeSession } })
    ;(getBiometricPreference as jest.Mock).mockResolvedValue(true)
    ;(authenticateWithBiometrics as jest.Mock).mockResolvedValue(false)

    const { getByTestId } = render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    )

    await waitFor(() => {
      const parsed = JSON.parse(getByTestId("probe").props.children)
      expect(parsed.loading).toBe(false)
      expect(parsed.hasSession).toBe(false)
    })
  })

  it("marks membershipBlocked true for an expired member profile", async () => {
    const fakeSession = { user: { id: "user-1" } }
    ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: fakeSession } })
    ;(getBiometricPreference as jest.Mock).mockResolvedValue(false)
    mockProfileQuery({ role: "member", membership_expires_at: "2020-01-01T00:00:00.000Z" })

    const { getByTestId } = render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    )

    await waitFor(() => {
      const parsed = JSON.parse(getByTestId("probe").props.children)
      expect(parsed.membershipBlocked).toBe(true)
    })
    expect(supabase.auth.signOut).toHaveBeenCalled()
  })

  it("clears membershipBlocked when signOut is called while blocked", async () => {
    const fakeSession = { user: { id: "user-1" } }
    ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: fakeSession } })
    ;(getBiometricPreference as jest.Mock).mockResolvedValue(false)
    mockProfileQuery({ role: "member", membership_expires_at: "2020-01-01T00:00:00.000Z" })

    const { getByTestId } = render(
      <AuthProvider>
        <ProbeWithSignOut />
      </AuthProvider>
    )

    await waitFor(() => {
      const parsed = JSON.parse(getByTestId("probe").props.children)
      expect(parsed.membershipBlocked).toBe(true)
    })

    await act(async () => {
      fireEvent.press(getByTestId("signout"))
    })

    await waitFor(() => {
      const parsed = JSON.parse(getByTestId("probe").props.children)
      expect(parsed.membershipBlocked).toBe(false)
    })
  })

  it("does not update state after unmount while applySession is still in flight", async () => {
    const fakeSession = { user: { id: "user-1" } }
    ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: fakeSession } })
    ;(getBiometricPreference as jest.Mock).mockResolvedValue(false)

    const pending: { resolve: () => void }[] = []
    mockDelayedProfileQuery({ role: "member", membership_expires_at: null }, pending)

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {})

    const { unmount } = render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(pending.length).toBe(1)
    })

    unmount()

    await act(async () => {
      pending[0].resolve()
      await Promise.resolve()
      await Promise.resolve()
    })

    const stateUpdateWarning = consoleErrorSpy.mock.calls.some((call) =>
      String(call[0]).includes("Can't perform a React state update on an unmounted component")
    )
    expect(stateUpdateWarning).toBe(false)

    consoleErrorSpy.mockRestore()
  })
})
