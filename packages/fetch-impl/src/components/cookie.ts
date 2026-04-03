import type { CookieHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { HttpContext } from "../context.js";
import { del, get, post } from "../http.js";

export function createCookieHandlers(ctx: HttpContext): CookieHandlers {
  return {
    async getAllCookies() {
      const cookies = await get<unknown[]>(ctx, "/cookie");
      return { cookies } as never;
    },
    async getCookie({ name }) {
      const cookie = await get(ctx, `/cookie/${encodeURIComponent(name)}`);
      return { cookie } as never;
    },
    async addCookie({ cookie }) {
      await post(ctx, "/cookie", { cookie });
    },
    async deleteCookie({ name }) {
      await del(ctx, `/cookie/${encodeURIComponent(name)}`);
    },
    async deleteAllCookies() {
      await del(ctx, "/cookie");
    },
  };
}
