import type {
  ExecuteScriptParams,
  ScriptHandlers,
  ScriptResult,
} from "@michaelhly.webdriver-c11y/schemas";
import type { ClassicContext } from "./context.js";

export function createScriptHandlers(ctx: ClassicContext): ScriptHandlers {
  return {
    async executeScript<R = unknown>(
      params: ExecuteScriptParams<R>,
    ): Promise<ScriptResult<R>> {
      const value = await ctx
        .getDriver()
        .executeScript<R>(params.script, ...(params.args ?? []));
      return { value: value as R };
    },
    async executeAsyncScript<R = unknown>(
      params: ExecuteScriptParams<R>,
    ): Promise<ScriptResult<R>> {
      const value = await ctx
        .getDriver()
        .executeAsyncScript<R>(params.script, ...(params.args ?? []));
      return { value: value as R };
    },
  };
}
