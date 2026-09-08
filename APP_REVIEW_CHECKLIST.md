# App Review Checklist

## Functionality and guideline 4.2

- [ ] The app is more than a passive website: native haptics, native share, status-bar integration, keyboard handling, lifecycle handling, deep links, and offline recovery are present.
- [ ] Add at least one durable mobile-specific benefit before public review if feasible (for example local dream drafts, notifications, or a Today widget).
- [ ] Every advertised feature is operational on the review build.
- [ ] Provide an active demo account with credits and complete review notes.
- [ ] Remove placeholder or “coming soon” claims from App Store screenshots and metadata.
- [ ] Test launch when the production server is slow or temporarily offline.

The first release still has a meaningful guideline 4.2 risk because primary content is remotely rendered in WKWebView. Native integrations reduce but do not eliminate that risk.

## In-App Purchase

- [x] Website Stripe code remains intact.
- [x] iOS App environment does not expose Stripe checkout for digital credits/subscriptions.
- [x] iOS does not open Safari to bypass IAP.
- [x] Existing and free credits remain usable.
- [ ] Implement and review StoreKit 2 products before enabling iOS purchases.
- [ ] Submit first IAP products with the binary and include screenshots/review notes.
- [ ] Add subscription terms, localized price, duration, restore control, and manage-subscription link when subscriptions launch.

## Login and account lifecycle

- [x] Email/password login remains available.
- [x] Google OAuth has a custom-scheme callback boundary.
- [ ] Add `oniromancy://auth/callback` to the Supabase allowlist and test on a signed device.
- [ ] Determine whether Sign in with Apple is required. If Google is a primary third-party login, implement it unless a documented exception applies.
- [ ] Add in-app account deletion. The current project exposes profile editing but no verified self-service deletion flow.
- [ ] Ensure deletion explains what is removed, retained, or cancelled and handles active subscriptions.

## Privacy and safety

- [x] No real API keys, certificates, profiles, or service-role secrets are included.
- [x] No arbitrary ATS exception is enabled.
- [x] App privacy manifest file is included.
- [ ] Generate and inspect Xcode's final privacy report from the Archive.
- [ ] Complete App Privacy answers for identifiers, purchase history, user content/dream text, product interaction, diagnostics, and any analytics actually collected.
- [ ] Confirm the published Privacy Policy accurately describes AI processing, image generation, retention, account deletion, and third-party processors.
- [ ] Confirm dream/fortune content is described as entertainment or personal reflection, not medical or professional advice.
- [ ] Confirm age-rating answers and content controls are appropriate for generated content.

## Metadata and support

- [ ] Working Privacy Policy URL
- [ ] Working Support URL and monitored support email
- [ ] App description and screenshots that show the app in use
- [ ] Review contact details and demo credentials
- [ ] Export-compliance answers for standard HTTPS encryption
- [ ] Copyright and trademark ownership for tarot/persona assets
- [ ] Category, age rating, subtitle, keywords, and localizations

## Device and release validation

- [ ] Small iPhone simulator (for example iPhone SE)
- [ ] Current Dynamic Island iPhone simulator/device
- [ ] Large iPhone simulator/device
- [ ] Physical device login and OAuth callback
- [ ] Relaunch and session persistence
- [ ] Offline cold launch and recovery
- [ ] Keyboard on Dream and Profile forms
- [ ] Five tabs, active state, back navigation, and Safe Area
- [ ] Tarot animations and touch targets
- [ ] Native share and haptics
- [ ] iOS purchase-unavailable boundary
- [ ] Safari/mobile web and desktop site regression
- [ ] TestFlight internal testing completed before review
