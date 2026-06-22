# M4VX — Premium Dropshipping

A modern e-commerce platform built with Next.js 15, featuring a monochrome minimalist design, server-side rendering, and comprehensive tooling.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + CSS variables |
| Database | PostgreSQL via Prisma ORM |
| Auth | Better-Auth (credentials + OAuth) |
| Payments | Stripe (Checkout, Webhooks) |
| Email | Resend + @react-email/components |
| File Storage | Cloudflare R2 |
| UI Primitives | Radix UI + shadcn/ui |
| Animation | Framer Motion |
| State | Zustand + Nanostores |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL (Neon, Supabase, or local)
- Stripe account (test mode)
- Resend account
- Cloudflare R2 bucket

### Setup

```bash
git clone <repo-url> m4vx
cd m4vx
npm install
```

Copy the environment file and fill in your values:

```bash
cp .env.example .env.local
```

Run database migrations and seed:

```bash
npm run db:push
npm run db:seed
```

Start the dev server:

```bash
npm run dev
```

## Environment Variables

See `.env.example` for all required variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | 32-char secret for Better-Auth |
| `BETTER_AUTH_URL` | Auth callback URL |
| `NEXTAUTH_SECRET` | 32-char secret for NextAuth |
| `NEXTAUTH_URL` | NextAuth callback URL |
| `STRIPE_SECRET_KEY` | Stripe secret key (sk_test_) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `RESEND_API_KEY` | Resend API key |
| `R2_ACCOUNT_ID` | Cloudflare R2 account ID |
| `R2_ACCESS_KEY_ID` | R2 access key |
| `R2_SECRET_ACCESS_KEY` | R2 secret key |
| `R2_BUCKET_NAME` | R2 bucket name |
| `R2_PUBLIC_URL` | R2 public base URL |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID (optional) |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier formatting |
| `npm run typecheck` | TypeScript type check |
| `npm run test` | Run unit + integration tests |
| `npm run test:coverage` | Run tests with coverage |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Create a new migration |
| `npm run db:seed` | Seed the database |
| `npm run db:studio` | Open Prisma Studio |

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── (shop)/       # Public-facing routes
│   ├── (auth)/       # Auth routes (login, register)
│   ├── admin/        # Admin dashboard
│   ├── account/      # User account pages
│   └── api/          # API routes
├── components/
│   ├── admin/        # Admin-specific components
│   ├── cart/         # Cart components
│   ├── home/         # Homepage sections
│   ├── layout/       # Layout components (header, footer, nav)
│   ├── product/      # Product detail components
│   ├── shared/       # Shared components (SEO, ratings)
│   ├── shop/         # Shop listing components
│   └── ui/           # shadcn/ui primitives
├── hooks/            # Custom React hooks
├── lib/              # Utilities, config, helpers
│   ├── email/        # Email templates
│   └── email/templates/
├── providers/        # React context providers
├── server/
│   ├── actions/      # Server actions
│   └── services/     # Business logic services
├── stores/           # Zustand stores
└── types/            # TypeScript type definitions
tests/
├── e2e/              # Playwright E2E tests
├── integration/      # Integration tests (mocked)
├── setup.ts          # Test setup
├── vitest.config.ts  # Vitest config
└── playwright.config.ts  # Playwright config
```

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for Vercel deployment instructions, environment variable setup, and third-party service configuration.
