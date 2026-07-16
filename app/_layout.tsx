import React, { useEffect } from "react"
import { Stack, useRouter, useSegments } from "expo-router"
import { AuthProvider, useAuth } from "../lib/auth/AuthContext"
import { View, ActivityIndicator } from "react-native"
import { useFonts } from "expo-font"
import { Anton_400Regular } from "@expo-google-fonts/anton"
import { Inter_400Regular } from "@expo-google-fonts/inter"
import { colors, fonts } from "../constants/theme"

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
  const [fontsLoaded] = useFonts({
    [fonts.heading]: Anton_400Regular,
    [fonts.body]: Inter_400Regular,
  })

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center" }}>
        <ActivityIndicator color={colors.brand} />
      </View>
    )
  }

  return (
    <AuthProvider>
      <Gate>
        <Stack screenOptions={{ headerShown: false }} />
      </Gate>
    </AuthProvider>
  )
}
