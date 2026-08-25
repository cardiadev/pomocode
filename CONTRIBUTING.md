# Contributing to PomoCode

This extension is built with TypeScript, bundled with [esbuild](https://esbuild.github.io/), and uses [Bun](https://bun.sh) as the package manager and script runner. The panel UI is a React app; there is no separate server or framework running inside the webview.

```bash
bun install       # install dependencies
bun run dev       # esbuild watch mode for both the extension host and the panel
bun run build     # production build
bun run check     # lint (oxlint) + typecheck
bun run package   # build and produce a .vsix package
```

To try the extension locally, open this folder in VS Code and press `F5` to launch an Extension Development Host window.
