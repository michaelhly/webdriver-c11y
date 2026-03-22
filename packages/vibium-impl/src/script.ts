import type { ScriptHandlers } from "@michaelhly.webdriver-interop/c11y";
import type { VibiumContext } from "./context.js";

export function createScriptHandlers(ctx: VibiumContext): ScriptHandlers {
	return {
		async executeScript({ script, args }) {
			const value = await ctx.getPage().evaluate(script, ...(args ?? []));
			return { value };
		},
		async executeAsyncScript({ script, args }) {
			const wrapped = `
				return new Promise((resolve, reject) => {
					const callback = resolve;
					(function() { ${script} }).call(null, ${(args ?? []).map(() => "arguments[i]").join(", ")}, callback);
				})
			`;
			const value = await ctx.getPage().evaluate(wrapped);
			return { value };
		},
	};
}
