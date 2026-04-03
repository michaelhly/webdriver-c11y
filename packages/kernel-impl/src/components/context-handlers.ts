import type { ContextHandlers } from "@michaelhly.webdriver-c11y/schemas";
import { exec, type KernelContext } from "./context.js";

export function createContextHandlers(ctx: KernelContext): ContextHandlers {
  return {
    async getWindowHandle() {
      const handle = await exec<string>(
        ctx,
        `
        const pages = context.pages();
        const idx = pages.indexOf(page);
        return String(idx >= 0 ? idx : 0);
      `,
      );
      return { handle };
    },
    async closeWindow() {
      await exec(ctx, `await page.close(); return undefined;`);
    },
    async switchToWindow({ handle }) {
      await exec(
        ctx,
        `
        const pages = context.pages();
        const idx = parseInt(${JSON.stringify(handle)}, 10);
        if (idx >= 0 && idx < pages.length) {
          await pages[idx].bringToFront();
        }
        return undefined;
      `,
      );
    },
    async getWindowHandles() {
      const handles = await exec<string[]>(
        ctx,
        `
        return context.pages().map((_, i) => String(i));
      `,
      );
      return { handles };
    },
    async newWindow({ type }) {
      const windowType = type === "window" ? "window" : "tab";
      const handle = await exec<string>(
        ctx,
        `
        const newPage = await context.newPage();
        const pages = context.pages();
        return String(pages.indexOf(newPage));
      `,
      );
      return { handle, type: windowType };
    },
    async switchToFrame({ id }) {
      if (id === null || id === undefined) {
        await exec(
          ctx,
          `
          await page.mainFrame();
          return undefined;
        `,
        );
      } else if (typeof id === "number") {
        await exec(
          ctx,
          `
          const frames = page.frames();
          if (${id} < frames.length) {
            // Playwright doesn't have a direct switchToFrame;
            // frame operations are done via frame locators
          }
          return undefined;
        `,
        );
      }
    },
    async switchToParentFrame() {
      await exec(ctx, `return undefined;`);
    },
  };
}
