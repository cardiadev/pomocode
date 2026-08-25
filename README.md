# PomoCode

A dynamic, aesthetic Pomodoro timer for VS Code with custom themes, Google Sans typography, live streaks, and session history.

## Features

- **Minimal status bar timer** — always visible; click it to open a quick-actions menu (start, pause, resume, skip, reset, or open the panel).
- **Activity Bar panel** — a dedicated PomoCode icon opens a full panel with 4 organized tabs: **Timer**, **Calendar**, **History**, and **Settings**.
- **Interactive Cycle Tracker** — step-by-step badges track your entire cycle progression (`Focus 1` → `Break 1` → ... → `Long Break`) without getting stuck in loops.
- **Customizable Color Themes & Fonts** — choose your primary accent, focus, short break, and long break colors with native color pickers, and select from modern fonts like Google Sans, Inter, Roboto, Outfit, and Fira Code.
- **Daily Targets & Goals** — configure your daily pomodoro target, link active goals to focus sessions, and celebrate daily progress.
- **Streak calendar & milestone badges** — inspect your monthly activity heat map with corner day badges and unlock achievements with Material Symbols iconography.
- **Notifications & Sound Engine** — macOS native notifications with instant sound previewing (`afplay`) and in-panel audio cues.
- **Backup & Data Management** — export your full data to JSON, copy to clipboard, or restore anytime.
- **Per-profile isolation** — settings, history, and goals are scoped to your active VS Code Profile.

## Getting started

1. Click the PomoCode icon in the Activity Bar (left sidebar).
2. Press **Start** to begin a focus session.
3. When a session ends, PomoCode notifies you and automatically advances the cycle.

Click the status bar timer any time for a quick menu of actions, or use the Command Palette:

- `PomoCode: Start Focus Session`
- `PomoCode: Pause Timer`
- `PomoCode: Resume Timer`
- `PomoCode: Reset Timer`
- `PomoCode: Skip to Next Session`
- `PomoCode: Open Panel`
- `PomoCode: Show Quick Menu`

## Settings

All settings are available under **Settings → Extensions → PomoCode**, or directly from the panel:

| Setting | Default | Description |
| --- | --- | --- |
| `pomocode.focusDuration` | `25` | Length of a focus session, in minutes. |
| `pomocode.shortBreakDuration` | `5` | Length of a short break, in minutes. |
| `pomocode.longBreakDuration` | `15` | Length of a long break, in minutes. |
| `pomocode.sessionsBeforeLongBreak` | `4` | Number of focus sessions before a long break is triggered. |
| `pomocode.dailyTargetPomodoros` | `8` | Daily target number of completed pomodoro focus sessions. |
| `pomocode.accentColor` | `#f97316` | Primary accent color for buttons and active states. |
| `pomocode.focusColor` | `#f97316` | Color used for focus sessions and indicators. |
| `pomocode.shortBreakColor` | `#22c55e` | Color used for short break sessions. |
| `pomocode.longBreakColor` | `#38bdf8` | Color used for long break sessions. |
| `pomocode.fontFamily` | `Google Sans` | Font family used across the PomoCode panel interface. |
| `pomocode.autoStartNextSession` | `false` | Automatically start the next session when the current one ends. |
| `pomocode.enableNotifications` | `true` | Show a VS Code notification on session start/end. |
| `pomocode.enableNativeNotifications` | `true` | macOS only: show a native system notification. |
| `pomocode.nativeNotificationSound` | `Glass` | macOS only: which system sound plays with the native notification. |
| `pomocode.enableSound` | `true` | Play an audio cue in the panel when a session ends. |
| `pomocode.completionSound` | `chime` | Tone style played in the panel: Chime, Bell, Digital, or Soft. |

Settings, session history, and goals respect VS Code's **Profiles** feature: each profile keeps its own independent PomoCode state.

## Troubleshooting native notifications

If you don't see or hear the native macOS notification even with `pomocode.enableNativeNotifications` on, it's almost always a macOS-level setting, not the extension:

- Check **System Settings → Focus**: an active Focus/Do Not Disturb mode silences all notifications and sounds, including PomoCode's.
- Check **System Settings → Notifications**: find the app that's running the AppleScript (usually "Script Editor", or your terminal app if you triggered a test manually) and make sure notifications and sounds are allowed for it.
- You can test this independently of PomoCode from a terminal: `osascript -e 'display notification "test" with title "test" sound name "Glass"'`. If that produces nothing, it's a system setting, not PomoCode.

## A note on the native notification icon

The native macOS notification (`pomocode.enableNativeNotifications`) is triggered via AppleScript's `display notification`. macOS always attributes these to a fixed system identity regardless of which process ran the script, so there's no way to make it show PomoCode's icon without bundling a separate signed helper binary — which we intentionally avoid, to keep the extension dependency-free and Gatekeeper-friendly. The title, message, and sound are still fully PomoCode's; only the icon is generic.

## A note on sound

PomoCode doesn't ship an audio file. Instead, it synthesizes a short beep in the panel using the Web Audio API when a session ends. This keeps the extension lightweight and avoids any font/audio licensing concerns. Browsers only allow audio to start after a user gesture, so PomoCode "unlocks" its audio context the first time you click anything in the panel (e.g. pressing Start) — as long as you've clicked once, the beep will play on every future session completion. The sound only plays while the PomoCode panel has been opened at least once in the current window; the visual/native notification always works regardless of panel state.

## License

MIT — see [LICENSE](./LICENSE).
