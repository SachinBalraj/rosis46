# Security Report — Rossis Biker Spot (bike-accessories-shop)

Production deployment target: **Vercel** (project `bike-accessories-shop-prod`).
Audit performed: September 2026. No real secret values are listed in this document.

## 1. What was reviewed

- Next.js 16.3.4 (App Router) + Tailwind v4 + MongoDB Atlas (native `mongodb` driver) + NextAuth v4 (JWT credentials)
- Razorpay payment flow: order creation, signature verification, webhooks
- All API routes, the admin console, account/order pages, cart store, and app config

## 2. Hardening applied in this pass

| Area | Change | Files |
|---|---|---|
| **Dependencies** | `next` 16.3.0 → 16.3.4 (fixes 2 critical CVEs), `eslint-config-next` matching | `package.json`, `package-lock.json` |
| **Security headers** | `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: DENY`, `Permissions-Policy`, removed `X-Powered-By` | `next.config.ts` |
| **CSP (production only)** | `default-src 'self'`; Razorpay + Google Maps + inline allowed where required; `frame-ancestors 'none'` | `next.config.ts` |
| **Rate limiting** | In-memory limiter on register (10/15min), create-order (20/10min), verify (30/10min), webhook (120/min) | `src/lib/rate-limit.ts` (new), the four routes |
| **Duplicate orders** | `create-order` reuses a PENDING order with identical email + cart signature within 15 min instead of creating duplicates | `src/app/api/payments/create-order/route.ts` |
| **Webhook hardening** | Requires signature (validated over raw body with secret), rejects non-INR / amount-mismatched captures, idempotent per `paymentEvent.providerEventId` | `src/app/api/payments/webhook/route.ts` |
| **Image upload** | SVG upload removed (stored-XSS vector), 5 MB cap, magic-byte validation per PNG/JPEG/WebP/GIF | `src/app/api/admin/products/route.ts` |
| **Session cookies** | Explicit `httpOnly`, `sameSite=lax`, `secure` in production | `src/auth.ts` |
| **Enumeration** | Registration no longer reveals whether an email is taken | `src/app/api/auth/register/route.ts` |
| **IDOR** | `/order-success/[orderId]` viewable only by owner, admin, or within 30 min of creation | `src/app/order-success/[orderId]/page.tsx` |
| **Env template** | `.env.example` un-ignored so it is committed as a placeholder-only template (fresh clones can deploy) | `.gitignore` |

## 3. Re-verified and already strong

- Server-side pricing: browser sends only `{ id, quantity }`; price/shipping recomputed from the DB.
- `verify` uses constant-time HMAC signature check (`crypto.timingSafeEqual`).
- Payment webhook idempotent; repeat events return without side effects.
- Order ownership checks on `/account` and `/account/orders/[orderId]` (`notFound` for others).
- All `/api/admin/*` routes require an ADMIN session (`requireAdmin`), and /admin pages are protected by the edge `src/proxy.ts` role check.
- The `mongodb` driver client is a cached server-side singleton (`src/lib/mongodb.ts`) — `MONGODB_URI` is only read in server code, never in client bundles (verified by scanning built output).
- No `console.log` of secrets; no `dangerouslySetInnerHTML`; no raw SQL; no unvalidated redirects (codebase-wide scan).
- Input validation via Zod on every mutating API route.

## 4. `npm audit` status

- `next` critical CVEs: fixed by 16.3.4.
- `nanoid<3.3.18` (transitive): fixed.

## 5. Required environment variables (Vercel Project Settings → Environment Variables)

Production application secrets — set for the production environment:

| Variable | Purpose | Source |
|---|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string (native `mongodb` driver) | MongoDB Atlas |
| `MONGODB_DB_NAME` | MongoDB database name, e.g. `bike_shop` | MongoDB Atlas |
| `NEXT_PUBLIC_APP_URL` | Site URL, e.g. `https://your-dom.vercel.app` | — |
| `NEXTAUTH_URL` | Public URL of the deployment (NextAuth v4) | — |
| `AUTH_SECRET` | NextAuth session signing secret (`npx auth secret`) | — |
| `RAZORPAY_KEY_ID` | Razorpay key id | Razorpay Dashboard |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret | Razorpay Dashboard |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook signing secret | Razorpay Dashboard → Webhooks |
| `ADMIN_USERNAME` | Admin login username | yours |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of admin password (`node -e "console.log(require('bcryptjs').hashSync('your-password', 10))"`) | yours |

## 6. Razorpay webhook setup

- **URL:** `https://<your-domain>/api/payments/webhook`
- **Events to subscribe:** `payment.captured` (at minimum). Adding `payment.failed`/`order.paid` is optional.
- Webhook secret above must match `RAZORPAY_WEBHOOK_SECRET`.

## 7. Vercel deploy checklist

1. Import `https://github.com/SachinBalraj/rosis46` into project `bike-accessories-shop-prod` (root dir `bike-accessories-shop`).
2. Add the variables from section 5 (both the Preview and Production envs as desired).
3. Set database to the LIVE MongoDB Atlas cluster for production build; keep staging instance separate for previews if needed.
4. Schema/collection changes require no migrations (MongoDB). Unique constraints are declared as indexes — run `npm run db:indexes` (idempotent) against the target database after any index change.
5. After first deploy, open Razorpay Dashboard → Webhooks → configure the URL/secret (section 6). Test with Razorpay test key/transactions first.
6. Verify after deploy:
   - `curl -sI https://<domain>/` shows `Strict-Transport-Security` and `Content-Security-Policy`.
   - A test order goes `create-order → Razorpay modal → verify → order-success`, and the webhook marks it PAID/CONFIRMED.

## 8. Going live (change *test → live* keys)

1. Razorpay Dashboard → switch from Test to Live; copy the new `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` into Vercel prod env and redeploy.
2. Recreate the webhook secret in live mode; update `RAZORPAY_WEBHOOK_SECRET` and the webhook URL/secret in the Dashboard.
3. Confirm the receipt of a live `payment.captured` event marks the order PAID (order appears in Admin console).

## 9. Residual risks / notes

- **Rate limiter is in-memory** (per warm instance on Vercel). It contains abuse but is not a hard global limit; for stricter enforcement, add Upstash Redis (would require an Upstash account + env vars).
- **CSP uses `'unsafe-inline'` for scripts/styles** — required by Next.js 16 inline RSC/hydration scripts, `next/font`, and sonner. All other directives are strict (`object-src 'none'`, `frame-ancestors 'none'`, no `unsafe-eval`).
- Payments are captured immediately (auto-capture). No refund/credit flow and no order-expiry job yet; abandoned PENDING orders keep stock reserved until cleared.
- Admin login (`/admin/login`) has no rate limit beyond the edge proxy role checks; optional future: a limiter on sign-in.
- Contact messages from `/contact` persist to the `ContactMessage` collection (`POST /api/contact`, rate-limited) and are managed from the admin console; status changes are idempotent.