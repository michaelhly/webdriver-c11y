import type { ScreenshotHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { PlaywrightContext } from "./context.js";

export function createScreenshotHandlers(
  ctx: PlaywrightContext,
): ScreenshotHandlers {
  return {
    async takeScreenshot(params) {
      const buffer = await ctx
        .getPage()
        .screenshot({ fullPage: params.fullPage ?? false });
      return { data: buffer.toString("base64") };
    },
  };
}
