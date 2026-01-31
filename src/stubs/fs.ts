/**
 * Browser stub for Node "fs" – postcss pulls it in for source maps.
 * No real filesystem in the browser; provide no-op/safe defaults.
 */
export function existsSync(): boolean {
  return false
}
export function readFileSync(): string {
  return ''
}
export default { existsSync, readFileSync }
