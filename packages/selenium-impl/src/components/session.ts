import type {
	Capabilities,
	SessionHandlers,
	Timeouts,
} from "@michaelhly.webdriver-c11y/schemas";
import { Builder } from "selenium-webdriver";
import type { ClassicContext } from "./context.js";

export function createSessionHandlers(ctx: ClassicContext): SessionHandlers {
	return {
		async status() {
			try {
				ctx.getDriver();
				return { ready: true, message: "Session is active" };
			} catch {
				return { ready: false, message: "No active session" };
			}
		},
		async newSession(params) {
			const alwaysMatch = params.capabilities?.alwaysMatch ?? {};
			const firstMatch = params.capabilities?.firstMatch ?? [{}];

			// Merge alwaysMatch with first firstMatch entry (W3C §7.1 processing)
			const merged = { ...alwaysMatch, ...firstMatch[0] };

			const builder = new Builder();

			// Set browser via forBrowser for selenium's internal driver routing
			if (merged.browserName) {
				builder.forBrowser(merged.browserName);
			}

			// Apply all capabilities including vendor extensions (e.g. "goog:chromeOptions")
			builder.withCapabilities(merged);

			const driver = await builder.build();
			ctx.setDriver(driver);

			const session = await driver.getSession();
			const matchedCaps = session.getCapabilities();

			// Extract matched capabilities from the session
			const capabilities: Capabilities = {};
			for (const key of matchedCaps.keys()) {
				(capabilities as Record<string, unknown>)[key] = matchedCaps.get(key);
			}

			return { sessionId: session.getId(), capabilities };
		},
		async deleteSession() {
			await ctx.getDriver().quit();
			ctx.clearDriver();
		},
		async getTimeouts() {
			const driver = ctx.getDriver();
			const raw = await driver.manage().getTimeouts();
			const result: Timeouts = {};
			result.script = raw.script ?? null;
			if (raw.pageLoad !== undefined) result.pageLoad = raw.pageLoad;
			if (raw.implicit !== undefined) result.implicit = raw.implicit;
			return result;
		},
		async setTimeouts(params) {
			await ctx
				.getDriver()
				.manage()
				.setTimeouts({
					script: params.script ?? undefined,
					pageLoad: params.pageLoad,
					implicit: params.implicit,
				});
		},
	};
}
