// -----------------------------------------------------------------------
// AUTO-GENERATED from JSON Schema files in json/
// Do not edit manually — run `pnpm generate` to regenerate.
// -----------------------------------------------------------------------

/**
 * This interface was referenced by `WebdriverPrint`'s JSON-Schema
 * via the `definition` "PrintParams".
 */
export interface PrintParams {
	orientation?: "portrait" | "landscape";
	scale?: number;
	background?: boolean;
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
	shrinkToFit?: boolean;
}
/**
 * This interface was referenced by `WebdriverPrint`'s JSON-Schema
 * via the `definition` "PrintResult".
 */
export interface PrintResult {
	data: string;
}
