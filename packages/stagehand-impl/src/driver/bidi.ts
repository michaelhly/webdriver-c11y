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
} from "../components/bidi/index.js";
import type { StagehandContext } from "../components/context.js";
import { createContext } from "../components/context.js";

export function buildBidiComponents(ctx: StagehandContext) {
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

export function createStagehandBidiDriver(): BidiDriver {
	const ctx = createContext();
	return createBidiDriver({
		protocol: "cdp",
		...buildBidiComponents(ctx),
	});
}
