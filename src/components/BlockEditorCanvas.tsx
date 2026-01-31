import { useState, useCallback, useEffect } from "react";
import {
  BlockEditorProvider,
  BlockCanvas,
  BlockInspector,
} from "../bootstrap-gutenberg";
import { useRegistry } from "@wordpress/data";
import { parse, serialize } from "@wordpress/blocks";
import type { EditorBlock } from "../types/block";

// #region agent log
const LOG = (msg: string, data: Record<string, unknown>, hypothesisId: string) => {
  fetch('http://127.0.0.1:7242/ingest/4c43da5b-e111-42d8-bec3-cb9fb53aaa55', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'BlockEditorCanvas.tsx', message: msg, data, timestamp: Date.now(), sessionId: 'debug-session', hypothesisId }) }).catch(() => {});
};
// #endregion

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
  const registry = useRegistry();
  // #region agent log
  const reg = registry as unknown as { select?: unknown; stores?: Record<string, unknown> };
  const hasRegistry = registry != null;
  const hasSelect = typeof reg?.select === 'function';
  const storeNames = registry && typeof reg.stores === 'object' ? Object.keys(reg.stores) : [];
  const selectRef = reg?.select != null ? String(reg.select).slice(0, 80) : 'none';
  LOG('BlockEditorCanvas useRegistry()', { hasRegistry, hasSelect, storeNames, storeCount: storeNames.length, selectRef }, 'H3');
  LOG('BlockEditorCanvas registry', { registryType: typeof registry, selectRef }, 'H5');
  // #endregion
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
    <div
      className="block-editor-canvas-wrap"
      // #region agent log
      onMouseDownCapture={() => {
        const r = registry as unknown as { select?: unknown; stores?: Record<string, unknown> };
        const hasR = registry != null;
        const hasSel = typeof r?.select === 'function';
        const stores = registry && typeof r.stores === 'object' ? Object.keys(r.stores) : [];
        LOG('click-time registry in scope', { hasRegistry: hasR, hasSelect: hasSel, storeCount: stores.length }, 'H6');
      }}
      // #endregion
    >
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
