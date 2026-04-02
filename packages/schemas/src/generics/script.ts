// ---------------------------------------------------------------------------
// Script params that accept JS functions in addition to plain strings.
// The generated ExecuteScriptParams (wire format) only allows strings;
// this module widens the public API so callers can pass functions directly.
// ---------------------------------------------------------------------------
import type { ExecuteScriptParams as GeneratedExecuteScriptParams } from "../generated/script.js";

/**
 * A script expression — either a plain code string or a JS function.
 *
 * When a function is provided it is serialised via `Function.prototype.toString()`
 * and wrapped as `return (${fn}).apply(null, arguments)` before being sent
 * over the WebDriver wire protocol.
 */
export type ScriptExpression<R = unknown> =
  | GeneratedExecuteScriptParams["script"]
  | ((...args: unknown[]) => R | Promise<R>);

export interface ExecuteScriptParams<R = unknown> {
  script: ScriptExpression<R>;
  args?: GeneratedExecuteScriptParams["args"];
}

export interface ScriptResult<R = unknown> {
  value: R;
}
