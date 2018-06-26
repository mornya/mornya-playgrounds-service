/**
 * getUID
 * Unique ID 얻기 (4byte)
 */
export function getUID() {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}
