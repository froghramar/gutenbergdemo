import { parse, serialize } from "@wordpress/blocks";
import type { ExportBlock, ExportPayload, PostMeta } from "../types/export";
import type { EditorBlock } from "../types/block";

/**
 * Build the full export payload in WordPress-compatible JSON format.
 * Uses Gutenberg's serialize() for content_raw and parse() to get the content array shape.
 */
export function buildExportPayload(
  blocks: EditorBlock[],
  meta: PostMeta,
  postType: string = "page"
): ExportPayload {
  const content_raw = serialize(blocks as Parameters<typeof serialize>[0]);
  const parsed = parse(content_raw) as ExportBlock[];

  return {
    post_type: postType,
    meta: {
      ...meta,
      date: meta.date || new Date().toISOString().replace("T", " ").slice(0, 19),
    },
    content_format: "wordpress-blocks",
    _meta: {
      features: ["gutenberg"],
      converted_at: new Date().toISOString(),
    },
    content: parsed,
    content_raw,
    post_meta: [],
    taxonomies: [],
  };
}

/**
 * Trigger download of the export as a JSON file.
 */
export function downloadExport(payload: ExportPayload, filename?: string): void {
  const name =
    filename ||
    (payload.meta.slug || payload.meta.title || "export")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "") + ".json";
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
