import React, { useEffect } from "react"
import { Stack, useRouter, useSegments } from "expo-router"
import { AuthProvider, useAuth } from "../lib/auth/AuthContext"
import { View, ActivityIndicator } from "react-native"
import { colors } from "../constants/theme"

function Gate({ children }: { children: React.ReactNode }) {
  const { session, loading, membershipBlocked } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    const currentRoute = segments[0]

    if (membershipBlocked) {
      if (currentRoute !== "membership-expired") {
        router.replace("/membership-expired")
      }
      return
    }

    if (!session) {
      if (currentRoute !== "login") {
        router.replace("/login")
      }
      return
    }

    if (currentRoute === "login" || currentRoute === "membership-expired") {
      router.replace("/")
    }
  }, [session, loading, membershipBlocked, segments, router])

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center" }}>
        <ActivityIndicator color={colors.brand} />
      </View>
    )
  }

  return <>{children}</>
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Gate>
        <Stack screenOptions={{ headerShown: false }} />
      </Gate>
    </AuthProvider>
  )
}
