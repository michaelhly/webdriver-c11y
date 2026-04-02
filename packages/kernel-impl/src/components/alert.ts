import type { AlertHandlers } from "@michaelhly.webdriver-c11y/schemas";
import { type KernelContext, exec } from "./context.js";

export function createAlertHandlers(ctx: KernelContext): AlertHandlers {
  return {
    async getAlertText() {
      const text = await exec<string>(ctx, `
        return await new Promise((resolve) => {
          page.once('dialog', (dialog) => resolve(dialog.message()));
        });
      `);
      return { text };
    },
    async acceptAlert() {
      await exec(ctx, `
        page.once('dialog', async (dialog) => {
          await dialog.accept();
        });
        return undefined;
      `);
    },
    async dismissAlert() {
      await exec(ctx, `
        page.once('dialog', async (dialog) => {
          await dialog.dismiss();
        });
        return undefined;
      `);
    },
    async sendAlertText({ text }) {
      await exec(ctx, `
        page.once('dialog', async (dialog) => {
          await dialog.accept(${JSON.stringify(text)});
        });
        return undefined;
      `);
    },
  };
}
