# Loop

Loop is an Android-first screen-usage tracker built with React Native, Expo SDK 58, TypeScript, Kotlin, and local SQLite. It reads usage only after the user enables Android Usage Access. It has no backend, account, sync, ML, or usage-data uploads.

## Requirements

- Android Studio with Android SDK Platform 35+, Build Tools, and an Android emulator or physical device.
- JDK 17 or newer. Android Studio's bundled JBR is configured in the commands below.
- Node.js 22.13+ (Expo SDK 58 requires a newer Node 22 than 22.12) and npm.
- Android SDK Platform 37, NDK 27.1.12297006, and CMake 3.22.1 (Gradle may download missing Android components).

## Run on Android

```powershell
$env:JAVA_HOME = 'C:\Program Files\Android\Android Studio\jbr'
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
npm install
npx expo run:android
```

The Android build is a development build; Expo Go cannot load the native `AndroidUsage` module. On launch, open Usage Access from the onboarding/settings card, enable Loop, then return. The dashboard refreshes when the app resumes. For live JavaScript changes after the native build, start Metro with `npx expo start --dev-client`.

On Windows, `plugins/withWindowsNinjaPaths.js` keeps generated CMake object paths under the Windows path limit. The Android project is generated from Expo config and is ignored by Git; `npx expo prebuild --platform android` regenerates it.

## Unit checks

```powershell
npm run typecheck
npm test
```

## Screens

- **Today:** measured total, app ranking and share, an event-based hourly view, personal baseline insights, refresh and permission states.
- **Timeline:** paired OS foreground/background events, with approximate timing and gaps disclosed.
- **History:** saved days and a seven-day trend. Days without saved data are shown as missing.
- **Settings:** Usage Access status, pause/resume refresh, local deletion, and data-use explanation.

See [architecture](docs/ARCHITECTURE.md) and [privacy](docs/PRIVACY.md) for data-flow and retention details. Android limits access to recent, potentially incomplete usage events; session timing is approximate and does not represent confirmed human attention. A physical device is needed to validate that its OS exposes useful event detail.
