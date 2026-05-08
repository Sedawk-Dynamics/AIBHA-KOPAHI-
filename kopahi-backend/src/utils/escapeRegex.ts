/*
 * Escape user input destined for a RegExp constructor. Prevents ReDoS by
 * stripping every regex metacharacter so the input can only ever match
 * literally.
 */
const escapeRegex = (str: unknown): string =>
  String(str ?? "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export default escapeRegex;
