import type {
  Capabilities,
  SessionHandlers,
} from "@michaelhly.webdriver-c11y/schemas";
import { SessionNotCreatedError } from "@michaelhly.webdriver-c11y/schemas";
import type { BrowserCreateParams } from "@onkernel/sdk/resources/browsers/browsers.js";
import { type KernelContext, exec } from "../context.js";

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
    async newSession(params) {
      const alwaysMatch = params.capabilities?.alwaysMatch ?? {};
      const firstMatch = params.capabilities?.firstMatch ?? [{}];
      const merged = { ...alwaysMatch, ...firstMatch[0] };

      const options = ctx.getOptions();

      try {
        const createParams: Record<string, unknown> = {
          headless: options.headless ?? true,
        };
        if (options.stealth !== undefined)
          createParams.stealth = options.stealth;
        if (options.gpu !== undefined) createParams.gpu = options.gpu;
        if (options.viewport !== undefined)
          createParams.viewport = options.viewport;
        if (options.timeoutSeconds !== undefined)
          createParams.timeout_seconds = options.timeoutSeconds;

        const browser = await ctx
          .getClient()
          .browsers.create(createParams as BrowserCreateParams);

        ctx.setSession(browser.session_id, browser.webdriver_ws_url);

        const capabilities: Capabilities = {
          browserName: "chrome",
          ...merged,
        };

        return { sessionId: browser.session_id, capabilities };
      } catch (e) {
        throw new SessionNotCreatedError(
          `Failed to create kernel browser session: ${e instanceof Error ? e.message : String(e)}`,
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
