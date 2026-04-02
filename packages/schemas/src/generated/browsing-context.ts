// -----------------------------------------------------------------------
// AUTO-GENERATED from JSON Schema files in json/
// Do not edit manually — run `pnpm generate` to regenerate.
// -----------------------------------------------------------------------

/**
 * This interface was referenced by `WebdriverContext`'s JSON-Schema
 * via the `definition` "WindowHandleResult".
 */
export interface WindowHandleResult {
  handle: string;
}
/**
 * This interface was referenced by `WebdriverContext`'s JSON-Schema
 * via the `definition` "WindowHandlesResult".
 */
export interface WindowHandlesResult {
  handles: string[];
}
/**
 * This interface was referenced by `WebdriverContext`'s JSON-Schema
 * via the `definition` "SwitchToWindowParams".
 */
export interface SwitchToWindowParams {
  handle: string;
}
/**
 * This interface was referenced by `WebdriverContext`'s JSON-Schema
 * via the `definition` "NewWindowParams".
 */
export interface NewWindowParams {
  type?: "tab" | "window";
}
/**
 * This interface was referenced by `WebdriverContext`'s JSON-Schema
 * via the `definition` "NewWindowResult".
 */
export interface NewWindowResult {
  handle: string;
  type: "tab" | "window";
}
/**
 * This interface was referenced by `WebdriverContext`'s JSON-Schema
 * via the `definition` "SwitchToFrameParams".
 */
export interface SwitchToFrameParams {
  id: unknown;
}
