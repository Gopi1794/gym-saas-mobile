import React from "react"
import { render, fireEvent } from "@testing-library/react-native"
import TurnstileCaptcha from "./TurnstileCaptcha"

jest.mock("react-native-webview", () => {
  const { View } = require("react-native")
  return { WebView: (props: object) => <View testID="webview" {...props} /> }
})

describe("TurnstileCaptcha", () => {
  it("shows a visible error and never emits a token when the configuration is missing", async () => {
    const onToken = jest.fn()
    const { getByText, queryByTestId } = await render(<TurnstileCaptcha onToken={onToken} siteKey="" hostname="" />)

    expect(getByText("La verificación de seguridad no está configurada. Contactá a soporte.")).toBeTruthy()
    expect(queryByTestId("webview")).toBeNull()
    expect(onToken).not.toHaveBeenCalled()
  })

  it("loads the widget with the allowed hostname as baseUrl and forwards tokens", async () => {
    const onToken = jest.fn()
    const { getByTestId } = await render(<TurnstileCaptcha onToken={onToken} siteKey="0xKEY" hostname="app.example.com" />)

    const webview = getByTestId("webview")
    expect(webview.props.source.baseUrl).toBe("https://app.example.com")
    expect(webview.props.source.html).toContain("0xKEY")

    await fireEvent(webview, "message", {
      nativeEvent: { data: JSON.stringify({ type: "success", token: "tok" }) },
    })
    expect(onToken).toHaveBeenLastCalledWith("tok")

    await fireEvent(webview, "message", { nativeEvent: { data: JSON.stringify({ type: "expired" }) } })
    expect(onToken).toHaveBeenLastCalledWith(null)
  })

  it("offers a retry when the widget reports an error", async () => {
    const onToken = jest.fn()
    const { getByTestId, getByText, queryByText } = await render(<TurnstileCaptcha onToken={onToken} siteKey="0xKEY" hostname="app.example.com" />)

    await fireEvent(getByTestId("webview"), "message", {
      nativeEvent: { data: JSON.stringify({ type: "error" }) },
    })
    await fireEvent.press(getByText("No pudimos cargar la verificación de seguridad. Tocá para reintentar."))

    expect(queryByText(/No pudimos cargar/)).toBeNull()
    expect(getByTestId("webview")).toBeTruthy()
  })
})
