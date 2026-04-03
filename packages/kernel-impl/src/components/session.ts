import type {
  Capabilities,
  SessionHandlers,
  Timeouts,
} from "@michaelhly.webdriver-c11y/schemas";
import { SessionNotCreatedError } from "@michaelhly.webdriver-c11y/schemas";
import type { KernelContext } from "../context.js";
import { evaluate } from "../eval.js";

export function createSessionHandlers(ctx: KernelContext): SessionHandlers {
  return {
    async status() {
      try {
        ctx.getSessionId();
        return { ready: true, message: "Session is active" };
      } catch {
        return { ready: false, message: "No active session" };
      }
    },
    async newSession(_params) {
      try {
        const browser = await ctx
          .getClient()
          .browsers.create(ctx.getBrowserOpts());

        ctx.setBrowser(browser);

        const capabilities: Capabilities = {
          browserName: "chrome",
          ...browser,
        };

        return { sessionId: browser.session_id, capabilities };
      } catch (e) {
        const error = e as Error;
        throw new SessionNotCreatedError(
          `Failed to create kernel browser session: ${error.message}`,
        );
      }
    },
    async deleteSession() {
      const sessionId = ctx.getSessionId();
      await ctx.getClient().browsers.deleteByID(sessionId);
      ctx.clearSession();
    },
    async getTimeouts() {
      return await evaluate<Timeouts>(ctx, async (page) => {
        const timeouts = await page.evaluate(() => {
          const w = window as unknown as Record<string, unknown>;
          return w.__webdriver_timeouts as Record<string, unknown> | undefined;
        });
        return {
          script: (timeouts?.script as number) ?? 30000,
          pageLoad: (timeouts?.pageLoad as number) ?? 300000,
          implicit: (timeouts?.implicit as number) ?? 0,
        };
      });
    },
    async setTimeouts(params) {
      await evaluate(
        ctx,
        async (page, _context, args) => {
          await page.evaluate((t) => {
            const w = window as unknown as Record<string, unknown>;
            w.__webdriver_timeouts = t;
          }, args);
          if (args.implicit !== undefined) {
            page.setDefaultTimeout(args.implicit);
          }
        },
        {
          script: params.script,
          pageLoad: params.pageLoad,
          implicit: params.implicit,
        },
      );
    },
  };
}
