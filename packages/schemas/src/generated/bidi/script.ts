// -----------------------------------------------------------------------
// AUTO-GENERATED from JSON Schema files in json/
// Do not edit manually — run `pnpm generate` to regenerate.
// -----------------------------------------------------------------------

/**
 * This interface was referenced by `WebdriverBidiScript`'s JSON-Schema
 * via the `definition` "ResultOwnership".
 */
export type ResultOwnership = "root" | "none";
/**
 * This interface was referenced by `WebdriverBidiScript`'s JSON-Schema
 * via the `definition` "RealmType".
 */
export type RealmType =
  | "window"
  | "dedicated-worker"
  | "shared-worker"
  | "service-worker"
  | "worker"
  | "paint-worklet"
  | "audio-worklet";

/**
 * This interface was referenced by `WebdriverBidiScript`'s JSON-Schema
 * via the `definition` "Target".
 */
export interface Target {
  context?: string;
  sandbox?: string;
  realm?: string;
}
/**
 * This interface was referenced by `WebdriverBidiScript`'s JSON-Schema
 * via the `definition` "SerializationOptions".
 */
export interface SerializationOptions {
  maxDomDepth?: number;
  maxObjectDepth?: number;
  includeShadowTree?: "none" | "open" | "all";
}
/**
 * This interface was referenced by `WebdriverBidiScript`'s JSON-Schema
 * via the `definition` "RealmInfo".
 */
export interface RealmInfo {
  realm: string;
  origin: string;
  type: RealmType;
  context?: string;
  sandbox?: string;
}
/**
 * This interface was referenced by `WebdriverBidiScript`'s JSON-Schema
 * via the `definition` "EvaluateParams".
 */
export interface EvaluateParams {
  expression: string;
  target: Target;
  awaitPromise: boolean;
  resultOwnership?: ResultOwnership;
  serializationOptions?: SerializationOptions;
  userActivation?: boolean;
}
/**
 * This interface was referenced by `WebdriverBidiScript`'s JSON-Schema
 * via the `definition` "CallFunctionParams".
 */
export interface CallFunctionParams {
  functionDeclaration: string;
  target: Target;
  awaitPromise: boolean;
  arguments?: unknown[];
  this?: unknown;
  resultOwnership?: ResultOwnership;
  serializationOptions?: SerializationOptions;
  userActivation?: boolean;
}
/**
 * This interface was referenced by `WebdriverBidiScript`'s JSON-Schema
 * via the `definition` "AddPreloadScriptParams".
 */
export interface AddPreloadScriptParams {
  functionDeclaration: string;
  arguments?: unknown[];
  contexts?: string[];
  sandbox?: string;
}
/**
 * This interface was referenced by `WebdriverBidiScript`'s JSON-Schema
 * via the `definition` "AddPreloadScriptResult".
 */
export interface AddPreloadScriptResult {
  script: string;
}
/**
 * This interface was referenced by `WebdriverBidiScript`'s JSON-Schema
 * via the `definition` "RemovePreloadScriptParams".
 */
export interface RemovePreloadScriptParams {
  script: string;
}
/**
 * This interface was referenced by `WebdriverBidiScript`'s JSON-Schema
 * via the `definition` "GetRealmsParams".
 */
export interface GetRealmsParams {
  context?: string;
  type?: RealmType;
}
/**
 * This interface was referenced by `WebdriverBidiScript`'s JSON-Schema
 * via the `definition` "GetRealmsResult".
 */
export interface GetRealmsResult {
  realms: RealmInfo[];
}
/**
 * This interface was referenced by `WebdriverBidiScript`'s JSON-Schema
 * via the `definition` "DisownParams".
 */
export interface DisownParams {
  handles: string[];
  target: Target;
}
