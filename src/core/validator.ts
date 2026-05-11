import { readFileSync } from 'node:fs';
import path from 'node:path';
import AjvModule from 'ajv';
import addFormatsModule from 'ajv-formats';
import type { LandscapeImportData } from '../icepanel/types.js';
import { ValidationError } from './errors.js';

const AjvCtor: any = (AjvModule as any).default ?? AjvModule;
const addFormats: any = (addFormatsModule as any).default ?? addFormatsModule;

export function validateLandscape(data: LandscapeImportData): void {
  const ajv = new AjvCtor({ allErrors: true, strict: false });
  addFormats(ajv);
  for (const n of ['ImportModelObjectType', 'ModelConnectionDirection', 'ModelObjectImport', 'ModelConnectionImport', 'LandscapeImportData']) {
    ajv.addSchema(JSON.parse(readFileSync(path.join(process.cwd(), 'schemas', `${n}.json`), 'utf8')));
  }
  const valid = ajv.validate('https://api.icepanel.io/v1/schemas/LandscapeImportData', data);
  if (!valid) throw new ValidationError(ajv.errorsText(ajv.errors));
}
