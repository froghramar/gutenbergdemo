import { useState, useCallback, useEffect } from "react";
import {
  BlockEditorProvider,
  BlockCanvas,
  BlockInspector,
  Inserter,
} from "../bootstrap-gutenberg";
import { parse, serialize } from "@wordpress/blocks";
import type { EditorBlock } from "../types/block";

/** Ensure every block has innerBlocks as an array and preserve originalContent (block-editor validation needs it). */
function normalizeBlocks(blocks: EditorBlock[]): EditorBlock[] {
  return blocks.map((b) => ({
    ...b,
    innerBlocks: Array.isArray(b.innerBlocks)
      ? normalizeBlocks(b.innerBlocks)
      : [],
  }));
}

import "@wordpress/components/build-style/style.css";
import "@wordpress/block-editor/build-style/style.css";
import "@wordpress/block-library/build-style/style.css";
import "@wordpress/block-library/build-style/theme.css";

const STORAGE_KEY = "gutenberg-demo-blocks";

const defaultSettings = {
  hasFixedToolbar: true,
  __experimentalBlockPatterns: [],
  __experimentalPreferredStyleVariations: {},
};

export interface BlockEditorCanvasProps {
  onBlocksChange?: (blocks: EditorBlock[]) => void;
}

function loadBlocksFromStorage(): EditorBlock[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored?.trim()) return [];
    // parse() returns editor-shaped blocks (name, attributes, innerBlocks, clientId, originalContent).
    // Use them directly so originalContent is preserved; validation compares it to save output.
    let parsed = parse(stored) as EditorBlock[];
    if (parsed.length === 0 && stored.trim().length > 0) {
      // Stored content may be raw HTML (e.g. from an old save); treat as one freeform block.
      parsed = parse(
        `<!-- wp:freeform -->\n${stored.trim()}\n<!-- /wp:freeform -->`
      ) as EditorBlock[];
    }
    return normalizeBlocks(parsed);
  } catch {
    return [];
  }
}

export function BlockEditorCanvas({ onBlocksChange }: BlockEditorCanvasProps) {
  const [blocks, setBlocks] = useState<EditorBlock[]>([]);

  // Load from localStorage after mount so block types are registered before parse() runs.
  useEffect(() => {
    const loaded = loadBlocksFromStorage();
    if (loaded.length > 0) {
      setBlocks(loaded);
      onBlocksChange?.(loaded);
    }
  }, [onBlocksChange]);

  const updateBlocks = useCallback(
    (next: EditorBlock[]) => {
      const normalized = normalizeBlocks(next);
      setBlocks(normalized);
      onBlocksChange?.(normalized);
    },
    [onBlocksChange]
  );

  const persistBlocks = useCallback(
    (next: EditorBlock[]) => {
      const normalized = normalizeBlocks(next);
      setBlocks(normalized);
      try {
        localStorage.setItem(STORAGE_KEY, serialize(normalized));
      } catch {
        // ignore
      }
      onBlocksChange?.(normalized);
    },
    [onBlocksChange]
  );

  return (
    <div className="block-editor-canvas-wrap">
      <BlockEditorProvider
        value={normalizeBlocks(blocks)}
        onInput={updateBlocks}
        onChange={persistBlocks}
        settings={defaultSettings}
      >
        <div className="block-editor-layout">
          <div className="block-editor-sidebar">
            <BlockInspector />
          </div>
          <div className="block-editor-main">
            <div className="block-editor-toolbar">
              <Inserter rootClientId={null} />
            </div>
            <div className="block-editor-canvas-area">
              <BlockCanvas height="100%" />
            </div>
          </div>
        </div>
      </BlockEditorProvider>
    </div>
  );
}
