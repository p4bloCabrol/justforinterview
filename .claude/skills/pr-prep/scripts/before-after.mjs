// Builds Storybook for the base ref (in a temporary worktree) and for HEAD, screenshots the given
// stories in both, and composes side-by-side "Before | After" images. Stories new in HEAD get "New".
// CLI: node before-after.mjs --base main --ids a,b [--themes light,dark] [--out .pr-prep/compare]
// Prints a JSON array: [{ id, theme, file, status: 'changed' | 'new' }]
import { execFileSync } from 'node:child_process';
import { existsSync, rmSync, symlinkSync, readFileSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { captureStories } from './capture.mjs';

const run = (cmd, argv, cwd) => execFileSync(cmd, argv, { cwd, stdio: ['ignore', 'ignore', 'inherit'], shell: process.platform === 'win32' });

function args(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 2) out[argv[i].replace(/^--/, '')] = argv[i + 1];
  return out;
}

async function compose(pairs, outDir) {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const results = [];
  try {
    for (const p of pairs) {
      const img = f => `data:image/png;base64,${readFileSync(f).toString('base64')}`;
      const col = (label, f) => `<figure><figcaption>${label}</figcaption>${f ? `<img src="${img(f)}">` : '<div class="none">Not in base</div>'}</figure>`;
      await page.setContent(`<html><body style="margin:0;padding:16px;background:#e5e5e5;font:500 13px system-ui;display:flex;gap:16px;width:max-content">
        <style>figure{margin:0}figcaption{margin-bottom:8px;color:#404040}img{display:block;max-width:600px;border-radius:6px}
        .none{width:240px;height:80px;display:grid;place-items:center;color:#737373;border:1px dashed #8a8a8a;border-radius:6px}</style>
        ${col('Before (base)', p.before)}${col(p.before ? 'After' : 'New', p.after)}</body></html>`);
      const file = path.join(outDir, `${p.id}--${p.theme}-compare.png`);
      await page.locator('body').screenshot({ path: file });
      results.push({ id: p.id, theme: p.theme, file, status: p.before ? 'changed' : 'new' });
    }
  } finally {
    await browser.close();
  }
  return results;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const a = args(process.argv.slice(2));
  const root = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
  const work = path.join(root, '.pr-prep');
  const baseTree = path.join(work, 'base');
  const ids = a.ids.split(',');
  const themes = (a.themes ?? 'light,dark').split(',');
  const out = path.resolve(a.out ?? path.join(work, 'compare'));

  if (existsSync(baseTree)) run('git', ['worktree', 'remove', '--force', baseTree], root);
  run('git', ['worktree', 'add', '--detach', baseTree, a.base], root);
  try {
    // Reuse HEAD's node_modules (a junction on Windows): fast, and fine while deps are close.
    symlinkSync(path.join(root, 'node_modules'), path.join(baseTree, 'node_modules'), 'junction');
    run('npx', ['storybook', 'build', '--quiet', '-o', path.join(work, 'base-static')], baseTree);
  } catch {
    console.error('Base has no Storybook build; every story will be reported as new.');
  } finally {
    run('git', ['worktree', 'remove', '--force', baseTree], root);
  }
  run('npx', ['storybook', 'build', '--quiet', '-o', path.join(work, 'head-static')], root);

  const after = await captureStories({ staticDir: path.join(work, 'head-static'), outDir: path.join(work, 'after'), ids, themes });
  const before = existsSync(path.join(work, 'base-static', 'index.json'))
    ? await captureStories({ staticDir: path.join(work, 'base-static'), outDir: path.join(work, 'before'), ids, themes })
    : [];
  const pairs = after.map(s => ({ id: s.id, theme: s.theme, after: s.file,
    before: before.find(b => b.id === s.id && b.theme === s.theme)?.file }));
  console.log(JSON.stringify(await compose(pairs, out), null, 2));
  rmSync(path.join(work, 'base-static'), { recursive: true, force: true });
}
