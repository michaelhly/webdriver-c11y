import type { Stagehand } from "@browserbasehq/stagehand";
import type { Driver } from "@michaelhly.webdriver-interop/c11y";
import { createDriver } from "@michaelhly.webdriver-interop/c11y";
import { createAlertHandlers } from "./alert.js";
import { createCookieHandlers } from "./cookie.js";
import { createElementHandlers } from "./element.js";
import { createNavigationHandlers } from "./navigation.js";
import { createScreenshotHandlers } from "./screenshot.js";
import { createScriptHandlers } from "./script.js";
import { createSessionHandlers } from "./session.js";
import type { StagehandContext } from "./compat/context.js";
import { createWindowHandlers } from "./window.js";

export function createStagehandDriver(stagehand: Stagehand): Driver {
	const ctx: StagehandContext = {
		stagehand,
		elements: new Map(),
		dialog: null,
		sessionId: null,
	};

	return createDriver({
		protocol: "cdp",
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

export { createSessionHandlers } from "./session.js";
export { createNavigationHandlers } from "./navigation.js";
export { createElementHandlers } from "./element.js";
export { createScriptHandlers } from "./script.js";
export { createCookieHandlers } from "./cookie.js";
export { createWindowHandlers } from "./window.js";
export { createScreenshotHandlers } from "./screenshot.js";
export { createAlertHandlers } from "./alert.js";
export type { StagehandContext } from "./compat/context.js";
