import React from "react"
import { render, fireEvent } from "@testing-library/react-native"
import MembershipExpiredScreen from "./membership-expired"
import { useAuth } from "../lib/auth/AuthContext"

jest.mock("../lib/auth/AuthContext", () => ({
  useAuth: jest.fn(),
}))

describe("MembershipExpiredScreen", () => {
  beforeEach(() => jest.clearAllMocks())

  it("calls signOut when the sign-out button is pressed", () => {
    const signOut = jest.fn()
    ;(useAuth as jest.Mock).mockReturnValue({ signOut })

    const { getByText } = render(<MembershipExpiredScreen />)

    fireEvent.press(getByText("Cerrar sesión"))

    expect(signOut).toHaveBeenCalled()
  })
})
