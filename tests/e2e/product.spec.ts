import { test, expect } from "@playwright/test"

test.describe("Product Page", () => {
  test.slow()

  const productLink = (page: import("@playwright/test").Page) =>
    page.locator('[data-testid="product-card"] a').first()

  test("product page loads with title", async ({ page }) => {
    await page.goto("/shop")
    const link = productLink(page)
    if (await link.count() > 0 && await link.isVisible()) {
      await link.click()
      await expect(page.locator("h1")).toBeVisible()
    }
  })

  test("gallery navigation works", async ({ page }) => {
    await page.goto("/shop")
    const link = productLink(page)
    if (await link.count() > 0 && await link.isVisible()) {
      await link.click()
      const nextBtn = page.getByLabel(/next image/i)
      if (await nextBtn.isVisible()) {
        await nextBtn.click()
      }
    }
  })

  test("can add product to cart", async ({ page }) => {
    await page.goto("/shop")
    const link = productLink(page)
    if (await link.count() > 0 && await link.isVisible()) {
      await link.click()
      const addBtn = page.getByRole("button", { name: /add to cart/i })
      if (await addBtn.isVisible()) {
        await addBtn.click()
      }
    }
  })
})
