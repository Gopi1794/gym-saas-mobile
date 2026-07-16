import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { colors } from "../constants/theme"

export default function MembershipExpiredScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Membresía vencida</Text>
      <Text style={styles.message}>Regularizá tu situación en el gimnasio para volver a acceder.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: "center", padding: 24, gap: 12 },
  title: { color: colors.brand, fontSize: 24, fontFamily: "Anton_400Regular", textAlign: "center" },
  message: { color: colors.text, textAlign: "center" },
})
