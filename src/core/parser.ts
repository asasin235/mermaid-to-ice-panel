import type { C4Ast, DiagramType } from './ast.js';
import { ParseError } from './errors.js';

const skipPrefixes = ['UpdateElementStyle', 'UpdateRelStyle', 'UpdateLayoutConfig'];
const headers: DiagramType[] = ['C4Context', 'C4Container', 'C4Component'];
function parseArgs(raw: string): string[] { const a:string[]=[]; let c=''; let q=''; for (const ch of raw) { if (q) { if (ch===q) q=''; else c+=ch; } else if (ch==='"'||ch==="'") q=ch; else if (ch===',') { if (c.trim()) a.push(c.trim()); c=''; } else c+=ch; } if (c.trim()) a.push(c.trim()); return a; }

export function parseC4(input: string): C4Ast {
  const ast: C4Ast = { diagramType: 'C4Context', elements: [], boundaries: [], relationships: [], warnings: [] };
  const scope: string[] = []; const declared = new Set<string>(); let gotHeader = false;
  for (const raw of input.split(/\r?\n/)) {
    const line = raw.trim(); if (!line || line.startsWith('%%')) continue;
    if (!gotHeader) { const h = line.split(/\s+/)[0] as DiagramType; if (!headers.includes(h)) throw new ParseError(`Unrecognised diagram header: ${line}`); ast.diagramType = h; gotHeader=true; continue; }
    if (line.startsWith('title ')) { ast.title = line.slice(6).trim(); continue; }
    if (line === '}') { if (!scope.length) throw new ParseError('Unbalanced braces'); scope.pop(); continue; }
    if (skipPrefixes.some((p)=>line.startsWith(p))) continue;
    const m = line.match(/^(\w+)\((.*)\)\s*(\{)?$/); if (!m) { ast.warnings.push(`Unknown directive skipped: ${line}`); continue; }
    const type = m[1]!; const args = parseArgs(m[2] ?? ''); const brace = m[3];
    if (type.includes('Boundary')) { const [alias,label,boundaryKind] = args; if (!alias||!label||!brace) throw new ParseError(`Invalid boundary syntax: ${line}`); if (declared.has(alias)) throw new ParseError(`Duplicate alias: ${alias}`); declared.add(alias); ast.boundaries.push({kind:'boundary',boundaryType:type,alias,label,boundaryKind,scope:[...scope]}); scope.push(alias); continue; }
    if (type.startsWith('Rel')) { const [from,to,label='',technology] = args; if(!from||!to) throw new ParseError(`Invalid relationship syntax: ${line}`); ast.relationships.push({kind:'relationship',relType:type,from,to,label,technology}); continue; }
    const [alias,label,technology,description]=args; if(!alias||!label) throw new ParseError(`Invalid element syntax: ${line}`); if(declared.has(alias)) throw new ParseError(`Duplicate alias: ${alias}`); declared.add(alias); ast.elements.push({kind:'element',elementType:type,alias,label,technology,description,scope:[...scope]});
  }
  if (!gotHeader) throw new ParseError('Missing C4 header'); if (scope.length) throw new ParseError('Unbalanced braces'); return ast;
}
