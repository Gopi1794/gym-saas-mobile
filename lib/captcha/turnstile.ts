// Pure helpers for the Cloudflare Turnstile WebView widget.

export type TurnstileEvent =
  | { type: "success"; token: string }
  | { type: "expired" }
  | { type: "error" }

export type TurnstileConfig = { siteKey: string; hostname: string }

export const TURNSTILE_MESSAGES = {
  missingConfig: "La verificación de seguridad no está configurada. Contactá a soporte.",
  widgetError: "No pudimos cargar la verificación de seguridad. Tocá para reintentar.",
} as const

export function parseTurnstileMessage(raw: string): TurnstileEvent | null {
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return null
  }
  if (typeof data !== "object" || data === null) return null

  const { type, token } = data as { type?: unknown; token?: unknown }
  if (type === "success") {
    return typeof token === "string" && token.length > 0 ? { type: "success", token } : null
  }
  if (type === "expired") return { type: "expired" }
  if (type === "error") return { type: "error" }
  return null
}

export function getTurnstileConfig(input: {
  siteKey: string | undefined
  hostname: string | undefined
}): TurnstileConfig | null {
  const siteKey = input.siteKey?.trim()
  const hostname = input.hostname
    ?.trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "")
  if (!siteKey || !hostname) return null
  return { siteKey, hostname }
}

export function canSubmitWithCaptcha(input: { token: string | null; busy: boolean }): boolean {
  return input.token !== null && !input.busy
}

export function buildTurnstileHtml(siteKey: string): string {
  // JSON.stringify yields a valid JS string; "<" is escaped so it can never close the script tag.
  const backslash = String.fromCharCode(92)
  const safeKey = JSON.stringify(siteKey).replace(/</g, `${backslash}u003c`)
  return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  html, body { margin: 0; padding: 0; background: #0A0A0A; height: 100%; }
  body { display: flex; align-items: center; justify-content: center; }
</style>
<script>
  function send(payload) {
    window.ReactNativeWebView.postMessage(JSON.stringify(payload));
  }
  // Diagnostics: report page-level failures so the app can log them in development.
  window.onerror = function (message) { send({ type: "debug", detail: "page error: " + message }); };
  send({ type: "debug", detail: "page loaded at " + location.href });
</script>
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad" async defer
  onerror="send({ type: 'debug', detail: 'turnstile script failed to load' })"></script>
</head>
<body>
<div id="widget"></div>
<script>
  function onTurnstileLoad() {
    send({ type: "debug", detail: "turnstile api loaded" });
    turnstile.render("#widget", {
      sitekey: ${safeKey},
      theme: "dark",
      callback: function (token) { send({ type: "success", token: token }); },
      "expired-callback": function () { send({ type: "expired" }); },
      "error-callback": function (code) { send({ type: "debug", detail: "turnstile error code " + code }); send({ type: "error" }); }
    });
  }
</script>
</body>
</html>`
}
