import React from "react"
import { render, fireEvent, waitFor, act } from "@testing-library/react-native"
import ForgotPasswordScreen from "./forgot-password"
import { supabase } from "../lib/supabase/client"
import { router } from "expo-router"

jest.mock("../lib/supabase/client", () => ({
  supabase: {
    auth: {
      resetPasswordForEmail: jest.fn(),
      verifyOtp: jest.fn(),
      updateUser: jest.fn(),
    },
  },
}))

jest.mock("expo-router", () => ({
  router: { replace: jest.fn() },
}))

const auth = supabase.auth as unknown as {
  resetPasswordForEmail: jest.Mock
  verifyOtp: jest.Mock
  updateUser: jest.Mock
}

type Utils = ReturnType<typeof render>

async function goToCodeStep(utils: Utils, email = "socio@test.com") {
  fireEvent.changeText(utils.getByPlaceholderText("Email"), email)
  fireEvent.press(utils.getByText("Enviar código"))
  await utils.findByText("Verificá el código")
}

function fillResetForm(
  utils: Utils,
  { otp = "123456", password = "claveSegura1", confirm = "claveSegura1" } = {}
) {
  fireEvent.changeText(utils.getByPlaceholderText("Código de 6 dígitos"), otp)
  fireEvent.changeText(utils.getByPlaceholderText("Nueva contraseña"), password)
  fireEvent.changeText(utils.getByPlaceholderText("Repetí la contraseña"), confirm)
}

