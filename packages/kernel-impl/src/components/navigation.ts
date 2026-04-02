import type { NavigationHandlers } from "@michaelhly.webdriver-c11y/schemas";
import { type KernelContext, exec } from "../context.js";

export function createNavigationHandlers(
  ctx: KernelContext,
): NavigationHandlers {
  return {
    async navigateTo({ url }) {
      await exec(
        ctx,
        `await page.goto(${JSON.stringify(url)}); return undefined;`,
      );
    },
    async getCurrentUrl() {
      const url = await exec<string>(ctx, `return page.url();`);
      return { url };
    },
    async getTitle() {
      const title = await exec<string>(ctx, `return await page.title();`);
      return { title };
    },
    async getPageSource() {
      const source = await exec<string>(ctx, `return await page.content();`);
      return { source };
    },
    async back() {
      await exec(ctx, `await page.goBack(); return undefined;`);
    },
    async forward() {
      await exec(ctx, `await page.goForward(); return undefined;`);
    },
    async refresh() {
      await exec(ctx, `await page.reload(); return undefined;`);
    },
  };
}
