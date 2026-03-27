// -----------------------------------------------------------------------
// AUTO-GENERATED from JSON Schema files in json/
// Do not edit manually — run `pnpm generate` to regenerate.
// -----------------------------------------------------------------------

/**
 * This interface was referenced by `WebdriverBidiLog`'s JSON-Schema
 * via the `definition` "LogLevel".
 */
export type LogLevel = "debug" | "info" | "warn" | "error";

/**
 * This interface was referenced by `WebdriverBidiLog`'s JSON-Schema
 * via the `definition` "StackFrame".
 */
export interface StackFrame {
  columnNumber: number;
  functionName: string;
  lineNumber: number;
  url: string;
}
/**
 * This interface was referenced by `WebdriverBidiLog`'s JSON-Schema
 * via the `definition` "StackTrace".
 */
export interface StackTrace {
  callFrames: StackFrame[];
}
/**
 * This interface was referenced by `WebdriverBidiLog`'s JSON-Schema
 * via the `definition` "LogEntry".
 */
export interface LogEntry {
  level: LogLevel;
  source: {
    realm: string;
    context?: string;
  };
  text?: string;
  timestamp: number;
  stackTrace?: StackTrace;
  type: "console" | "javascript";
  method?: string;
  args?: unknown[];
}
