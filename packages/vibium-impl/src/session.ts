import { browser as vibiumBrowser } from "vibium";
import type { SessionHandlers } from "@michaelhly.webdriver-interop/c11y";
import type { BidiContext } from "./context.js";

let sessionCounter = 0;

export function createSessionHandlers(ctx: BidiContext): SessionHandlers {
	return {
		async newSession(params) {
			const opts: { headless?: boolean; executablePath?: string } = {};
			if (params.capabilities?.headless !== undefined) {
				opts.headless = params.capabilities.headless;
			}
			if (params.capabilities?.executablePath !== undefined) {
				opts.executablePath = params.capabilities.executablePath;
			}
			const browser = await vibiumBrowser.start(opts);
			ctx.setBrowser(browser);
			const page = await browser.page();
			page.onDialog((dialog) => {
				ctx.alert.pendingDialog = dialog;
			});
			ctx.setPage(page);
			return { sessionId: `bidi-${String(sessionCounter++)}` };
		},
		async deleteSession() {
			await ctx.getBrowser().stop();
			ctx.clearSession();
		},
	};
}
