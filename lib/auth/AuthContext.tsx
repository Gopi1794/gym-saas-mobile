import React, { createContext, useContext, useEffect, useState } from "react"
import type { Session } from "@supabase/supabase-js"
import { supabase } from "../supabase/client"
import { isMembershipBlocked } from "./membershipGate"
import { authenticateWithBiometrics, getBiometricPreference } from "./biometric"

type AuthContextValue = {
  session: Session | null
  loading: boolean
  membershipBlocked: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function checkMembership(userId: string): Promise<boolean> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, membership_expires_at")
    .eq("id", userId)
    .single()

  if (!profile) return true

  return isMembershipBlocked(profile as { role: string; membership_expires_at: string | null })
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [membershipBlocked, setMembershipBlocked] = useState(false)

  async function applySession(nextSession: Session | null, isMounted: () => boolean) {
    if (!nextSession) {
      if (isMounted()) {
        setSession(null)
        setMembershipBlocked(false)
      }
      return
    }

    const blocked = await checkMembership(nextSession.user.id)
    if (blocked) {
      await supabase.auth.signOut()
      if (isMounted()) {
        setSession(null)
        setMembershipBlocked(true)
      }
      return
    }

    if (isMounted()) {
      setMembershipBlocked(false)
      setSession(nextSession)
    }
  }

  useEffect(() => {
    let mounted = true
    const isMounted = () => mounted

    async function bootstrap() {
      const { data } = await supabase.auth.getSession()
      const storedSession = data.session

      if (storedSession) {
        const biometricEnabled = await getBiometricPreference()
        if (biometricEnabled) {
          const authenticated = await authenticateWithBiometrics()
          if (!authenticated) {
            await supabase.auth.signOut()
            if (isMounted()) {
              setSession(null)
              setLoading(false)
            }
            return
          }
        }
      }

      await applySession(storedSession, isMounted)
      if (isMounted()) setLoading(false)
    }

    bootstrap()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      applySession(nextSession, isMounted)
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: "Email o contraseña incorrectos" }
    return { error: null }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setSession(null)
    setMembershipBlocked(false)
  }

  return (
    <AuthContext.Provider value={{ session, loading, membershipBlocked, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
