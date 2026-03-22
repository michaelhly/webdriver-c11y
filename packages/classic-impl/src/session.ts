import { Builder } from "selenium-webdriver";
import type { SessionHandlers } from "@michaelhly.webdriver-interop/c11y";
import type { ClassicContext } from "./context.js";

export function createSessionHandlers(ctx: ClassicContext): SessionHandlers {
	return {
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
	};
}
