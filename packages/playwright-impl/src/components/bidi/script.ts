import type {
  AddPreloadScriptResult,
  BidiScriptHandlers,
  GetRealmsResult,
} from "@michaelhly.webdriver-c11y/schemas";
import { UnsupportedOperationError } from "@michaelhly.webdriver-c11y/schemas";
import type { PlaywrightContext } from "../context.js";
import { getPage } from "../context.js";

let nextScriptId = 0;

export function createBidiScriptHandlers(
  ctx: PlaywrightContext,
): BidiScriptHandlers {
  return {
    async scriptEvaluate(params) {
      const page = params.target.context
        ? getPage(ctx, params.target.context)
        : ctx.getPage();
      const result = await page.evaluate((expr) => {
        return new Function(`return (${expr})`)();
      }, params.expression);
      return result;
    },
    async scriptCallFunction(params) {
      const page = params.target.context
        ? getPage(ctx, params.target.context)
        : ctx.getPage();
      const result = await page.evaluate(
        ({ fn, args }) => {
          const func = new Function(`return (${fn})`)();
          return func(...args);
        },
        {
          fn: params.functionDeclaration,
          args: params.arguments ?? [],
        },
      );
      return result;
    },
    async scriptAddPreloadScript(params) {
      const page = ctx.getPage();
      const script = `(${params.functionDeclaration})(${(params.arguments ?? []).map((a) => JSON.stringify(a)).join(", ")})`;
      await page.addInitScript(script);
      const id = `pw-script-${String(nextScriptId++)}`;
      return { script: id } satisfies AddPreloadScriptResult;
    },
    async scriptRemovePreloadScript(_params) {
      throw new UnsupportedOperationError(
        "Playwright does not support removing individual preload scripts",
      );
    },
    async scriptGetRealms(params) {
      // Playwright doesn't expose JavaScript realms directly.
      // Return a single realm for the target context's main frame.
      const page = params.context
        ? getPage(ctx, params.context)
        : ctx.getPage();
      const url = page.url();
      const realm: import("@michaelhly.webdriver-c11y/schemas").RealmInfo = {
        realm: "default",
        origin: url,
        type: "window",
      };
      if (params.context) realm.context = params.context;
      return { realms: [realm] } satisfies GetRealmsResult;
    },
    async scriptDisown(_params) {
      // No-op: Playwright manages handle lifetimes automatically
    },
  };
}
