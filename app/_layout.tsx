import React from "react"
import { Stack, Redirect } from "expo-router"
import { AuthProvider, useAuth } from "../lib/auth/AuthContext"
import { View, ActivityIndicator } from "react-native"
import { colors } from "../constants/theme"

function Gate({ children }: { children: React.ReactNode }) {
  const { session, loading, membershipBlocked } = useAuth()

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center" }}>
        <ActivityIndicator color={colors.brand} />
      </View>
    )
  }

  if (membershipBlocked) {
    return <Redirect href="/membership-expired" />
  }

  if (!session) {
    return <Redirect href="/login" />
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
