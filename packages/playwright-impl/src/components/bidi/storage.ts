import type {
  BidiStorageHandlers,
  DeleteCookiesResult,
  GetCookiesResult,
  SetCookieResult,
} from "@michaelhly.webdriver-c11y/schemas";
import type { PlaywrightContext } from "../context.js";

export function createBidiStorageHandlers(
  ctx: PlaywrightContext,
): BidiStorageHandlers {
  return {
    async storageGetCookies(params) {
      const browserContext = ctx.getContext();
      const allCookies = await browserContext.cookies();

      let filtered = allCookies;
      if (params.filter) {
        const f = params.filter;
        filtered = allCookies.filter((c) => {
          if (f.name !== undefined && c.name !== f.name) return false;
          if (f.domain !== undefined && c.domain !== f.domain) return false;
          if (f.path !== undefined && c.path !== f.path) return false;
          if (f.httpOnly !== undefined && c.httpOnly !== f.httpOnly)
            return false;
          if (f.secure !== undefined && c.secure !== f.secure) return false;
          if (
            f.sameSite !== undefined &&
            c.sameSite.toLowerCase() !== f.sameSite
          )
            return false;
          return true;
        });
      }

      const cookies = filtered.map((c) => ({
        name: c.name,
        value: { type: "string" as const, value: c.value },
        domain: c.domain,
        path: c.path,
        httpOnly: c.httpOnly,
        secure: c.secure,
        sameSite: c.sameSite.toLowerCase(),
        size: c.name.length + c.value.length,
      }));

      return {
        cookies,
        partitionKey: {},
      } satisfies GetCookiesResult;
    },
    async storageSetCookie(params) {
      const browserContext = ctx.getContext();
      const c = params.cookie;
      await browserContext.addCookies([
        {
          name: c.name,
          value: c.value.value,
          domain: c.domain,
          path: c.path ?? "/",
          httpOnly: c.httpOnly ?? false,
          secure: c.secure ?? false,
          sameSite: (c.sameSite === "strict"
            ? "Strict"
            : c.sameSite === "lax"
              ? "Lax"
              : "None") as "Strict" | "Lax" | "None",
          expires: c.expiry ?? -1,
        },
      ]);
      return { partitionKey: {} } satisfies SetCookieResult;
    },
    async storageDeleteCookies(params) {
      const browserContext = ctx.getContext();
      if (params.filter) {
        const f = params.filter;
        if (f.name !== undefined) {
          await browserContext.clearCookies({ name: f.name });
        } else if (f.domain !== undefined) {
          await browserContext.clearCookies({ domain: f.domain });
        } else {
          await browserContext.clearCookies();
        }
      } else {
        await browserContext.clearCookies();
      }
      return { partitionKey: {} } satisfies DeleteCookiesResult;
    },
  };
}
