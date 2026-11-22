import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { colors, fonts } from "../../constants/theme"
import type { HomePlan } from "../../lib/home/memberHome"
import { homeColors } from "./homeColors"

export default function TodayWorkoutCard({ plan }: { plan: HomePlan | null }) {
  if (!plan) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Sin plan asignado</Text>
        <Text style={styles.body}>Tu entrenador todavía no te asignó una rutina.</Text>
      </View>
    )
  }

  if (plan.exercises.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Hoy · {plan.dayName}</Text>
        <Text style={styles.title}>Sin rutina hoy</Text>
        <Text style={styles.body}>El entrenador no programó ejercicios para hoy.</Text>
      </View>
    )
  }

  const count = plan.exercises.length
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>Hoy · {plan.dayName}</Text>
      <Text style={styles.title}>{plan.name}</Text>
      <Text style={styles.count}>
        {count} {count === 1 ? "ejercicio" : "ejercicios"}
      </Text>
      <View style={styles.list}>
        {plan.exercises.map((ex, i) => (
          <View key={`${ex.name}-${i}`} style={styles.row}>
            <Text style={styles.exName} numberOfLines={1}>
              {ex.name}
            </Text>
            <Text style={styles.exRx}>{ex.prescription}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: homeColors.surface, borderColor: homeColors.border, borderWidth: 1, borderRadius: 16, padding: 16, gap: 4 },
  eyebrow: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 12, letterSpacing: 1 },
  title: { color: colors.text, fontFamily: fonts.heading, fontSize: 24 },
  count: { color: colors.brand, fontFamily: fonts.body, fontSize: 13, fontWeight: "600" },
  body: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 14 },
  list: { marginTop: 12, gap: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 },
  exName: { color: colors.text, fontFamily: fonts.body, fontSize: 15, flex: 1 },
  exRx: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 14 },
})
