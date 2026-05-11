import { createHash } from 'node:crypto';

export const deterministicId = (namespace: string, objectType: string, canonicalPath: string): string =>
  createHash('sha256').update(`${namespace}::${objectType}::${canonicalPath}`).digest('hex').slice(0, 16);
