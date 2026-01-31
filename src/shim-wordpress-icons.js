/**
 * Re-export @wordpress/icons and add 'edit' (block-editor expects it; package exports 'pencil').
 * Import from real path to avoid alias loop.
 */
export * from '../node_modules/@wordpress/icons/build-module/index.mjs'
export { pencil as edit } from '../node_modules/@wordpress/icons/build-module/index.mjs'
