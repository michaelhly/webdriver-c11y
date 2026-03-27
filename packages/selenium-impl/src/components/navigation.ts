import type { NavigationHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { ClassicContext } from "./context.js";

export function createNavigationHandlers(
  ctx: ClassicContext,
): NavigationHandlers {
  return {
    async navigateTo({ url }) {
      await ctx.getDriver().get(url);
    },
    async getCurrentUrl() {
      return { url: await ctx.getDriver().getCurrentUrl() };
    },
    async getTitle() {
      return { title: await ctx.getDriver().getTitle() };
    },
    async getPageSource() {
      return { source: await ctx.getDriver().getPageSource() };
    },
    async back() {
      await ctx.getDriver().navigate().back();
    },
    async forward() {
      await ctx.getDriver().navigate().forward();
    },
    async refresh() {
      await ctx.getDriver().navigate().refresh();
    },
  };
}
