import type {
	AddPreloadScriptResult,
	BidiScriptHandlers,
	GetRealmsResult,
	RealmInfo,
} from "@michaelhly.webdriver-c11y/schema";
import type { StagehandContext } from "../context.js";

export function createBidiScriptHandlers(
	ctx: StagehandContext,
): BidiScriptHandlers {
	return {
		async scriptEvaluate(params) {
			const response = await ctx.getPage().sendCDP<{
				result: { type: string; value?: unknown };
				exceptionDetails?: unknown;
			}>("Runtime.evaluate", {
				expression: params.expression,
				awaitPromise: params.awaitPromise,
				contextId: params.target.context
					? Number(params.target.context)
					: undefined,
				returnByValue: true,
			});
			return response.result;
		},
		async scriptCallFunction(params) {
			const response = await ctx.getPage().sendCDP<{
				result: { type: string; value?: unknown };
				exceptionDetails?: unknown;
			}>("Runtime.callFunctionOn", {
				functionDeclaration: params.functionDeclaration,
				arguments: params.arguments?.map((a) => ({ value: a })),
				awaitPromise: params.awaitPromise,
				executionContextId: params.target.context
					? Number(params.target.context)
					: undefined,
				returnByValue: true,
			});
			return response.result;
		},
		async scriptAddPreloadScript(params) {
			const { identifier } = await ctx
				.getPage()
				.sendCDP<{ identifier: string }>(
					"Page.addScriptToEvaluateOnNewDocument",
					{ source: params.functionDeclaration },
				);
			return { script: identifier } satisfies AddPreloadScriptResult;
		},
		async scriptRemovePreloadScript(params) {
			await ctx.getPage().sendCDP("Page.removeScriptToEvaluateOnNewDocument", {
				identifier: params.script,
			});
		},
		async scriptGetRealms(_params) {
			// CDP doesn't have a direct "get realms" command;
			// return the main execution context as the single realm
			const realms: RealmInfo[] = [
				{
					realm: "default",
					origin: ctx.getPage().url(),
					type: "window",
				},
			];
			return { realms } satisfies GetRealmsResult;
		},
		async scriptDisown(_params) {
			// CDP Runtime.releaseObjectGroup is the closest equivalent
			await ctx.getPage().sendCDP("Runtime.releaseObjectGroup", {
				objectGroup: "default",
			});
		},
	};
}
