import { parseC4 } from './core/parser.js';
import { mapToLandscape } from './core/mapper.js';
import { emitYaml } from './core/emitter.js';
import { validateLandscape } from './core/validator.js';

export function convertMermaidToIcePanel(source: string, options: { namespace: string; domain?: string; validate?: boolean }) {
  const ast = parseC4(source);
  const data = mapToLandscape(ast, options.namespace, options.domain);
  if (options.validate ?? true) validateLandscape(data);
  return emitYaml(data);
}
