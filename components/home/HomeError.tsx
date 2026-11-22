import React from "react"
import { View, Text, Pressable, StyleSheet } from "react-native"
import { colors, fonts } from "../../constants/theme"
import { SignOutButton } from "./HomeContent"

type Props = { onRetry: () => void; onSignOut: () => void }

export default function HomeError({ onRetry, onSignOut }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>No pudimos cargar tu inicio</Text>
      <Text style={styles.body}>Revisá tu conexión e intentá de nuevo.</Text>
      <Pressable style={styles.retry} onPress={onRetry} accessibilityRole="button">
        <Text style={styles.retryText}>Reintentar</Text>
      </Pressable>
      <SignOutButton onPress={onSignOut} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  title: { color: colors.error, fontFamily: fonts.heading, fontSize: 24 },
  body: { color: colors.text, fontFamily: fonts.body },
  retry: { backgroundColor: colors.brand, borderRadius: 8, padding: 14, alignItems: "center", marginTop: 4 },
  retryText: { color: colors.text, fontFamily: fonts.body, fontWeight: "600" },
})
