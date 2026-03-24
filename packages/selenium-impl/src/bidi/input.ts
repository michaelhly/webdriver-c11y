import type { BidiInputHandlers } from "@michaelhly.webdriver-c11y/schema";
import type { ClassicContext } from "../context.js";

export function createBidiInputHandlers(
	ctx: ClassicContext,
): BidiInputHandlers {
	return {
		async inputPerformActions(params) {
			const bidi = await ctx.getDriver().getBidi();
			await bidi.send({
				method: "input.performActions",
				params: {
					context: params.context,
					actions: params.actions,
				},
			});
		},
		async inputReleaseActions(params) {
			const bidi = await ctx.getDriver().getBidi();
			await bidi.send({
				method: "input.releaseActions",
				params: { context: params.context },
			});
		},
		async inputSetFiles(params) {
			const bidi = await ctx.getDriver().getBidi();
			await bidi.send({
				method: "input.setFiles",
				params: {
					context: params.context,
					element: params.element,
					files: params.files,
				},
			});
		},
	};
}
