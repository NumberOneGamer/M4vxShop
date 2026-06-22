# Testing

## Test Structure

```
tests/
├── e2e/                    # Playwright end-to-end tests
│   ├── homepage.spec.ts
│   ├── product.spec.ts
│   ├── cart.spec.ts
│   ├── checkout.spec.ts
│   ├── auth.spec.ts
│   ├── admin.spec.ts
│   ├── search.spec.ts
│   └── mobile.spec.ts
├── integration/            # Integration tests (mocked Prisma)
│   ├── stripe-webhook.test.ts
│   ├── auth-flow.test.ts
│   └── product-import-export.test.ts
├── utils.test.ts           # Unit tests for utility functions
├── validations.test.ts     # Unit tests for Zod schemas
├── cart-store.test.ts      # Unit tests for Zustand cart store
├── setup.ts                # Test setup (jest-dom, localStorage mock)
├── vitest.config.ts        # Vitest configuration
└── playwright.config.ts    # Playwright configuration
```

## Running Tests

### Unit & Integration Tests

Uses Vitest with jsdom environment:

```bash
npm run test                 # Run once
npm run test:coverage        # Run with coverage report
```

Coverage is generated in `coverage/` (text, JSON, HTML reports).

### E2E Tests

Uses Playwright with Chromium:

```bash
npm run test:e2e             # Run all E2E tests
```

Requires the Next.js dev server running on port 3000.

## Writing Tests

### Unit Tests

Place in `tests/` with the pattern `*.test.ts`. Use Vitest globals (`describe`, `it`, `expect`).

```typescript
import { formatPrice } from "@/lib/utils"

describe("formatPrice", () => {
  it("formats USD by default", () => {
    expect(formatPrice(29.99)).toBe("$29.99")
  })
})
```

### Integration Tests

Place in `tests/integration/`. Mock Prisma using `vi.hoisted`:

```typescript
import { vi, describe, it, expect } from "vitest"

const mockPrisma = { ... }
vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }))
```

### E2E Tests

Place in `tests/e2e/`. Use Playwright's test framework:

```typescript
import { test, expect } from "@playwright/test"

test("homepage has title", async ({ page }) => {
  await page.goto("/")
  await expect(page).toHaveTitle(/M4vx/)
})
```

## Test Data / Seeding

The database seed script is at `prisma/seed.ts`. Run it with:

```bash
npm run db:seed
```

Seeds include:
- Admin user (admin@m4vx.com / password123)
- Demo customer users
- Product catalog with categories
- Sample reviews
- Coupon codes

## Continuous Integration

Tests run via GitHub Actions. The pipeline:
1. Run `npm run typecheck`
2. Run `npm run lint`
3. Run `npm run test`
4. Run `npm run build`
