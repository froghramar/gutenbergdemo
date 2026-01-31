import { useState, useCallback, useEffect } from "react";
import {
  BlockEditorProvider,
  BlockCanvas,
  BlockInspector,
} from "@wordpress/block-editor";
import { registerCoreBlocks } from "@wordpress/block-library";
import { parse } from "@wordpress/blocks";
import type { EditorBlock } from "../types/block";

function generateClientId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/** Convert parsed blocks (blockName, attrs) to editor format (name, attributes, clientId). */
function parsedToEditorBlocks(parsed: unknown[]): EditorBlock[] {
  return (parsed as { blockName?: string; attrs?: object; innerBlocks?: unknown[] }[]).map(
    (b) => ({
      clientId: generateClientId(),
      name: b.blockName || "core/freeform",
      attributes: b.attrs || {},
      innerBlocks: b.innerBlocks?.length
        ? parsedToEditorBlocks(b.innerBlocks)
        : undefined,
    })
  );
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

let coreBlocksRegistered = false;
function ensureCoreBlocks() {
  if (!coreBlocksRegistered) {
    registerCoreBlocks();
    coreBlocksRegistered = true;
  }
}

export interface BlockEditorCanvasProps {
  onBlocksChange?: (blocks: EditorBlock[]) => void;
}

export function BlockEditorCanvas({ onBlocksChange }: BlockEditorCanvasProps) {
  const [blocks, setBlocks] = useState<EditorBlock[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = parse(stored) as { blockName?: string; attrs?: object; innerBlocks?: unknown[] }[];
        return parsedToEditorBlocks(parsed);
      }
    } catch {
      // ignore
    }
    return [];
  });

  ensureCoreBlocks();

  const updateBlocks = useCallback(
    (next: EditorBlock[]) => {
      setBlocks(next);
      onBlocksChange?.(next);
    },
    [onBlocksChange]
  );

  const persistBlocks = useCallback(
    (next: EditorBlock[]) => {
      setBlocks(next);
      try {
        const { serialize } = require("@wordpress/blocks");
        localStorage.setItem(STORAGE_KEY, serialize(next));
      } catch {
        // ignore
      }
      onBlocksChange?.(next);
    },
    [onBlocksChange]
  );

  useEffect(() => {
    onBlocksChange?.(blocks);
  }, []);

  return (
    <div className="block-editor-canvas-wrap">
      <BlockEditorProvider
        value={blocks}
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
