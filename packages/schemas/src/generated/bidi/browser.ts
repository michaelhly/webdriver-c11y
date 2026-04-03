// -----------------------------------------------------------------------
// AUTO-GENERATED from JSON Schema files in json/
// Do not edit manually — run `pnpm generate` to regenerate.
// -----------------------------------------------------------------------

/**
 * Opaque user context ID
 *
 * This interface was referenced by `WebdriverBidiBrowser`'s JSON-Schema
 * via the `definition` "UserContext".
 */
export type UserContext = string;

/**
 * This interface was referenced by `WebdriverBidiBrowser`'s JSON-Schema
 * via the `definition` "UserContextInfo".
 */
export interface UserContextInfo {
  userContext: UserContext;
}
/**
 * This interface was referenced by `WebdriverBidiBrowser`'s JSON-Schema
 * via the `definition` "CreateUserContextResult".
 */
export interface CreateUserContextResult {
  userContext: UserContext;
}
/**
 * This interface was referenced by `WebdriverBidiBrowser`'s JSON-Schema
 * via the `definition` "GetUserContextsResult".
 */
export interface GetUserContextsResult {
  userContexts: UserContextInfo[];
}
/**
 * This interface was referenced by `WebdriverBidiBrowser`'s JSON-Schema
 * via the `definition` "RemoveUserContextParams".
 */
export interface RemoveUserContextParams {
  userContext: UserContext;
}
/**
 * This interface was referenced by `WebdriverBidiBrowser`'s JSON-Schema
 * via the `definition` "ClientWindowInfo".
 */
export interface ClientWindowInfo {
  clientWindow: string;
  state: "normal" | "minimized" | "maximized" | "fullscreen";
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
}
/**
 * This interface was referenced by `WebdriverBidiBrowser`'s JSON-Schema
 * via the `definition` "GetClientWindowsResult".
 */
export interface GetClientWindowsResult {
  clientWindows: ClientWindowInfo[];
}
/**
 * This interface was referenced by `WebdriverBidiBrowser`'s JSON-Schema
 * via the `definition` "SetClientWindowStateParams".
 */
export interface SetClientWindowStateParams {
  clientWindow: string;
  state?: "normal" | "minimized" | "maximized" | "fullscreen";
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}
