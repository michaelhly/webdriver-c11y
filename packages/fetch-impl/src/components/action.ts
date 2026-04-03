import type { ActionHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { HttpContext } from "../context.js";
import { del, post } from "../http.js";

export function createActionHandlers(ctx: HttpContext): ActionHandlers {
  return {
    async performActions({ actions }) {
      await post(ctx, "/actions", { actions });
    },
    async releaseActions() {
      await del(ctx, "/actions");
    },
  };
}
