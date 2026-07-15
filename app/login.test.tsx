import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react-native"
import LoginScreen from "./login"
import { useAuth } from "../lib/auth/AuthContext"

jest.mock("../lib/auth/AuthContext", () => ({
  useAuth: jest.fn(),
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
  beforeEach(() => jest.clearAllMocks())

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
})
