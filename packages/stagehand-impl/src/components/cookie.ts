import type {
  Cookie,
  CookieHandlers,
} from "@michaelhly.webdriver-c11y/schemas";
import { sendCDP, type CDPResult } from "./shared/cdp.js";
import type { StagehandContext } from "./context.js";

type CdpCookie = CDPResult<"Network.getCookies">["cookies"][number];

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
      const { cookies } = await sendCDP(ctx.getPage(), "Network.getCookies");
      return { cookies: cookies.map(toCookie) };
    },
    async getCookie({ name }) {
      const { cookies } = await sendCDP(ctx.getPage(), "Network.getCookies");
      const found = cookies.find((c) => c.name === name);
      if (!found) throw new Error(`Cookie not found: ${name}`);
      return { cookie: toCookie(found) };
    },
    async addCookie({ cookie }) {
      await sendCDP(ctx.getPage(), "Network.setCookie", {
        name: cookie.name,
        value: cookie.value,
        ...(cookie.path != null && { path: cookie.path }),
        ...(cookie.domain != null && { domain: cookie.domain }),
        ...(cookie.secure != null && { secure: cookie.secure }),
        ...(cookie.httpOnly != null && { httpOnly: cookie.httpOnly }),
        ...(cookie.sameSite != null && { sameSite: cookie.sameSite }),
        ...(cookie.expiry != null && { expires: cookie.expiry }),
      });
    },
    async deleteCookie({ name }) {
      await sendCDP(ctx.getPage(), "Network.deleteCookies", { name });
    },
    async deleteAllCookies() {
      await sendCDP(ctx.getPage(), "Network.clearBrowserCookies");
    },
  };
}
