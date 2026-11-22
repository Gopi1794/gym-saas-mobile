import React, { useRef, useState } from "react"
import { View, TextInput, Text, Pressable, StyleSheet, Alert } from "react-native"
import { router } from "expo-router"
import { useAuth } from "../lib/auth/AuthContext"
import { colors, fonts } from "../constants/theme"
import AnimatedGradientBackground from "../components/AnimatedGradientBackground"
import TurnstileCaptcha, { type TurnstileCaptchaHandle } from "../components/TurnstileCaptcha"
import { canSubmitWithCaptcha } from "../lib/captcha/turnstile"
import { getBiometricPreference, setBiometricPreference } from "../lib/auth/biometric"

export default function LoginScreen() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const captchaRef = useRef<TurnstileCaptchaHandle>(null)
  const canSubmit = canSubmitWithCaptcha({ token: captchaToken, busy: loading })

  async function handleSubmit() {
    if (captchaToken === null) return
    setError(null)
    setLoading(true)
    const result = await signIn(email, password, captchaToken)
    setLoading(false)
    // Tokens are single-use: always ask for a fresh one after an attempt.
    captchaRef.current?.reset()

    if (result.error) {
      setError(result.error)
      return
    }

    const biometricAlreadyEnabled = await getBiometricPreference()
    if (!biometricAlreadyEnabled) {
      await new Promise<void>((resolve) => {
        Alert.alert(
          "¿Activar Face ID / huella?",
          "Podés usarlo para tu próximo acceso.",
          [
            {
              text: "No, gracias",
              style: "cancel",
              onPress: () => resolve(),
            },
            {
              text: "Activar",
              onPress: async () => {
                await setBiometricPreference(true)
                resolve()
              },
            },
          ]
        )
      })
    }

    router.replace("/")
  }

  return (
    <View style={styles.container}>
      <AnimatedGradientBackground />
      <Text style={styles.title}>Voltia</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor={colors.textMuted}
        secureTextEntry
        autoCapitalize="none"
        value={password}
        onChangeText={setPassword}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <TurnstileCaptcha ref={captchaRef} onToken={setCaptchaToken} />

      <Pressable
        style={[styles.button, !canSubmit && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!canSubmit}
      >
        <Text style={styles.buttonText}>{loading ? "Ingresando..." : "Iniciar sesión"}</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/forgot-password")}>
        <Text style={styles.link}>Olvidé mi contraseña</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: "center", padding: 24, gap: 16 },
  title: { color: colors.brand, fontSize: 32, fontFamily: fonts.heading, textAlign: "center", marginBottom: 24 },
  input: { borderWidth: 1, borderColor: "#333", borderRadius: 8, padding: 12, color: colors.text, fontFamily: fonts.body },
  button: { backgroundColor: colors.brand, borderRadius: 8, padding: 14, alignItems: "center" },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: colors.text, fontWeight: "600", fontFamily: fonts.body },
  error: { color: colors.error, textAlign: "center", fontFamily: fonts.body },
  link: { color: colors.textMuted, textAlign: "center", marginTop: 8, fontFamily: fonts.body },
})
