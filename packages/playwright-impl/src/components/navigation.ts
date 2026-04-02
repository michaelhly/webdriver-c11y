import type { NavigationHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { PlaywrightContext } from "./context.js";

export function createNavigationHandlers(
  ctx: PlaywrightContext,
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
      return { source: await ctx.getPage().content() };
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
