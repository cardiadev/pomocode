import * as vscode from 'vscode';

function getNonce(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

const FONT_FILES = [
  ['Inter-Regular', 'Inter-Regular.woff2', 400],
  ['Inter-Medium', 'Inter-Medium.woff2', 500],
  ['Inter-SemiBold', 'Inter-SemiBold.woff2', 600],
  ['Inter-Bold', 'Inter-Bold.woff2', 700],
] as const;

export function buildPanelHtml(webview: vscode.Webview, extensionUri: vscode.Uri): string {
  const nonce = getNonce();
  const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'dist', 'webview', 'main.js'));
  const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'dist', 'webview', 'main.css'));

  const fontFaces = FONT_FILES.map(([, fileName, weight]) => {
    const fontUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'assets', 'fonts', fileName));
    return `@font-face { font-family: 'Inter'; src: url('${fontUri.toString()}') format('woff2'); font-weight: ${weight}; font-style: normal; font-display: swap; }`;
  }).join('\n');

  const csp = [
    "default-src 'none'",
    `img-src ${webview.cspSource} https:`,
    `style-src ${webview.cspSource} 'nonce-${nonce}'`,
    `font-src ${webview.cspSource}`,
    `script-src 'nonce-${nonce}'`,
  ].join('; ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="${csp}" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="${styleUri.toString()}" />
  <style nonce="${nonce}">
    ${fontFaces}
  </style>
  <title>PomoCode</title>
</head>
<body>
  <div id="root"></div>
  <script nonce="${nonce}" src="${scriptUri.toString()}"></script>
</body>
</html>`;
}