describe("ForgotPasswordScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    auth.resetPasswordForEmail.mockResolvedValue({ error: null })
    auth.verifyOtp.mockResolvedValue({ error: null })
    auth.updateUser.mockResolvedValue({ error: null })
  })

  it("requests the code without a redirectTo and moves to the code step", async () => {
    const utils = render(<ForgotPasswordScreen />)
    await goToCodeStep(utils)

    expect(auth.resetPasswordForEmail).toHaveBeenCalledTimes(1)
    expect(auth.resetPasswordForEmail).toHaveBeenCalledWith("socio@test.com")
    expect(utils.getByText(/socio@test\.com/)).toBeTruthy()
  })

  it("validates the email before calling supabase", async () => {
    const utils = render(<ForgotPasswordScreen />)
    fireEvent.changeText(utils.getByPlaceholderText("Email"), "nope")
    fireEvent.press(utils.getByText("Enviar código"))

    expect(await utils.findByText("Ingresá un email válido.")).toBeTruthy()
    expect(auth.resetPasswordForEmail).not.toHaveBeenCalled()
  })

  it("shows a visible error and stays on step one when the request fails", async () => {
    auth.resetPasswordForEmail.mockResolvedValueOnce({ error: { message: "boom" } })
    const utils = render(<ForgotPasswordScreen />)
    fireEvent.changeText(utils.getByPlaceholderText("Email"), "socio@test.com")
    fireEvent.press(utils.getByText("Enviar código"))

    expect(
      await utils.findByText("No pudimos enviar el email. Verificá la dirección e intentá de nuevo.")
    ).toBeTruthy()
    expect(utils.queryByText("Verificá el código")).toBeNull()
  })

  it("verifies the code, updates the password and goes home keeping the session", async () => {
    const utils = render(<ForgotPasswordScreen />)
    await goToCodeStep(utils)
    fillResetForm(utils)
    fireEvent.press(utils.getByText("Verificar y guardar"))

    await waitFor(() => {
      expect(auth.verifyOtp).toHaveBeenCalledWith({
        email: "socio@test.com",
        token: "123456",
        type: "recovery",
      })
      expect(auth.updateUser).toHaveBeenCalledWith({ password: "claveSegura1" })
      expect(router.replace).toHaveBeenCalledWith("/")
    })
  })

  it("keeps only digits in the code field", async () => {
    const utils = render(<ForgotPasswordScreen />)
    await goToCodeStep(utils)
    fireEvent.changeText(utils.getByPlaceholderText("Código de 6 dígitos"), "12ab34-56789")

    expect(utils.getByPlaceholderText("Código de 6 dígitos").props.value).toBe("123456")
  })

  it("does not call supabase when the passwords do not match", async () => {
    const utils = render(<ForgotPasswordScreen />)
    await goToCodeStep(utils)
    fillResetForm(utils, { confirm: "distinta123" })
    fireEvent.press(utils.getByText("Verificar y guardar"))

    expect(await utils.findByText("Las contraseñas no coinciden.")).toBeTruthy()
    expect(auth.verifyOtp).not.toHaveBeenCalled()
  })

  it("does not call supabase when the password is too short", async () => {
    const utils = render(<ForgotPasswordScreen />)
    await goToCodeStep(utils)
    fillResetForm(utils, { password: "corta", confirm: "corta" })
    fireEvent.press(utils.getByText("Verificar y guardar"))

    expect(await utils.findByText("La contraseña debe tener al menos 8 caracteres.")).toBeTruthy()
    expect(auth.verifyOtp).not.toHaveBeenCalled()
  })

  it("shows an error and skips updateUser when the code is invalid", async () => {
    auth.verifyOtp.mockResolvedValueOnce({ error: { message: "expired" } })
    const utils = render(<ForgotPasswordScreen />)
    await goToCodeStep(utils)
    fillResetForm(utils)
    fireEvent.press(utils.getByText("Verificar y guardar"))

    expect(await utils.findByText("Código incorrecto o expirado. Pedí uno nuevo.")).toBeTruthy()
    expect(auth.updateUser).not.toHaveBeenCalled()
    expect(router.replace).not.toHaveBeenCalled()
  })

  it("retries only updateUser when the code was verified but the update failed", async () => {
    auth.updateUser.mockResolvedValueOnce({ error: { message: "x" } })
    const utils = render(<ForgotPasswordScreen />)
    await goToCodeStep(utils)
    fillResetForm(utils)
    fireEvent.press(utils.getByText("Verificar y guardar"))
    expect(
      await utils.findByText("No se pudo actualizar la contraseña. Intentá de nuevo.")
    ).toBeTruthy()

    fireEvent.press(utils.getByText("Verificar y guardar"))

    await waitFor(() => expect(router.replace).toHaveBeenCalledWith("/"))
    expect(auth.verifyOtp).toHaveBeenCalledTimes(1)
    expect(auth.updateUser).toHaveBeenCalledTimes(2)
  })

  it("goes back to the email step with 'Pedir otro código'", async () => {
    const utils = render(<ForgotPasswordScreen />)
    await goToCodeStep(utils)
    fireEvent.press(utils.getByText("Pedir otro código"))

    expect(utils.getByText("Recuperar acceso")).toBeTruthy()
  })

  it("returns to the login screen with 'Volver al login'", () => {
    const utils = render(<ForgotPasswordScreen />)
    fireEvent.press(utils.getByText("Volver al login"))

    expect(router.replace).toHaveBeenCalledWith("/login")
  })

  describe("resend", () => {
    beforeEach(() => jest.useFakeTimers())
    afterEach(() => jest.useRealTimers())

    it("blocks resending during the cooldown and re-enables it after 60 seconds", async () => {
      const utils = render(<ForgotPasswordScreen />)
      await goToCodeStep(utils)

      expect(utils.getByText("Reenviar en 60s")).toBeTruthy()
      expect(utils.queryByText("Reenviar código")).toBeNull()

      act(() => {
        jest.advanceTimersByTime(60_000)
      })

      fireEvent.press(await utils.findByText("Reenviar código"))

      await waitFor(() => expect(auth.resetPasswordForEmail).toHaveBeenCalledTimes(2))
      expect(auth.resetPasswordForEmail).toHaveBeenLastCalledWith("socio@test.com")
      expect(
        await utils.findByText("Si el email está registrado, te reenviamos el código.")
      ).toBeTruthy()
      expect(utils.getByText("Reenviar en 60s")).toBeTruthy()
    })
  })
})
