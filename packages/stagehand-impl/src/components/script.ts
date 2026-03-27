import type { ScriptHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { StagehandContext } from "./context.js";

export function createScriptHandlers(ctx: StagehandContext): ScriptHandlers {
	return {
		async executeScript({ script, args }) {
			const value = await ctx
				.getPage()
				.evaluate(
					({ s, a }: { s: string; a: unknown[] }) =>
						new Function(...a.map((_, i) => `arg${i}`), s)(...a),
					{ s: script, a: args ?? [] },
				);
			return { value };
		},
		async executeAsyncScript({ script, args }) {
			const value = await ctx.getPage().evaluate(
				({ s, a }: { s: string; a: unknown[] }) =>
					new Promise((resolve) => {
						const fn = new Function(
							...a.map((_, i) => `arg${i}`),
							"callback",
							s,
						);
						fn(...a, resolve);
					}),
				{ s: script, a: args ?? [] },
			);
			return { value };
		},
	};
}
