import type { V3Options } from "@browserbasehq/stagehand";
import {
	type ClassicDriver,
	createClassicDriver,
} from "@michaelhly.webdriver-c11y/schemas";
import { createActionHandlers } from "../components/action.js";
import { createAlertHandlers } from "../components/alert.js";
import type { StagehandContext } from "../components/context.js";
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

export function buildClassicComponents(
	ctx: StagehandContext,
	stagehandOptions: Partial<V3Options> = {},
) {
	return {
		session: createSessionHandlers(ctx, stagehandOptions),
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

export function createStagehandClassicDriver(
	stagehandOptions: Partial<V3Options> = {},
): ClassicDriver {
	const ctx = createContext();
	return createClassicDriver({
		protocol: "cdp",
		...buildClassicComponents(ctx, stagehandOptions),
	});
}
