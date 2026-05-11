export type DiagramType = 'C4Context' | 'C4Container' | 'C4Component';

export interface ElementNode {
  kind: 'element';
  elementType: string;
  alias: string;
  label: string;
  technology?: string;
  description?: string;
  scope: string[];
}

export interface BoundaryNode {
  kind: 'boundary';
  boundaryType: string;
  alias: string;
  label: string;
  boundaryKind?: string;
  scope: string[];
}

export interface RelationshipNode {
  kind: 'relationship';
  relType: string;
  from: string;
  to: string;
  label: string;
  technology?: string;
}

export interface C4Ast {
  diagramType: DiagramType;
  title?: string;
  elements: ElementNode[];
  boundaries: BoundaryNode[];
  relationships: RelationshipNode[];
  warnings: string[];
}
