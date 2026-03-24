import type {
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
			const builder = new Builder();
			if (params.capabilities?.browserName) {
				builder.forBrowser(params.capabilities.browserName);
			}
			const driver = await builder.build();
			ctx.setDriver(driver);
			const session = await driver.getSession();
			return { sessionId: session.getId() };
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
