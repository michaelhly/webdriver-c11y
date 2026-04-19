import type {
  ExecuteScriptParams,
  ScriptHandlers,
  ScriptResult,
} from "@michaelhly.webdriver-c11y/schemas";
import type { KernelContext } from "../context.js";
import { evaluate } from "../eval.js";

export function createScriptHandlers(ctx: KernelContext): ScriptHandlers {
  return {
    async executeScript<R = unknown>(
      params: ExecuteScriptParams<R>,
    ): Promise<ScriptResult<R>> {
      const script =
        typeof params.script === "function"
          ? `return (${params.script.toString()}).apply(null, arguments);`
          : params.script;
      const args = params.args ?? [];
      const value = await evaluate<{ script: string; args: unknown[] }, R>(
        ctx,
        async (page, _context, a) => {
          return page.evaluate(
            ({ s, a: evalArgs }) => {
              const fn = new Function(s);
              return fn(...evalArgs);
            },
            { s: a.script, a: a.args },
          ) as Promise<R>;
        },
        { script, args },
      );
      return { value };
    },
    async executeAsyncScript<R = unknown>(
      params: ExecuteScriptParams<R>,
    ): Promise<ScriptResult<R>> {
      const script =
        typeof params.script === "function"
          ? `return (${params.script.toString()}).apply(null, arguments);`
          : params.script;
      const args = params.args ?? [];
      const value = await evaluate<{ script: string; args: unknown[] }, R>(
        ctx,
        async (page, _context, a) => {
          return page.evaluate(
            ({ scriptBody, args }) => {
              return new Promise<unknown>((resolve, reject) => {
                try {
                  const paramNames = args.map(
                    (_: unknown, i: number) => `a${i}`,
                  );
                  paramNames.push("callback");
                  paramNames.push(scriptBody);
                  const fn = new Function(...paramNames);
                  fn(...args, resolve);
                } catch (e) {
                  reject(e);
                }
              });
            },
            { scriptBody: a.script, args: a.args },
          ) as Promise<R>;
        },
        { script, args },
      );
      return { value };
    },
  };
}
