import type { ScriptHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { PlaywrightContext } from "./context.js";

export function createScriptHandlers(ctx: PlaywrightContext): ScriptHandlers {
  return {
    async executeScript({ script, args }) {
      const value = await ctx
        .getPage()
        .evaluate(
          ({ s, a }) => new Function(...a.map((_, i) => `arg${i}`), s)(...a),
          { s: script, a: args ?? [] },
        );
      return { value };
    },
    async executeAsyncScript({ script, args }) {
      const value = await ctx.getPage().evaluate(
        ({ s, a }) =>
          new Promise((resolve) => {
            const cb = (result: unknown) => resolve(result);
            new Function(...a.map((_, i) => `arg${i}`), "arguments", s)(...a, {
              length: a.length + 1,
              [a.length]: cb,
            });
          }),
        { s: script, a: args ?? [] },
      );
      return { value };
    },
  };
}
