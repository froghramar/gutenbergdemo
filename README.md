# Gutenberg UI Builder

A React + TypeScript UI builder using the WordPress Gutenberg block editor. Build content with all Gutenberg-supported blocks and download the result as WordPress-compatible JSON.

## Features

- **Full Gutenberg block editor** – Uses `@wordpress/block-editor` and `@wordpress/block-library` for the same block set as WordPress (paragraphs, headings, images, columns, etc.).
- **Post / page meta** – Edit title, slug, status, author, and date for the exported content.
- **JSON export** – Download a single JSON file in the format used by WordPress (e.g. for import or headless CMS):
  - `post_type`, `meta`, `content_format: "wordpress-blocks"`
  - `content` – array of blocks with `blockName`, `attrs`, `innerBlocks`, `innerHTML`, `innerContent`
  - `content_raw` – serialized block markup (Gutenberg comment format)
  - `_meta.features`, `_meta.converted_at`, `post_meta`, `taxonomies`

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Usage

1. Add and edit blocks in the main editor (same behavior as WordPress block editor).
2. Set **Post / Page meta** in the left sidebar (title, slug, status, author, date).
3. Click **Download JSON** to save the current content and meta as a `.json` file.

Editor content is also persisted in `localStorage` so it survives page reloads.

## Export format example

The downloaded JSON matches the structure you provided, for example:

```json
{
  "post_type": "page",
  "meta": {
    "title": "Checkout",
    "slug": "checkout",
    "status": "publish",
    "author": "1",
    "date": "2026-01-28 17:10:06"
  },
  "content_format": "wordpress-blocks",
  "_meta": {
    "features": ["gutenberg"],
    "converted_at": "2026-01-28T17:10:06.082Z"
  },
  "content": [
    {
      "blockName": "core/paragraph",
      "attrs": {},
      "innerBlocks": [],
      "innerHTML": "<p>Hello</p>",
      "innerContent": ["<p>Hello</p>"]
    }
  ],
  "content_raw": "<!-- wp:paragraph -->\n<p>Hello</p>\n<!-- /wp:paragraph -->",
  "post_meta": [],
  "taxonomies": []
}
```

## Tech stack

- **React 18** + **TypeScript**
- **Vite**
- **@wordpress/block-editor**, **@wordpress/block-library**, **@wordpress/blocks**, **@wordpress/components**, **@wordpress/data**, **@wordpress/element**, **@wordpress/i18n**
