import type { ScreenshotHandlers } from "@michaelhly.webdriver-interop/c11y";
import type { StagehandContext } from "./compat/context.js";
import { getActivePage } from "./compat/page.js";

export function createScreenshotHandlers(
	ctx: StagehandContext,
): ScreenshotHandlers {
	return {
		async takeScreenshot(params) {
			const page = getActivePage(ctx);
			const buffer = await page.screenshot({
				fullPage: params.fullPage ?? false,
			});
			return { data: buffer.toString("base64") };
		},
	};
}
