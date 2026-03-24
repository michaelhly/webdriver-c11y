// -----------------------------------------------------------------------
// AUTO-GENERATED from JSON Schema files in json/
// Do not edit manually — run `pnpm generate` to regenerate.
// -----------------------------------------------------------------------

/**
 * This interface was referenced by `WebdriverElement`'s JSON-Schema
 * via the `definition` "LocatorStrategy".
 */
export type LocatorStrategy =
	| "css"
	| "xpath"
	| "id"
	| "name"
	| "tag-name"
	| "class-name"
	| "link-text"
	| "partial-link-text"
	| "text"
	| "role"
	| "label"
	| "placeholder";

/**
 * This interface was referenced by `WebdriverElement`'s JSON-Schema
 * via the `definition` "Locator".
 */
export interface Locator {
	using: LocatorStrategy;
	value: string;
}
/**
 * This interface was referenced by `WebdriverElement`'s JSON-Schema
 * via the `definition` "FindElementParams".
 */
export interface FindElementParams {
	locator: Locator;
	fromElement?: string;
}
/**
 * This interface was referenced by `WebdriverElement`'s JSON-Schema
 * via the `definition` "FindElementResult".
 */
export interface FindElementResult {
	elementId: string;
}
/**
 * This interface was referenced by `WebdriverElement`'s JSON-Schema
 * via the `definition` "FindElementsResult".
 */
export interface FindElementsResult {
	elementIds: string[];
}
/**
 * This interface was referenced by `WebdriverElement`'s JSON-Schema
 * via the `definition` "ElementIdParams".
 */
export interface ElementIdParams {
	elementId: string;
}
/**
 * This interface was referenced by `WebdriverElement`'s JSON-Schema
 * via the `definition` "SendKeysParams".
 */
export interface SendKeysParams {
	elementId: string;
	text: string;
}
/**
 * This interface was referenced by `WebdriverElement`'s JSON-Schema
 * via the `definition` "GetAttributeParams".
 */
export interface GetAttributeParams {
	elementId: string;
	name: string;
}
/**
 * This interface was referenced by `WebdriverElement`'s JSON-Schema
 * via the `definition` "GetPropertyParams".
 */
export interface GetPropertyParams {
	elementId: string;
	name: string;
}
/**
 * This interface was referenced by `WebdriverElement`'s JSON-Schema
 * via the `definition` "GetCssValueParams".
 */
export interface GetCssValueParams {
	elementId: string;
	propertyName: string;
}
/**
 * This interface was referenced by `WebdriverElement`'s JSON-Schema
 * via the `definition` "TextResult".
 */
export interface TextResult {
	text: string;
}
/**
 * This interface was referenced by `WebdriverElement`'s JSON-Schema
 * via the `definition` "AttributeResult".
 */
export interface AttributeResult {
	value: string | null;
}
/**
 * This interface was referenced by `WebdriverElement`'s JSON-Schema
 * via the `definition` "PropertyResult".
 */
export interface PropertyResult {
	value: unknown;
}
/**
 * This interface was referenced by `WebdriverElement`'s JSON-Schema
 * via the `definition` "CssValueResult".
 */
export interface CssValueResult {
	value: string;
}
/**
 * This interface was referenced by `WebdriverElement`'s JSON-Schema
 * via the `definition` "TagNameResult".
 */
export interface TagNameResult {
	tagName: string;
}
/**
 * This interface was referenced by `WebdriverElement`'s JSON-Schema
 * via the `definition` "BooleanResult".
 */
export interface BooleanResult {
	value: boolean;
}
/**
 * This interface was referenced by `WebdriverElement`'s JSON-Schema
 * via the `definition` "ScreenshotResult".
 */
export interface ScreenshotResult {
	data: string;
}
