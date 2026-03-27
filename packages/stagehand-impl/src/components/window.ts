import type { WindowHandlers } from "@michaelhly.webdriver-c11y/schemas";
import { sendCDP } from "./shared/cdp.js";
import type { StagehandContext } from "./context.js";

export function createWindowHandlers(ctx: StagehandContext): WindowHandlers {
  return {
    async getWindowRect() {
      const { windowId } = await sendCDP(
        ctx.getPage(),
        "Browser.getWindowForTarget",
      );
      const { bounds } = await sendCDP(
        ctx.getPage(),
        "Browser.getWindowBounds",
        { windowId },
      );
      return {
        x: bounds.left ?? 0,
        y: bounds.top ?? 0,
        width: bounds.width ?? 0,
        height: bounds.height ?? 0,
      };
    },
    async setWindowRect(params) {
      const { windowId } = await sendCDP(
        ctx.getPage(),
        "Browser.getWindowForTarget",
      );
      await sendCDP(ctx.getPage(), "Browser.setWindowBounds", {
        windowId,
        bounds: {
          ...(params.x != null && { left: params.x }),
          ...(params.y != null && { top: params.y }),
          ...(params.width != null && { width: params.width }),
          ...(params.height != null && { height: params.height }),
        },
      });
      return this.getWindowRect();
    },
    async maximizeWindow() {
      const { windowId } = await sendCDP(
        ctx.getPage(),
        "Browser.getWindowForTarget",
      );
      await sendCDP(ctx.getPage(), "Browser.setWindowBounds", {
        windowId,
        bounds: { windowState: "maximized" },
      });
      return this.getWindowRect();
    },
    async minimizeWindow() {
      const { windowId } = await sendCDP(
        ctx.getPage(),
        "Browser.getWindowForTarget",
      );
      await sendCDP(ctx.getPage(), "Browser.setWindowBounds", {
        windowId,
        bounds: { windowState: "minimized" },
      });
      return this.getWindowRect();
    },
    async fullscreenWindow() {
      const { windowId } = await sendCDP(
        ctx.getPage(),
        "Browser.getWindowForTarget",
      );
      await sendCDP(ctx.getPage(), "Browser.setWindowBounds", {
        windowId,
        bounds: { windowState: "fullscreen" },
      });
      return this.getWindowRect();
    },
  };
}
