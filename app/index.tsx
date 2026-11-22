import React, { useCallback, useEffect, useState } from "react"
import { View, ScrollView, ActivityIndicator, RefreshControl, StyleSheet } from "react-native"
import { colors } from "../constants/theme"
import { useAuth } from "../lib/auth/AuthContext"
import { supabase } from "../lib/supabase/client"
import { loadMemberHome } from "../lib/home/loadMemberHome"
import type { MemberHomeData } from "../lib/home/memberHome"
import HomeContent from "../components/home/HomeContent"
import HomeError from "../components/home/HomeError"

type State = { status: "loading" } | { status: "error" } | { status: "ready"; data: MemberHomeData }

export default function HomeScreen() {
  const { session, signOut } = useAuth()
  const userId = session?.user.id
  const [state, setState] = useState<State>({ status: "loading" })
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    if (!userId) return
    try {
      setState({ status: "ready", data: await loadMemberHome(supabase, userId) })
    } catch {
      setState({ status: "error" })
    }
  }, [userId])

  useEffect(() => {
    setState({ status: "loading" })
    load()
  }, [load])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }, [load])

  const retry = useCallback(() => {
    setState({ status: "loading" })
    load()
  }, [load])

  if (state.status === "loading") {
    return (
      <View style={styles.center} testID="home-loading">
        <ActivityIndicator color={colors.brand} />
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand} />}
    >
      {state.status === "error" ? (
        <HomeError onRetry={retry} onSignOut={signOut} />
      ) : (
        <HomeContent data={state.data} onSignOut={signOut} />
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, paddingTop: 64, paddingBottom: 48 },
  center: { flex: 1, backgroundColor: colors.background, justifyContent: "center" },
})
