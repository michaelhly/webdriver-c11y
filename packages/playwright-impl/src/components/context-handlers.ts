import type { ContextHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { PlaywrightContext } from "./context.js";
import { storePage } from "./context.js";

export function createContextHandlers(ctx: PlaywrightContext): ContextHandlers {
  return {
    async getWindowHandle() {
      const page = ctx.getPage();
      // Find the ID for the current page in the pages map
      for (const [id, p] of ctx.pages) {
        if (p === page) return { handle: id };
      }
      // If not found, store it and return the new ID
      const handle = storePage(ctx, page);
      return { handle };
    },
    async closeWindow() {
      await ctx.getPage().close();
    },
    async switchToWindow({ handle }) {
      const page = ctx.pages.get(handle);
      if (!page) {
        throw new Error(`Window handle not found: ${handle}`);
      }
      ctx.setPage(page);
      await page.bringToFront();
    },
    async getWindowHandles() {
      // Sync pages map with actual browser context pages
      const contextPages = ctx.getContext().pages();
      const handles: string[] = [];
      for (const page of contextPages) {
        let found = false;
        for (const [id, p] of ctx.pages) {
          if (p === page) {
            handles.push(id);
            found = true;
            break;
          }
        }
        if (!found) {
          handles.push(storePage(ctx, page));
        }
      }
      return { handles };
    },
    async newWindow({ type }) {
      const browserContext = ctx.getContext();
      const page = await browserContext.newPage();
      const handle = storePage(ctx, page);
      ctx.setPage(page);

      // Listen for dialogs on the new page
      page.on("dialog", (dialog) => {
        ctx.pendingDialog = dialog;
      });

      return { handle, type: type ?? "tab" };
    },
    async switchToFrame({ id }) {
      if (id === null || id === undefined) {
        // Switch to main frame - set page's main frame context
        // In Playwright, the page itself represents the main frame
        // No explicit switch needed since page methods operate on the main frame
        return;
      }
      if (typeof id === "number") {
        const frames = ctx.getPage().frames();
        const frame = frames[id];
        if (!frame) throw new Error(`Frame not found at index: ${id}`);
        // Playwright frames are accessed via page.frames() but operations
        // target the main frame by default. For frame-specific operations,
        // users would need to use the frame directly.
        return;
      }
    },
    async switchToParentFrame() {
      // In Playwright, frame hierarchy is accessed via frame.parentFrame()
      // The page itself represents the top-level frame
    },
  };
}
