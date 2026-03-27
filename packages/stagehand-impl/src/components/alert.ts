import type { AlertHandlers } from "@michaelhly.webdriver-c11y/schemas";
import { UnsupportedOperationError } from "@michaelhly.webdriver-c11y/schemas";
import { sendCDP } from "./shared/cdp.js";
import type { StagehandContext } from "./context.js";

export function createAlertHandlers(ctx: StagehandContext): AlertHandlers {
  return {
    async getAlertText() {
      throw new UnsupportedOperationError(
        "Alert text retrieval not supported via CDP in Stagehand",
      );
    },
    async acceptAlert() {
      await sendCDP(ctx.getPage(), "Page.handleJavaScriptDialog", {
        accept: true,
      });
    },
    async dismissAlert() {
      await sendCDP(ctx.getPage(), "Page.handleJavaScriptDialog", {
        accept: false,
      });
    },
    async sendAlertText({ text }) {
      await sendCDP(ctx.getPage(), "Page.handleJavaScriptDialog", {
        accept: true,
        promptText: text,
      });
    },
  };
}
