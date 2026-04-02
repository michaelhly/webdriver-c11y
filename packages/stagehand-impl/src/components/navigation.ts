import type { NavigationHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { StagehandContext } from "./context.js";

export function createNavigationHandlers(
  ctx: StagehandContext,
): NavigationHandlers {
  return {
    async navigateTo({ url }) {
      await ctx.getPage().goto(url);
    },
    async getCurrentUrl() {
      return { url: ctx.getPage().url() };
    },
    async getTitle() {
      return { title: await ctx.getPage().title() };
    },
    async getPageSource() {
      const source = await ctx
        .getPage()
        .evaluate(() => document.documentElement.outerHTML);
      return { source };
    },
    async back() {
      await ctx.getPage().goBack();
    },
    async forward() {
      await ctx.getPage().goForward();
    },
    async refresh() {
      await ctx.getPage().reload();
    },
  };
}
