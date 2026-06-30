# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

**Cevi Uster** — official mobile app for a Swiss youth organization (Cevi = Scouts equivalent). Published on App Store and Google Play. App content is in Swiss German. All development happens in the `CeviUster/` subdirectory.

## Commands

All commands run from `CeviUster/`:

```bash
yarn start            # Start Metro bundler (Expo Go / dev client)
yarn ios              # Run on iOS simulator
yarn android          # Run on Android emulator/device
yarn lint             # ESLint via expo lint
```

No test suite is configured.

**iOS builds** are done manually via Xcode (`CeviUster/ios/CeviUster.xcworkspace`). After native dependency changes, run `pod install` in `CeviUster/ios/`.

**Android builds** are done manually via Android Studio or Gradle. The release keystore path is machine-specific (hardcoded in `android/app/build.gradle`) — needs to point to a local keystore file.

## Architecture

### Routing
File-based routing via **expo-router**. All screens live in `CeviUster/app/`:

- `(tabs)/` — bottom tab bar with 5 tabs
  - `index.tsx` — Welcome (WebView → cevi-uster.ch)
  - `contact.tsx` — Contact (WebView)
  - `dataprotectionpolicy.tsx` — Privacy (WebView)
  - `agenda/` — event listing + detail, fetches from WordPress Events Calendar REST API
  - `box/` — "Chäschtli" section: Stufen list → Info detail + dropout/unsubscribe form

### Data fetching
**TanStack Query v5** (`@tanstack/react-query`). A `QueryClient` is set up in `app/_layout.tsx`. All API calls go through `useQuery` hooks, with the actual fetch logic in `CeviUster/services/`.

All backend URLs are WordPress REST API endpoints on `cevi-uster.ch`, defined in `CeviUster/constants/URLs.ts`.

### Styling
No CSS-in-JS library. Uses `StyleSheet.create` with explicit `lightStyles`/`darkStyles` variants, switched via `useColorScheme()`. Shared styles are in `CeviUster/constants/sharedStyles.ts`. Brand colors and `BORDER_RADIUS` are in `CeviUster/constants/Colors.ts`.

### Key libraries
- `react-native-webview` — three of the five tabs are WebViews
- `react-native-calendar-events` — calendar integration for agenda events (requires permission)
- `react-native-elements` — ListItem, Button, Icon, Avatar, CheckBox
- `moment` — date formatting
- `validator` — email validation in dropout form

### New Architecture
Both iOS and Android run React Native's New Architecture (Fabric/JSI) with Hermes. `reactCompiler: true` and `typedRoutes: true` are enabled in `app.json`.

## Notable issues
- `react-query` v3 is listed in `package.json` alongside `@tanstack/react-query` v5 — only the v5 package is actually used in code.
- `components/providers.tsx` is dead code (duplicate `QueryClientProvider` not wired up).
