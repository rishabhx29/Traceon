/**
 * Viewer HTML shell.
 *
 * At build time, the esbuild build script generates:
 *  - `viewer-bundle.cjs`   — the minified IIFE bundle of the React Flow viewer
 *  - `reactflow-styles.cjs` — @xyflow/react's required stylesheet
 *  - `logo-datauri.cjs`    — the Traceon logo as a base64 data URI
 *
 * The CLI bundle imports all three (esbuild inlines them), and at runtime we
 * splice them into this HTML shell. This is what makes the published package
 * a single self-contained file.
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const viewerBundle: string = require('../../dist/viewer-bundle.cjs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const reactFlowCss: string = require('../../dist/reactflow-styles.cjs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const logoDataUri: string | null = require('../../dist/logo-datauri.cjs');

const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function buildViewerHtml(repoName: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Traceon — ${esc(repoName)} Dependency Graph</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }
  body {
    background: #080808;
    color: #e5e5e5;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    overflow: hidden;
  }
</style>
<style>${reactFlowCss}</style>
</head>
<body>
<div id="root"></div>
<script>
  // Minimal ResizeObserver fallback for environments that lack it. Real
  // browsers have the native one and never execute this. The fallback fires
  // one default measurement so layout-dependent code still completes.
  if (typeof window.ResizeObserver === 'undefined') {
    window.ResizeObserver = class {
      constructor(cb) { this.cb = cb; }
      observe(el) {
        setTimeout(() => {
          try {
            this.cb([{ target: el, contentRect: { width: 180, height: 60 }, borderBoxSize: [{ inlineSize: 180, blockSize: 60 }], contentBoxSize: [{ inlineSize: 180, blockSize: 60 }] }], this);
          } catch {}
        }, 0);
      }
      unobserve() {}
      disconnect() {}
    };
  }
</script>
<script>
  // Surface viewer crashes visibly instead of a blank page.
  (function () {
    var shown = false;
    function show(message) {
      if (shown) return;
      shown = true;
      var root = document.getElementById('root');
      if (root) root.innerHTML =
        '<div style="height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;font-family:monospace;background:#080808;color:#ef4444;padding:24px;text-align:center;">' +
        '<div style="font-size:16px;font-weight:bold;">Viewer crashed</div>' +
        '<div style="font-size:12px;color:#9ca3af;max-width:640px;word-break:break-word;">' + String(message).replace(/[<>&]/g, function (c) { return { '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]; }) + '</div>' +
        '<div style="font-size:11px;color:#4b5563;">Please report this at https://github.com/rishabhx29/Traceon/issues</div>' +
        '</div>';
    }
    window.addEventListener('error', function (e) { show(e.message || 'Unknown error'); });
    window.addEventListener('unhandledrejection', function (e) {
      var r = e.reason;
      show(r && r.message ? r.message : String(r));
    });
  })();
</script>
<script>window.__TRACEON_REPO_NAME__ = ${JSON.stringify(repoName)};</script>
<script>window.__TRACEON_LOGO__ = ${JSON.stringify(logoDataUri)};</script>
<script>${viewerBundle}</script>
</body>
</html>`;
}
