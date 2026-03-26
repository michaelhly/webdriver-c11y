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
import type { OptionsBuilder } from "../options/builder.js";

export type SeleniumDriverOptions<TOptions> = Record<
	string,
	OptionsBuilder<TOptions>
>;

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

export function applyBrowserOptions<TOptions>(
	ctx: ClassicContext,
	options: SeleniumDriverOptions<TOptions>,
): void {
	for (const [, builder] of Object.entries(options)) {
		ctx.browserOptions.set(builder.vendor, builder.build());
	}
}

export function createSeleniumClassicDriver<TOptions>(
	options?: SeleniumDriverOptions<TOptions>,
): ClassicDriver {
	const ctx = createContext();
	if (options) applyBrowserOptions(ctx, options);
	return createClassicDriver({
		protocol: "webdriver",
		...buildClassicComponents(ctx),
	});
}
