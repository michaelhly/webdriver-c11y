import {
	type ClassicDriver,
	createClassicDriver,
} from "@michaelhly.webdriver-c11y/schema";
import { createActionHandlers } from "../action.js";
import { createAlertHandlers } from "../alert.js";
import type { ClassicContext } from "../context.js";
import { createContext } from "../context.js";
import { createContextHandlers } from "../context-handlers.js";
import { createCookieHandlers } from "../cookie.js";
import { createElementHandlers } from "../element.js";
import { createNavigationHandlers } from "../navigation.js";
import { createPrintHandlers } from "../print.js";
import { createScreenshotHandlers } from "../screenshot.js";
import { createScriptHandlers } from "../script.js";
import { createSessionHandlers } from "../session.js";
import { createWindowHandlers } from "../window.js";

export function buildClassicComponents(ctx: ClassicContext) {
	return {
		session: createSessionHandlers(ctx),
		navigation: createNavigationHandlers(ctx),
		context: createContextHandlers(ctx),
		element: createElementHandlers(ctx),
		script: createScriptHandlers(ctx),
		cookie: createCookieHandlers(ctx),
		window: createWindowHandlers(ctx),
		action: createActionHandlers(ctx),
		screenshot: createScreenshotHandlers(ctx),
		print: createPrintHandlers(ctx),
		alert: createAlertHandlers(ctx),
	};
}

export function createSeleniumClassicDriver(): ClassicDriver {
	const ctx = createContext();
	return createClassicDriver({
		protocol: "webdriver",
		...buildClassicComponents(ctx),
	});
}
