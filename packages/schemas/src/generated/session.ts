// -----------------------------------------------------------------------
// AUTO-GENERATED from JSON Schema files in json/
// Do not edit manually — run `pnpm generate` to regenerate.
// -----------------------------------------------------------------------

/**
 * This interface was referenced by `WebdriverSession`'s JSON-Schema
 * via the `definition` "ProxyConfiguration".
 */
export interface ProxyConfiguration {
  proxyType?: "pac" | "direct" | "autodetect" | "system" | "manual";
  proxyAutoconfigUrl?: string;
  ftpProxy?: string;
  httpProxy?: string;
  noProxy?: string[];
  sslProxy?: string;
  socksProxy?: string;
  socksVersion?: number;
}
/**
 * This interface was referenced by `WebdriverSession`'s JSON-Schema
 * via the `definition` "Capabilities".
 */
export interface Capabilities {
  browserName?: string;
  browserVersion?: string;
  platformName?: string;
  acceptInsecureCerts?: boolean;
  pageLoadStrategy?: "none" | "eager" | "normal";
  proxy?: ProxyConfiguration;
  timeouts?: Timeouts;
  strictFileInteractability?: boolean;
  unhandledPromptBehavior?:
    | "dismiss"
    | "accept"
    | "dismiss and notify"
    | "accept and notify"
    | "ignore";
  userAgent?: string;
  [k: string]: unknown;
}
/**
 * This interface was referenced by `WebdriverSession`'s JSON-Schema
 * via the `definition` "Timeouts".
 */
export interface Timeouts {
  script?: number | null;
  pageLoad?: number;
  implicit?: number;
}
/**
 * This interface was referenced by `WebdriverSession`'s JSON-Schema
 * via the `definition` "CapabilitiesRequest".
 */
export interface CapabilitiesRequest {
  alwaysMatch?: Capabilities;
  /**
   * @minItems 1
   */
  firstMatch?: [Capabilities, ...Capabilities[]];
}
/**
 * This interface was referenced by `WebdriverSession`'s JSON-Schema
 * via the `definition` "NewSessionParams".
 */
export interface NewSessionParams {
  capabilities?: CapabilitiesRequest;
}
/**
 * This interface was referenced by `WebdriverSession`'s JSON-Schema
 * via the `definition` "NewSessionResult".
 */
export interface NewSessionResult {
  sessionId: string;
  capabilities: Capabilities;
}
/**
 * This interface was referenced by `WebdriverSession`'s JSON-Schema
 * via the `definition` "StatusResult".
 */
export interface StatusResult {
  ready: boolean;
  message: string;
}
