# RideReady — Bike Accessories Shop

A Next.js 16 (App Router) e-commerce storefront for cycling gear with a
PostgreSQL/Prisma backend and Razorpay Standard Checkout for payments.

## Stack

- **Next.js 16** (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4
- **Prisma 7** + PostgreSQL (via `@prisma/adapter-pg` driver adapter)
- **NextAuth.js (Auth.js) v4** credentials auth — email/password, bcrypt
- **Zustand** cart with `localStorage` persistence
- **React Hook Form + Zod** form validation
- **Razorpay Node SDK** for order creation and signature/webhook verification

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create the environment file and fill in real values:

   ```bash
   cp .env.example .env
   ```

3. Start PostgreSQL and set `DATABASE_URL` / `DIRECT_URL` in `.env` (a local
   Postgres, or a free Supabase/Neon instance). For local development you can
   use the bundled PGlite server — run it with `npm run db:server` (the
   `-m 10` flag is required; the default of 1 connection causes Prisma
   `P1017 ConnectionClosed` errors under concurrent requests).

4. Apply the schema and seed the catalogue:

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. Run the dev server:

   ```bash
   npm run dev
   ```

   Open http://localhost:3000.

## Accounts & authentication

Accounts use NextAuth.js credentials with email + password. Passwords are
hashed with **bcrypt** (12 rounds) and stored in the `User` table — they are
never returned by any API or written to the session.

### Environment

```bash
# Required for credentials auth to work locally
NEXTAUTH_URL="http://localhost:3000"

# Used by NextAuth to sign session JWTs (set a long random string in prod)
AUTH_SECRET="a_long_random_secret"
```

### Flows

- **Register / sign in** — `/account` renders the sign-in + register forms
  when signed out. `POST /api/auth/register` validates with Zod, hashes the
  password, creates the user and 409s on duplicate email.
- **Dashboard** — `/account` is session-aware. Signed in, it shows the order
  history with shipment/payment status badges; signed out, it shows the forms.
- **Order details** — `/account/orders/[orderId]` shows items, totals,
  shipping address and payment/shipment status. Only the owning user (or an
  ADMIN) can open it — anyone else gets a 404.
- **Guest checkout** — checkout works without an account. If you're signed in,
  the order is linked to your user (`Order.userId`) so it appears in your
  history; guest orders are only visible via their confirmation page.

### Promoting an admin

Orders can be viewed in the dashboard by any account, but the **admin console**
(`/admin`) is restricted to `ADMIN` users. Promote an existing user:

```bash
npm run db:admin you@example.com
```

### Security notes

- Credentials are verified server-side with `bcrypt.compare`; the session JWT
  carries only `id`, `name`, `email` and `role`.
- Role checks are enforced in server components (e.g. `/admin`) and each
  protected page re-checks the session — never trust client-side state.
- `NEXTAUTH_URL` must match the local origin for cookies to stick on
  `localhost` during development.

## Admin console

Every route under `/admin` is guarded server-side (via `getAdminSession` in
`src/app/admin/layout.tsx`) and every mutation API re-checks authorization
with `requireAdmin` in `src/lib/admin-auth.ts`. Only `ADMIN` users pass;
everyone else is redirected to `/account`.

| Page | Purpose |
| --- | --- |
| `/admin` | Add-product form: name, description, category, price + optional sale price, stock, image URL, featured and active toggles. |

API endpoints: `POST /api/admin/products` (create). The endpoint validates
with Zod, converts rupees to paise server-side and returns 400/401/403/409 as
appropriate.

## Razorpay integration

### Payment flow

1. Customer adds items to the cart and submits the checkout form.
2. `POST /api/payments/create-order` re-validates every cart line against the
   database — product existence, active status, **price** (from
   `salePriceInPaise ?? priceInPaise`) and **stock** are re-read server-side.
   Browser prices and totals are never trusted.
3. The order and its `OrderItem`s are created with `PENDING` payment status,
   and stock is reserved (decremented) in the same DB transaction.
4. A Razorpay order is created in **paise** (INR) using the SDK. The API
   returns only the Razorpay order ID, the public key ID, and safe checkout
   data — never the key secret.
5. `checkout.js` is loaded from Razorpay's official CDN
   (`https://checkout.razorpay.com/v1/checkout.js`) only after the customer
   clicks **Pay securely**, and the checkout is opened with the order ID,
   INR currency and customer prefill (name/email/phone).
6. On success, `POST /api/payments/verify` verifies the Razorpay signature
   with `crypto.timingSafeEqual` and marks the order `PAID` (only if it is
   still `PENDING`). The customer lands on `/order-success/[orderId]`.
7. `POST /api/payments/webhook` verifies `x-razorpay-signature` against the
   raw request body. Webhook handling is idempotent: every payment is recorded
   once in the `PaymentEvent` table (`providerEventId` is unique), so duplicate
   or replayed webhooks are no-ops.

If a payment is cancelled or fails, the customer is taken to
`/payment-failed` with a clear reason, and the Pay button is disabled while a
checkout attempt is in flight so the same order can't be paid twice.

### Testing locally

Razorpay offers a **test mode** with test keys and a test card/UPI set — no
real money is moved.

1. **Get test keys.** In the [Razorpay Dashboard](https://dashboard.razorpay.com)
   → Settings → API Keys, generate a test key pair. Fill `.env`:

   ```bash
   RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxxxxxx"
   RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
   RAZORPAY_WEBHOOK_SECRET="any_fixed_random_string_for_local_testing"
   ```

   The webhook secret can be any string locally; it just has to match the one
   you configure for webhooks.

2. **Seed the database** (checkout only accepts products that exist in the DB):

   ```bash
   npm run db:seed
   ```

3. **Start the app:**

   ```bash
   npm run dev
   ```

4. **Test the flow**:

   - Add a few products to the cart, go to `/checkout` and fill in the
     delivery details.
   - Click **Pay securely**. The Razorpay test checkout opens.
   - **Successful payment**: pay with the test card `4111 1111 1111 1111`
     (any future expiry, any CVV). After payment you're verified and taken to
     `/order-success/[orderId]`.
   - **Failed payment**: use the test card `4000 0000 0000 0002`.
   - **Cancelled**: close the payment modal — you're shown a cancel message.
   - **UPI**: `success@razorpay` (success) or `failure@razorpay` (failure).
   - **Netbanking**: select HDFC and authenticate with `1234`.

5. **Test webhooks locally** (optional but recommended). Expose the app with
   ngrok:

   ```bash
   ngrok http 3000
   ```

   In the Razorpay Dashboard → Settings → Webhooks, add a webhook pointing at
   `https://<your-ngrok-id>.ngrok-free.app/api/payments/webhook` and enable
   the **payment.captured** and **payment.failed** events. Set the webhook
   secret to the same value as `RAZORPAY_WEBHOOK_SECRET`. Payments now also
   update order state via webhook, independently of the browser redirect.

### API reference

| Endpoint | Purpose |
| --- | --- |
| `POST /api/payments/create-order` | Validates cart server-side, creates pending `Order`/`OrderItem`s, reserves stock, creates Razorpay order. Returns `orderId`, `razorpayOrderId`, `keyId`, `amount`, `currency`. |
| `POST /api/payments/verify` | Verifies the payment signature server-side (`timingSafeEqual`) and marks the order `PAID`. Idempotent. |
| `POST /api/payments/webhook` | Verifies `x-razorpay-signature` against the raw body and records idempotent `PaymentEvent`s. |

### Security notes

- `RAZORPAY_KEY_SECRET` and `RAZORPAY_WEBHOOK_SECRET` are read only in
  server-only modules (`src/lib/payments.ts`, which imports `server-only`) and
  never exposed to the client. Only the public key ID is sent to the browser.
- Prices, totals and stock are always recomputed from the database; the client
  only sends product IDs and quantities.
- Stock is reserved transactionally at order creation to prevent overselling.
  If order creation or the Razorpay call fails, the reservation is rolled back.
- Order state transitions to `PAID` are guarded with `WHERE paymentStatus =
  'PENDING'`, so a payment can only be recorded once.

### Production notes

- Set `RAZORPAY_WEBHOOK_SECRET` to the secret generated by the Razorpay
  Dashboard, and point the webhook URL at your deployed
  `/api/payments/webhook`.
- Configure auto-capture in the Razorpay dashboard or the order request.
- Consider restoring reserved stock for orders left unpaid for a long time
  (a scheduled job that reconciles `PENDING` orders with Razorpay's API).
