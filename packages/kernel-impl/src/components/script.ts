import type {
  ExecuteScriptParams,
  ScriptHandlers,
  ScriptResult,
} from "@michaelhly.webdriver-c11y/schemas";
import { exec, type KernelContext } from "../context.js";

export function createScriptHandlers(ctx: KernelContext): ScriptHandlers {
  return {
    async executeScript<R = unknown>(
      params: ExecuteScriptParams<R>,
    ): Promise<ScriptResult<R>> {
      const args = params.args ?? [];
      const value = await exec<R>(
        ctx,
        `
        const fn = new Function(${JSON.stringify(params.script)});
        return await page.evaluate(fn, ...${JSON.stringify(args)});
      `,
      );
      return { value };
    },
    async executeAsyncScript<R = unknown>(
      params: ExecuteScriptParams<R>,
    ): Promise<ScriptResult<R>> {
      const args = params.args ?? [];
      const value = await exec<R>(
        ctx,
        `
        const scriptBody = ${JSON.stringify(params.script)};
        const args = ${JSON.stringify(args)};
        return await page.evaluate(({ scriptBody, args }) => {
          return new Promise((resolve, reject) => {
            try {
              const fn = new Function(...args.map((_, i) => 'a' + i).concat(['callback', scriptBody]));
              fn(...args, resolve);
            } catch (e) {
              reject(e);
            }
          });
        }, { scriptBody, args });
      `,
      );
      return { value };
    },
  };
}
