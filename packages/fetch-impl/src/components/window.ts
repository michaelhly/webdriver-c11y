import type { WindowHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { HttpContext } from "../context.js";
import { get, post } from "../http.js";

export function createWindowHandlers(ctx: HttpContext): WindowHandlers {
  return {
    async getWindowRect() {
      return get(ctx, "/window/rect");
    },
    async setWindowRect(params) {
      return post(ctx, "/window/rect", params);
    },
    async maximizeWindow() {
      return post(ctx, "/window/maximize");
    },
    async minimizeWindow() {
      return post(ctx, "/window/minimize");
    },
    async fullscreenWindow() {
      return post(ctx, "/window/fullscreen");
    },
  };
}
