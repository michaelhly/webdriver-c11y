import type {
  Capabilities,
  SessionHandlers,
  Timeouts,
} from "@michaelhly.webdriver-c11y/schemas";
import { SessionNotCreatedError } from "@michaelhly.webdriver-c11y/schemas";
import type { BrowserType, LaunchOptions } from "playwright";
import { chromium, webkit } from "playwright";
import { VALID_BROWSERS } from "../constants.js";
import type { PlaywrightContext } from "./context.js";
import { storePage } from "./context.js";

function toBrowserType(name: string): {
  browserType: BrowserType;
  channel?: string;
} {
  switch (name) {
    case "chromium":
    case "chrome":
      return { browserType: chromium };
    case "firefox":
      throw new SessionNotCreatedError(
        "Firefox is not supported in the Playwright implementation",
      );
    case "webkit":
      return { browserType: webkit };
    case "msedge":
    case "MicrosoftEdge":
      return { browserType: chromium, channel: "msedge" };
    default:
      throw new SessionNotCreatedError(
        `Unsupported browserName: '${name}'. ` +
          `Must be one of: ${[...VALID_BROWSERS].join(", ")}`,
      );
  }
}

export function createSessionHandlers(ctx: PlaywrightContext): SessionHandlers {
  return {
    async status() {
      try {
        ctx.getBrowser();
        return { ready: true, message: "Session is active" };
      } catch {
        return { ready: false, message: "No active session" };
      }
    },
    async newSession(params) {
      const alwaysMatch = params.capabilities?.alwaysMatch ?? {};
      const firstMatch = params.capabilities?.firstMatch ?? [{}];
      const merged = { ...alwaysMatch, ...firstMatch[0] };

      const browserName =
        (merged.browserName as string | undefined) ?? "chromium";

      if (!VALID_BROWSERS.has(browserName)) {
        throw new SessionNotCreatedError(
          `Unsupported browserName: '${browserName}'. ` +
            `Must be one of: ${[...VALID_BROWSERS].join(", ")}`,
        );
      }

      const { browserType, channel } = toBrowserType(browserName);

      const launchOptions: LaunchOptions = {};
      if (channel) launchOptions.channel = channel;
      if (merged.acceptInsecureCerts === true) {
        // Handled at context level via ignoreHTTPSErrors
      }

      const browser = await browserType.launch(launchOptions);
      ctx.setBrowser(browser);

      const contextOptions: Record<string, unknown> = {};
      if (merged.acceptInsecureCerts === true) {
        contextOptions.ignoreHTTPSErrors = true;
      }

      const browserContext = await browser.newContext(contextOptions);
      ctx.setContext(browserContext);

      const page = await browserContext.newPage();
      ctx.setPage(page);
      storePage(ctx, page);

      // Listen for dialogs on the page
      page.on("dialog", (dialog) => {
        ctx.pendingDialog = dialog;
      });

      // Apply timeouts from capabilities
      if (merged.timeouts) {
        const t = merged.timeouts as Timeouts;
        ctx.timeouts = { ...t };
        if (t.implicit !== undefined) {
          page.setDefaultTimeout(t.implicit);
        }
        if (t.pageLoad !== undefined) {
          page.setDefaultNavigationTimeout(t.pageLoad);
        }
      }

      const sessionId = crypto.randomUUID();

      const capabilities: Capabilities = {
        browserName,
        browserVersion: browser.version(),
        platformName: "unknown",
        acceptInsecureCerts: merged.acceptInsecureCerts ?? false,
        pageLoadStrategy:
          (merged.pageLoadStrategy as Capabilities["pageLoadStrategy"]) ??
          "normal",
        timeouts: ctx.timeouts,
      };

      return { sessionId, capabilities };
    },
    async deleteSession() {
      await ctx.getBrowser().close();
      ctx.clearBrowser();
    },
    async getTimeouts() {
      const result: Timeouts = {};
      result.script = ctx.timeouts.script ?? null;
      if (ctx.timeouts.pageLoad !== undefined)
        result.pageLoad = ctx.timeouts.pageLoad;
      if (ctx.timeouts.implicit !== undefined)
        result.implicit = ctx.timeouts.implicit;
      return result;
    },
    async setTimeouts(params) {
      if (params.script !== undefined) ctx.timeouts.script = params.script;
      if (params.pageLoad !== undefined) {
        ctx.timeouts.pageLoad = params.pageLoad;
        ctx.getPage().setDefaultNavigationTimeout(params.pageLoad);
      }
      if (params.implicit !== undefined) {
        ctx.timeouts.implicit = params.implicit;
        ctx.getPage().setDefaultTimeout(params.implicit);
      }
    },
  };
}
