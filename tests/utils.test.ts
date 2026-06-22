import { describe, it, expect } from "vitest"
import { cn, formatPrice, formatDate, formatNumber, slugify, truncate, generateOrderNumber } from "@/lib/utils"

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2")
  })

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible")
  })

  it("merges tailwind classes correctly", () => {
    expect(cn("px-4", "px-6")).toBe("px-6")
  })
})

describe("formatPrice", () => {
  it("formats USD by default", () => {
    expect(formatPrice(29.99)).toBe("$29.99")
  })

  it("formats with currency option", () => {
    expect(formatPrice(29.99, { currency: "EUR" })).toBe("€29.99")
  })

  it("formats compact notation", () => {
    expect(formatPrice(1500, { notation: "compact" })).toBe("$1.5K")
  })

  it("handles string input", () => {
    expect(formatPrice("49.99")).toBe("$49.99")
  })

  it("handles zero", () => {
    expect(formatPrice(0)).toBe("$0.00")
  })
})

describe("formatDate", () => {
  it("formats a date string", () => {
    const result = formatDate("2024-01-15")
    expect(result).toBe("January 15, 2024")
  })

  it("formats a Date object", () => {
    const result = formatDate(new Date(2024, 0, 15))
    expect(result).toBe("January 15, 2024")
  })
})

describe("formatNumber", () => {
  it("formats with thousand separators", () => {
    expect(formatNumber(1234567)).toBe("1,234,567")
  })
})

describe("slugify", () => {
  it("converts to lowercase slug", () => {
    expect(slugify("Hello World")).toBe("hello-world")
  })

  it("removes special characters", () => {
    expect(slugify("Hello! World?")).toBe("hello-world")
  })

  it("handles multiple spaces", () => {
    expect(slugify("hello   world")).toBe("hello-world")
  })

  it("trims dashes", () => {
    expect(slugify("  hello world  ")).toBe("hello-world")
  })
})

describe("truncate", () => {
  it("returns string if shorter than length", () => {
    expect(truncate("hello", 10)).toBe("hello")
  })

  it("truncates with ellipsis", () => {
    expect(truncate("hello world this is long", 10)).toBe("hello worl...")
  })
})

describe("generateOrderNumber", () => {
  it("starts with M4VX prefix", () => {
    expect(generateOrderNumber()).toMatch(/^M4VX-/)
  })

  it("generates unique numbers", () => {
    const a = generateOrderNumber()
    const b = generateOrderNumber()
    expect(a).not.toBe(b)
  })
})
