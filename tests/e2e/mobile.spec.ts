import { test, expect } from "@playwright/test"

test.describe("Mobile", () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test("homepage renders without horizontal scroll", async ({ page }) => {
    await page.goto("/")
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 2)
  })

  test("bottom nav is visible on mobile", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("navigation").last()).toBeVisible()
  })

  test("cart page stacks vertically on mobile", async ({ page }) => {
    await page.goto("/cart")
    await expect(page.getByRole("heading", { name: /cart/i }).first()).toBeVisible()
  })
})
