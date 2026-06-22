import { test, expect } from "@playwright/test"

test.describe("Authentication", () => {
  test("login page has form fields", async ({ page }) => {
    await page.goto("/login")
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
  })

  test("register page has form fields", async ({ page }) => {
    await page.goto("/register")
    await expect(page.getByLabel(/email/i)).toBeVisible()
  })

  test("forgot password page loads", async ({ page }) => {
    await page.goto("/forgot-password")
    await expect(page.getByLabel(/email/i)).toBeVisible()
  })
})
