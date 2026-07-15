import { parseResetPasswordLink } from "./deepLink"

describe("parseResetPasswordLink", () => {
  it("extracts tokens from a valid recovery link with query params", () => {
    const url = "gymflowmember://reset-password?access_token=abc123&refresh_token=xyz789&type=recovery"
    expect(parseResetPasswordLink(url)).toEqual({ accessToken: "abc123", refreshToken: "xyz789" })
  })

  it("extracts tokens from a universal link with a hash fragment", () => {
    const url = "https://voltia-fitness.com/reset-password#access_token=abc123&refresh_token=xyz789&type=recovery"
    expect(parseResetPasswordLink(url)).toEqual({ accessToken: "abc123", refreshToken: "xyz789" })
  })

  it("returns null when type is not recovery", () => {
    const url = "gymflowmember://reset-password?access_token=abc123&refresh_token=xyz789&type=signup"
    expect(parseResetPasswordLink(url)).toBeNull()
  })

  it("returns null when tokens are missing", () => {
    const url = "gymflowmember://reset-password?type=recovery"
    expect(parseResetPasswordLink(url)).toBeNull()
  })

  it("returns null for a malformed url", () => {
    expect(parseResetPasswordLink("not-a-url")).toBeNull()
  })

  it("falls back to query string when hash fragment lacks valid recovery tokens", () => {
    const url = "https://voltia-fitness.com/reset-password#foo=bar?access_token=abc123&refresh_token=xyz789&type=recovery"
    expect(parseResetPasswordLink(url)).toEqual({ accessToken: "abc123", refreshToken: "xyz789" })
  })
})
