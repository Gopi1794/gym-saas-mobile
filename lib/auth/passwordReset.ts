// Pure decisions for the 6-digit email code password recovery flow.
// Mirrors the web ForgotPasswordForm (rules, copy and resend cooldown).

export const OTP_LENGTH = 6
export const MIN_PASSWORD_LENGTH = 8
export const RESEND_COOLDOWN_SECONDS = 60

export const RESET_MESSAGES = {
  emailInvalid: "Ingresá un email válido.",
  requestFailed: "No pudimos enviar el email. Verificá la dirección e intentá de nuevo.",
  rateLimited: "Pediste demasiados códigos. Esperá unos minutos e intentá de nuevo.",
  otpIncomplete: "Ingresá el código de 6 dígitos",
  passwordMismatch: "Las contraseñas no coinciden.",
  passwordTooShort: "La contraseña debe tener al menos 8 caracteres.",
  codeInvalid: "Código incorrecto o expirado. Pedí uno nuevo.",
  updateFailed: "No se pudo actualizar la contraseña. Intentá de nuevo.",
  samePassword: "La nueva contraseña debe ser distinta a la anterior.",
  resendSent: "Si el email está registrado, te reenviamos el código.",
} as const

type AuthErrorLike = { message: string; code?: string }

export function sanitizeOtp(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, OTP_LENGTH)
}

export function validateEmail(email: string): string | null {
  return /^\S+@\S+\.\S+$/.test(email.trim()) ? null : RESET_MESSAGES.emailInvalid
}

export function validateResetForm(input: {
  otp: string
  password: string
  confirm: string
}): string | null {
  if (input.otp.length !== OTP_LENGTH) return RESET_MESSAGES.otpIncomplete
  if (input.password !== input.confirm) return RESET_MESSAGES.passwordMismatch
  if (input.password.length < MIN_PASSWORD_LENGTH) return RESET_MESSAGES.passwordTooShort
  return null
}

export function remainingCooldownSeconds(sentAt: number | null, now: number): number {
  if (sentAt === null) return 0
  const remainingMs = RESEND_COOLDOWN_SECONDS * 1000 - (now - sentAt)
  return Math.max(0, Math.ceil(remainingMs / 1000))
}

// Never distinguishes unknown emails: Supabase answers success for them, and
// any failure here gets the same generic copy as the web.
export function mapRequestError(error: AuthErrorLike): string {
  return error.code === "over_email_send_rate_limit"
    ? RESET_MESSAGES.rateLimited
    : RESET_MESSAGES.requestFailed
}

export function mapVerifyError(_error: AuthErrorLike): string {
  return RESET_MESSAGES.codeInvalid
}

export function mapUpdateError(error: AuthErrorLike): string {
  return error.code === "same_password" ? RESET_MESSAGES.samePassword : RESET_MESSAGES.updateFailed
}
