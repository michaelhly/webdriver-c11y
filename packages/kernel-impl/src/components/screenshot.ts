import type { ScreenshotHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { KernelContext } from "./context.js";

export function createScreenshotHandlers(
  ctx: KernelContext,
): ScreenshotHandlers {
  return {
    async takeScreenshot(_params) {
      const response = await ctx
        .getClient()
        .browsers.computer.captureScreenshot(ctx.getSessionId());
      const buffer = await response.arrayBuffer();
      return { data: Buffer.from(buffer).toString("base64") };
    },
  };
}
