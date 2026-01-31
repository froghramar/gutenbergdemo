import { useState, useCallback } from "react";
import { BlockEditorCanvas } from "./components/BlockEditorCanvas";
import { PostMetaForm } from "./components/PostMetaForm";
import { buildExportPayload, downloadExport } from "./utils/exportBlocks";
import type { PostMeta } from "./types/export";
import type { EditorBlock } from "./types/block";
import "./App.css";

const defaultMeta: PostMeta = {
  title: "Checkout",
  slug: "checkout",
  status: "publish",
  author: "1",
  date: new Date().toISOString().replace("T", " ").slice(0, 19),
};

function App() {
  const [meta, setMeta] = useState<PostMeta>(defaultMeta);
  const [blocks, setBlocks] = useState<EditorBlock[]>([]);
  const [postType] = useState("page");

  const handleBlocksChange = useCallback((newBlocks: EditorBlock[]) => {
    setBlocks(newBlocks);
  }, []);

  const handleDownload = useCallback(() => {
    const payload = buildExportPayload(blocks, meta, postType);
    downloadExport(payload);
  }, [blocks, meta, postType]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Gutenberg UI Builder</h1>
        <p>Build content with blocks and export as WordPress-compatible JSON.</p>
      </header>
      <div className="app-body">
        <aside className="app-sidebar">
          <PostMetaForm meta={meta} onChange={setMeta} />
          <div className="export-actions">
            <button type="button" className="download-json" onClick={handleDownload}>
              Download JSON
            </button>
          </div>
        </aside>
        <main className="app-editor">
          <BlockEditorCanvas onBlocksChange={handleBlocksChange} />
        </main>
      </div>
    </div>
  );
}

export default App;
