import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { WebView, type WebViewMessageEvent } from "react-native-webview"
import { colors, fonts } from "../constants/theme"
import {
  TURNSTILE_MESSAGES,
  buildTurnstileHtml,
  getTurnstileConfig,
  parseTurnstileMessage,
} from "../lib/captcha/turnstile"

export type TurnstileCaptchaHandle = {
  /** Discards the current token and loads a fresh widget (tokens are single-use). */
  reset: () => void
}

type Props = {
  onToken: (token: string | null) => void
  /** Overrides for tests; default to the EXPO_PUBLIC_TURNSTILE_* env vars. */
  siteKey?: string
  hostname?: string
}

const TurnstileCaptcha = forwardRef<TurnstileCaptchaHandle, Props>(function TurnstileCaptcha(
  { onToken, siteKey = process.env.EXPO_PUBLIC_TURNSTILE_SITE_KEY, hostname = process.env.EXPO_PUBLIC_TURNSTILE_HOSTNAME },
  ref
) {
  const [attempt, setAttempt] = useState(0)
  const [failed, setFailed] = useState(false)

  const config = useMemo(() => getTurnstileConfig({ siteKey, hostname }), [siteKey, hostname])
  const html = useMemo(() => (config ? buildTurnstileHtml(config.siteKey) : null), [config])

  const reset = useCallback(() => {
    onToken(null)
    setFailed(false)
    setAttempt((value) => value + 1)
  }, [onToken])

  useImperativeHandle(ref, () => ({ reset }), [reset])

  function handleMessage(event: WebViewMessageEvent) {
    // Dev-only: log widget diagnostics (never the token itself).
    if (__DEV__) {
      try {
        const raw = JSON.parse(event.nativeEvent.data) as { type?: string; detail?: string }
        console.warn("[turnstile]", raw.type, raw.detail ?? "")
      } catch {
        console.warn("[turnstile] unparseable message")
      }
    }
    const message = parseTurnstileMessage(event.nativeEvent.data)
    if (!message) return
    if (message.type === "success") {
      setFailed(false)
      onToken(message.token)
      return
    }
    onToken(null)
    if (message.type === "error") setFailed(true)
  }

  if (!config || !html) {
    return <Text style={styles.error}>{TURNSTILE_MESSAGES.missingConfig}</Text>
  }

  if (failed) {
    return (
      <Pressable onPress={reset} accessibilityRole="button">
        <Text style={styles.error}>{TURNSTILE_MESSAGES.widgetError}</Text>
      </Pressable>
    )
  }

  return (
    <View style={styles.container}>
      <WebView
        key={attempt}
        originWhitelist={["*"]}
        javaScriptEnabled
        source={{ html, baseUrl: `https://${config.hostname}` }}
        onMessage={handleMessage}
        onError={(event) => {
          if (__DEV__) console.warn("[turnstile] webview error:", event.nativeEvent.description)
          onToken(null)
          setFailed(true)
        }}
        onHttpError={(event) => {
          if (__DEV__) console.warn("[turnstile] http error:", event.nativeEvent.statusCode, event.nativeEvent.url)
        }}
        style={styles.webview}
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  )
})

export default TurnstileCaptcha

const styles = StyleSheet.create({
  container: { width: "100%", maxWidth: 300, height: 70, alignSelf: "center", backgroundColor: colors.background },
  webview: { flex: 1, backgroundColor: colors.background },
  error: { color: colors.error, textAlign: "center", fontFamily: fonts.body },
})
