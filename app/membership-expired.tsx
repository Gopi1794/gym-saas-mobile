import React from "react"
import { View, Text, Pressable, StyleSheet } from "react-native"
import { colors, fonts } from "../constants/theme"
import { useAuth } from "../lib/auth/AuthContext"

export default function MembershipExpiredScreen() {
  const { signOut } = useAuth()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Membresía vencida</Text>
      <Text style={styles.message}>Regularizá tu situación en el gimnasio para volver a acceder.</Text>

      <Pressable style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: "center", padding: 24, gap: 12 },
  title: { color: colors.brand, fontSize: 24, fontFamily: "Anton_400Regular", textAlign: "center" },
  message: { color: colors.text, textAlign: "center" },
  button: { backgroundColor: colors.brand, borderRadius: 8, padding: 14, alignItems: "center", marginTop: 12 },
  buttonText: { color: colors.text, fontWeight: "600", fontFamily: fonts.body },
})
