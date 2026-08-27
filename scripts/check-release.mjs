import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist');
const indexPath = path.join(root, 'index.html');
const expectedBase = process.env.CROWN_BASE_PATH || '/';

const fail = (message) => {
  console.error(`[release-check] ${message}`);
  process.exitCode = 1;
};

if (!fs.existsSync(indexPath)) {
  fail('dist/index.html is missing');
  process.exit();
}

const html = fs.readFileSync(indexPath, 'utf8');
if (!html.trim()) fail('dist/index.html is empty');
if (/localhost|127\.0\.0\.1/.test(html)) fail('production HTML contains a local development URL');

const refs = [...html.matchAll(/(?:src|href)=["']([^"'#?]+)["']/g)].map((match) => match[1]);
const localRefs = refs.filter((ref) => !/^(?:https?:|data:|mailto:|tel:)/.test(ref));

for (const ref of localRefs) {
  if (expectedBase !== '/' && ref.startsWith('/') && !ref.startsWith(expectedBase)) {
    fail(`absolute asset reference escapes configured base ${expectedBase}: ${ref}`);
    continue;
  }

  const relative = ref.startsWith(expectedBase)
    ? ref.slice(expectedBase.length)
    : ref.replace(/^\//, '');
  const target = path.join(root, relative);
  if (!fs.existsSync(target)) fail(`referenced release asset is missing: ${ref}`);
}

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : [full];
});

const files = walk(root);
if (!files.some((file) => /assets[/\\].+\.js$/.test(file))) fail('no bundled JavaScript asset found');
if (files.some((file) => file.endsWith('.map'))) fail('source maps must not be shipped in the release bundle');

if (!process.exitCode) {
  console.log(`[release-check] PASS: ${files.length} files, ${localRefs.length} local index references, base=${expectedBase}`);
}
