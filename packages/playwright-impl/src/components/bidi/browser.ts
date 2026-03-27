import type { BidiBrowserHandlers } from "@michaelhly.webdriver-c11y/schemas";
import { UnsupportedOperationError } from "@michaelhly.webdriver-c11y/schemas";
import type { PlaywrightContext } from "../context.js";
import { storeUserContext } from "../context.js";

export function createBidiBrowserHandlers(
  ctx: PlaywrightContext,
): BidiBrowserHandlers {
  return {
    async browserClose() {
      await ctx.getBrowser().close();
      ctx.clearBrowser();
    },
    async browserCreateUserContext() {
      const browser = ctx.getBrowser();
      const browserContext = await browser.newContext();
      const id = storeUserContext(ctx, browserContext);
      return { userContext: id };
    },
    async browserGetUserContexts() {
      const userContexts = [];
      for (const [id] of ctx.userContexts) {
        userContexts.push({ userContext: id });
      }
      return { userContexts };
    },
    async browserRemoveUserContext(params) {
      const browserContext = ctx.userContexts.get(params.userContext);
      if (browserContext) {
        await browserContext.close();
        ctx.userContexts.delete(params.userContext);
      }
    },
    async browserGetClientWindows() {
      throw new UnsupportedOperationError(
        "browserGetClientWindows is not supported in Playwright",
      );
    },
    async browserSetClientWindowState(_params) {
      throw new UnsupportedOperationError(
        "browserSetClientWindowState is not supported in Playwright",
      );
    },
  };
}
