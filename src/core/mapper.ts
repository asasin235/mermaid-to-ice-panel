import type { C4Ast } from './ast.js';
import { deterministicId } from './ids.js';
import type { LandscapeImportData, ModelObjectImport } from '../icepanel/types.js';
import { MappingError } from './errors.js';

const mapType: Record<string, { type: ModelObjectImport['type']; external?: boolean }> = {
  Person: { type: 'actor', external: false }, Person_Ext: { type: 'actor', external: true },
  System: { type: 'system', external: false }, System_Ext: { type: 'system', external: true },
  SystemDb: { type: 'system', external: false }, SystemDb_Ext: { type: 'system', external: true },
  SystemQueue: { type: 'system', external: false }, SystemQueue_Ext: { type: 'system', external: true },
  Container: { type: 'app' }, Container_Ext: { type: 'app', external: true }, ContainerQueue: { type: 'app' }, ContainerQueue_Ext: { type: 'app', external: true },
  ContainerDb: { type: 'store' }, ContainerDb_Ext: { type: 'store', external: true },
  Component: { type: 'component' }, Component_Ext: { type: 'component', external: true }, ComponentQueue: { type: 'component' }, ComponentQueue_Ext: { type: 'component', external: true }, ComponentDb: { type: 'component' }, ComponentDb_Ext: { type: 'component', external: true }
};

export function mapToLandscape(ast: C4Ast, namespace: string, domainOverride?: string): LandscapeImportData {
  const modelObjects: ModelObjectImport[] = []; const aliasToObj = new Map<string, ModelObjectImport>(); const aliasPath = new Map<string,string>();
  const domainName = ast.boundaries.find((b)=>b.boundaryType==='Enterprise_Boundary' && b.scope.length===0)?.label || domainOverride || ast.title || 'Default Domain';
  const domainAlias = ast.boundaries.find((b)=>b.boundaryType==='Enterprise_Boundary' && b.scope.length===0)?.alias || '__root_domain';
  const domainId = deterministicId(namespace,'domain',domainAlias);
  const domain: ModelObjectImport = { id: domainId, name: domainName, type: 'domain' }; modelObjects.push(domain); aliasToObj.set(domainAlias, domain); aliasPath.set(domainAlias, domainAlias);
  for (const e of ast.elements) {
    const t = mapType[e.elementType]; if (!t) continue;
    const parent = t.type==='actor' || t.type==='system' ? domain : undefined;
    const parentId = parent?.id;
    const path = `${e.scope.join('/')}${e.scope.length?'/':''}${e.alias}`;
    const obj: ModelObjectImport = { id: deterministicId(namespace,t.type,path), name: e.label, type: t.type, parentId, description: e.description, caption: e.technology, external: t.external };
    if (!obj.parentId) delete obj.parentId;
    if (obj.description===undefined) delete obj.description; if (obj.caption===undefined) delete obj.caption; if (obj.external===undefined) delete obj.external;
    modelObjects.push(obj); aliasToObj.set(e.alias,obj); aliasPath.set(e.alias,path);
  }
  const modelConnections = ast.relationships.map((r) => {
    if (!aliasToObj.has(r.from) || !aliasToObj.has(r.to)) throw new MappingError(`Rel references undefined alias: ${r.from} -> ${r.to}`);
    let origin = r.from; let target = r.to; let direction: 'outgoing'|'bidirectional' = 'outgoing';
    if (r.relType==='Rel_Back') { origin = r.to; target = r.from; }
    if (r.relType==='BiRel') direction = 'bidirectional';
    const connPath = `${aliasPath.get(origin)}>>${aliasPath.get(target)}::${r.label||''}`;
    return { id: deterministicId(namespace,'connection',connPath), name: r.label || `${origin} to ${target}`, direction, originId: aliasToObj.get(origin)!.id, targetId: aliasToObj.get(target)!.id, description: r.technology };
  });
  return { namespace, modelObjects, modelConnections };
}
