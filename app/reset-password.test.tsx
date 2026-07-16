import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react-native"
import * as Linking from "expo-linking"
import ResetPasswordScreen from "./reset-password"
import { supabase } from "../lib/supabase/client"

jest.mock("../lib/supabase/client", () => ({
  supabase: {
    auth: {
      setSession: jest.fn().mockResolvedValue({ error: null }),
      updateUser: jest.fn().mockResolvedValue({ error: null }),
    },
  },
}))

jest.mock("expo-linking", () => ({
  getInitialURL: jest.fn(),
  useURL: jest.fn(),
}))

jest.mock("expo-router", () => ({
  router: { replace: jest.fn() },
}))

describe("ResetPasswordScreen", () => {
  beforeEach(() => jest.clearAllMocks())

  it("updates the password using the tokens parsed from the deep link", async () => {
    ;(Linking.useURL as jest.Mock).mockReturnValue(
      "gymflowmember://reset-password?access_token=abc123&refresh_token=xyz789&type=recovery"
    )

    const { getByPlaceholderText, getByText } = render(<ResetPasswordScreen />)

    fireEvent.changeText(getByPlaceholderText("Nueva contraseña"), "nuevaClaveSegura123")
    fireEvent.press(getByText("Guardar nueva contraseña"))

    await waitFor(() => {
      expect(supabase.auth.setSession).toHaveBeenCalledWith({
        access_token: "abc123",
        refresh_token: "xyz789",
      })
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({ password: "nuevaClaveSegura123" })
    })
  })

  it("shows an error and does not call supabase when the link has no valid tokens", async () => {
    ;(Linking.useURL as jest.Mock).mockReturnValue("gymflowmember://reset-password")

    const { getByPlaceholderText, getByText, findByText } = render(<ResetPasswordScreen />)

    fireEvent.changeText(getByPlaceholderText("Nueva contraseña"), "nuevaClaveSegura123")
    fireEvent.press(getByText("Guardar nueva contraseña"))

    expect(await findByText("Link inválido o vencido")).toBeTruthy()
    expect(supabase.auth.setSession).not.toHaveBeenCalled()
  })

  it("shows an error and does not call updateUser when setSession fails with an expired link", async () => {
    ;(Linking.useURL as jest.Mock).mockReturnValue(
      "gymflowmember://reset-password?access_token=expired&refresh_token=expired&type=recovery"
    )
    ;(supabase.auth.setSession as jest.Mock).mockResolvedValueOnce({
      error: { message: "Invalid or expired token" },
    })

    const { getByPlaceholderText, getByText, findByText } = render(<ResetPasswordScreen />)

    fireEvent.changeText(getByPlaceholderText("Nueva contraseña"), "nuevaClaveSegura123")
    fireEvent.press(getByText("Guardar nueva contraseña"))

    expect(await findByText("Link inválido o vencido")).toBeTruthy()
    expect(supabase.auth.updateUser).not.toHaveBeenCalled()
  })
})
