import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const schemas: Record<string, string> = {
  LandscapeImportData: 'https://api.icepanel.io/v1/schemas/LandscapeImportData',
  ModelObjectImport: 'https://api.icepanel.io/v1/schemas/ModelObjectImport',
  ModelConnectionImport: 'https://api.icepanel.io/v1/schemas/ModelConnectionImport',
  ImportModelObjectType: 'https://api.icepanel.io/v1/schemas/ImportModelObjectType',
  ModelConnectionDirection: 'https://api.icepanel.io/v1/schemas/ModelConnectionDirection'
};

await mkdir('schemas', { recursive: true });
for (const [name, url] of Object.entries(schemas)) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  const json = await res.json();
  await writeFile(path.join('schemas', `${name}.json`), `${JSON.stringify(json, null, 2)}\n`, 'utf8');
  console.error(`Wrote schemas/${name}.json`);
}
