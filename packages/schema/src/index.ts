// Generated types — derived from JSON Schema via json-schema-to-typescript
export type { SendAlertTextParams, AlertTextResult } from "./generated/alert.js";
export type {
	Cookie,
	GetCookieParams,
	GetAllCookiesResult,
	GetCookieResult,
	AddCookieParams,
	DeleteCookieParams,
} from "./generated/cookie.js";
export type {
	LocatorStrategy,
	Locator,
	FindElementParams,
	FindElementResult,
	FindElementsResult,
	ElementIdParams,
	SendKeysParams,
	GetAttributeParams,
	GetPropertyParams,
	GetCssValueParams,
	TextResult,
	AttributeResult,
	PropertyResult,
	CssValueResult,
	TagNameResult,
	BooleanResult,
	ScreenshotResult,
} from "./generated/element.js";
export type {
	NavigateParams,
	GetCurrentUrlResult,
	GetTitleResult,
	GetPageSourceResult,
} from "./generated/navigation.js";
export type { TakeScreenshotParams } from "./generated/screenshot.js";
export type { ExecuteScriptParams, ScriptResult } from "./generated/script.js";
export type {
	Capabilities,
	NewSessionParams,
	NewSessionResult,
} from "./generated/session.js";
export type { Rect, SetWindowRectParams } from "./generated/window.js";

// Functional driver interface
export {
	type Protocol,
	type SessionHandlers,
	type NavigationHandlers,
	type ElementHandlers,
	type ScriptHandlers,
	type CookieHandlers,
	type WindowHandlers,
	type ScreenshotHandlers,
	type AlertHandlers,
	type Driver,
	type DriverComponents,
	createDriver,
} from "./driver.js";

// Error types
export {
	DriverError,
	SessionNotCreatedError,
	NoSuchElementError,
	StaleElementReferenceError,
	ElementNotInteractableError,
	NoSuchAlertError,
	NoSuchWindowError,
	ScriptTimeoutError,
	TimeoutError,
	InvalidSelectorError,
	UnsupportedOperationError,
} from "./errors.js";
