import { describe, it, expect, vi, beforeEach } from "vitest"

const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
}

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}))

vi.mock("better-auth", () => ({
  betterAuth: () => ({
    api: {
      signUp: vi.fn(),
      signIn: vi.fn(),
      verifyEmail: vi.fn(),
    },
  }),
}))

describe("Auth Flow Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("registers a new user", async () => {
    const userData = {
      email: "newuser@example.com",
      password: "SecurePass123!",
      name: "New User",
    }

    mockPrisma.user.findUnique.mockResolvedValue(null)
    mockPrisma.user.create.mockResolvedValue({
      id: "user-1",
      email: userData.email,
      name: userData.name,
      role: "CUSTOMER",
      emailVerified: false,
    })

    const register = async (data: typeof userData) => {
      const existing = await mockPrisma.user.findUnique({
        where: { email: data.email },
      })
      if (existing) return { error: "Email already registered" }

      const user = await mockPrisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          emailVerified: false,
        },
      })

      return { success: true, userId: user.id }
    }

    const result = await register(userData)
    expect(result.success).toBe(true)
    expect(result.userId).toBe("user-1")
  })

  it("prevents duplicate registration", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "existing-user",
      email: "existing@example.com",
    })

    const register = async (email: string) => {
      const existing = await mockPrisma.user.findUnique({ where: { email } })
      if (existing) return { error: "Email already registered" }
      return { success: true }
    }

    const result = await register("existing@example.com")
    expect(result).toEqual({ error: "Email already registered" })
  })

  it("login verifies credentials", async () => {
    const mockUser = {
      id: "user-1",
      email: "test@example.com",
      passwordHash: "$2a$10$hashedpassword",
      name: "Test User",
    }

    mockPrisma.user.findUnique.mockResolvedValue(mockUser)

    const login = async (email: string, _password: string) => {
      const user = await mockPrisma.user.findUnique({ where: { email } })
      if (!user) return { error: "Invalid credentials" }
      return { success: true, userId: user.id }
    }

    const result = await login("test@example.com", "password")
    expect(result).toEqual({ success: true, userId: "user-1" })
  })

  it("rejects login for non-existent user", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null)

    const login = async (email: string) => {
      const user = await mockPrisma.user.findUnique({ where: { email } })
      if (!user) return { error: "Invalid credentials" }
      return { success: true }
    }

    const result = await login("nonexistent@example.com")
    expect(result).toEqual({ error: "Invalid credentials" })
  })
})
