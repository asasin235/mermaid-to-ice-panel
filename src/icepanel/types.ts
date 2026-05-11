export type ImportModelObjectType =
  | 'domain'
  | 'actor'
  | 'system'
  | 'group'
  | 'app'
  | 'store'
  | 'component';

export type ModelConnectionDirection = 'outgoing' | 'incoming' | 'bidirectional';

export interface ModelObjectImport {
  id: string;
  name: string;
  type: ImportModelObjectType;
  parentId?: string;
  description?: string;
  caption?: string;
  external?: boolean;
  status?: string;
}

export interface ModelConnectionImport {
  id: string;
  name: string;
  direction: ModelConnectionDirection;
  originId: string;
  targetId: string;
  description?: string;
}

export interface LandscapeImportData {
  namespace: string;
  modelObjects: ModelObjectImport[];
  modelConnections: ModelConnectionImport[];
}
