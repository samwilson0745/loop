# Loop architecture

Loop is an Android-first Expo and React Native app. It has no account, backend, cloud sync, or machine learning.

## Data path

1. `modules/android-usage` reads Android `UsageStatsManager` after Usage Access has been granted and can open the Android permission settings page.
2. `src/features/usage/native.ts` is the TypeScript boundary. `service.ts` handles permission checks, cache freshness, refresh and errors.
3. `aggregation.ts` merges package statistics, calculates shares, and pairs sorted foreground/background events into approximate sessions.
4. `database.ts` persists daily summaries, app rows, and the event detail used for the timeline in a local SQLite database.
5. `insights.ts` is a pure deterministic rules module. It describes app share, compares completed days only after four available baseline days, and derives session observations from paired native events.
6. Expo Router screens display the data and its limitations. UI components do not call Android APIs or calculate analytics.

## Known Android limitations

Usage Access is a special OS setting rather than a runtime dialog. Android's usage records and events can be delayed, incomplete, or unavailable on locked/restricted profiles. `queryEvents` retains only a limited recent window. The app therefore labels readings as partial and never fills missing dates or timeline events with fabricated values. Session duration is an interval inferred from paired events, not proof of uninterrupted attention.

## Development

The native bridge requires a development build; Expo Go cannot load it. Run `npm run android` after creating the development build, then enable Usage Access from Loop's onboarding/settings screen. A physical Android device is needed to validate real usage data. The Android emulator is useful for building, navigation, and permission-state checks but its usage history is not representative of a personal phone.
