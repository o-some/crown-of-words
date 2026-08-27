import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const registryPath = resolve(root, '.masterbrain/asset-registry.json');
const registry = JSON.parse(await readFile(registryPath, 'utf8'));

const failures = [];
const notes = [];

for (const asset of registry.assets) {
  if (asset.status !== 'ready') {
    notes.push(`${asset.id}: ${asset.status}`);
    continue;
  }

  const filePath = resolve(root, asset.runtimePath);
  try {
    const info = await stat(filePath);
    if (info.size !== asset.size) {
      failures.push(`${asset.id}: size ${info.size} != ${asset.size}`);
      continue;
    }

    const bytes = await readFile(filePath);
    const sha256 = createHash('sha256').update(bytes).digest('hex');
    if (sha256 !== asset.sha256) {
      failures.push(`${asset.id}: sha256 ${sha256} != ${asset.sha256}`);
    }
  } catch (error) {
    failures.push(`${asset.id}: ${error.code ?? error.message}`);
  }
}

if (registry.rules?.runtimeDropboxHotlinks !== false) {
  failures.push('registry must forbid runtime Dropbox hotlinks');
}

if (failures.length) {
  console.error('Asset integrity check FAILED');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Asset integrity check PASS (${registry.assets.filter((asset) => asset.status === 'ready').length} ready assets)`);
for (const note of notes) console.log(`NOTE ${note}`);
