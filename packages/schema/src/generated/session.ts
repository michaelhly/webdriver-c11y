// -----------------------------------------------------------------------
// AUTO-GENERATED from JSON Schema files in json/
// Do not edit manually — run `pnpm generate` to regenerate.
// -----------------------------------------------------------------------

/**
 * This interface was referenced by `WebdriverSession`'s JSON-Schema
 * via the `definition` "Capabilities".
 */
export interface Capabilities {
	browserName?: "chrome" | "firefox" | "edge" | "safari";
	headless?: boolean;
	executablePath?: string;
	args?: string[];
}
/**
 * This interface was referenced by `WebdriverSession`'s JSON-Schema
 * via the `definition` "NewSessionParams".
 */
export interface NewSessionParams {
	capabilities?: Capabilities;
}
/**
 * This interface was referenced by `WebdriverSession`'s JSON-Schema
 * via the `definition` "NewSessionResult".
 */
export interface NewSessionResult {
	sessionId: string;
}
