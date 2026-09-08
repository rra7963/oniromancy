# StoreKit 2 Integration Plan

## Current compliance boundary

The website keeps Stripe. The Capacitor iOS environment does not show or launch Stripe checkout for digital credits or subscriptions. Existing balances, earned/free credits, and previously acquired entitlements remain usable.

The iOS message is: `Purchases are temporarily unavailable in the iOS app.`

## Proposed products

Use final Bundle ID ownership before creating products in App Store Connect.

| Product ID | Type | App entitlement |
| --- | --- | --- |
| `com.oniromancy.credits.starter30` | Consumable | 30 credits; server enforces one starter grant per Apple account/application account |
| `com.oniromancy.credits.50` | Consumable | 50 credits |
| `com.oniromancy.credits.200` | Consumable | 200 credits |
| `com.oniromancy.credits.500` | Consumable | 500 credits |
| `com.oniromancy.mystic.monthly` | Auto-renewable subscription | Mystic monthly entitlement and monthly allowance |
| `com.oniromancy.mystic.yearly` | Auto-renewable subscription | Mystic yearly entitlement and allowance |

Keep the two subscription products in one subscription group. Prices are owned by App Store Connect rather than copied from Stripe at runtime.

## Native purchase flow

1. Fetch products with StoreKit 2 `Product.products(for:)`.
2. Show localized App Store price strings.
3. Call `purchase()` only after an explicit user action.
4. Require a verified StoreKit transaction.
5. Send the signed transaction/JWS to an authenticated server endpoint.
6. Verify transaction signature, Bundle ID, product ID, environment, ownership, revocation, and subscription status on the server.
7. Apply entitlement or credits in one database transaction.
8. Finish the StoreKit transaction only after the server confirms an idempotent grant.

Never award credits solely from client-provided product IDs or success booleans.

## Idempotency and duplicate prevention

Use Apple's transaction ID as a provider-scoped unique key. The server operation must atomically:

- insert the Apple ledger event if it does not already exist;
- update the user's balance or subscription entitlement;
- return the previously applied result for a duplicate request.

Add a unique database constraint on `(provider, external_transaction_id)`. Do not rely only on an in-memory check.

## Unified Supabase ledger

Extend `transactions` rather than creating separate balances:

```sql
alter table public.transactions
  add column if not exists provider text default 'internal',
  add column if not exists external_transaction_id text,
  add column if not exists original_transaction_id text,
  add column if not exists product_id text,
  add column if not exists environment text,
  add column if not exists status text default 'completed';

create unique index if not exists transactions_provider_external_unique
  on public.transactions(provider, external_transaction_id)
  where external_transaction_id is not null;
```

Recommended provider values: `stripe`, `apple`, `internal`, `referral`, and `daily_bonus`. Existing Stripe webhook rows should gradually receive provider and external IDs. Keep `credits_change` as the authoritative signed delta and never recompute historical deltas from current pricing.

Do not store a private App Store API key or unredacted credentials in Supabase rows. Retain only the fields needed for audit and a hash/reference to the verified payload if required.

## Restore behavior

- Consumable credits are not restored by StoreKit. The server ledger and authenticated Supabase balance provide cross-device continuity.
- Auto-renewable subscriptions must support Restore/Sync using `AppStore.sync()` and current entitlements.
- A reinstall should recover the server balance after login, not re-grant previously consumed StoreKit transactions.
- Define account-transfer behavior before launch; never silently attach one Apple transaction to two application accounts.

## App Store Server Notifications

Configure App Store Server Notifications V2 for subscription renewal, expiration, grace period, billing retry, refund, revocation, and offer events. The webhook must:

- verify the signed payload;
- deduplicate notification and transaction IDs;
- update subscription state using transaction dates, not arrival order;
- reverse unused entitlement or credits only under an explicit refund policy;
- retain an auditable ledger entry for reversals.

Use separate Sandbox and Production configuration and validate environment on every event.

## Stripe coexistence

- Web checkout continues through Stripe.
- iOS purchases use StoreKit 2.
- Both providers write into the same transaction ledger and update the same profile balance.
- Credits bought on either platform may be consumed cross-platform after authentication.
- iOS must also offer eligible digital products through IAP while those benefits are available in the app.
- Never add an in-app call-to-action that opens the website to bypass IAP.

## Required server work for the next phase

- Authenticated Apple transaction-verification endpoint
- App Store Server API credentials stored only in server secrets
- Notification V2 webhook
- Idempotent database function/RPC for grants and reversals
- StoreKit client module and purchase UI
- Sandbox, interrupted-purchase, Ask to Buy, pending, refund, upgrade/downgrade, expiration, and duplicate-delivery tests
