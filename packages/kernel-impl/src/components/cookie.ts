import type {
  Cookie,
  CookieHandlers,
} from "@michaelhly.webdriver-c11y/schemas";
import { type KernelContext, exec } from "../context.js";

export function createCookieHandlers(ctx: KernelContext): CookieHandlers {
  return {
    async getAllCookies() {
      const cookies = await exec<Cookie[]>(
        ctx,
        `
        const raw = await context.cookies();
        return raw.map(c => ({
          name: c.name,
          value: c.value,
          path: c.path,
          domain: c.domain,
          secure: c.secure,
          httpOnly: c.httpOnly,
          expiry: c.expires !== -1 ? Math.floor(c.expires) : undefined,
          sameSite: c.sameSite !== 'None' ? c.sameSite : undefined,
        }));
      `,
      );
      return { cookies };
    },
    async getCookie({ name }) {
      const cookie = await exec<Cookie>(
        ctx,
        `
        const raw = await context.cookies();
        const c = raw.find(c => c.name === ${JSON.stringify(name)});
        if (!c) throw new Error('No such cookie: ' + ${JSON.stringify(name)});
        return {
          name: c.name,
          value: c.value,
          path: c.path,
          domain: c.domain,
          secure: c.secure,
          httpOnly: c.httpOnly,
          expiry: c.expires !== -1 ? Math.floor(c.expires) : undefined,
          sameSite: c.sameSite !== 'None' ? c.sameSite : undefined,
        };
      `,
      );
      return { cookie };
    },
    async addCookie({ cookie }) {
      await exec(
        ctx,
        `
        const c = ${JSON.stringify(cookie)};
        await context.addCookies([{
          name: c.name,
          value: c.value,
          url: c.domain ? undefined : page.url(),
          domain: c.domain,
          path: c.path ?? '/',
          secure: c.secure,
          httpOnly: c.httpOnly,
          expires: c.expiry ? c.expiry : undefined,
          sameSite: c.sameSite ?? 'Lax',
        }]);
        return undefined;
      `,
      );
    },
    async deleteCookie({ name }) {
      await exec(
        ctx,
        `
        const url = page.url();
        const cookies = await context.cookies(url);
        const target = cookies.find(c => c.name === ${JSON.stringify(name)});
        if (target) {
          await context.clearCookies({ name: ${JSON.stringify(name)} });
        }
        return undefined;
      `,
      );
    },
    async deleteAllCookies() {
      await exec(
        ctx,
        `
        await context.clearCookies();
        return undefined;
      `,
      );
    },
  };
}
