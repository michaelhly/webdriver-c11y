import type { ScreenshotHandlers } from "@michaelhly.webdriver-interop/c11y";
import type { ClassicContext } from "./context.js";

export function createScreenshotHandlers(
	ctx: ClassicContext,
): ScreenshotHandlers {
	return {
		async takeScreenshot() {
			const data = await ctx.getDriver().takeScreenshot();
			return { data };
		},
	};
}
