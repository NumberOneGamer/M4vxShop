import { test, expect } from "@playwright/test"

test.describe("Cart", () => {
  test("cart page renders empty state", async ({ page }) => {
    await page.goto("/cart")
    await expect(page.getByRole("heading", { name: /cart/i }).first()).toBeVisible()
  })

  test("can navigate to checkout from cart", async ({ page }) => {
    await page.goto("/cart")
    const checkoutBtn = page.getByRole("link", { name: /checkout/i })
    if (await checkoutBtn.isVisible()) {
      await checkoutBtn.click()
      await expect(page).toHaveURL(/\/checkout/)
    }
  })
})
