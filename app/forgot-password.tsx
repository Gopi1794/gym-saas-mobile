import React, { useEffect, useRef, useState } from "react"
import { View, TextInput, Text, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { router } from "expo-router"
import TurnstileCaptcha, { type TurnstileCaptchaHandle } from "../components/TurnstileCaptcha"
import { canSubmitWithCaptcha } from "../lib/captcha/turnstile"
import { supabase } from "../lib/supabase/client"
import { colors, fonts } from "../constants/theme"
import {
  OTP_LENGTH,
  RESEND_COOLDOWN_SECONDS,
  RESET_MESSAGES,
  mapRequestError,
  mapUpdateError,
  mapVerifyError,
  remainingCooldownSeconds,
  sanitizeOtp,
  validateEmail,
  validateResetForm,
} from "../lib/auth/passwordReset"

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("")
  const [confirmedEmail, setConfirmedEmail] = useState<string | null>(null)
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [sentAt, setSentAt] = useState<number | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [resending, setResending] = useState(false)
  const [resendMessage, setResendMessage] = useState<string | null>(null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const captchaRef = useRef<TurnstileCaptchaHandle>(null)

  // True once verifyOtp succeeded: the code is consumed, so a retry after a
  // failed updateUser must not verify it again.
  const verified = useRef(false)

  useEffect(() => {
    if (sentAt === null) return
    const tick = () => setSecondsLeft(remainingCooldownSeconds(sentAt, Date.now()))
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [sentAt])

  async function handleRequestCode() {
    const emailError = validateEmail(email)
    if (emailError) {
      setError(emailError)
      return
    }

    if (captchaToken === null) return
    const target = email.trim()
    setLoading(true)
    setError(null)
    const { error: requestError } = await supabase.auth.resetPasswordForEmail(target, { captchaToken })
    setLoading(false)

    if (requestError) {
      // Dev-only: the UI shows generic copy, so surface the real cause in Metro.
      if (__DEV__) console.warn("[forgot-password] request failed:", requestError.code, requestError.message)
      setError(mapRequestError(requestError))
      // Tokens are single-use: the retry needs a fresh one.
      captchaRef.current?.reset()
      return
    }

    // The token is consumed; the resend step asks for its own.
    setCaptchaToken(null)
    setConfirmedEmail(target)
    setSecondsLeft(RESEND_COOLDOWN_SECONDS)
    setSentAt(Date.now())
    setResendMessage(null)
  }

  async function handleResend() {
    if (!confirmedEmail || resending || secondsLeft > 0 || captchaToken === null) return
    setResending(true)
    setResendMessage(null)
    // The outcome is not revealed, same as the web: the message is neutral.
    const { error: resendError } = await supabase.auth.resetPasswordForEmail(confirmedEmail, { captchaToken })
    if (resendError && __DEV__) {
      console.warn("[forgot-password] resend failed:", resendError.code, resendError.message)
    }
    setCaptchaToken(null)
    setSecondsLeft(RESEND_COOLDOWN_SECONDS)
    setSentAt(Date.now())
    setResendMessage(RESET_MESSAGES.resendSent)
    setResending(false)
  }

  async function handleVerifyAndReset() {
    if (!confirmedEmail) return
    const validationError = validateResetForm({ otp, password, confirm })
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError(null)

    if (!verified.current) {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: confirmedEmail,
        token: otp,
        type: "recovery",
      })
      if (verifyError) {
        setError(mapVerifyError(verifyError))
        setLoading(false)
        return
      }
      verified.current = true
    }

    const { error: updateError } = await supabase.auth.updateUser({ password })
    if (updateError) {
      setError(mapUpdateError(updateError))
      setLoading(false)
      return
    }

    setLoading(false)
    // verifyOtp left a valid session (same as the web, which goes to the
    // dashboard); the auth gate keeps it and the user lands on home.
    router.replace("/")
  }

  function handleRestart() {
    setConfirmedEmail(null)
    setSentAt(null)
    setSecondsLeft(0)
    setOtp("")
    setPassword("")
    setConfirm("")
    setError(null)
    setResendMessage(null)
    setCaptchaToken(null)
    verified.current = false
  }

  const canRequest = canSubmitWithCaptcha({ token: captchaToken, busy: loading })
  const submitDisabled = loading || otp.length !== OTP_LENGTH || !password || !confirm

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {confirmedEmail === null ? (
          <>
            <Text style={styles.title}>Recuperar acceso</Text>
            <Text style={styles.subtitle}>
              Ingresá tu email y te mandamos un código de 6 dígitos para crear una nueva contraseña.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            {error && <Text style={styles.error}>{error}</Text>}

            <TurnstileCaptcha ref={captchaRef} onToken={setCaptchaToken} />

            <Pressable
              style={[styles.button, !canRequest && styles.buttonDisabled]}
              onPress={handleRequestCode}
              disabled={!canRequest}
            >
              <Text style={styles.buttonText}>{loading ? "Enviando..." : "Enviar código"}</Text>
            </Pressable>

            <Pressable onPress={() => router.replace("/login")}>
              <Text style={styles.link}>Volver al login</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.title}>Verificá el código</Text>
            <Text style={styles.subtitle}>
              Mandamos un código de 6 dígitos a <Text style={styles.emphasis}>{confirmedEmail}</Text>. Expira en 10
              minutos.
            </Text>

            <TextInput
              style={[styles.input, styles.codeInput]}
              placeholder="Código de 6 dígitos"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              maxLength={OTP_LENGTH}
              value={otp}
              onChangeText={(value) => setOtp(sanitizeOtp(value))}
            />

            <TextInput
              style={styles.input}
              placeholder="Nueva contraseña"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="new-password"
              value={password}
              onChangeText={setPassword}
            />

            <TextInput
              style={styles.input}
              placeholder="Repetí la contraseña"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="new-password"
              value={confirm}
              onChangeText={setConfirm}
            />

            {error && <Text style={styles.error}>{error}</Text>}

            <Pressable
              style={[styles.button, submitDisabled && styles.buttonDisabled]}
              onPress={handleVerifyAndReset}
              disabled={submitDisabled}
            >
              <Text style={styles.buttonText}>{loading ? "Guardando..." : "Verificar y guardar"}</Text>
            </Pressable>

            {resendMessage && <Text style={styles.info}>{resendMessage}</Text>}

            {resending ? (
              <Text style={styles.info}>Enviando...</Text>
            ) : secondsLeft > 0 ? (
              <Text style={styles.info}>Reenviar en {secondsLeft}s</Text>
            ) : (
              <>
                <TurnstileCaptcha onToken={setCaptchaToken} />
                <Pressable
                  onPress={handleResend}
                  disabled={captchaToken === null}
                  style={captchaToken === null && styles.buttonDisabled}
                >
                  <Text style={styles.linkStrong}>Reenviar código</Text>
                </Pressable>
              </>
            )}

            <Pressable onPress={handleRestart}>
              <Text style={styles.link}>Pedir otro código</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, justifyContent: "center", padding: 24, gap: 16 },
  title: { color: colors.brand, fontSize: 28, fontFamily: fonts.heading, textAlign: "center" },
  subtitle: { color: colors.textMuted, textAlign: "center", fontFamily: fonts.body },
  emphasis: { color: colors.text },
  input: { borderWidth: 1, borderColor: "#333", borderRadius: 8, padding: 12, color: colors.text, fontFamily: fonts.body },
  codeInput: { textAlign: "center", fontSize: 20, letterSpacing: 6 },
  button: { backgroundColor: colors.brand, borderRadius: 8, padding: 14, alignItems: "center" },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: colors.text, fontWeight: "600", fontFamily: fonts.body },
  error: { color: colors.error, textAlign: "center", fontFamily: fonts.body },
  info: { color: colors.textMuted, textAlign: "center", fontFamily: fonts.body },
  link: { color: colors.textMuted, textAlign: "center", fontFamily: fonts.body },
  linkStrong: { color: colors.brand, textAlign: "center", fontWeight: "600", fontFamily: fonts.body },
})
