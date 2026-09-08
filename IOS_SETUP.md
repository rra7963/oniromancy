# Oniromancy AI — iOS Setup

## What this project contains

The iOS target is a Capacitor 8 native shell that loads `https://www.oniromancy.com` over HTTPS. A bundled branded fallback page is used when the device has no network connection. The minimum deployment target is iOS 15.

The native project is available at:

```text
ios/App/App.xcworkspace
```

## Requirements

- macOS with full Xcode installed (Xcode 16 or newer recommended)
- Xcode command-line tools selected with `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`
- Node.js 18 or newer
- An Apple Developer team for device, Archive, and TestFlight signing
- The production website deployed with the App-aware changes in this repository

## Install and synchronize

```bash
npm install
npm run typecheck
npm run lint
npm run build
npm run cap:sync
npm run ios:open
```

`native-fallback/index.html` is copied into the native bundle during `cap:sync`. The product UI still comes from the deployed website because `server.url` points to production.

## Bundle identifier

The provisional identifier is `com.oniromancy.app`.

Before the first signed build, update both centralized configuration points to the same value:

1. `IOS_BUNDLE_ID` in `capacitor.config.ts`
2. `ONIROMANCY_BUNDLE_ID` in `ios/AppConfig.xcconfig`

Do not edit the identifier inside individual Xcode build configurations; they reference `$(ONIROMANCY_BUNDLE_ID)`.

## Xcode signing and device run

1. Open `ios/App/App.xcworkspace`.
2. Select the `App` target, then **Signing & Capabilities**.
3. Enable **Automatically manage signing**.
4. Select the correct Apple Developer Team.
5. Confirm the Bundle Identifier is registered and unique.
6. Choose a connected iPhone and press Run.
7. Test launch, login, app restart, all five tabs, keyboard, offline launch, sharing, and the purchase-unavailable screen.

No certificate, Team ID, provisioning profile, or signing identity is committed to this project.

## Archive and TestFlight

1. Increment `MARKETING_VERSION` and `CURRENT_PROJECT_VERSION` in the App target.
2. Select **Any iOS Device (arm64)**.
3. Use **Product → Archive**.
4. In Organizer choose **Distribute App → App Store Connect → Upload**.
5. In App Store Connect, finish export-compliance, privacy, age-rating, review-contact, support URL, and demo-account information.
6. Add the build to an internal TestFlight group before external testing.

This repository does not submit or upload the app automatically.

## Supabase OAuth and session configuration

Email/password authentication continues to run inside the WKWebView and uses Supabase cookie/local storage persistence.

For Google OAuth in the iOS shell:

1. In **Supabase Dashboard → Authentication → URL Configuration**, keep the production site URL as `https://www.oniromancy.com`.
2. Add `https://www.oniromancy.com/auth/callback` to Redirect URLs.
3. Add `oniromancy://auth/callback` to Redirect URLs.
4. Confirm the Google provider remains configured with Supabase's provider callback URL.
5. Test both a new account and an existing account after installing a signed build.

The custom scheme is declared in `Info.plist`. Incoming callbacks are accepted only for the `oniromancy:` scheme, and web callback `next` values are restricted to local paths to prevent open redirects.

Sign in with Apple is not implemented in this version. If Google remains a primary login option for App Store distribution, add Sign in with Apple before review unless an App Review guideline exception clearly applies.

## URL scheme and Associated Domains

- Current deep-link scheme: `oniromancy://`
- OAuth callback: `oniromancy://auth/callback`
- Associated Domains are not required for the current custom-scheme flow and have not been enabled.

For future Universal Links, add the `applinks:www.oniromancy.com` entitlement and host a valid `apple-app-site-association` file. Do not enable the capability until the website file and Apple Team/App identifiers are known.

## Navigation policy

- Core Oniromancy and required Supabase URLs can remain inside the app.
- Blog, FAQ, About, Partners, Contact, symbolism guides, tarot meanings, Privacy, and Terms open in the system browser from the App environment.
- Third-party HTTPS links open through the Capacitor Browser plugin.
- `mailto:` and `tel:` links are left to iOS.
- Stripe purchasing UI is not available inside the iOS environment.

## ATS and permissions

No arbitrary HTTP or ATS exception is configured. The production server and authentication endpoints must remain valid HTTPS endpoints.

The current features do not request camera, microphone, photo-library, contacts, location, or tracking permission, so no speculative usage descriptions were added. Add a purpose string only when a feature actually uses the corresponding protected API.

An app-level `PrivacyInfo.xcprivacy` is included. Re-check the final archive's generated privacy report whenever dependencies change.

## Production deployment order

Because the native shell loads the production website, deploy the web changes before distributing the iOS build. Verify `https://www.oniromancy.com` serves the App-aware bundle, then run `npm run cap:sync`, Archive, and upload the native binary.

## Known local verification limit

This environment only exposes Apple Command Line Tools, not the full Xcode application. `xcodebuild` therefore could not compile the target here. Complete the Xcode signing and simulator/device checks above on a Mac with full Xcode installed.
