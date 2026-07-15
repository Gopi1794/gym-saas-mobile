import * as SecureStore from "expo-secure-store"
import * as LocalAuthentication from "expo-local-authentication"

const BIOMETRIC_PREFERENCE_KEY = "biometric_enabled"

export async function getBiometricPreference(): Promise<boolean> {
  const value = await SecureStore.getItemAsync(BIOMETRIC_PREFERENCE_KEY)
  return value === "true"
}

export async function setBiometricPreference(enabled: boolean): Promise<void> {
  await SecureStore.setItemAsync(BIOMETRIC_PREFERENCE_KEY, enabled ? "true" : "false")
}

export async function authenticateWithBiometrics(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync()
  if (!hasHardware) return false

  const isEnrolled = await LocalAuthentication.isEnrolledAsync()
  if (!isEnrolled) return false

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Confirmá tu identidad para continuar",
  })

  return result.success
}
