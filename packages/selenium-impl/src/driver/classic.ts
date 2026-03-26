import {
	type ClassicDriver,
	createClassicDriver,
} from "@michaelhly.webdriver-c11y/schemas";
import { createActionHandlers } from "../components/action.js";
import { createAlertHandlers } from "../components/alert.js";
import type { ClassicContext } from "../components/context.js";
import { createContext } from "../components/context.js";
import { createContextHandlers } from "../components/context-handlers.js";
import { createCookieHandlers } from "../components/cookie.js";
import { createElementHandlers } from "../components/element.js";
import { createNavigationHandlers } from "../components/navigation.js";
import { createPrintHandlers } from "../components/print.js";
import { createScreenshotHandlers } from "../components/screenshot.js";
import { createScriptHandlers } from "../components/script.js";
import { createSessionHandlers } from "../components/session.js";
import { createWindowHandlers } from "../components/window.js";
import type { ChromeOptionsBuilder } from "../options/chrome.js";
import type { EdgeOptionsBuilder } from "../options/edge.js";
import type { FirefoxOptionsBuilder } from "../options/firefox.js";
import type { SafariOptionsBuilder } from "../options/safari.js";

export interface SeleniumDriverOptions {
	chrome?: ChromeOptionsBuilder;
	firefox?: FirefoxOptionsBuilder;
	edge?: EdgeOptionsBuilder;
	safari?: SafariOptionsBuilder;
}

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

export function applyBrowserOptions(
	ctx: ClassicContext,
	options: SeleniumDriverOptions,
): void {
	if (options.chrome) ctx.browserOptions.chrome = options.chrome.build();
	if (options.firefox) ctx.browserOptions.firefox = options.firefox.build();
	if (options.edge) ctx.browserOptions.edge = options.edge.build();
	if (options.safari) ctx.browserOptions.safari = options.safari.build();
}

export function createSeleniumClassicDriver(
	options?: SeleniumDriverOptions,
): ClassicDriver {
	const ctx = createContext();
	if (options) applyBrowserOptions(ctx, options);
	return createClassicDriver({
		protocol: "webdriver",
		...buildClassicComponents(ctx),
	});
}
