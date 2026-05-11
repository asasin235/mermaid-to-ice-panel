#!/usr/bin/env node
import { Command } from 'commander';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { convertMermaidToIcePanel } from './index.js';

const p = new Command();
p.argument('<input>').option('-o, --output <path>').option('-n, --namespace <name>','namespace','mermaid-import').option('--domain <name>').option('--no-validate').option('--dry-run').option('-v, --verbose');
p.action(async (input, opts) => {
  try {
    const src = await readFile(input,'utf8');
    const yml = convertMermaidToIcePanel(src,{namespace:opts.namespace,domain:opts.domain,validate:opts.validate});
    if (opts.dryRun) process.stdout.write(yml);
    else {
      const out = opts.output ?? `${path.basename(input, path.extname(input))}.yaml`;
      await writeFile(out,yml,'utf8');
      if (opts.verbose) console.error(`Wrote ${out}`);
    }
  } catch (e) { console.error((e as Error).message); process.exit(1); }
});
await p.parseAsync(process.argv);
