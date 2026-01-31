import { useState, useCallback, useEffect } from "react";
import {
  BlockEditorProvider,
  BlockCanvas,
  BlockInspector,
} from "../bootstrap-gutenberg";
import { parse, serialize } from "@wordpress/blocks";
import type { EditorBlock } from "../types/block";

function generateClientId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/** Convert parsed blocks (blockName, attrs) to editor format (name, attributes, clientId). */
function parsedToEditorBlocks(parsed: unknown[]): EditorBlock[] {
  return (
    parsed as {
      blockName?: string;
      attrs?: Record<string, unknown>;
      innerBlocks?: unknown[];
    }[]
  ).map((b) => ({
    clientId: generateClientId(),
    name: b.blockName || "core/freeform",
    attributes: b.attrs ?? {},
    innerBlocks: b.innerBlocks?.length
      ? parsedToEditorBlocks(b.innerBlocks)
      : [],
  }));
}

/** Ensure every block has innerBlocks as an array (block-editor reducer requires it). */
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

export function BlockEditorCanvas({ onBlocksChange }: BlockEditorCanvasProps) {
  const [blocks, setBlocks] = useState<EditorBlock[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = parse(stored) as { blockName?: string; attrs?: Record<string, unknown>; innerBlocks?: unknown[] }[];
        return parsedToEditorBlocks(parsed);
      }
    } catch {
      // ignore
    }
    return [];
  });

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

  useEffect(() => {
    onBlocksChange?.(blocks);
  }, []);

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
            <BlockCanvas height="100%" />
          </div>
        </div>
      </BlockEditorProvider>
    </div>
  );
}
