import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { colors, fonts } from "../../constants/theme"
import type { DayStatus, WeekSummary } from "../../lib/home/memberHome"
import { homeColors } from "./homeColors"

const DOT: Record<DayStatus, { bg: string; mark: string }> = {
  completed: { bg: homeColors.success, mark: "✓" },
  missed: { bg: homeColors.danger, mark: "✕" },
  rest: { bg: homeColors.rest, mark: "" },
  "today-pending": { bg: homeColors.success, mark: "•" },
  future: { bg: homeColors.future, mark: "" },
}

type Props = { week: WeekSummary; streak: number }

export default function WeekCard({ week, streak }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Tu semana</Text>
      <View style={styles.days}>
        {week.days.map((d, i) => (
          <View key={i} style={styles.day}>
            <View
              style={[
                styles.dot,
                { backgroundColor: DOT[d.status].bg },
                d.status === "today-pending" && styles.today,
              ]}
            >
              <Text style={styles.mark}>{DOT[d.status].mark}</Text>
            </View>
            <Text style={styles.dayLabel}>{d.label}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.summary}>
        {week.completed} de {week.planned} {week.planned === 1 ? "día completado" : "días completados"}
      </Text>
      <Text style={styles.streak}>
        Racha: {streak} {streak === 1 ? "día" : "días"}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: homeColors.surface, borderColor: homeColors.border, borderWidth: 1, borderRadius: 16, padding: 16, gap: 8 },
  label: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 12, letterSpacing: 1 },
  days: { flexDirection: "row", justifyContent: "space-between", marginVertical: 4 },
  day: { alignItems: "center", gap: 6 },
  dot: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  today: { borderWidth: 2, borderColor: colors.text },
  mark: { color: "#0A0A0A", fontWeight: "700", fontSize: 14 },
  dayLabel: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 11 },
  summary: { color: colors.text, fontFamily: fonts.body, fontSize: 15 },
  streak: { color: colors.brand, fontFamily: fonts.body, fontSize: 14, fontWeight: "600" },
})
