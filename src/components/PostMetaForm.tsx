import { useCallback } from "react";
import type { PostMeta } from "../types/export";

export interface PostMetaFormProps {
  meta: PostMeta;
  onChange: (meta: PostMeta) => void;
}

function formatDateForInput(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 16);
}

function formatDateForExport(value: string): string {
  if (!value) return new Date().toISOString().replace("T", " ").slice(0, 19);
  const d = new Date(value);
  return d.toISOString().replace("T", " ").slice(0, 19);
}

export function PostMetaForm({ meta, onChange }: PostMetaFormProps) {
  const update = useCallback(
    (field: keyof PostMeta, value: string) => {
      onChange({
        ...meta,
        [field]: field === "date" ? formatDateForExport(value) : value,
      });
    },
    [meta, onChange]
  );

  return (
    <div className="post-meta-form">
      <h3>Post / Page meta</h3>
      <label>
        Title
        <input
          type="text"
          value={meta.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="e.g. Checkout"
        />
      </label>
      <label>
        Slug
        <input
          type="text"
          value={meta.slug}
          onChange={(e) => update("slug", e.target.value)}
          placeholder="e.g. checkout"
        />
      </label>
      <label>
        Status
        <select
          value={meta.status}
          onChange={(e) => update("status", e.target.value)}
        >
          <option value="publish">Publish</option>
          <option value="draft">Draft</option>
          <option value="private">Private</option>
        </select>
      </label>
      <label>
        Author ID
        <input
          type="text"
          value={meta.author}
          onChange={(e) => update("author", e.target.value)}
          placeholder="1"
        />
      </label>
      <label>
        Date
        <input
          type="datetime-local"
          value={formatDateForInput(meta.date)}
          onChange={(e) => update("date", e.target.value)}
        />
      </label>
    </div>
  );
}
