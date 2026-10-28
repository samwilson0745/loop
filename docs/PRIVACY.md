# Privacy

- Usage records stay in the app's local SQLite database. Loop has no network client or usage-data upload path.
- Loop reads package names, app labels, aggregated foreground durations, and available foreground/background event timestamps only after the user enables Android Usage Access.
- Daily summaries and the event detail needed for the approximate timeline remain on device until the user deletes them or removes app data. The app does not continuously collect in the background; it refreshes on open, return to foreground, or manual refresh.
- Pause stops Loop's own refresh. It does not revoke Android's Usage Access grant.
- Delete all Loop data removes saved daily summaries and events from Loop's SQLite database. Android retains and manages its own system usage history.
- Usage duration is not a measure of attention, intent, productivity, or wellbeing.
