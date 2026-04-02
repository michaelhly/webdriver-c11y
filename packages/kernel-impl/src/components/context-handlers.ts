import type { ContextHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { KernelContext } from "./context.js";
import { evaluate } from "../exec.js";

export function createContextHandlers(ctx: KernelContext): ContextHandlers {
  return {
    async getWindowHandle() {
      const handle = await evaluate(ctx, (page, context) => {
        const pages = context.pages();
        const idx = pages.indexOf(page);
        return String(idx >= 0 ? idx : 0);
      });
      return { handle };
    },
    async closeWindow() {
      await evaluate(ctx, async (page) => {
        await page.close();
      });
    },
    async switchToWindow({ handle }) {
      await evaluate(
        ctx,
        async (_page, context, args) => {
          const pages = context.pages();
          const idx = parseInt(args.handle, 10);
          if (idx >= 0 && idx < pages.length) {
            await pages[idx]?.bringToFront();
          }
        },
        { handle },
      );
    },
    async getWindowHandles() {
      const handles = await evaluate(ctx, (_page, context) => {
        return context.pages().map((_: unknown, i: number) => String(i));
      });
      return { handles };
    },
    async newWindow({ type }) {
      const windowType = type === "window" ? "window" : "tab";
      const handle = await evaluate(ctx, async (_page, context) => {
        const newPage = await context.newPage();
        const pages = context.pages();
        return String(pages.indexOf(newPage));
      });
      return { handle, type: windowType };
    },
    async switchToFrame({ id }) {
      if (id === null || id === undefined) {
        // Switch to main frame — no-op in Playwright (main frame is default)
      }
      // Frame switching is implicit in Playwright via frameLocator
    },
    async switchToParentFrame() {
      // No-op in Playwright — frame navigation is implicit
    },
  };
}
