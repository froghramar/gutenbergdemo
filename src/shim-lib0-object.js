/**
 * Re-export lib0/object and add deepFreeze (used by yjs; missing in some lib0 versions).
 * Import from actual path to avoid alias loop.
 */
export * from '../node_modules/lib0/object.js'
export const deepFreeze = (obj) => obj
