export function parseResetPasswordLink(url: string): { accessToken: string; refreshToken: string } | null {
  let paramString: string

  try {
    if (url.includes("#")) {
      paramString = url.split("#")[1] ?? ""
    } else if (url.includes("?")) {
      paramString = url.split("?")[1] ?? ""
    } else {
      return null
    }
  } catch {
    return null
  }

  const params = new URLSearchParams(paramString)
  const type = params.get("type")
  const accessToken = params.get("access_token")
  const refreshToken = params.get("refresh_token")

  if (type !== "recovery" || !accessToken || !refreshToken) {
    return null
  }

  return { accessToken, refreshToken }
}
