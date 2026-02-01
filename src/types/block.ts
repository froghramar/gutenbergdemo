/**
 * Minimal block shape used by the editor and serialize.
 * @wordpress/blocks uses "name"; data store may use "type" internally.
 * originalContent is set by parse() and used by validation/serialization.
 */
export interface EditorBlock {
  clientId?: string;
  name: string;
  attributes?: Record<string, unknown>;
  innerBlocks?: EditorBlock[];
  /** Parsed inner HTML; required for block validation and correct serialization. */
  originalContent?: string;
}
