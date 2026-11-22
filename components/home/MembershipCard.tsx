import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { colors, fonts } from "../../constants/theme"
import type { MembershipStatus } from "../../lib/home/memberHome"
import { homeColors } from "./homeColors"

function headline(m: MembershipStatus): string {
  if (m.kind === "none") return "Sin vencimiento registrado"
  if (m.kind === "expired") return "Membresía vencida"
  if (m.daysLeft === 0) return "Vence hoy"
  return `Vence en ${m.daysLeft} ${m.daysLeft === 1 ? "día" : "días"}`
}

export default function MembershipCard({ membership }: { membership: MembershipStatus }) {
  const needsRenewal = membership.kind === "expiring" || membership.kind === "expired"
  const accent = membership.kind === "expired" ? homeColors.danger : needsRenewal ? homeColors.warning : homeColors.success

  return (
    <View style={[styles.card, needsRenewal && { borderColor: accent }]}>
      <Text style={styles.label}>Membresía</Text>
      <Text style={[styles.headline, { color: membership.kind === "none" ? colors.textMuted : accent }]}>
        {headline(membership)}
      </Text>
      {needsRenewal && <Text style={styles.notice}>Renovala en el gimnasio o desde la web.</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: homeColors.surface, borderColor: homeColors.border, borderWidth: 1, borderRadius: 16, padding: 16, gap: 4 },
  label: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 12, letterSpacing: 1 },
  headline: { fontFamily: fonts.body, fontSize: 18, fontWeight: "600" },
  notice: { color: colors.text, fontFamily: fonts.body, fontSize: 14, marginTop: 4 },
})
