import { test, expect } from "@playwright/test"

test.describe("Homepage", () => {
  test("renders the hero section", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("h1")).toBeVisible()
  })

  test("navigation links work", async ({ page }) => {
    await page.goto("/")
    const shopLink = page.locator('header a[href="/shop"]')
    await expect(shopLink).toBeVisible()
    await page.goto("/shop")
    await expect(page).toHaveURL(/\/shop/)
  })

  test("footer is present", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("contentinfo")).toBeVisible()
  })
})
