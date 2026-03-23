import type { ScriptHandlers } from "@michaelhly.webdriver-interop/c11y";
import type { BidiContext } from "./context.js";

export function createScriptHandlers(ctx: BidiContext): ScriptHandlers {
	return {
		async executeScript({ script, args }) {
			const value = await ctx
				.getPage()
				.evaluate(
					`(function(){${script}}).apply(null, ${JSON.stringify(args ?? [])})`,
				);
			return { value };
		},
		async executeAsyncScript({ script, args }) {
			const value = await ctx
				.getPage()
				.evaluate(
					`new Promise((__resolve__) => { const __args__ = ${JSON.stringify(args ?? [])}; __args__.push(__resolve__); (function(){${script}}).apply(null, __args__); })`,
				);
			return { value };
		},
	};
}
