import React from "react"
import { View, Text, Pressable, StyleSheet } from "react-native"
import { colors, fonts } from "../../constants/theme"
import type { MemberHomeData } from "../../lib/home/memberHome"
import MembershipCard from "./MembershipCard"
import TodayWorkoutCard from "./TodayWorkoutCard"
import WeekCard from "./WeekCard"

type Props = { data: MemberHomeData; onSignOut: () => void }

export function SignOutButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={styles.signOut} onPress={onPress} accessibilityRole="button">
      <Text style={styles.signOutText}>Cerrar sesión</Text>
    </Pressable>
  )
}

export default function HomeContent({ data, onSignOut }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>{data.greeting}</Text>
      <MembershipCard membership={data.membership} />
      <TodayWorkoutCard plan={data.plan} />
      {data.week && <WeekCard week={data.week} streak={data.streak} />}
      <SignOutButton onPress={onSignOut} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  greeting: { color: colors.text, fontFamily: fonts.heading, fontSize: 28, marginBottom: 4 },
  signOut: { borderColor: colors.textMuted, borderWidth: 1, borderRadius: 8, padding: 14, alignItems: "center", marginTop: 8 },
  signOutText: { color: colors.text, fontFamily: fonts.body, fontWeight: "600" },
})
