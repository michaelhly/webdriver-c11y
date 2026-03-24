import type { ScriptHandlers } from "@michaelhly.webdriver-interop/c11y";
import type { ClassicContext } from "./context.js";

export function createScriptHandlers(ctx: ClassicContext): ScriptHandlers {
	return {
		async executeScript({ script, args }) {
			const value = await ctx
				.getDriver()
				.executeScript(script, ...(args ?? []));
			return { value };
		},
		async executeAsyncScript({ script, args }) {
			const value = await ctx
				.getDriver()
				.executeAsyncScript(script, ...(args ?? []));
			return { value };
		},
	};
}
