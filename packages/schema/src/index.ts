// Generated types — derived from JSON Schema via json-schema-to-typescript

// Functional driver interface
export {
	type AlertHandlers,
	type CookieHandlers,
	createDriver,
	type Driver,
	type DriverComponents,
	type ElementHandlers,
	type NavigationHandlers,
	type Protocol,
	type ScreenshotHandlers,
	type ScriptHandlers,
	type SessionHandlers,
	type WindowHandlers,
} from "./driver.js";
// Error types
export {
	DriverError,
	ElementNotInteractableError,
	InvalidSelectorError,
	NoSuchAlertError,
	NoSuchElementError,
	NoSuchWindowError,
	ScriptTimeoutError,
	SessionNotCreatedError,
	StaleElementReferenceError,
	TimeoutError,
	UnsupportedOperationError,
} from "./errors.js";
export type {
	AlertTextResult,
	SendAlertTextParams,
} from "./generated/alert.js";
export type {
	AddCookieParams,
	Cookie,
	DeleteCookieParams,
	GetAllCookiesResult,
	GetCookieParams,
	GetCookieResult,
} from "./generated/cookie.js";
export type {
	AttributeResult,
	BooleanResult,
	CssValueResult,
	ElementIdParams,
	FindElementParams,
	FindElementResult,
	FindElementsResult,
	GetAttributeParams,
	GetCssValueParams,
	GetPropertyParams,
	Locator,
	LocatorStrategy,
	PropertyResult,
	ScreenshotResult,
	SendKeysParams,
	TagNameResult,
	TextResult,
} from "./generated/element.js";
export type {
	GetCurrentUrlResult,
	GetPageSourceResult,
	GetTitleResult,
	NavigateParams,
} from "./generated/navigation.js";
export type { TakeScreenshotParams } from "./generated/screenshot.js";
export type { ExecuteScriptParams, ScriptResult } from "./generated/script.js";
export type {
	Capabilities,
	NewSessionParams,
	NewSessionResult,
} from "./generated/session.js";
export type { Rect, SetWindowRectParams } from "./generated/window.js";
