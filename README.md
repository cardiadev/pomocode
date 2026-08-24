# PomoCode

A dynamic, friendly Pomodoro timer for VS Code with live stats, streaks, and session history.

## Features

- **Minimal status bar timer** — always visible, click it to open the panel.
- **Activity Bar panel** — a dedicated PomoCode icon opens a full panel with the timer, session controls, history, streaks, and stats.
- **Native notifications** — VS Code notifications announce when a session starts and ends.
- **Fully customizable** — durations, auto-start, notifications, and sound are all configurable from VS Code Settings or directly from the panel, kept in sync both ways.
- **Per-profile isolation** — settings and history are scoped to your active VS Code Profile, so switching profiles gives you a clean, independent PomoCode state.
- **Session history & stats** — every completed session is recorded; the panel shows today/week/all-time counts and focused minutes, plus your current daily streak.
- **Themed to match VS Code** — the panel follows your active color theme automatically (light, dark, or high contrast), using the self-hosted Inter font.

## Getting started

1. Click the PomoCode icon in the Activity Bar (left sidebar).
2. Press **Start** to begin a focus session.
3. When a session ends, PomoCode shows a notification and automatically moves to the next session (break or focus), unless you've disabled auto-start.

You can also control PomoCode from the Command Palette:

- `PomoCode: Start Focus Session`
- `PomoCode: Pause Timer`
- `PomoCode: Resume Timer`
- `PomoCode: Reset Timer`
- `PomoCode: Skip to Next Session`
- `PomoCode: Open Panel`

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
| `pomocode.enableSound` | `true` | Play a sound in the panel when a session ends. |

Settings and session history respect VS Code's **Profiles** feature: each profile keeps its own independent PomoCode configuration and history.

## A note on sound

PomoCode doesn't ship an audio file. Instead, it synthesizes a short beep in the panel using the Web Audio API when a session ends. This keeps the extension lightweight and avoids any font/audio licensing concerns, but it means **the sound only plays while the PomoCode panel has been opened at least once in the current window** — the visual notification always works regardless of panel state.

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
