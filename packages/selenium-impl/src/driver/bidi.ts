import {
	type BidiDriver,
	createBidiDriver,
} from "@michaelhly.webdriver-c11y/schema";
import {
	createBidiBrowserHandlers,
	createBidiBrowsingContextHandlers,
	createBidiInputHandlers,
	createBidiLogHandlers,
	createBidiNetworkHandlers,
	createBidiScriptHandlers,
	createBidiStorageHandlers,
} from "../bidi/index.js";
import type { ClassicContext } from "../context.js";
import { createContext } from "../context.js";

export function buildBidiComponents(ctx: ClassicContext) {
	return {
		browsingContext: createBidiBrowsingContextHandlers(ctx),
		network: createBidiNetworkHandlers(ctx),
		script: createBidiScriptHandlers(ctx),
		log: createBidiLogHandlers(ctx),
		input: createBidiInputHandlers(ctx),
		storage: createBidiStorageHandlers(ctx),
		browser: createBidiBrowserHandlers(ctx),
	};
}

export function createSeleniumBidiDriver(): BidiDriver {
	const ctx = createContext();
	return createBidiDriver({
		protocol: "webdriver",
		...buildBidiComponents(ctx),
	});
}
