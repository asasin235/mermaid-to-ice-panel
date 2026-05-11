import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { convertMermaidToIcePanel } from '../src/index.js';

const dir = 'test/fixtures';
for (const file of readdirSync(dir).filter((f) => f.endsWith('.mmd'))) {
  it(file, () => {
    const input = readFileSync(path.join(dir, file), 'utf8');
    const out = convertMermaidToIcePanel(input, { namespace: 'mermaid-import' });
    const expectedPath = path.join(dir, file.replace('.mmd', '.expected.yaml'));
    if (process.env.UPDATE_GOLDENS === '1') writeFileSync(expectedPath, out, 'utf8');
    const expected = readFileSync(expectedPath, 'utf8');
    expect(out).toBe(expected);
    expect(convertMermaidToIcePanel(input, { namespace: 'mermaid-import' })).toBe(out);
  });
}

describe('errors', () => {
  it('fails bad header', () => {
    expect(() => convertMermaidToIcePanel('flowchart TB', { namespace: 'x' })).toThrow();
  });
});
