import type { BrowsingContextHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { HttpContext } from "../context.js";
import { del, get, post } from "../http.js";

const W3C_ELEMENT_KEY = "element-6066-11e4-a52e-4f735466cecf";

export function createBrowsingContextHandlers(
  ctx: HttpContext,
): BrowsingContextHandlers {
  return {
    async getWindowHandle() {
      const handle = await get<string>(ctx, "/window");
      return { handle };
    },
    async closeWindow() {
      await del(ctx, "/window");
    },
    async switchToWindow({ handle }) {
      await post(ctx, "/window", { handle });
    },
    async getWindowHandles() {
      const handles = await get<string[]>(ctx, "/window/handles");
      return { handles };
    },
    async newWindow(params) {
      return post(ctx, "/window/new", { type: params.type });
    },
    async switchToFrame({ id }) {
      // W3C spec: id can be null (top-level), number (index), or element reference
      let wireId: unknown = id;
      if (typeof id === "string") {
        wireId = { [W3C_ELEMENT_KEY]: id };
      }
      await post(ctx, "/frame", { id: wireId });
    },
    async switchToParentFrame() {
      await post(ctx, "/frame/parent");
    },
  };
}
