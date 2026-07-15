export function parseResetPasswordLink(url: string): { accessToken: string; refreshToken: string } | null {
  try {
    // Try fragment first
    if (url.includes("#")) {
      const paramString = url.split("#")[1] ?? ""
      const params = new URLSearchParams(paramString)
      const type = params.get("type")
      const accessToken = params.get("access_token")
      const refreshToken = params.get("refresh_token")

      if (type === "recovery" && accessToken && refreshToken) {
        return { accessToken, refreshToken }
      }
    }

    // Fall back to query string
    if (url.includes("?")) {
      const paramString = url.split("?")[1] ?? ""
      const params = new URLSearchParams(paramString)
      const type = params.get("type")
      const accessToken = params.get("access_token")
      const refreshToken = params.get("refresh_token")

      if (type === "recovery" && accessToken && refreshToken) {
        return { accessToken, refreshToken }
      }
    }

    return null
  } catch {
    return null
  }
}
