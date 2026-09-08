# Oniromancy AI iOS V1 Changes

## Delivered

- Added Capacitor 8 core, iOS platform, App, Browser, Haptics, Share, Status Bar, and Keyboard packages.
- Added the native iOS project and an `App.xcworkspace` entry point.
- Configured the production server URL, HTTPS-only policy, allowed navigation hosts, iOS 15 target, portrait iPhone orientation, branded icon/splash, and custom URL scheme.
- Added a bundled offline fallback and native network recovery controller.
- Added capability-based Capacitor/iOS detection and `data-capacitor` / `data-platform` DOM state.
- Added a five-item iOS-only bottom navigation: Dreams, Tarot, Horoscope, Journal, Profile.
- Added Safe Area, dynamic viewport, keyboard, 16px form input, horizontal overflow, touch target, and reduced-motion styling.
- Hid the Web Navbar, Footer, marketing sections, and non-core landing content only in the native iOS environment.
- Added centralized native bridge modules for platform checks, haptics, and sharing.
- Added haptics to tabs, Dream submission, Tarot draw/reveal, and Horoscope draw/reveal.
- Added native sharing for non-sensitive public Oniromancy links. Private dream text, questions, and generated results are not automatically passed to the native share sheet.
- Added Status Bar styling, keyboard visibility behavior, app resume events, and Supabase session refresh.
- Added system-browser routing for third-party and non-core content.
- Added Google OAuth custom-scheme handling and hardened the web callback against arbitrary `next` redirects.
- Disabled Stripe digital purchases in the Capacitor iOS environment while retaining Web Stripe and existing/free credits.
- Normalized the Partners referral URL to `https://www.oniromancy.com`.
- Added an app privacy manifest and review/setup/StoreKit documentation.
- Fixed the pre-existing invalid root-layout script placement that caused a Next.js client error.

## Validation performed

- `npm install`: passed using a project-local npm cache; npm reported existing dependency audit findings.
- Baseline lint: passed with 32 warnings and zero errors.
- Baseline TypeScript: passed.
- Baseline build: failed because the supplied archive did not contain required Supabase/Stripe environment variables.
- Final lint: passed with 31 warnings and zero errors.
- Final TypeScript: passed.
- Final production build: passed using ignored, non-secret local placeholder environment values.
- Production server smoke test: `/`, `/tarot`, `/horoscope`, `/history`, `/profile`, `/pricing`, and `/auth` all returned HTTP 200.
- `npm run cap:sync`: passed; six Capacitor plugins detected.
- `Info.plist` and `PrivacyInfo.xcprivacy`: passed `plutil -lint`.
- App icon: rendered and visually inspected.
- `xcodebuild`: not run successfully because full Xcode is not installed/selected on this machine. A standalone Swift package check was also blocked by the host's mismatched Command Line Tools compiler/SDK.
- Simulator, physical device, OAuth provider, persistent real session, and TestFlight: not verified.
- Browser device-size inspection was attempted; the initial development render was blocked by missing environment configuration, and the browser test surface later refused the local URL. These size checks remain unverified rather than inferred.

## Existing warnings and dependency findings

- ESLint still reports 31 pre-existing warnings, primarily unused imports, explicit `any`, one `img` optimization warning, and hook dependency warnings.
- `npm audit` reports 19 dependency findings after adding Capacitor. No forced upgrade was applied because it could introduce unrelated breaking changes.
- A local npm cache permission problem exists under the user account. Installation succeeded with a project-local cache without changing user-level permissions.

## Remaining release risks

- App-aware Web changes must be deployed to `www.oniromancy.com` before the native binary will display the new App layout.
- Full Xcode compilation and simulator/device validation remain mandatory.
- Supabase dashboard redirect allowlisting is required for OAuth.
- Sign in with Apple may be required if Google login remains.
- StoreKit is intentionally not implemented; iOS purchases remain unavailable.
- The app needs a self-service account deletion flow before App Review.
- Guideline 4.2 minimum-functionality risk remains for a remote WebView product.
- Final privacy answers, signing, screenshots, metadata, and App Store Connect configuration require owner credentials and decisions.
