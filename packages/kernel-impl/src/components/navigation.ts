import type { NavigationHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { KernelContext } from "./context.js";
import { evaluate } from "../eval.js";

export function createNavigationHandlers(
  ctx: KernelContext,
): NavigationHandlers {
  return {
    async navigateTo({ url }) {
      await evaluate(
        ctx,
        async (page, _context, args) => {
          await page.goto(args.url);
        },
        { url },
      );
    },
    async getCurrentUrl() {
      const url = await evaluate(ctx, (page) => page.url());
      return { url };
    },
    async getTitle() {
      const title = await evaluate(ctx, (page) => page.title());
      return { title };
    },
    async getPageSource() {
      const source = await evaluate(ctx, (page) => page.content());
      return { source };
    },
    async back() {
      await evaluate(ctx, async (page) => {
        await page.goBack();
      });
    },
    async forward() {
      await evaluate(ctx, async (page) => {
        await page.goForward();
      });
    },
    async refresh() {
      await evaluate(ctx, async (page) => {
        await page.reload();
      });
    },
  };
}
