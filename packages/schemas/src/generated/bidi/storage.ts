// -----------------------------------------------------------------------
// AUTO-GENERATED from JSON Schema files in json/
// Do not edit manually — run `pnpm generate` to regenerate.
// -----------------------------------------------------------------------

/**
 * This interface was referenced by `WebdriverBidiStorage`'s JSON-Schema
 * via the `definition` "PartitionKey".
 */
export interface PartitionKey {
  userContext?: string;
  sourceOrigin?: string;
}
/**
 * This interface was referenced by `WebdriverBidiStorage`'s JSON-Schema
 * via the `definition` "CookieFilter".
 */
export interface CookieFilter {
  name?: string;
  domain?: string;
  path?: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  size?: number;
  value?: {
    type: "string" | "base64";
    value: string;
  };
}
/**
 * This interface was referenced by `WebdriverBidiStorage`'s JSON-Schema
 * via the `definition` "PartitionDescriptor".
 */
export interface PartitionDescriptor {
  type: "context" | "storageKey";
  context?: string;
  userContext?: string;
  sourceOrigin?: string;
}
/**
 * This interface was referenced by `WebdriverBidiStorage`'s JSON-Schema
 * via the `definition` "GetCookiesParams".
 */
export interface GetCookiesParams {
  filter?: CookieFilter;
  partition?: PartitionDescriptor;
}
/**
 * This interface was referenced by `WebdriverBidiStorage`'s JSON-Schema
 * via the `definition` "GetCookiesResult".
 */
export interface GetCookiesResult {
  cookies: unknown[];
  partitionKey: PartitionKey;
}
/**
 * This interface was referenced by `WebdriverBidiStorage`'s JSON-Schema
 * via the `definition` "SetCookieParams".
 */
export interface SetCookieParams {
  cookie: {
    name: string;
    value: {
      type: "string" | "base64";
      value: string;
    };
    domain: string;
    path?: string;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
    expiry?: number;
  };
  partition?: PartitionDescriptor;
}
/**
 * This interface was referenced by `WebdriverBidiStorage`'s JSON-Schema
 * via the `definition` "SetCookieResult".
 */
export interface SetCookieResult {
  partitionKey: PartitionKey;
}
/**
 * This interface was referenced by `WebdriverBidiStorage`'s JSON-Schema
 * via the `definition` "DeleteCookiesParams".
 */
export interface DeleteCookiesParams {
  filter?: CookieFilter;
  partition?: PartitionDescriptor;
}
/**
 * This interface was referenced by `WebdriverBidiStorage`'s JSON-Schema
 * via the `definition` "DeleteCookiesResult".
 */
export interface DeleteCookiesResult {
  partitionKey: PartitionKey;
}
