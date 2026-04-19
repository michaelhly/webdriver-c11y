import type { Rect, WindowHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { KernelContext } from "../context.js";
import { evaluate } from "../eval.js";

export function createWindowHandlers(ctx: KernelContext): WindowHandlers {
  async function getWindowRect(): Promise<Rect> {
    return await evaluate<Rect>(ctx, (page) => {
      const size = page.viewportSize();
      return {
        x: 0,
        y: 0,
        width: size?.width ?? 0,
        height: size?.height ?? 0,
      };
    });
  }

  return {
    getWindowRect,
    async setWindowRect(params) {
      const width = params.width ?? undefined;
      const height = params.height ?? undefined;
      if (width !== undefined && height !== undefined) {
        await ctx.getClient().browsers.update(ctx.getSessionId(), {
          viewport: { width, height },
        });
      }
      return getWindowRect();
    },
    async maximizeWindow() {
      return getWindowRect();
    },
    async minimizeWindow() {
      return getWindowRect();
    },
    async fullscreenWindow() {
      return getWindowRect();
    },
  };
}
