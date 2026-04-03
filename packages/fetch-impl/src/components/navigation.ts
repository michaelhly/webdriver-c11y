import type { NavigationHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { HttpContext } from "../context.js";
import { get, post } from "../http.js";

export function createNavigationHandlers(ctx: HttpContext): NavigationHandlers {
  return {
    async navigateTo({ url }) {
      await post(ctx, "/url", { url });
    },
    async getCurrentUrl() {
      const url = await get<string>(ctx, "/url");
      return { url };
    },
    async getTitle() {
      const title = await get<string>(ctx, "/title");
      return { title };
    },
    async getPageSource() {
      const source = await get<string>(ctx, "/source");
      return { source };
    },
    async back() {
      await post(ctx, "/back");
    },
    async forward() {
      await post(ctx, "/forward");
    },
    async refresh() {
      await post(ctx, "/refresh");
    },
  };
}
