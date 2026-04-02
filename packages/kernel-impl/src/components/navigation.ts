import type { NavigationHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { KernelContext } from "./context.js";
import { execFn } from "./exec.js";

export function createNavigationHandlers(
  ctx: KernelContext,
): NavigationHandlers {
  return {
    async navigateTo({ url }) {
      await execFn(
        ctx,
        async (page, _context, args) => {
          await page.goto(args.url);
        },
        { url },
      );
    },
    async getCurrentUrl() {
      const url = await execFn(ctx, (page) => page.url());
      return { url };
    },
    async getTitle() {
      const title = await execFn(ctx, (page) => page.title());
      return { title };
    },
    async getPageSource() {
      const source = await execFn(ctx, (page) => page.content());
      return { source };
    },
    async back() {
      await execFn(ctx, async (page) => {
        await page.goBack();
      });
    },
    async forward() {
      await execFn(ctx, async (page) => {
        await page.goForward();
      });
    },
    async refresh() {
      await execFn(ctx, async (page) => {
        await page.reload();
      });
    },
  };
}
