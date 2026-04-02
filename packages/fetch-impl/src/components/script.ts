import type { ScriptHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { HttpContext } from "../context.js";
import { post } from "../http.js";

export function createScriptHandlers(ctx: HttpContext): ScriptHandlers {
  return {
    async executeScript({ script, args }) {
      const wireScript =
        typeof script === "function"
          ? `return (${script.toString()}).apply(null, arguments)`
          : script;
      const value = await post(ctx, "/execute/sync", {
        script: wireScript,
        args: args ?? [],
      });
      return { value } as never;
    },
    async executeAsyncScript({ script, args }) {
      const wireScript =
        typeof script === "function"
          ? `return (${script.toString()}).apply(null, arguments)`
          : script;
      const value = await post(ctx, "/execute/async", {
        script: wireScript,
        args: args ?? [],
      });
      return { value } as never;
    },
  };
}
