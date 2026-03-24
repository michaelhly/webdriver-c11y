import type { ScriptHandlers } from "@michaelhly.webdriver-c11y/schemas";
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
