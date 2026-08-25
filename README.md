# PomoCode

A dynamic, friendly Pomodoro timer for VS Code with live stats, streaks, and session history.

## Features

- **Minimal status bar timer** — always visible; click it to open a quick-actions menu (start, pause, resume, skip, reset, or open the panel).
- **Activity Bar panel** — a dedicated PomoCode icon opens a full panel with the timer, round progress, session controls, goals, history, streaks, and stats.
- **Full Pomodoro cycle** — follows the standard technique: 4 completed focus sessions (with short breaks in between) make up a round, then a long break, then the round starts over. A round dot indicator shows where you are in the current round. Skipping a session moves the timer forward without falsely counting toward the round — only a focus session that runs to completion counts.
- **Goals** — jot down what you're working towards and check them off, independent of your Pomodoro sessions.
- **Streak calendar & badges** — click the streak badge for a Duolingo-style monthly calendar of your active days, plus unlockable milestone badges to keep you motivated.
- **Notifications** — VS Code notifications announce when a session starts and ends, with an optional native macOS notification so you still see it when VS Code is in the background.
- **Fully customizable** — durations, auto-start, notifications, and sound are all configurable from VS Code Settings or directly from the panel, kept in sync both ways.
- **Per-profile isolation** — settings, history, and goals are scoped to your active VS Code Profile, so switching profiles gives you a clean, independent PomoCode state.
- **Session history & stats** — every completed session is recorded; the panel shows today/week/all-time counts and focused minutes, plus your current daily streak.
- **Themed to match VS Code** — the panel follows your active color theme automatically (light, dark, or high contrast), using the self-hosted Inter font.

## Getting started

1. Click the PomoCode icon in the Activity Bar (left sidebar).
2. Press **Start** to begin a focus session.
3. When a session ends, PomoCode shows a notification and automatically moves to the next session (break or focus), unless you've disabled auto-start.

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
| `pomocode.autoStartNextSession` | `false` | Automatically start the next session when the current one ends. |
| `pomocode.enableNotifications` | `true` | Show a VS Code notification on session start/end. |
| `pomocode.enableNativeNotifications` | `true` | macOS only: also show a native system notification, so you see it even when VS Code is in the background. |
| `pomocode.nativeNotificationSound` | `Glass` | macOS only: which system sound plays with the native notification (`None` disables it). |
| `pomocode.enableSound` | `true` | Play a sound in the panel when a session ends. |
| `pomocode.completionSound` | `chime` | Tone style played in the panel: Chime, Bell, Digital, or Soft. |

Settings, session history, and goals respect VS Code's **Profiles** feature: each profile keeps its own independent PomoCode state.

## A note on the native notification icon

The native macOS notification (`pomocode.enableNativeNotifications`) is triggered via AppleScript's `display notification`. macOS always attributes these to a fixed system identity regardless of which process ran the script, so there's no way to make it show PomoCode's icon without bundling a separate signed helper binary — which we intentionally avoid, to keep the extension dependency-free and Gatekeeper-friendly. The title, message, and sound are still fully PomoCode's; only the icon is generic.

## A note on sound

PomoCode doesn't ship an audio file. Instead, it synthesizes a short beep in the panel using the Web Audio API when a session ends. This keeps the extension lightweight and avoids any font/audio licensing concerns. Browsers only allow audio to start after a user gesture, so PomoCode "unlocks" its audio context the first time you click anything in the panel (e.g. pressing Start) — as long as you've clicked once, the beep will play on every future session completion. The sound only plays while the PomoCode panel has been opened at least once in the current window; the visual/native notification always works regardless of panel state.

## Development

This extension is built with TypeScript, bundled with [esbuild](https://esbuild.github.io/), and uses [Bun](https://bun.sh) as the package manager and script runner. The panel UI is a React app; there is no separate server or framework running inside the webview.

```bash
bun install       # install dependencies
bun run dev       # esbuild watch mode for both the extension host and the panel
bun run build     # production build
bun run check     # lint (oxlint) + typecheck
bun run package   # build and produce a .vsix package
```

To try the extension locally, open this folder in VS Code and press `F5` to launch an Extension Development Host window.

## License

MIT — see [LICENSE](./LICENSE).
