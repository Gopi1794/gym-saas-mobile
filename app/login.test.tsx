import React from "react"
import { render, fireEvent, waitFor, act } from "@testing-library/react-native"
import { Alert } from "react-native"
import LoginScreen from "./login"
import { router } from "expo-router"
import { useAuth } from "../lib/auth/AuthContext"
import { getBiometricPreference, setBiometricPreference } from "../lib/auth/biometric"

jest.mock("../lib/auth/AuthContext", () => ({
  useAuth: jest.fn(),
}))

jest.mock("../lib/auth/biometric", () => ({
  getBiometricPreference: jest.fn(),
  setBiometricPreference: jest.fn(),
}))

const mockCaptcha = { auto: true, resets: 0, issued: 0 }

jest.mock("../components/TurnstileCaptcha", () => {
  const React = require("react")
  const { View } = require("react-native")
  return {
    __esModule: true,
    default: React.forwardRef(function MockCaptcha(
      { onToken }: { onToken: (token: string | null) => void },
      ref: React.Ref<{ reset: () => void }>
    ) {
      React.useImperativeHandle(ref, () => ({
        reset: () => {
          mockCaptcha.resets += 1
          onToken(null)
          if (mockCaptcha.auto) onToken("fresh-token-" + ++mockCaptcha.issued)
        },
      }))
      React.useEffect(() => {
        if (mockCaptcha.auto) onToken("test-token")
      }, [onToken])
      return <View testID="captcha" />
    }),
  }
})

jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
  },
}))

describe("LoginScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCaptcha.auto = true
    mockCaptcha.resets = 0
    mockCaptcha.issued = 0
    ;(getBiometricPreference as jest.Mock).mockResolvedValue(false)
    jest.spyOn(Alert, "alert").mockImplementation(() => {})
  })

  it("calls signIn with the entered email and password", async () => {
    const signIn = jest.fn().mockResolvedValue({ error: null })
    ;(useAuth as jest.Mock).mockReturnValue({ signIn })

    const { getByPlaceholderText, getByText } = await render(<LoginScreen />)

    await fireEvent.changeText(getByPlaceholderText("Email"), "socio@test.com")
    await fireEvent.changeText(getByPlaceholderText("Contraseña"), "supersecret")
    // Not awaited: the submit handler stays pending until the Alert prompt is answered (or signIn resolves).
    void fireEvent.press(getByText("Iniciar sesión"))

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("socio@test.com", "supersecret", "test-token")
    })
  })

  it("shows an error message when signIn fails", async () => {
    const signIn = jest.fn().mockResolvedValue({ error: "Email o contraseña incorrectos" })
    ;(useAuth as jest.Mock).mockReturnValue({ signIn })

    const { getByPlaceholderText, getByText, findByText } = await render(<LoginScreen />)

    await fireEvent.changeText(getByPlaceholderText("Email"), "socio@test.com")
    await fireEvent.changeText(getByPlaceholderText("Contraseña"), "wrong")
    await fireEvent.press(getByText("Iniciar sesión"))

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

    const { getByPlaceholderText, getByText, findByText } = await render(<LoginScreen />)
    await fireEvent.changeText(getByPlaceholderText("Email"), "socio@test.com")
    await fireEvent.changeText(getByPlaceholderText("Contraseña"), "supersecret")
    // Not awaited: the submit handler stays pending until the Alert prompt is answered (or signIn resolves).
    void fireEvent.press(getByText("Iniciar sesión"))

    expect(await findByText("Ingresando...")).toBeTruthy()
    await act(async () => {
      resolveSignIn({ error: null })
    })
  })

  it("prompts to enable biometrics after a successful login when not already enabled", async () => {
    const signIn = jest.fn().mockResolvedValue({ error: null })
    ;(useAuth as jest.Mock).mockReturnValue({ signIn })
    ;(getBiometricPreference as jest.Mock).mockResolvedValue(false)

    const { getByPlaceholderText, getByText } = await render(<LoginScreen />)

    await fireEvent.changeText(getByPlaceholderText("Email"), "socio@test.com")
    await fireEvent.changeText(getByPlaceholderText("Contraseña"), "supersecret")
    // Not awaited: the submit handler stays pending until the Alert prompt is answered (or signIn resolves).
    void fireEvent.press(getByText("Iniciar sesión"))

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

    const { getByPlaceholderText, getByText } = await render(<LoginScreen />)

    await fireEvent.changeText(getByPlaceholderText("Email"), "socio@test.com")
    await fireEvent.changeText(getByPlaceholderText("Contraseña"), "supersecret")
    // Not awaited: the submit handler stays pending until the Alert prompt is answered (or signIn resolves).
    void fireEvent.press(getByText("Iniciar sesión"))

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

    const { getByPlaceholderText, getByText } = await render(<LoginScreen />)

    await fireEvent.changeText(getByPlaceholderText("Email"), "socio@test.com")
    await fireEvent.changeText(getByPlaceholderText("Contraseña"), "supersecret")
    await fireEvent.press(getByText("Iniciar sesión"))

    await waitFor(() => {
      expect(getBiometricPreference).toHaveBeenCalled()
    })

    expect(Alert.alert).not.toHaveBeenCalled()
  })

  it("navigates to the forgot-password screen without calling supabase", async () => {
    ;(useAuth as jest.Mock).mockReturnValue({ signIn: jest.fn() })

    const { getByText } = await render(<LoginScreen />)
    await fireEvent.press(getByText("Olvidé mi contraseña"))

    expect(router.push).toHaveBeenCalledWith("/forgot-password")
  })

  it("does not call signIn until the captcha has produced a token", async () => {
    mockCaptcha.auto = false
    const signIn = jest.fn().mockResolvedValue({ error: null })
    ;(useAuth as jest.Mock).mockReturnValue({ signIn })

    const { getByPlaceholderText, getByText } = await render(<LoginScreen />)
    await fireEvent.changeText(getByPlaceholderText("Email"), "socio@test.com")
    await fireEvent.changeText(getByPlaceholderText("Contraseña"), "supersecret")
    await fireEvent.press(getByText("Iniciar sesión"))

    expect(signIn).not.toHaveBeenCalled()
  })

  it("resets the captcha after a failed attempt so the next one uses a fresh token", async () => {
    const signIn = jest.fn().mockResolvedValue({ error: "Email o contraseña incorrectos" })
    ;(useAuth as jest.Mock).mockReturnValue({ signIn })

    const { getByPlaceholderText, getByText, findByText } = await render(<LoginScreen />)
    await fireEvent.changeText(getByPlaceholderText("Email"), "socio@test.com")
    await fireEvent.changeText(getByPlaceholderText("Contraseña"), "wrong")
    await fireEvent.press(getByText("Iniciar sesión"))
    await findByText("Email o contraseña incorrectos")

    expect(mockCaptcha.resets).toBe(1)

    await fireEvent.press(getByText("Iniciar sesión"))
    await waitFor(() => expect(signIn).toHaveBeenCalledTimes(2))
    expect(signIn).toHaveBeenLastCalledWith("socio@test.com", "wrong", "fresh-token-1")
  })
})
