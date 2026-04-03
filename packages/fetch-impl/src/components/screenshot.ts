import type { ScreenshotHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { HttpContext } from "../context.js";
import { get } from "../http.js";

export function createScreenshotHandlers(ctx: HttpContext): ScreenshotHandlers {
  return {
    async takeScreenshot() {
      const data = await get<string>(ctx, "/screenshot");
      return { data };
    },
  };
}
