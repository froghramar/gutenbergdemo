/**
 * JSON export format for Gutenberg block content (WordPress-compatible).
 */
export interface ExportBlock {
  blockName: string;
  attrs: Record<string, unknown>;
  innerBlocks: ExportBlock[];
  innerHTML?: string;
  innerContent?: (string | null)[];
}

export interface PostMeta {
  title: string;
  slug: string;
  status: string;
  author: string;
  date: string;
}

export interface ExportPayload {
  post_type: string;
  meta: PostMeta;
  content_format: "wordpress-blocks";
  _meta: {
    features: string[];
    converted_at: string;
  };
  content: ExportBlock[];
  content_raw: string;
  post_meta: unknown[];
  taxonomies: unknown[];
}
