import * as esbuild from 'esbuild';

const isWatch = process.argv.includes('--watch');

const extensionConfig: esbuild.BuildOptions = {
  entryPoints: ['src/extension.ts'],
  outfile: 'dist/extension.js',
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node20',
  external: ['vscode'],
  minify: !isWatch,
  sourcemap: isWatch,
  logLevel: 'silent',
};

const webviewConfig: esbuild.BuildOptions = {
  entryPoints: ['webview-ui/src/main.tsx'],
  outfile: 'dist/webview/main.js',
  bundle: true,
  platform: 'browser',
  format: 'iife',
  target: 'es2020',
  minify: !isWatch,
  sourcemap: isWatch,
  logLevel: 'silent',
};

async function build(): Promise<void> {
  await Promise.all([esbuild.build(extensionConfig), esbuild.build(webviewConfig)]);
}

build().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
