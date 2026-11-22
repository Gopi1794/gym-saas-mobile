import {
  buildTurnstileHtml,
  canSubmitWithCaptcha,
  getTurnstileConfig,
  parseTurnstileMessage,
} from "./turnstile"

describe("parseTurnstileMessage", () => {
  it("returns the token for a success message", () => {
    expect(parseTurnstileMessage(JSON.stringify({ type: "success", token: "abc" }))).toEqual({
      type: "success",
      token: "abc",
    })
  })

  it("treats a success message without a token as invalid", () => {
    expect(parseTurnstileMessage(JSON.stringify({ type: "success" }))).toBeNull()
    expect(parseTurnstileMessage(JSON.stringify({ type: "success", token: "" }))).toBeNull()
  })

  it("recognises expired and error messages", () => {
    expect(parseTurnstileMessage(JSON.stringify({ type: "expired" }))).toEqual({ type: "expired" })
    expect(parseTurnstileMessage(JSON.stringify({ type: "error" }))).toEqual({ type: "error" })
  })

  it("ignores malformed or unknown payloads", () => {
    expect(parseTurnstileMessage("not json")).toBeNull()
    expect(parseTurnstileMessage("null")).toBeNull()
    expect(parseTurnstileMessage(JSON.stringify({ type: "other" }))).toBeNull()
    expect(parseTurnstileMessage(JSON.stringify("success"))).toBeNull()
  })
})

describe("getTurnstileConfig", () => {
  it("returns null when the site key or hostname is missing", () => {
    expect(getTurnstileConfig({ siteKey: undefined, hostname: "app.example.com" })).toBeNull()
    expect(getTurnstileConfig({ siteKey: "key", hostname: undefined })).toBeNull()
    expect(getTurnstileConfig({ siteKey: " ", hostname: "app.example.com" })).toBeNull()
  })

  it("normalizes the hostname by dropping scheme and trailing slashes", () => {
    expect(getTurnstileConfig({ siteKey: "key", hostname: "https://app.example.com/" })).toEqual({
      siteKey: "key",
      hostname: "app.example.com",
    })
  })
})

describe("buildTurnstileHtml", () => {
  it("loads the Turnstile script, embeds the site key and posts messages to React Native", () => {
    const html = buildTurnstileHtml("0xSITEKEY")
    expect(html).toContain("https://challenges.cloudflare.com/turnstile/v0/api.js")
    expect(html).toContain("0xSITEKEY")
    expect(html).toContain("ReactNativeWebView.postMessage")
  })

  it("escapes the site key so it cannot break out of the script string", () => {
    const html = buildTurnstileHtml('"</script><script>alert(1)')
    expect(html).not.toContain("</script><script>alert(1)")
  })
})

describe("canSubmitWithCaptcha", () => {
  it("requires a token and no request in flight", () => {
    expect(canSubmitWithCaptcha({ token: null, busy: false })).toBe(false)
    expect(canSubmitWithCaptcha({ token: "t", busy: true })).toBe(false)
    expect(canSubmitWithCaptcha({ token: "t", busy: false })).toBe(true)
  })
})
