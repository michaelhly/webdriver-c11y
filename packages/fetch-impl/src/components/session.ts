import type { SessionHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { HttpContext } from "../context.js";
import { command, get, post } from "../http.js";

export function createSessionHandlers(ctx: HttpContext): SessionHandlers {
  return {
    async status() {
      return command(ctx, "GET", "/status");
    },
    async newSession(params) {
      const result = await command<{
        sessionId: string;
        capabilities: Record<string, unknown>;
      }>(ctx, "POST", "/session", { capabilities: params.capabilities ?? {} });
      ctx.sessionId = result.sessionId;
      return result;
    },
    async deleteSession() {
      await command(ctx, "DELETE", `/session/${ctx.sessionId}`);
      ctx.sessionId = null;
    },
    async getTimeouts() {
      return get(ctx, "/timeouts");
    },
    async setTimeouts(params) {
      await post(ctx, "/timeouts", params);
    },
  };
}
