import { createDriver, type Driver } from "@michaelhly.webdriver-interop/c11y";
import { createContext } from "./context.js";
import { createSessionHandlers } from "./session.js";
import { createNavigationHandlers } from "./navigation.js";
import { createElementHandlers } from "./element.js";
import { createScriptHandlers } from "./script.js";
import { createCookieHandlers } from "./cookie.js";
import { createWindowHandlers } from "./window.js";
import { createScreenshotHandlers } from "./screenshot.js";
import { createAlertHandlers } from "./alert.js";

export function createClassicDriver(): Driver {
	const ctx = createContext();
	return createDriver({
		protocol: "webdriver-classic",
		session: createSessionHandlers(ctx),
		navigation: createNavigationHandlers(ctx),
		element: createElementHandlers(ctx),
		script: createScriptHandlers(ctx),
		cookie: createCookieHandlers(ctx),
		window: createWindowHandlers(ctx),
		screenshot: createScreenshotHandlers(ctx),
		alert: createAlertHandlers(ctx),
	});
}
