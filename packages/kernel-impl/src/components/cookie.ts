import type {
  Cookie,
  CookieHandlers,
} from "@michaelhly.webdriver-c11y/schemas";
import type { KernelContext } from "./context.js";
import { evaluate } from "../eval.js";

function toCookie(c: {
  name: string;
  value: string;
  path: string;
  domain: string;
  secure: boolean;
  httpOnly: boolean;
  expires: number;
  sameSite: "Strict" | "Lax" | "None";
}): Cookie {
  const cookie: Cookie = { name: c.name, value: c.value };
  cookie.path = c.path;
  cookie.domain = c.domain;
  cookie.secure = c.secure;
  cookie.httpOnly = c.httpOnly;
  if (c.expires !== -1) cookie.expiry = Math.floor(c.expires);
  if (c.sameSite !== "None") cookie.sameSite = c.sameSite as "Strict" | "Lax";
  return cookie;
}

export function createCookieHandlers(ctx: KernelContext): CookieHandlers {
  return {
    async getAllCookies() {
      const raw = await evaluate(ctx, async (_page, context) => {
        return context.cookies();
      });
      return { cookies: raw.map(toCookie) };
    },
    async getCookie({ name }) {
      const raw = await evaluate(
        ctx,
        async (_page, context, args) => {
          const cookies = await context.cookies();
          const c = cookies.find((c) => c.name === args.name);
          if (!c) throw new Error(`No such cookie: ${args.name}`);
          return c;
        },
        { name },
      );
      return { cookie: toCookie(raw) };
    },
    async addCookie({ cookie }) {
      await evaluate(
        ctx,
        async (page, context, args) => {
          const c = args.cookie;
          const entry: Parameters<typeof context.addCookies>[0][number] = {
            name: c.name,
            value: c.value,
            path: c.path ?? "/",
            sameSite: (c.sameSite as "Strict" | "Lax" | "None") ?? "Lax",
          };
          if (c.domain) {
            entry.domain = c.domain;
          } else {
            entry.url = page.url();
          }
          if (c.secure !== undefined) entry.secure = c.secure;
          if (c.httpOnly !== undefined) entry.httpOnly = c.httpOnly;
          if (c.expiry !== undefined) entry.expires = c.expiry;
          await context.addCookies([entry]);
        },
        { cookie },
      );
    },
    async deleteCookie({ name }) {
      await evaluate(
        ctx,
        async (_page, context, args) => {
          await context.clearCookies({ name: args.name });
        },
        { name },
      );
    },
    async deleteAllCookies() {
      await evaluate(ctx, async (_page, context) => {
        await context.clearCookies();
      });
    },
  };
}
