import type {
  Cookie,
  CookieHandlers,
} from "@michaelhly.webdriver-c11y/schemas";
import type { PlaywrightContext } from "./context.js";

function toW3CCookie(c: {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: number;
  httpOnly: boolean;
  secure: boolean;
  sameSite: "Strict" | "Lax" | "None";
}): Cookie {
  const cookie: Cookie = { name: c.name, value: c.value };
  if (c.path !== undefined) cookie.path = c.path;
  if (c.domain !== undefined) cookie.domain = c.domain;
  if (c.secure !== undefined) cookie.secure = c.secure;
  if (c.httpOnly !== undefined) cookie.httpOnly = c.httpOnly;
  if (c.expires !== undefined && c.expires !== -1) {
    cookie.expiry = Math.floor(c.expires);
  }
  if (c.sameSite != null)
    cookie.sameSite = c.sameSite as NonNullable<Cookie["sameSite"]>;
  return cookie;
}

export function createCookieHandlers(ctx: PlaywrightContext): CookieHandlers {
  return {
    async getAllCookies() {
      const raw = await ctx.getContext().cookies();
      return { cookies: raw.map(toW3CCookie) };
    },
    async getCookie({ name }) {
      const raw = await ctx.getContext().cookies();
      const found = raw.find((c) => c.name === name);
      if (!found) return { cookie: { name, value: "" } };
      return { cookie: toW3CCookie(found) };
    },
    async addCookie({ cookie }) {
      const url = ctx.getPage().url();
      const pwCookie: {
        name: string;
        value: string;
        url?: string;
        domain?: string;
        path?: string;
        expires?: number;
        httpOnly?: boolean;
        secure?: boolean;
        sameSite?: "Strict" | "Lax" | "None";
      } = {
        name: cookie.name,
        value: cookie.value,
      };
      if (cookie.domain !== undefined) {
        pwCookie.domain = cookie.domain;
      } else {
        pwCookie.url = url;
      }
      if (cookie.path !== undefined) pwCookie.path = cookie.path;
      if (cookie.expiry !== undefined) pwCookie.expires = cookie.expiry;
      if (cookie.httpOnly !== undefined) pwCookie.httpOnly = cookie.httpOnly;
      if (cookie.secure !== undefined) pwCookie.secure = cookie.secure;
      if (cookie.sameSite !== undefined) pwCookie.sameSite = cookie.sameSite;
      await ctx.getContext().addCookies([pwCookie]);
    },
    async deleteCookie({ name }) {
      await ctx.getContext().clearCookies({ name });
    },
    async deleteAllCookies() {
      await ctx.getContext().clearCookies();
    },
  };
}
