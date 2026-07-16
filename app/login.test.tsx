import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react-native"
import { Alert } from "react-native"
import LoginScreen from "./login"
import { useAuth } from "../lib/auth/AuthContext"
import { getBiometricPreference, setBiometricPreference } from "../lib/auth/biometric"

jest.mock("../lib/auth/AuthContext", () => ({
  useAuth: jest.fn(),
}))

jest.mock("../lib/auth/biometric", () => ({
  getBiometricPreference: jest.fn(),
  setBiometricPreference: jest.fn(),
}))

jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
  },
}))

jest.mock("../lib/supabase/client", () => ({
  supabase: {
    auth: {
      resetPasswordForEmail: jest.fn(),
    },
  },
}))

describe("LoginScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getBiometricPreference as jest.Mock).mockResolvedValue(false)
    jest.spyOn(Alert, "alert").mockImplementation(() => {})
  })

  it("calls signIn with the entered email and password", async () => {
    const signIn = jest.fn().mockResolvedValue({ error: null })
    ;(useAuth as jest.Mock).mockReturnValue({ signIn })

    const { getByPlaceholderText, getByText } = render(<LoginScreen />)

    fireEvent.changeText(getByPlaceholderText("Email"), "socio@test.com")
    fireEvent.changeText(getByPlaceholderText("Contraseña"), "supersecret")
    fireEvent.press(getByText("Iniciar sesión"))

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("socio@test.com", "supersecret")
    })
  })

  it("shows an error message when signIn fails", async () => {
    const signIn = jest.fn().mockResolvedValue({ error: "Email o contraseña incorrectos" })
    ;(useAuth as jest.Mock).mockReturnValue({ signIn })

    const { getByPlaceholderText, getByText, findByText } = render(<LoginScreen />)

    fireEvent.changeText(getByPlaceholderText("Email"), "socio@test.com")
    fireEvent.changeText(getByPlaceholderText("Contraseña"), "wrong")
    fireEvent.press(getByText("Iniciar sesión"))

    expect(await findByText("Email o contraseña incorrectos")).toBeTruthy()
  })

  it("disables the submit button while loading", async () => {
    let resolveSignIn: (v: { error: string | null }) => void = () => {}
    const signIn = jest.fn(
      () =>
        new Promise<{ error: string | null }>((resolve) => {
          resolveSignIn = resolve
        })
    )
    ;(useAuth as jest.Mock).mockReturnValue({ signIn })

    const { getByPlaceholderText, getByText } = render(<LoginScreen />)
    fireEvent.changeText(getByPlaceholderText("Email"), "socio@test.com")
    fireEvent.changeText(getByPlaceholderText("Contraseña"), "supersecret")
    fireEvent.press(getByText("Iniciar sesión"))

    expect(getByText("Ingresando...")).toBeTruthy()
    resolveSignIn({ error: null })
  })

  it("prompts to enable biometrics after a successful login when not already enabled", async () => {
    const signIn = jest.fn().mockResolvedValue({ error: null })
    ;(useAuth as jest.Mock).mockReturnValue({ signIn })
    ;(getBiometricPreference as jest.Mock).mockResolvedValue(false)

    const { getByPlaceholderText, getByText } = render(<LoginScreen />)

    fireEvent.changeText(getByPlaceholderText("Email"), "socio@test.com")
    fireEvent.changeText(getByPlaceholderText("Contraseña"), "supersecret")
    fireEvent.press(getByText("Iniciar sesión"))

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "¿Activar Face ID / huella?",
        "Podés usarlo para tu próximo acceso.",
        expect.any(Array)
      )
    })
  })

  it("calls setBiometricPreference(true) when the user accepts the prompt", async () => {
    const signIn = jest.fn().mockResolvedValue({ error: null })
    ;(useAuth as jest.Mock).mockReturnValue({ signIn })
    ;(getBiometricPreference as jest.Mock).mockResolvedValue(false)

    const { getByPlaceholderText, getByText } = render(<LoginScreen />)

    fireEvent.changeText(getByPlaceholderText("Email"), "socio@test.com")
    fireEvent.changeText(getByPlaceholderText("Contraseña"), "supersecret")
    fireEvent.press(getByText("Iniciar sesión"))

    await waitFor(() => expect(Alert.alert).toHaveBeenCalled())

    const buttons = (Alert.alert as jest.Mock).mock.calls[0][2]
    const activateButton = buttons.find((b: { text: string }) => b.text === "Activar")

    await activateButton.onPress()

    expect(setBiometricPreference).toHaveBeenCalledWith(true)
  })

  it("does not prompt to enable biometrics when already enabled", async () => {
    const signIn = jest.fn().mockResolvedValue({ error: null })
    ;(useAuth as jest.Mock).mockReturnValue({ signIn })
    ;(getBiometricPreference as jest.Mock).mockResolvedValue(true)

    const { getByPlaceholderText, getByText } = render(<LoginScreen />)

    fireEvent.changeText(getByPlaceholderText("Email"), "socio@test.com")
    fireEvent.changeText(getByPlaceholderText("Contraseña"), "supersecret")
    fireEvent.press(getByText("Iniciar sesión"))

    await waitFor(() => {
      expect(getBiometricPreference).toHaveBeenCalled()
    })

    expect(Alert.alert).not.toHaveBeenCalled()
  })
})
