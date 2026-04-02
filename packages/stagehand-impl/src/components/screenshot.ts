import type { ScreenshotHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { StagehandContext } from "./context.js";

export function createScreenshotHandlers(
  ctx: StagehandContext,
): ScreenshotHandlers {
  return {
    async takeScreenshot(params) {
      const opts =
        params.fullPage !== undefined ? { fullPage: params.fullPage } : {};
      const buf = await ctx.getPage().screenshot(opts);
      return { data: buf.toString("base64") };
    },
  };
}
