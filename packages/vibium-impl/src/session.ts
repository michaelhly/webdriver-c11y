import { browser } from "vibium";
import type { SessionHandlers } from "@michaelhly.webdriver-interop/c11y";
import type { VibiumContext } from "./context.js";

let sessionCounter = 0;

export function createSessionHandlers(ctx: VibiumContext): SessionHandlers {
	return {
		async newSession(params) {
			const opts: Record<string, unknown> = {};
			if (params.capabilities?.headless !== undefined)
				opts.headless = params.capabilities.headless;
			if (params.capabilities?.executablePath !== undefined)
				opts.executablePath = params.capabilities.executablePath;
			if (params.capabilities?.args !== undefined)
				opts.args = params.capabilities.args;

			const bro = await browser.start(opts);
			ctx.setBrowser(bro);

			const bctx = await bro.newContext();
			ctx.setContext(bctx);

			const page = await bro.page();
			ctx.setPage(page);

			return { sessionId: `bidi-${String(sessionCounter++)}` };
		},
		async deleteSession() {
			await ctx.getBrowser().stop();
			ctx.clear();
		},
	};
}
