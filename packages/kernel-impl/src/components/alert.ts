import type { AlertHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { KernelContext } from "./context.js";
import { execFn } from "./exec.js";

export function createAlertHandlers(ctx: KernelContext): AlertHandlers {
  return {
    async getAlertText() {
      const text = await execFn(ctx, (page) => {
        return new Promise<string>((resolve) => {
          page.once("dialog", (dialog) => resolve(dialog.message()));
        });
      });
      return { text };
    },
    async acceptAlert() {
      await execFn(ctx, (page) => {
        page.once("dialog", (dialog) => dialog.accept());
      });
    },
    async dismissAlert() {
      await execFn(ctx, (page) => {
        page.once("dialog", (dialog) => dialog.dismiss());
      });
    },
    async sendAlertText({ text }) {
      await execFn(
        ctx,
        (page, _context, args) => {
          page.once("dialog", (dialog) => dialog.accept(args.text));
        },
        { text },
      );
    },
  };
}
