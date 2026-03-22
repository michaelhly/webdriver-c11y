// -----------------------------------------------------------------------
// AUTO-GENERATED from JSON Schema files in schema/
// Do not edit manually — run `pnpm generate` to regenerate.
// -----------------------------------------------------------------------
export interface AddCookieParams {
	cookie: Cookie;
}

export interface Cookie {
	domain?: string;
	expiry?: number;
	httpOnly?: boolean;
	name: string;
	path?: string;
	sameSite?: SameSite;
	secure?: boolean;
	value: string;
}

export type SameSite = "Strict" | "Lax" | "None";

export interface AlertTextResult {
	text: string;
}

export interface AttributeResult {
	value: null | string;
}

export interface BooleanResult {
	value: boolean;
}

export interface Capabilities {
	args?: string[];
	browserName?: BrowserName;
	executablePath?: string;
	headless?: boolean;
}

export type BrowserName = "chrome" | "firefox" | "edge" | "safari";

export interface CssValueResult {
	value: string;
}

export interface DeleteCookieParams {
	name: string;
}

export interface ElementIdParams {
	elementId: string;
}

export interface ExecuteScriptParams {
	args?: any[];
	script: string;
}

export interface FindElementParams {
	fromElement?: string;
	locator: Locator;
}

export interface Locator {
	using: LocatorStrategy;
	value: string;
}

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

export interface FindElementResult {
	elementId: string;
}

export interface FindElementsResult {
	elementIds: string[];
}

export interface GetAllCookiesResult {
	cookies: Cookie[];
}

export interface GetAttributeParams {
	elementId: string;
	name: string;
}

export interface GetCookieParams {
	name: string;
}

export interface GetCookieResult {
	cookie: Cookie;
}

export interface GetCssValueParams {
	elementId: string;
	propertyName: string;
}

export interface GetCurrentUrlResult {
	url: string;
}

export interface GetPageSourceResult {
	source: string;
}

export interface GetPropertyParams {
	elementId: string;
	name: string;
}

export interface GetTitleResult {
	title: string;
}

export interface NavigateParams {
	url: string;
}

export interface NewSessionParams {
	capabilities?: Capabilities;
}

export interface NewSessionResult {
	sessionId: string;
}

export interface PropertyResult {
	value: any;
}

export interface Rect {
	height: number;
	width: number;
	x: number;
	y: number;
}

export interface ScreenshotResult {
	data: string;
}

export interface ScriptResult {
	value: any;
}

export interface SendAlertTextParams {
	text: string;
}

export interface SendKeysParams {
	elementId: string;
	text: string;
}

export interface SetWindowRectParams {
	height?: number;
	width?: number;
	x?: number;
	y?: number;
}

export interface TagNameResult {
	tagName: string;
}

export interface TakeScreenshotParams {
	fullPage?: boolean;
}

export interface TextResult {
	text: string;
}
