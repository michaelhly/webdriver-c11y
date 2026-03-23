import type { ScreenshotHandlers } from "@michaelhly.webdriver-interop/c11y";
import type { BidiContext } from "./context.js";

export function createScreenshotHandlers(
	ctx: BidiContext,
): ScreenshotHandlers {
	return {
		async takeScreenshot(params) {
			const opts: { fullPage?: boolean } = {};
			if (params?.fullPage !== undefined) {
				opts.fullPage = params.fullPage;
			}
			const buf = await ctx.getPage().screenshot(opts);
			return { data: buf.toString("base64") };
		},
	};
}
