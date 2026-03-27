// -----------------------------------------------------------------------
// AUTO-GENERATED from JSON Schema files in json/
// Do not edit manually — run `pnpm generate` to regenerate.
// -----------------------------------------------------------------------

/**
 * Opaque browsing context ID
 *
 * This interface was referenced by `WebdriverBidiBrowsingContext`'s JSON-Schema
 * via the `definition` "BrowsingContext".
 */
export type BrowsingContext = string;
/**
 * Opaque navigation ID
 *
 * This interface was referenced by `WebdriverBidiBrowsingContext`'s JSON-Schema
 * via the `definition` "Navigation".
 */
export type Navigation = string;
/**
 * This interface was referenced by `WebdriverBidiBrowsingContext`'s JSON-Schema
 * via the `definition` "ReadinessState".
 */
export type ReadinessState = "none" | "interactive" | "complete";
/**
 * This interface was referenced by `WebdriverBidiBrowsingContext`'s JSON-Schema
 * via the `definition` "CreateType".
 */
export type CreateType = "tab" | "window";

/**
 * This interface was referenced by `WebdriverBidiBrowsingContext`'s JSON-Schema
 * via the `definition` "CreateParams".
 */
export interface CreateParams {
  type: CreateType;
  referenceContext?: BrowsingContext;
  background?: boolean;
  userContext?: string;
}
/**
 * This interface was referenced by `WebdriverBidiBrowsingContext`'s JSON-Schema
 * via the `definition` "CreateResult".
 */
export interface CreateResult {
  context: BrowsingContext;
}
/**
 * This interface was referenced by `WebdriverBidiBrowsingContext`'s JSON-Schema
 * via the `definition` "CloseParams".
 */
export interface CloseParams {
  context: BrowsingContext;
  promptUnload?: boolean;
}
/**
 * This interface was referenced by `WebdriverBidiBrowsingContext`'s JSON-Schema
 * via the `definition` "ActivateParams".
 */
export interface ActivateParams {
  context: BrowsingContext;
}
/**
 * This interface was referenced by `WebdriverBidiBrowsingContext`'s JSON-Schema
 * via the `definition` "NavigateParams".
 */
export interface NavigateParams {
  context: BrowsingContext;
  url: string;
  wait?: ReadinessState;
}
/**
 * This interface was referenced by `WebdriverBidiBrowsingContext`'s JSON-Schema
 * via the `definition` "NavigateResult".
 */
export interface NavigateResult {
  navigation?: Navigation;
  url: string;
}
/**
 * This interface was referenced by `WebdriverBidiBrowsingContext`'s JSON-Schema
 * via the `definition` "ReloadParams".
 */
export interface ReloadParams {
  context: BrowsingContext;
  ignoreCache?: boolean;
  wait?: ReadinessState;
}
/**
 * This interface was referenced by `WebdriverBidiBrowsingContext`'s JSON-Schema
 * via the `definition` "TraverseHistoryParams".
 */
export interface TraverseHistoryParams {
  context: BrowsingContext;
  delta: number;
}
/**
 * This interface was referenced by `WebdriverBidiBrowsingContext`'s JSON-Schema
 * via the `definition` "GetTreeParams".
 */
export interface GetTreeParams {
  maxDepth?: number;
  root?: BrowsingContext;
}
/**
 * This interface was referenced by `WebdriverBidiBrowsingContext`'s JSON-Schema
 * via the `definition` "InfoListResult".
 */
export interface InfoListResult {
  contexts: Info[];
}
/**
 * This interface was referenced by `WebdriverBidiBrowsingContext`'s JSON-Schema
 * via the `definition` "Info".
 */
export interface Info {
  context: BrowsingContext;
  url: string;
  parent?: BrowsingContext;
  children: Info[];
  userContext?: string;
  originalOpener?: BrowsingContext;
}
/**
 * This interface was referenced by `WebdriverBidiBrowsingContext`'s JSON-Schema
 * via the `definition` "SetViewportParams".
 */
export interface SetViewportParams {
  context: BrowsingContext;
  viewport?: {
    width: number;
    height: number;
  };
  devicePixelRatio?: number;
}
/**
 * This interface was referenced by `WebdriverBidiBrowsingContext`'s JSON-Schema
 * via the `definition` "PrintParams".
 */
export interface PrintParams {
  context: BrowsingContext;
  background?: boolean;
  orientation?: "portrait" | "landscape";
  page?: {
    width?: number;
    height?: number;
  };
  margin?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  pageRanges?: unknown[];
  scale?: number;
  shrinkToFit?: boolean;
}
/**
 * This interface was referenced by `WebdriverBidiBrowsingContext`'s JSON-Schema
 * via the `definition` "PrintResult".
 */
export interface PrintResult {
  data: string;
}
