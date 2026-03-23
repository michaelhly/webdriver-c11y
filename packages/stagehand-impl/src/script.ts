import type { ScriptHandlers } from "@michaelhly.webdriver-interop/c11y";
import type { StagehandContext } from "./shared.js";
import { getActivePage } from "./shared.js";

export function createScriptHandlers(ctx: StagehandContext): ScriptHandlers {
	return {
		async executeScript(params) {
			const page = getActivePage(ctx);
			const value = await page.evaluate(
				(a: { script: string; args: unknown[] }) => {
					const fn = new Function(a.script);
					return fn.apply(null, a.args);
				},
				{ script: params.script, args: params.args ?? [] },
			);
			return { value };
		},

		async executeAsyncScript(params) {
			const page = getActivePage(ctx);
			const value = await page.evaluate(
				(a: { script: string; args: unknown[] }) => {
					return new Promise((resolve, reject) => {
						try {
							const fn = new Function(a.script);
							fn.apply(null, [...a.args, resolve]);
						} catch (e) {
							reject(e);
						}
					});
				},
				{ script: params.script, args: params.args ?? [] },
			);
			return { value };
		},
	};
}
