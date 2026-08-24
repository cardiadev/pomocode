import * as esbuild from 'esbuild';

const watchLogPlugin: esbuild.Plugin = {
  name: 'watch-log',
  setup(build) {
    build.onStart(() => {
      console.log('[watch] build started');
    });
    build.onEnd((result) => {
      for (const error of result.errors) {
        console.error(`> ${error.text}`);
      }
      console.log('[watch] build finished');
    });
  },
};

const extensionConfig: esbuild.BuildOptions = {
  entryPoints: ['src/extension.ts'],
  outfile: 'dist/extension.js',
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node20',
  external: ['vscode'],
  minify: false,
  sourcemap: true,
  plugins: [watchLogPlugin],
};

const webviewConfig: esbuild.BuildOptions = {
  entryPoints: ['webview-ui/src/main.tsx'],
  outfile: 'dist/webview/main.js',
  bundle: true,
  platform: 'browser',
  format: 'iife',
  target: 'es2020',
  minify: false,
  sourcemap: true,
  plugins: [watchLogPlugin],
};

async function watch(): Promise<void> {
  const extensionCtx = await esbuild.context(extensionConfig);
  const webviewCtx = await esbuild.context(webviewConfig);
  await Promise.all([extensionCtx.watch(), webviewCtx.watch()]);
}

watch().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
