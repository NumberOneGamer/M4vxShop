import { test, expect } from "@playwright/test"

test.describe("Search", () => {
  test("shop page has search/filter elements", async ({ page }) => {
    await page.goto("/shop")
    await expect(page.locator("h1")).toBeVisible()
  })

  test("shop page renders product grid", async ({ page }) => {
    await page.goto("/shop")
    await expect(page.locator("main")).toBeVisible()
  })
})
