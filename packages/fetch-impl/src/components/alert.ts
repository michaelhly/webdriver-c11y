import type { AlertHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { HttpContext } from "../context.js";
import { get, post } from "../http.js";

export function createAlertHandlers(ctx: HttpContext): AlertHandlers {
  return {
    async getAlertText() {
      const text = await get<string>(ctx, "/alert/text");
      return { text };
    },
    async acceptAlert() {
      await post(ctx, "/alert/accept");
    },
    async dismissAlert() {
      await post(ctx, "/alert/dismiss");
    },
    async sendAlertText({ text }) {
      await post(ctx, "/alert/text", { text });
    },
  };
}
