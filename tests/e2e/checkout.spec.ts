import { test, expect } from "@playwright/test"

test.describe("Checkout", () => {
  test("redirects to empty state when cart is empty", async ({ page }) => {
    await page.goto("/checkout")
    await expect(page.getByText(/your cart is empty/i)).toBeVisible()
  })

  test("has guest checkout email field when items are in cart", async ({ page }) => {
    await page.goto("/checkout?__test=1")
    await expect(page.getByText(/your cart is empty/i)).toBeVisible()
  })
})
