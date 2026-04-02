import type { WindowHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { KernelContext } from "./context.js";

export function createWindowHandlers(ctx: KernelContext): WindowHandlers {
  async function getWindowRect() {
    const viewport = await ctx
      .getClient()
      .browsers.playwright.execute(ctx.getSessionId(), {
        code: `
          const size = page.viewportSize();
          return { x: 0, y: 0, width: size?.width ?? 0, height: size?.height ?? 0 };
        `,
      });
    if (!viewport.success) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }
    return viewport.result as {
      x: number;
      y: number;
      width: number;
      height: number;
    };
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
