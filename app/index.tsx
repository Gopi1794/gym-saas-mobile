import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { colors } from "../constants/theme"

export default function HomeStub() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sesión iniciada. Home real fuera de alcance de este plan.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: "center", padding: 24 },
  text: { color: colors.text, textAlign: "center" },
})
