// Publishes PR images to the orphan branch `pr-assets` (no shared history with the code) under
// <pr-branch>/, and prints the Markdown image URLs to paste into the PR body.
// CLI: node publish.mjs --branch feat/button --files a.png,b.png
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';

const git = (argv, cwd) => execFileSync('git', argv, { cwd, encoding: 'utf8' }).trim();

const a = {};
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i += 2) a[argv[i].replace(/^--/, '')] = argv[i + 1];

const root = git(['rev-parse', '--show-toplevel']);
const tree = path.join(root, '.pr-prep', 'assets');
const folder = a.branch.replace(/[^\w.-]+/g, '-');
const files = a.files.split(',');
const repo = execFileSync('gh', ['repo', 'view', '--json', 'nameWithOwner', '-q', '.nameWithOwner'], { encoding: 'utf8' }).trim();

if (existsSync(tree)) git(['worktree', 'remove', '--force', tree], root);
const remoteHas = git(['ls-remote', '--heads', 'origin', 'pr-assets'], root) !== '';
if (remoteHas) {
  git(['fetch', 'origin', 'pr-assets:pr-assets'], root);
  git(['worktree', 'add', tree, 'pr-assets'], root);
} else {
  git(['worktree', 'add', '--orphan', '-b', 'pr-assets', tree], root);
}

try {
  const dest = path.join(tree, folder);
  rmSync(dest, { recursive: true, force: true }); // re-running replaces this PR's images
  mkdirSync(dest, { recursive: true });
  for (const f of files) copyFileSync(f, path.join(dest, path.basename(f)));
  git(['add', '-A'], tree);
  if (git(['status', '--porcelain'], tree)) {
    git(['commit', '-m', `assets: images for ${a.branch}`], tree);
    git(['push', 'origin', 'pr-assets'], tree);
  }
  for (const f of files) {
    const name = path.basename(f);
    console.log(`![${name.replace(/\.png$/, '')}](https://raw.githubusercontent.com/${repo}/pr-assets/${folder}/${name})`);
  }
} finally {
  git(['worktree', 'remove', '--force', tree], root);
}
