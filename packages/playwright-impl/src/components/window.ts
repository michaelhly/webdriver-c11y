import type { WindowHandlers } from "@michaelhly.webdriver-c11y/schemas";
import { UnsupportedOperationError } from "@michaelhly.webdriver-c11y/schemas";
import type { PlaywrightContext } from "./context.js";

export function createWindowHandlers(ctx: PlaywrightContext): WindowHandlers {
  return {
    async getWindowRect() {
      const size = ctx.getPage().viewportSize();
      const pos = await ctx
        .getPage()
        .evaluate(() => ({ x: window.screenX, y: window.screenY }));
      return {
        x: pos.x,
        y: pos.y,
        width: size?.width ?? 0,
        height: size?.height ?? 0,
      };
    },
    async setWindowRect(params) {
      const page = ctx.getPage();
      const currentSize = page.viewportSize();
      await page.setViewportSize({
        width: params.width ?? currentSize?.width ?? 1280,
        height: params.height ?? currentSize?.height ?? 720,
      });
      return this.getWindowRect();
    },
    async maximizeWindow() {
      throw new UnsupportedOperationError(
        "maximizeWindow is not supported in Playwright",
      );
    },
    async minimizeWindow() {
      throw new UnsupportedOperationError(
        "minimizeWindow is not supported in Playwright",
      );
    },
    async fullscreenWindow() {
      throw new UnsupportedOperationError(
        "fullscreenWindow is not supported in Playwright",
      );
    },
  };
}
