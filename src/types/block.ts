/**
 * Minimal block shape used by the editor and serialize.
 * @wordpress/blocks uses "name"; data store may use "type" internally.
 */
export interface EditorBlock {
  clientId?: string;
  name: string;
  attributes?: Record<string, unknown>;
  innerBlocks?: EditorBlock[];
}
