# Changelog

All notable changes to PomoCode are documented in this file.

## [0.5.3] - 2026-08-25

### Added

- **ReUI NumberField Inputs**: Replaced all raw numeric inputs in Settings with modern stepper components featuring increment/decrement buttons and direct keyboard input.

### Changed

- **Distributed Control Buttons**: Start, Skip, and Reset buttons now span the full container width equally in a single clean row.
- **Clean Text UI**: Removed emojis from the Tab bar, Sound Test buttons, Data Management actions, Clear History actions, and Daily Target headers.
- **Streamlined Confirmation Modals**: Simplified modal action buttons to concise `Cancel` and `Delete` / `Reset` labels, ensuring consistent confirmation protection for timer resets.

## [0.5.2] - 2026-08-25

### Added

- **Reset Confirmation Prompt**: Clicking Reset now displays a confirmation dialog to prevent accidental restarts of active pomodoro sessions.
- **Native Notification Sound Previews**: Added instant sound previewing (`afplay`) directly from the Settings dropdown and dedicated test buttons so users can hear and choose their preferred macOS system alert sound.
- **Granular History Clearing & Reset**: Added options in Settings to clear today's history, this week's history, or perform a full history wipe, protected by confirmation prompts to prevent accidental data loss.

## [0.5.1] - 2026-08-25

### Changed

- **Larger Timer Display**: Expanded circular timer diameter to 220px with 36px font-size and glowing accents for enhanced readability and visual impact.
- **Instant Settings & Daily Target Reactivity**: Changes to settings (such as daily target pomodoros) now immediately reflect in the dashboard and statistics in real-time.
- **Daily Target & Pomodoro Progression**: Every processed focus session (whether naturally completed or stepped through via skip) increments the daily pomodoro count toward your daily target.
- **Uncapped Daily Goals**: Reaching and exceeding 100% of your daily goal displays celebration states and actual percentages without restricting doing more pomodoros.

## [0.5.0] - 2026-08-25

### Added

- **Modern Tabbed Navigation**: Seamless switching between **Timer (Dashboard)**, **Calendar & Badges**, **Day-by-day History**, and **Settings & Data**.
- **Cycle & Event Step Tracker**: Full visual breakdown of each element in a Pomodoro round (`Focus 1 → Break 1 → ... → Focus N → Long Break`) with live progress and daily target tracking.
- **Daily Pomodoro Target**: Configure daily pomodoro target in settings with live progress bar in the dashboard.
- **Global Goals Management & Session Linking**:
  - Mark goals completed (`✓`) to archive them to a collapsible completed list with reopening (`↺`) and deletion.
  - Link active goals to current focus sessions directly from the timer dashboard.
  - Track pomodoros dedicated per goal.
- **Day-by-Day Grouped History**: Chronological daily cards with daily focus minutes, session counts, round totals, search, filters, and goal tags.
- **Interactive Calendar Tab**: Full-view monthly calendar with daily focus heatmap, day details inspector, and achievement badges.
- **JSON Data Management & Backup**:
  - Export complete data backup to a standalone `.json` file (`pomocode.exportData`).
  - Copy JSON backup to clipboard.
  - Import and restore data from JSON backup (`pomocode.importData`).

### Fixed

- **Skip Flow Progression**: Skipping a focus session now properly advances the round state machine through short breaks and long breaks to complete the cycle without getting stuck in an endless focus/shortBreak loop.

## [0.4.0] - 2026-08-25

### Added

- Full-round tracking: `roundsCompletedToday` and `roundsCompletedAllTime` stats, derived from completed long-break entries (a round only counts once its long break has actually run, matching the standard Pomodoro Technique definition of "1 ciclo completo"). Shown in the Stats section, the round-progress area, and the status bar quick menu.
- The extension version now shows below the "Developed by Cardiadev" footer link in the panel.
- Status bar text and the quick menu now show the current round position (e.g. "(2/4)"), not just inside the panel.

### Changed

- Moved developer/build setup instructions out of README.md (which VS Code renders as the extension's "Details" page) into a separate `CONTRIBUTING.md`, so the Details page only shows end-user-relevant content.

### Investigated

- Confirmed (with the user) that native macOS notifications not appearing, and the native sound not playing, is not a PomoCode bug: even a bare `osascript -e 'display notification ...'` run directly from the terminal produced no banner or sound on the affected machine. This points to macOS Focus/Do Not Disturb or Notification permissions for the calling process, not the extension's AppleScript invocation.

## [0.3.0] - 2026-08-24

### Added

- Round progress indicator in the panel (dots + "Pomodoro X of N this round") so the full 4-pomodoro cycle structure is visible, not just the current session.
- `pomocode.nativeNotificationSound` setting: choose which macOS system sound plays with the native notification (or `None`).
- `pomocode.completionSound` setting: choose the panel's completion tone (Chime, Bell, Digital, or Soft), with instant preview when changing it.
- Quick-actions menu now shows today's pomodoro count and current streak as a header line.

### Fixed

- Skipping a focus session no longer counts toward the round of `sessionsBeforeLongBreak`. Only a focus session that runs to completion advances the round — matching the standard Pomodoro Technique rule that a pomodoro only "counts" if it wasn't interrupted. Skipping still moves the timer forward; it just doesn't corrupt the round count or trigger a premature long break.

### Note on native notification icon

macOS attributes any notification triggered via AppleScript's `display notification` to a fixed system identity, regardless of which process ran the script — there's no way to make it show PomoCode's (or VS Code's) icon without bundling a separate signed helper binary. We're intentionally not doing that, to keep the extension dependency-free, so the native notification's icon will remain generic; the notification's title/body/sound are still fully PomoCode's.

## [0.2.0] - 2026-08-24

### Added

- Goals section in the panel to track what you're working towards, independent of Pomodoro sessions.
- Duolingo-style streak calendar and badges: click the streak badge to see a monthly activity calendar and unlockable milestone badges.
- Status bar click now opens a quick-actions menu (start/pause/resume/skip/reset/open panel) instead of only opening the panel.
- Native macOS notifications (via `enableNativeNotifications`) so session alerts show up even when VS Code is in the background.
- Footer credit linking to the developer's GitHub profile.

### Changed

- Reordered the panel so History sits below Settings, since an unbounded history list would otherwise keep pushing Settings further down.

### Fixed

- The session-completion beep now reliably plays: the shared `AudioContext` is unlocked on the first click/tap in the panel, working around browsers' autoplay policy that silently suspends audio started without a user gesture.

## [0.1.0] - 2026-08-24

### Added

- Pomodoro timer with focus, short break, and long break sessions.
- Status bar item showing the live countdown and session type.
- Activity Bar panel with a circular timer display, session controls (start, pause, resume, reset, skip), session history, streaks, and stats (today/week/all-time).
- Native VS Code notifications on session start and completion.
- Fully customizable durations and behavior via VS Code settings, with two-way sync between the Settings UI and the panel.
- Session history and stats stored per VS Code Profile.
- Synthesized completion sound using the Web Audio API (no bundled audio assets).
- Self-hosted Inter font for a consistent, offline-friendly UI across light, dark, and high-contrast themes.
