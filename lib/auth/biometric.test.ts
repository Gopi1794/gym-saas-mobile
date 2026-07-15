import * as SecureStore from "expo-secure-store"
import * as LocalAuthentication from "expo-local-authentication"
import { getBiometricPreference, setBiometricPreference, authenticateWithBiometrics } from "./biometric"

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
}))

jest.mock("expo-local-authentication", () => ({
  hasHardwareAsync: jest.fn(),
  isEnrolledAsync: jest.fn(),
  authenticateAsync: jest.fn(),
}))

describe("biometric preference", () => {
  beforeEach(() => jest.clearAllMocks())

  it("defaults to false when no preference is stored", async () => {
    ;(SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null)
    expect(await getBiometricPreference()).toBe(false)
  })

  it("returns true when preference was stored as enabled", async () => {
    ;(SecureStore.getItemAsync as jest.Mock).mockResolvedValue("true")
    expect(await getBiometricPreference()).toBe(true)
  })

  it("persists the preference as a string", async () => {
    await setBiometricPreference(true)
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith("biometric_enabled", "true")
  })
})

describe("authenticateWithBiometrics", () => {
  beforeEach(() => jest.clearAllMocks())

  it("returns false when the device has no biometric hardware", async () => {
    ;(LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(false)
    expect(await authenticateWithBiometrics()).toBe(false)
  })

  it("returns false when no biometrics are enrolled", async () => {
    ;(LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(true)
    ;(LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(false)
    expect(await authenticateWithBiometrics()).toBe(false)
  })

  it("returns true when authentication succeeds", async () => {
    ;(LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(true)
    ;(LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(true)
    ;(LocalAuthentication.authenticateAsync as jest.Mock).mockResolvedValue({ success: true })
    expect(await authenticateWithBiometrics()).toBe(true)
  })

  it("returns false when the user cancels or fails", async () => {
    ;(LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(true)
    ;(LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(true)
    ;(LocalAuthentication.authenticateAsync as jest.Mock).mockResolvedValue({ success: false })
    expect(await authenticateWithBiometrics()).toBe(false)
  })
})
