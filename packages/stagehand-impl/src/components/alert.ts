import type { AlertHandlers } from "@michaelhly.webdriver-c11y/schemas";
import { UnsupportedOperationError } from "@michaelhly.webdriver-c11y/schemas";
import type { StagehandContext } from "./context.js";

export function createAlertHandlers(ctx: StagehandContext): AlertHandlers {
  return {
    async getAlertText() {
      throw new UnsupportedOperationError(
        "Alert text retrieval not supported via CDP in Stagehand",
      );
    },
    async acceptAlert() {
      await ctx
        .getPage()
        .sendCDP("Page.handleJavaScriptDialog", { accept: true });
    },
    async dismissAlert() {
      await ctx
        .getPage()
        .sendCDP("Page.handleJavaScriptDialog", { accept: false });
    },
    async sendAlertText({ text }) {
      await ctx.getPage().sendCDP("Page.handleJavaScriptDialog", {
        accept: true,
        promptText: text,
      });
    },
  };
}
