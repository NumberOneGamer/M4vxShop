import { describe, it, expect } from "vitest"
import {
  emailSchema,
  addressSchema,
  createOrderSchema,
  reviewSchema,
  newsletterSchema,
  couponSchema,
  productSchema,
  searchQuerySchema,
} from "@/lib/validations"

describe("emailSchema", () => {
  it("validates a valid email", () => {
    expect(emailSchema.safeParse("test@example.com").success).toBe(true)
  })

  it("rejects invalid email", () => {
    expect(emailSchema.safeParse("not-an-email").success).toBe(false)
  })

  it("rejects empty string", () => {
    expect(emailSchema.safeParse("").success).toBe(false)
  })
})

describe("addressSchema", () => {
  it("validates a valid address", () => {
    const result = addressSchema.safeParse({
      line1: "123 Main St",
      city: "New York",
      postalCode: "10001",
    })
    expect(result.success).toBe(true)
  })

  it("rejects missing required fields", () => {
    const result = addressSchema.safeParse({ line1: "" })
    expect(result.success).toBe(false)
  })
})

describe("createOrderSchema", () => {
  const validOrder = {
    email: "test@example.com",
    firstName: "John",
    lastName: "Doe",
    address1: "123 Main St",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "US",
    shippingMethod: "standard",
    paymentIntentId: "pi_123",
    items: [{ productId: "p1", name: "Item", price: 10, quantity: 1 }],
    subtotal: 10,
    shippingCost: 5,
    taxAmount: 1,
    discountAmount: 0,
    total: 16,
  }

  it("validates a valid order", () => {
    const result = createOrderSchema.safeParse(validOrder)
    expect(result.success).toBe(true)
  })

  it("rejects missing email", () => {
    const result = createOrderSchema.safeParse({ ...validOrder, email: "" })
    expect(result.success).toBe(false)
  })

  it("rejects negative total", () => {
    const result = createOrderSchema.safeParse({ ...validOrder, total: -1 })
    expect(result.success).toBe(false)
  })

  it("rejects empty items", () => {
    const result = createOrderSchema.safeParse({ ...validOrder, items: [] })
    expect(result.success).toBe(false)
  })
})

describe("reviewSchema", () => {
  it("validates a valid review", () => {
    const result = reviewSchema.safeParse({
      productId: "p1",
      rating: 5,
      title: "Great!",
      body: "Really love this product.",
    })
    expect(result.success).toBe(true)
  })

  it("rejects rating out of range", () => {
    expect(reviewSchema.safeParse({ productId: "p1", rating: 6, title: "x", body: "y" }).success).toBe(false)
    expect(reviewSchema.safeParse({ productId: "p1", rating: 0, title: "x", body: "y" }).success).toBe(false)
  })
})

describe("newsletterSchema", () => {
  it("validates a valid email", () => {
    expect(newsletterSchema.safeParse({ email: "test@example.com" }).success).toBe(true)
  })

  it("rejects invalid email", () => {
    expect(newsletterSchema.safeParse({ email: "bad" }).success).toBe(false)
  })
})

describe("couponSchema", () => {
  it("validates percentage coupon", () => {
    const result = couponSchema.safeParse({
      code: "SAVE20",
      discountType: "PERCENTAGE",
      discountValue: 20,
    })
    expect(result.success).toBe(true)
  })

  it("validates fixed coupon", () => {
    const result = couponSchema.safeParse({
      code: "SAVE10",
      discountType: "FIXED",
      discountValue: 10,
    })
    expect(result.success).toBe(true)
  })
})

describe("productSchema", () => {
  it("validates a valid product", () => {
    const result = productSchema.safeParse({
      name: "Test Product",
      slug: "test-product",
      description: "A test product description",
      price: 29.99,
      stock: 10,
    })
    expect(result.success).toBe(true)
  })

  it("rejects missing name", () => {
    const result = productSchema.safeParse({
      slug: "test-product",
      description: "x",
      price: 10,
      stock: 1,
    })
    expect(result.success).toBe(false)
  })
})

describe("searchQuerySchema", () => {
  it("validates a valid query", () => {
    expect(searchQuerySchema.safeParse({ query: "shoes" }).success).toBe(true)
  })

  it("rejects empty query", () => {
    expect(searchQuerySchema.safeParse({ query: "" }).success).toBe(false)
  })
})
