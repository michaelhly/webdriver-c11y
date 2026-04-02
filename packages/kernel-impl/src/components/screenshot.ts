import type { ScreenshotHandlers } from "@michaelhly.webdriver-c11y/schemas";
import { type KernelContext, exec } from "./context.js";

export function createScreenshotHandlers(
  ctx: KernelContext,
): ScreenshotHandlers {
  return {
    async takeScreenshot(params) {
      const data = await exec<string>(ctx, `
        const buf = await page.screenshot({ fullPage: ${params.fullPage ?? false} });
        return buf.toString('base64');
      `);
      return { data };
    },
  };
}
