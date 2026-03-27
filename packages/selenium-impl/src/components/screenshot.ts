import type { ScreenshotHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { ClassicContext } from "./context.js";

export function createScreenshotHandlers(
  ctx: ClassicContext,
): ScreenshotHandlers {
  return {
    async takeScreenshot(_params) {
      const data = await ctx.getDriver().takeScreenshot();
      return { data };
    },
  };
}
