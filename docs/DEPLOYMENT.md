# Deployment

## Vercel

### 1. Connect Repository

Push the project to GitHub and import it into Vercel.

### 2. Set Build Configuration

- **Framework Preset:** Next.js (auto-detected)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)

### 3. Environment Variables

Add all variables from `.env.example` in the Vercel project settings. Key ones:

```
DATABASE_URL                 # PostgreSQL connection string
BETTER_AUTH_SECRET           # Generate: openssl rand -hex 32
BETTER_AUTH_URL              # https://your-domain.com
NEXTAUTH_SECRET              # Same as BETTER_AUTH_SECRET
NEXTAUTH_URL                 # https://your-domain.com
STRIPE_SECRET_KEY            # sk_live_... (production key)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  # pk_live_...
STRIPE_WEBHOOK_SECRET        # whsec_... (from Stripe)
RESEND_API_KEY               # re_... (Resend API key)
R2_ACCOUNT_ID                # Cloudflare R2 account ID
R2_ACCESS_KEY_ID             # R2 access key
R2_SECRET_ACCESS_KEY         # R2 secret key
R2_BUCKET_NAME               # m4vx-assets
R2_PUBLIC_URL                # https://assets.your-domain.com
NEXT_PUBLIC_VERCEL_URL       # your-project.vercel.app
NEXT_PUBLIC_GA_ID            # G-XXXXXXXX (optional)
```

### 4. Database Migration

Migrations run automatically on deploy via Vercel's Post-Deploy hook, or manually:

```bash
npx prisma db push
```

For zero-downtime, use:

```bash
npx prisma migrate deploy
```

### 5. Custom Domain

Add your domain in Vercel Dashboard → Project → Domains.

## Stripe Webhook Configuration

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy the signing secret (`whsec_...`) to `STRIPE_WEBHOOK_SECRET`
5. Verify webhook endpoint is healthy on first test event

## Resend Domain Verification

1. Go to Resend Dashboard → Domains
2. Add your sending domain
3. Add the three DNS TXT records to your domain provider
4. Wait for DNS propagation (up to 48 hours)
5. Verify the domain in Resend
6. Update `FROM_EMAIL` in `src/lib/resend.ts` to use your verified domain

## Cloudflare R2 Bucket Setup

1. Create an R2 bucket in Cloudflare Dashboard
2. Generate an API token with read/write permissions
3. Set public access (or use signed URLs for private assets)
4. Configure CORS policy for your domain
5. Add the bucket URL to `next.config.ts` `images.remotePatterns` if needed

## Security Headers

The application includes CSP, HSTS, and other security headers via middleware (`src/middleware.ts`). No additional web server configuration is needed on Vercel.

## Post-Deployment Checklist

- [ ] Homepage loads without errors
- [ ] Product listing page renders correctly
- [ ] Product detail page loads with images
- [ ] Add to cart works end-to-end
- [ ] Stripe checkout completes successfully
- [ ] Webhook handles payment events
- [ ] Order confirmation email arrives
- [ ] Admin dashboard loads
- [ ] Login/register flow works
- [ ] Search returns results
- [ ] Mobile navigation works
- [ ] Lighthouse score > 90
