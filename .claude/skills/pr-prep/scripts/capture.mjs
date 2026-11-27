// Screenshots Storybook stories from a static build, per theme and locale.
// CLI: node capture.mjs --static storybook-static --out .pr-prep/shots [--ids a,b] [--changed-since main]
//                       [--themes light,dark] [--locales en]
// Prints a JSON array: [{ id, title, name, theme, locale, file }]
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' };

function serve(root) {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x');
    let file = path.join(root, decodeURIComponent(url.pathname));
    if (url.pathname.endsWith('/')) file = path.join(file, 'index.html');
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': MIME[path.extname(file)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end();
    }
  });
  return new Promise(resolve => server.listen(0, () => resolve(server)));
}

/** Story entries whose stories file lives in a folder touched since `base`. */
export function changedStoryIds(index, base) {
  const changed = execFileSync('git', ['diff', '--name-only', `${base}...HEAD`], { encoding: 'utf8' })
    .split('\n').filter(Boolean).map(f => path.posix.dirname(f));
  const dirs = new Set(changed);
  return Object.values(index.entries)
    .filter(e => e.type === 'story' && dirs.has(path.posix.dirname(e.importPath.replace(/^\.\//, ''))))
    .map(e => e.id);
}

export async function captureStories({ staticDir, outDir, ids, themes = ['light', 'dark'], locales = ['en'], suffix = '' }) {
  const index = JSON.parse(await readFile(path.join(staticDir, 'index.json'), 'utf8'));
  const entries = ids.map(id => index.entries[id]).filter(Boolean);
  await mkdir(outDir, { recursive: true });
  const server = await serve(staticDir);
  const { port } = server.address();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 900, height: 700 }, deviceScaleFactor: 2 });
  const shots = [];
  try {
    for (const e of entries) {
      for (const theme of themes) {
        for (const locale of locales) {
          await page.goto(`http://localhost:${port}/iframe.html?id=${e.id}&viewMode=story&globals=theme:${theme};locale:${locale}`,
            { waitUntil: 'networkidle' });
          await page.waitForSelector('#storybook-root .jfi-root');
          await page.evaluate(() => document.fonts.ready);
          // Crop to the story content (the decorator wrapper is full-height).
          const box = await page.evaluate(() => {
            const kids = [...document.querySelectorAll('#storybook-root .jfi-root > *')];
            const rects = kids.map(k => k.getBoundingClientRect()).filter(r => r.width && r.height);
            if (!rects.length) return null;
            const pad = 24;
            const x = Math.max(0, Math.min(...rects.map(r => r.left)) - pad);
            const y = Math.max(0, Math.min(...rects.map(r => r.top)) - pad);
            return { x, y, width: Math.max(...rects.map(r => r.right)) + pad - x, height: Math.max(...rects.map(r => r.bottom)) + pad - y };
          });
          const file = path.join(outDir, `${e.id}--${theme}-${locale}${suffix}.png`);
          await page.screenshot({ path: file, ...(box ? { clip: box } : {}) });
          shots.push({ id: e.id, title: e.title, name: e.name, theme, locale, file });
        }
      }
    }
  } finally {
    await browser.close();
    server.close();
  }
  return shots;
}

function args(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 2) out[argv[i].replace(/^--/, '')] = argv[i + 1];
  return out;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const a = args(process.argv.slice(2));
  const staticDir = path.resolve(a.static ?? 'storybook-static');
  if (!existsSync(path.join(staticDir, 'index.json'))) throw new Error(`No Storybook build at ${staticDir}`);
  const index = JSON.parse(await readFile(path.join(staticDir, 'index.json'), 'utf8'));
  const ids = a.ids ? a.ids.split(',') : changedStoryIds(index, a['changed-since'] ?? 'main');
  const shots = await captureStories({
    staticDir, outDir: path.resolve(a.out ?? '.pr-prep/shots'), ids,
    themes: (a.themes ?? 'light,dark').split(','), locales: (a.locales ?? 'en').split(','),
  });
  console.log(JSON.stringify(shots, null, 2));
}
