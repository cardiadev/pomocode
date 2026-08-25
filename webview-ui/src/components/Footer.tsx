import type { ReactElement } from 'react';

const GITHUB_URL = 'https://github.com/cardiadev';

interface FooterProps {
  onOpenExternal: (url: string) => void;
  version: string | undefined;
}

export function Footer({ onOpenExternal, version }: FooterProps): ReactElement {
  return (
    <footer className="app-footer">
      <button type="button" className="app-footer-link" onClick={() => onOpenExternal(GITHUB_URL)}>
        Developed by Cardiadev
      </button>
      {version && <div className="app-footer-version">v{version}</div>}
    </footer>
  );
}
