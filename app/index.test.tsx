import React from "react"
import { render, fireEvent, waitFor, screen } from "@testing-library/react-native"
import HomeScreen from "./index"
import { useAuth } from "../lib/auth/AuthContext"
import { loadMemberHome } from "../lib/home/loadMemberHome"
import type { MemberHomeData } from "../lib/home/memberHome"

jest.mock("../lib/auth/AuthContext", () => ({ useAuth: jest.fn() }))
jest.mock("../lib/supabase/client", () => ({ supabase: { __fake: true } }))
jest.mock("../lib/home/loadMemberHome", () => ({ loadMemberHome: jest.fn() }))

const mockUseAuth = useAuth as jest.Mock
const mockLoad = loadMemberHome as jest.Mock

const week = {
  days: [
    { label: "L", status: "completed" },
    { label: "M", status: "rest" },
    { label: "X", status: "missed" },
    { label: "J", status: "today-pending" },
    { label: "V", status: "future" },
    { label: "S", status: "future" },
    { label: "D", status: "future" },
  ],
  planned: 3,
  completed: 1,
} as const

function data(overrides: Partial<MemberHomeData> = {}): MemberHomeData {
  return {
    greeting: "Buenas tardes, Gabriel",
    membership: { kind: "active", daysLeft: 20 },
    plan: {
      name: "Hipertrofia",
      dayName: "Jueves",
      exercises: [
        { name: "Press banca", prescription: "4 × 8–10" },
        { name: "Plancha", prescription: "3 × 45 s" },
      ],
    },
    week: { ...week, days: [...week.days] },
    streak: 3,
    ...overrides,
  }
}

const signOut = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  mockUseAuth.mockReturnValue({ session: { user: { id: "user-1" } }, signOut })
})

describe("HomeScreen", () => {
  it("shows a loading indicator while the data loads", async () => {
    mockLoad.mockReturnValue(new Promise(() => {}))
    await render(<HomeScreen />)
    expect(screen.getByTestId("home-loading")).toBeTruthy()
  })

  it("loads the home for the signed-in member", async () => {
    mockLoad.mockResolvedValue(data())
    await render(<HomeScreen />)
    await screen.findByText("Buenas tardes, Gabriel")
    expect(mockLoad).toHaveBeenCalledWith(expect.anything(), "user-1")
  })

  it("renders today's workout with name and prescription", async () => {
    mockLoad.mockResolvedValue(data())
    await render(<HomeScreen />)

    await screen.findByText("Hipertrofia")
    expect(screen.getByText("Hoy · Jueves")).toBeTruthy()
    expect(screen.getByText("Press banca")).toBeTruthy()
    expect(screen.getByText("4 × 8–10")).toBeTruthy()
    expect(screen.getByText("Plancha")).toBeTruthy()
    expect(screen.getByText("3 × 45 s")).toBeTruthy()
  })

  it("shows the empty state when no plan is assigned", async () => {
    mockLoad.mockResolvedValue(data({ plan: null, week: null }))
    await render(<HomeScreen />)

    await screen.findByText("Sin plan asignado")
    expect(screen.queryByText("Tu semana")).toBeNull()
  })

  it("shows the rest-day state when the plan has nothing for today", async () => {
    mockLoad.mockResolvedValue(data({ plan: { name: "Hipertrofia", dayName: "Jueves", exercises: [] } }))
    await render(<HomeScreen />)

    await screen.findByText("Sin rutina hoy")
    expect(screen.getByText("Hoy · Jueves")).toBeTruthy()
  })

  it("shows weekly progress and the streak", async () => {
    mockLoad.mockResolvedValue(data())
    await render(<HomeScreen />)

    await screen.findByText("Tu semana")
    expect(screen.getByText("1 de 3 días completados")).toBeTruthy()
    expect(screen.getByText("Racha: 3 días")).toBeTruthy()
  })

  it("uses the singular for a one-day streak", async () => {
    mockLoad.mockResolvedValue(data({ streak: 1 }))
    await render(<HomeScreen />)
    await screen.findByText("Racha: 1 día")
  })

  it("shows the membership status without a renew notice when it is active", async () => {
    mockLoad.mockResolvedValue(data())
    await render(<HomeScreen />)

    await screen.findByText("Vence en 20 días")
    expect(screen.queryByText(/Renovala/)).toBeNull()
  })

  it("shows a renew-at-the-gym notice (no payment button) when it expires within 7 days", async () => {
    mockLoad.mockResolvedValue(data({ membership: { kind: "expiring", daysLeft: 3 } }))
    await render(<HomeScreen />)

    await screen.findByText("Vence en 3 días")
    expect(screen.getByText(/Renovala en el gimnasio o desde la web/)).toBeTruthy()
  })

  it("says it expires today on the last day", async () => {
    mockLoad.mockResolvedValue(data({ membership: { kind: "expiring", daysLeft: 0 } }))
    await render(<HomeScreen />)
    await screen.findByText("Vence hoy")
  })

  it("shows an expired membership", async () => {
    mockLoad.mockResolvedValue(data({ membership: { kind: "expired", daysLeft: -2 } }))
    await render(<HomeScreen />)

    await screen.findByText("Membresía vencida")
    expect(screen.getByText(/Renovala en el gimnasio o desde la web/)).toBeTruthy()
  })

  it("shows a neutral message when there is no membership date", async () => {
    mockLoad.mockResolvedValue(data({ membership: { kind: "none", daysLeft: null } }))
    await render(<HomeScreen />)
    await screen.findByText("Sin vencimiento registrado")
  })

  it("shows an error with retry and recovers on retry", async () => {
    mockLoad.mockRejectedValueOnce(new Error("network"))
    mockLoad.mockResolvedValueOnce(data())
    await render(<HomeScreen />)

    await screen.findByText("No pudimos cargar tu inicio")
    await fireEvent.press(screen.getByText("Reintentar"))

    await screen.findByText("Buenas tardes, Gabriel")
    expect(mockLoad).toHaveBeenCalledTimes(2)
  })

  it("still offers sign out when loading failed", async () => {
    mockLoad.mockRejectedValue(new Error("network"))
    await render(<HomeScreen />)

    await screen.findByText("No pudimos cargar tu inicio")
    await fireEvent.press(screen.getByText("Cerrar sesión"))
    expect(signOut).toHaveBeenCalledTimes(1)
  })

  it("signs out from the home", async () => {
    mockLoad.mockResolvedValue(data())
    await render(<HomeScreen />)

    await screen.findByText("Buenas tardes, Gabriel")
    await fireEvent.press(screen.getByText("Cerrar sesión"))
    await waitFor(() => expect(signOut).toHaveBeenCalledTimes(1))
  })

  it("does not load anything without a session", async () => {
    mockUseAuth.mockReturnValue({ session: null, signOut })
    await render(<HomeScreen />)
    expect(mockLoad).not.toHaveBeenCalled()
  })
})
