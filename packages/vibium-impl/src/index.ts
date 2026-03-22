import { createDriver, type Driver } from "@michaelhly.webdriver-interop/c11y";
import { createVibiumContext } from "./context.js";
import { createSessionHandlers } from "./session.js";
import { createNavigationHandlers } from "./navigation.js";
import { createElementHandlers } from "./element.js";
import { createScriptHandlers } from "./script.js";
import { createCookieHandlers } from "./cookie.js";
import { createWindowHandlers } from "./window.js";
import { createScreenshotHandlers } from "./screenshot.js";
import { createAlertHandlers, createAlertState } from "./alert.js";

export function createBidiDriver(): Driver {
	const ctx = createVibiumContext();
	const alertState = createAlertState();

	return createDriver({
		protocol: "webdriver-bidi",
		session: createSessionHandlers(ctx),
		navigation: createNavigationHandlers(ctx),
		element: createElementHandlers(ctx),
		script: createScriptHandlers(ctx),
		cookie: createCookieHandlers(ctx),
		window: createWindowHandlers(ctx),
		screenshot: createScreenshotHandlers(ctx),
		alert: createAlertHandlers(ctx, alertState),
	});
}
