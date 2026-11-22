import {
  OTP_LENGTH,
  MIN_PASSWORD_LENGTH,
  RESEND_COOLDOWN_SECONDS,
  RESET_MESSAGES,
  sanitizeOtp,
  validateEmail,
  validateResetForm,
  remainingCooldownSeconds,
  mapRequestError,
  mapVerifyError,
  mapUpdateError,
} from "./passwordReset"

describe("constants", () => {
  it("mirrors the web flow", () => {
    expect(OTP_LENGTH).toBe(6)
    expect(MIN_PASSWORD_LENGTH).toBe(8)
    expect(RESEND_COOLDOWN_SECONDS).toBe(60)
  })
})

describe("sanitizeOtp", () => {
  it("keeps digits only", () => {
    expect(sanitizeOtp("12a3-4 5")).toBe("12345")
  })

  it("truncates to six digits", () => {
    expect(sanitizeOtp("1234567890")).toBe("123456")
  })
})

describe("validateEmail", () => {
  it("rejects an empty email", () => {
    expect(validateEmail("   ")).toBe(RESET_MESSAGES.emailInvalid)
  })

  it("rejects a malformed email", () => {
    expect(validateEmail("not-an-email")).toBe(RESET_MESSAGES.emailInvalid)
  })

  it("accepts a valid email with surrounding spaces", () => {
    expect(validateEmail(" socio@test.com ")).toBeNull()
  })
})

describe("validateResetForm", () => {
  const valid = { otp: "123456", password: "claveSegura1", confirm: "claveSegura1" }

  it("accepts a valid form", () => {
    expect(validateResetForm(valid)).toBeNull()
  })

  it("requires a six digit code", () => {
    expect(validateResetForm({ ...valid, otp: "123" })).toBe(RESET_MESSAGES.otpIncomplete)
  })

  it("requires matching passwords", () => {
    expect(validateResetForm({ ...valid, confirm: "otra" })).toBe(RESET_MESSAGES.passwordMismatch)
  })

  it("requires a minimum password length", () => {
    expect(validateResetForm({ otp: "123456", password: "corta", confirm: "corta" })).toBe(
      RESET_MESSAGES.passwordTooShort
    )
  })
})

describe("remainingCooldownSeconds", () => {
  it("returns the full cooldown right after sending", () => {
    expect(remainingCooldownSeconds(1000, 1000)).toBe(60)
  })

  it("rounds partial seconds up", () => {
    expect(remainingCooldownSeconds(0, 59_500)).toBe(1)
  })

  it("never goes below zero", () => {
    expect(remainingCooldownSeconds(0, 120_000)).toBe(0)
  })

  it("is zero when nothing was sent yet", () => {
    expect(remainingCooldownSeconds(null, 5000)).toBe(0)
  })
})

describe("error mapping", () => {
  it("maps a request error to a generic message without revealing accounts", () => {
    expect(mapRequestError({ message: "boom" })).toBe(RESET_MESSAGES.requestFailed)
  })

  it("maps rate limiting on request", () => {
    expect(mapRequestError({ message: "x", code: "over_email_send_rate_limit" })).toBe(
      RESET_MESSAGES.rateLimited
    )
  })

  it("maps any verify error to invalid or expired code", () => {
    expect(mapVerifyError({ message: "Token has expired or is invalid" })).toBe(
      RESET_MESSAGES.codeInvalid
    )
  })

  it("maps same_password on update", () => {
    expect(mapUpdateError({ message: "x", code: "same_password" })).toBe(RESET_MESSAGES.samePassword)
  })

  it("maps other update errors to the generic message", () => {
    expect(mapUpdateError({ message: "x" })).toBe(RESET_MESSAGES.updateFailed)
  })
})
