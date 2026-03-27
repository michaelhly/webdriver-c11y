import type { AlertHandlers } from "@michaelhly.webdriver-c11y/schemas";
import { NoSuchAlertError } from "@michaelhly.webdriver-c11y/schemas";
import type { PlaywrightContext } from "./context.js";

export function createAlertHandlers(ctx: PlaywrightContext): AlertHandlers {
  return {
    async getAlertText() {
      if (!ctx.pendingDialog) throw new NoSuchAlertError("No alert present");
      return { text: ctx.pendingDialog.message() };
    },
    async acceptAlert() {
      if (!ctx.pendingDialog) throw new NoSuchAlertError("No alert present");
      await ctx.pendingDialog.accept();
      ctx.pendingDialog = null;
    },
    async dismissAlert() {
      if (!ctx.pendingDialog) throw new NoSuchAlertError("No alert present");
      await ctx.pendingDialog.dismiss();
      ctx.pendingDialog = null;
    },
    async sendAlertText({ text }) {
      if (!ctx.pendingDialog) throw new NoSuchAlertError("No alert present");
      await ctx.pendingDialog.accept(text);
      ctx.pendingDialog = null;
    },
  };
}
