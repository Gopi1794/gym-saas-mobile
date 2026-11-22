import React from "react"
import { AccessibilityInfo } from "react-native"
import { render, screen } from "@testing-library/react-native"
import AnimatedGradientBackground from "./AnimatedGradientBackground"

jest.mock("expo-linear-gradient", () => {
  const { View } = require("react-native")
  return { LinearGradient: (props: object) => <View {...props} /> }
})

function mockReduceMotion(enabled: boolean) {
  jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(enabled)
  jest.spyOn(AccessibilityInfo, "addEventListener").mockReturnValue({ remove: jest.fn() } as never)
}

afterEach(() => jest.restoreAllMocks())

describe("AnimatedGradientBackground", () => {
  it("renders without intercepting touches", async () => {
    mockReduceMotion(false)
    await render(<AnimatedGradientBackground />)
    const root = await screen.findByTestId("animated-gradient-background")
    expect(root.props.pointerEvents).toBe("none")
  })

  it("animates when reduce motion is off", async () => {
    mockReduceMotion(false)
    await render(<AnimatedGradientBackground />)
    expect(await screen.findByTestId("gradient-animated")).toBeTruthy()
    expect(screen.queryByTestId("gradient-static")).toBeNull()
  })

  it("renders the static gradient when reduce motion is on", async () => {
    mockReduceMotion(true)
    await render(<AnimatedGradientBackground />)
    expect(await screen.findByTestId("gradient-static")).toBeTruthy()
    expect(screen.queryByTestId("gradient-animated")).toBeNull()
  })
})
