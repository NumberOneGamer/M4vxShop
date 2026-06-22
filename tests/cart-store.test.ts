import { describe, it, expect, beforeEach } from "vitest"
import { useCartStore } from "@/stores/cart-store"
import type { CartItemType } from "@/types/cart"

const mockItem = (overrides: Partial<CartItemType> = {}): CartItemType => ({
  id: "item-1",
  productId: "prod-1",
  variantId: null,
  name: "Test Product",
  slug: "test-product",
  price: 29.99,
  comparePrice: null,
  quantity: 1,
  stock: 10,
  image: null,
  imageAlt: null,
  variantName: null,
  ...overrides,
})

const mockCoupon = {
  code: "SAVE20",
  discountType: "percentage" as const,
  discountValue: 20,
  minOrderAmount: null,
}

describe("CartStore", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], coupon: null, shipping: null, isOpen: false })
  })

  describe("addItem", () => {
    it("adds a new item to empty cart", () => {
      useCartStore.getState().addItem(mockItem())
      expect(useCartStore.getState().items).toHaveLength(1)
      expect(useCartStore.getState().items[0].name).toBe("Test Product")
    })

    it("increments quantity if same product+variant already in cart", () => {
      useCartStore.getState().addItem(mockItem())
      useCartStore.getState().addItem(mockItem())
      expect(useCartStore.getState().items).toHaveLength(1)
      expect(useCartStore.getState().items[0].quantity).toBe(2)
    })

    it("caps quantity at stock level", () => {
      useCartStore.getState().addItem(mockItem({ quantity: 8 }))
      useCartStore.getState().addItem(mockItem({ quantity: 5 }))
      expect(useCartStore.getState().items[0].quantity).toBe(10)
    })
  })

  describe("removeItem", () => {
    it("removes an item by id", () => {
      useCartStore.getState().addItem(mockItem())
      useCartStore.getState().removeItem("item-1")
      expect(useCartStore.getState().items).toHaveLength(0)
    })
  })

  describe("updateQuantity", () => {
    it("updates quantity", () => {
      useCartStore.getState().addItem(mockItem())
      useCartStore.getState().updateQuantity("item-1", 3)
      expect(useCartStore.getState().items[0].quantity).toBe(3)
    })

    it("caps quantity at stock", () => {
      useCartStore.getState().addItem(mockItem())
      useCartStore.getState().updateQuantity("item-1", 20)
      expect(useCartStore.getState().items[0].quantity).toBe(10)
    })

    it("removes item if quantity is 0", () => {
      useCartStore.getState().addItem(mockItem())
      useCartStore.getState().updateQuantity("item-1", 0)
      expect(useCartStore.getState().items).toHaveLength(0)
    })
  })

  describe("clearCart", () => {
    it("clears items, coupon, and shipping", () => {
      useCartStore.getState().addItem(mockItem())
      useCartStore.getState().setCoupon(mockCoupon)
      useCartStore.getState().clearCart()
      expect(useCartStore.getState().items).toHaveLength(0)
      expect(useCartStore.getState().coupon).toBeNull()
      expect(useCartStore.getState().shipping).toBeNull()
    })
  })

  describe("computed values", () => {
    it("totalItems sums quantities", () => {
      useCartStore.getState().addItem(mockItem({ id: "a", quantity: 2 }))
      useCartStore.getState().addItem(mockItem({ id: "b", quantity: 3 }))
      expect(useCartStore.getState().totalItems()).toBe(5)
    })

    it("subtotal sums price * quantity", () => {
      useCartStore.getState().addItem(mockItem({ id: "a", productId: "prod-a", price: 10, quantity: 2 }))
      useCartStore.getState().addItem(mockItem({ id: "b", productId: "prod-b", price: 5, quantity: 3 }))
      expect(useCartStore.getState().subtotal()).toBe(35)
    })

    it("discount returns 0 without coupon", () => {
      useCartStore.getState().addItem(mockItem({ price: 100, quantity: 1 }))
      expect(useCartStore.getState().discount()).toBe(0)
    })

    it("discount applies percentage coupon", () => {
      useCartStore.getState().addItem(mockItem({ price: 100, quantity: 1 }))
      useCartStore.getState().setCoupon(mockCoupon)
      expect(useCartStore.getState().discount()).toBe(20)
    })

    it("total is subtotal - discount + shipping", () => {
      useCartStore.getState().addItem(mockItem({ price: 100, quantity: 1 }))
      useCartStore.getState().setCoupon(mockCoupon)
      useCartStore.getState().setShipping({ id: "std", label: "Standard", cost: 10 })
      expect(useCartStore.getState().total()).toBe(90)
    })
  })

  describe("cart UI state", () => {
    it("toggles open state", () => {
      expect(useCartStore.getState().isOpen).toBe(false)
      useCartStore.getState().toggleOpen()
      expect(useCartStore.getState().isOpen).toBe(true)
      useCartStore.getState().toggleOpen()
      expect(useCartStore.getState().isOpen).toBe(false)
    })

    it("sets open state", () => {
      useCartStore.getState().setOpen(true)
      expect(useCartStore.getState().isOpen).toBe(true)
    })
  })
})
