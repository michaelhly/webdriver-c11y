import type { ScreenshotHandlers } from "@michaelhly.webdriver-interop/c11y";
import type { VibiumContext } from "./context.js";

export function createScreenshotHandlers(
	ctx: VibiumContext,
): ScreenshotHandlers {
	return {
		async takeScreenshot(params) {
			const opts = params.fullPage !== undefined
				? { fullPage: params.fullPage }
				: undefined;
			const buf = await ctx.getPage().screenshot(opts);
			return { data: buf.toString("base64") };
		},
	};
}
