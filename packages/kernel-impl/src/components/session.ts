import type {
  Capabilities,
  SessionHandlers,
} from "@michaelhly.webdriver-c11y/schemas";
import { SessionNotCreatedError } from "@michaelhly.webdriver-c11y/schemas";
import { exec, type KernelContext } from "../context.js";

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
          .browsers.create(ctx.getCreateParams());

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
      return await exec(
        ctx,
        `
        const timeouts = await page.evaluate(() => {
          return (window as any).__webdriver_timeouts || {};
        });
        return {
          script: timeouts.script ?? 30000,
          pageLoad: timeouts.pageLoad ?? 300000,
          implicit: timeouts.implicit ?? 0,
        };
      `,
      );
    },
    async setTimeouts(params) {
      const script = params.script ?? null;
      const pageLoad = params.pageLoad ?? undefined;
      const implicit = params.implicit ?? undefined;
      await exec(
        ctx,
        `
        const timeouts = {
          script: ${script === null ? "null" : String(script)},
          pageLoad: ${pageLoad === undefined ? "undefined" : String(pageLoad)},
          implicit: ${implicit === undefined ? "undefined" : String(implicit)},
        };
        await page.evaluate((t) => {
          (window as any).__webdriver_timeouts = t;
        }, timeouts);
        if (timeouts.implicit !== undefined) {
          await page.setDefaultTimeout(timeouts.implicit);
        }
        return undefined;
      `,
      );
    },
  };
}
