import YAML from 'yaml';
import type { LandscapeImportData } from '../icepanel/types.js';

export function emitYaml(data: LandscapeImportData): string {
  return '# yaml-language-server: $schema=https://api.icepanel.io/v1/schemas/LandscapeImportData\n' + YAML.stringify(data);
}
