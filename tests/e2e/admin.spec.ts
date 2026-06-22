import { test, expect } from "@playwright/test"

test.describe("Admin", () => {
  test("admin login redirects to login page", async ({ page }) => {
    await page.goto("/admin")
    await expect(page).toHaveURL(/\/login/)
  })

  test("admin products page redirects unauthenticated", async ({ page }) => {
    await page.goto("/admin/products")
    await expect(page).toHaveURL(/\/login/)
  })
})
