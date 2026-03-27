import type {
  Cookie,
  CookieHandlers,
} from "@michaelhly.webdriver-c11y/schemas";
import type { StagehandContext } from "./context.js";

interface CdpCookie {
  name: string;
  value: string;
  path: string;
  domain: string;
  secure: boolean;
  httpOnly: boolean;
  expires: number;
  sameSite?: string;
}

function toCookie(c: CdpCookie): Cookie {
  const cookie: Cookie = { name: c.name, value: c.value };
  if (c.path) cookie.path = c.path;
  if (c.domain) cookie.domain = c.domain;
  if (c.secure) cookie.secure = c.secure;
  if (c.httpOnly) cookie.httpOnly = c.httpOnly;
  if (c.expires > 0) cookie.expiry = Math.floor(c.expires);
  if (c.sameSite)
    cookie.sameSite = c.sameSite as NonNullable<Cookie["sameSite"]>;
  return cookie;
}

export function createCookieHandlers(ctx: StagehandContext): CookieHandlers {
  return {
    async getAllCookies() {
      const { cookies } = await ctx
        .getPage()
        .sendCDP<{ cookies: CdpCookie[] }>("Network.getCookies");
      return { cookies: cookies.map(toCookie) };
    },
    async getCookie({ name }) {
      const { cookies } = await ctx
        .getPage()
        .sendCDP<{ cookies: CdpCookie[] }>("Network.getCookies");
      const found = cookies.find((c) => c.name === name);
      if (!found) throw new Error(`Cookie not found: ${name}`);
      return { cookie: toCookie(found) };
    },
    async addCookie({ cookie }) {
      await ctx.getPage().sendCDP("Network.setCookie", {
        name: cookie.name,
        value: cookie.value,
        path: cookie.path,
        domain: cookie.domain,
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
        sameSite: cookie.sameSite,
        expires: cookie.expiry,
      });
    },
    async deleteCookie({ name }) {
      await ctx.getPage().sendCDP("Network.deleteCookies", { name });
    },
    async deleteAllCookies() {
      await ctx.getPage().sendCDP("Network.clearBrowserCookies");
    },
  };
}
