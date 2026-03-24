import type {
	AlertTextResult,
	SendAlertTextParams,
} from "./generated/alert.js";
import type {
	AddCookieParams,
	DeleteCookieParams,
	GetAllCookiesResult,
	GetCookieParams,
	GetCookieResult,
} from "./generated/cookie.js";
import type {
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
	PropertyResult,
	ScreenshotResult,
	SendKeysParams,
	TagNameResult,
	TextResult,
} from "./generated/element.js";
import type {
	GetCurrentUrlResult,
	GetPageSourceResult,
	GetTitleResult,
	NavigateParams,
} from "./generated/navigation.js";
import type { TakeScreenshotParams } from "./generated/screenshot.js";
import type { ExecuteScriptParams, ScriptResult } from "./generated/script.js";
import type {
	NewSessionParams,
	NewSessionResult,
} from "./generated/session.js";
import type { Rect, SetWindowRectParams } from "./generated/window.js";

// ---------------------------------------------------------------------------
// Functional handler groups — each domain is an independent composable unit.
// Implementations provide factory functions that return these handler records.
// ---------------------------------------------------------------------------

export interface SessionHandlers {
	newSession: (params: NewSessionParams) => Promise<NewSessionResult>;
	deleteSession: () => Promise<void>;
}

export interface NavigationHandlers {
	navigateTo: (params: NavigateParams) => Promise<void>;
	getCurrentUrl: () => Promise<GetCurrentUrlResult>;
	getTitle: () => Promise<GetTitleResult>;
	getPageSource: () => Promise<GetPageSourceResult>;
	back: () => Promise<void>;
	forward: () => Promise<void>;
	refresh: () => Promise<void>;
}

export interface ElementHandlers {
	findElement: (params: FindElementParams) => Promise<FindElementResult>;
	findElements: (params: FindElementParams) => Promise<FindElementsResult>;
	elementClick: (params: ElementIdParams) => Promise<void>;
	elementSendKeys: (params: SendKeysParams) => Promise<void>;
	elementClear: (params: ElementIdParams) => Promise<void>;
	elementGetText: (params: ElementIdParams) => Promise<TextResult>;
	elementGetAttribute: (params: GetAttributeParams) => Promise<AttributeResult>;
	elementGetProperty: (params: GetPropertyParams) => Promise<PropertyResult>;
	elementGetCssValue: (params: GetCssValueParams) => Promise<CssValueResult>;
	elementGetTagName: (params: ElementIdParams) => Promise<TagNameResult>;
	elementGetRect: (params: ElementIdParams) => Promise<Rect>;
	elementIsDisplayed: (params: ElementIdParams) => Promise<BooleanResult>;
	elementIsEnabled: (params: ElementIdParams) => Promise<BooleanResult>;
	elementIsSelected: (params: ElementIdParams) => Promise<BooleanResult>;
	elementTakeScreenshot: (params: ElementIdParams) => Promise<ScreenshotResult>;
}

export interface ScriptHandlers {
	executeScript: (params: ExecuteScriptParams) => Promise<ScriptResult>;
	executeAsyncScript: (params: ExecuteScriptParams) => Promise<ScriptResult>;
}

export interface CookieHandlers {
	getAllCookies: () => Promise<GetAllCookiesResult>;
	getCookie: (params: GetCookieParams) => Promise<GetCookieResult>;
	addCookie: (params: AddCookieParams) => Promise<void>;
	deleteCookie: (params: DeleteCookieParams) => Promise<void>;
	deleteAllCookies: () => Promise<void>;
}

export interface WindowHandlers {
	getWindowRect: () => Promise<Rect>;
	setWindowRect: (params: SetWindowRectParams) => Promise<Rect>;
	maximizeWindow: () => Promise<Rect>;
	minimizeWindow: () => Promise<Rect>;
	fullscreenWindow: () => Promise<Rect>;
}

export interface ScreenshotHandlers {
	takeScreenshot: (params: TakeScreenshotParams) => Promise<ScreenshotResult>;
}

export interface AlertHandlers {
	getAlertText: () => Promise<AlertTextResult>;
	acceptAlert: () => Promise<void>;
	dismissAlert: () => Promise<void>;
	sendAlertText: (params: SendAlertTextParams) => Promise<void>;
}

// ---------------------------------------------------------------------------
// Protocol identifier — distinguishes the underlying implementation.
// ---------------------------------------------------------------------------

export type Protocol = "webdriver-classic" | "webdriver-bidi";

// ---------------------------------------------------------------------------
// Driver — the complete functional interface, composed from handler groups.
// ---------------------------------------------------------------------------

export type Driver = { readonly protocol: Protocol } & SessionHandlers &
	NavigationHandlers &
	ElementHandlers &
	ScriptHandlers &
	CookieHandlers &
	WindowHandlers &
	ScreenshotHandlers &
	AlertHandlers;

// ---------------------------------------------------------------------------
// createDriver — assemble a Driver from individual handler groups.
//
// Usage in selenium-impl:
//
//   const driver = createDriver({
//     session:    createSessionHandlers(webDriver),
//     navigation: createNavigationHandlers(webDriver),
//     element:    createElementHandlers(webDriver),
//     ...
//   });
// ---------------------------------------------------------------------------

export interface DriverComponents {
	protocol: Protocol;
	session: SessionHandlers;
	navigation: NavigationHandlers;
	element: ElementHandlers;
	script: ScriptHandlers;
	cookie: CookieHandlers;
	window: WindowHandlers;
	screenshot: ScreenshotHandlers;
	alert: AlertHandlers;
}

export function createDriver(components: DriverComponents): Driver {
	return {
		protocol: components.protocol,
		...components.session,
		...components.navigation,
		...components.element,
		...components.script,
		...components.cookie,
		...components.window,
		...components.screenshot,
		...components.alert,
	};
}
