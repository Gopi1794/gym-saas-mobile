import AsyncStorage from "@react-native-async-storage/async-storage"
import * as SecureStore from "expo-secure-store"
import largeSecureStore from "./largeSecureStore"

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}))

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}))

describe("largeSecureStore", () => {
  const mockAsyncStorage: Record<string, string> = {}
  const mockSecureStore: Record<string, string> = {}

  beforeEach(() => {
    jest.clearAllMocks()
    Object.keys(mockAsyncStorage).forEach((k) => delete mockAsyncStorage[k])
    Object.keys(mockSecureStore).forEach((k) => delete mockSecureStore[k])

    ;(AsyncStorage.setItem as jest.Mock).mockImplementation(async (k, v) => {
      mockAsyncStorage[k] = v
    })
    ;(AsyncStorage.getItem as jest.Mock).mockImplementation(async (k) => mockAsyncStorage[k] ?? null)
    ;(AsyncStorage.removeItem as jest.Mock).mockImplementation(async (k) => {
      delete mockAsyncStorage[k]
    })
    ;(SecureStore.setItemAsync as jest.Mock).mockImplementation(async (k, v) => {
      mockSecureStore[k] = v
    })
    ;(SecureStore.getItemAsync as jest.Mock).mockImplementation(async (k) => mockSecureStore[k] ?? null)
    ;(SecureStore.deleteItemAsync as jest.Mock).mockImplementation(async (k) => {
      delete mockSecureStore[k]
    })
  })

  it("roundtrips a value through setItem and getItem", async () => {
    await largeSecureStore.setItem("supabase-session", "hello world session data")
    const result = await largeSecureStore.getItem("supabase-session")
    expect(result).toBe("hello world session data")
  })

  it("never stores plaintext in AsyncStorage", async () => {
    await largeSecureStore.setItem("supabase-session", "plaintext-secret")
    expect(mockAsyncStorage["supabase-session"]).not.toContain("plaintext-secret")
  })

  it("returns null when nothing is stored", async () => {
    const result = await largeSecureStore.getItem("missing-key")
    expect(result).toBeNull()
  })

  it("removeItem clears both stores", async () => {
    await largeSecureStore.setItem("supabase-session", "value")
    await largeSecureStore.removeItem("supabase-session")
    expect(await largeSecureStore.getItem("supabase-session")).toBeNull()
    expect(mockSecureStore["supabase-session"]).toBeUndefined()
  })
})
