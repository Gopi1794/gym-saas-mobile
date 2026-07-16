import React, { useState } from "react"
import { View, TextInput, Text, Pressable, StyleSheet } from "react-native"
import { router } from "expo-router"
import * as Linking from "expo-linking"
import { supabase } from "../lib/supabase/client"
import { parseResetPasswordLink } from "../lib/auth/deepLink"
import { colors } from "../constants/theme"

export default function ResetPasswordScreen() {
  const url = Linking.useURL()
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    const tokens = url ? parseResetPasswordLink(url) : null

    if (!tokens) {
      setError("Link inválido o vencido")
      return
    }

    setSaving(true)
    setError(null)

    const { error: sessionError } = await supabase.auth.setSession({
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    })

    if (sessionError) {
      setError("Link inválido o vencido")
      setSaving(false)
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({ password })
    setSaving(false)

    if (updateError) {
      setError("No se pudo actualizar la contraseña")
      return
    }

    router.replace("/login")
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Nueva contraseña"
        placeholderTextColor={colors.textMuted}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Pressable style={styles.button} onPress={handleSave} disabled={saving}>
        <Text style={styles.buttonText}>{saving ? "Guardando..." : "Guardar nueva contraseña"}</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: "center", padding: 24, gap: 16 },
  title: { color: colors.brand, fontSize: 24, fontFamily: "Anton_400Regular", textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#333", borderRadius: 8, padding: 12, color: colors.text },
  button: { backgroundColor: colors.brand, borderRadius: 8, padding: 14, alignItems: "center" },
  buttonText: { color: colors.text, fontWeight: "600" },
  error: { color: colors.error, textAlign: "center" },
})
