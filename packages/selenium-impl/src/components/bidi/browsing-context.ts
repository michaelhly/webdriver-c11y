import type {
	BidiBrowsingContextHandlers,
	BidiPrintResult,
	CreateResult,
	InfoListResult,
	NavigateResult,
} from "@michaelhly.webdriver-c11y/schemas";
import type { ClassicContext } from "../context.js";

export function createBidiBrowsingContextHandlers(
	ctx: ClassicContext,
): BidiBrowsingContextHandlers {
	return {
		async browsingContextCreate(params) {
			const bidi = await ctx.getDriver().getBidi();
			const response = await bidi.send({
				method: "browsingContext.create",
				params: {
					type: params.type,
					referenceContext: params.referenceContext,
					background: params.background,
					userContext: params.userContext,
				},
			});
			return (response as { result: CreateResult }).result;
		},
		async browsingContextClose(params) {
			const bidi = await ctx.getDriver().getBidi();
			await bidi.send({
				method: "browsingContext.close",
				params: {
					context: params.context,
					promptUnload: params.promptUnload,
				},
			});
		},
		async browsingContextActivate(params) {
			const bidi = await ctx.getDriver().getBidi();
			await bidi.send({
				method: "browsingContext.activate",
				params: { context: params.context },
			});
		},
		async browsingContextNavigate(params) {
			const bidi = await ctx.getDriver().getBidi();
			const response = await bidi.send({
				method: "browsingContext.navigate",
				params: {
					context: params.context,
					url: params.url,
					wait: params.wait,
				},
			});
			return (response as { result: NavigateResult }).result;
		},
		async browsingContextReload(params) {
			const bidi = await ctx.getDriver().getBidi();
			const response = await bidi.send({
				method: "browsingContext.reload",
				params: {
					context: params.context,
					ignoreCache: params.ignoreCache,
					wait: params.wait,
				},
			});
			return (response as { result: NavigateResult }).result;
		},
		async browsingContextTraverseHistory(params) {
			const bidi = await ctx.getDriver().getBidi();
			await bidi.send({
				method: "browsingContext.traverseHistory",
				params: { context: params.context, delta: params.delta },
			});
		},
		async browsingContextGetTree(params) {
			const bidi = await ctx.getDriver().getBidi();
			const response = await bidi.send({
				method: "browsingContext.getTree",
				params: {
					root: params.root,
					maxDepth: params.maxDepth,
				},
			});
			return (response as { result: InfoListResult }).result;
		},
		async browsingContextSetViewport(params) {
			const bidi = await ctx.getDriver().getBidi();
			await bidi.send({
				method: "browsingContext.setViewport",
				params: {
					context: params.context,
					viewport: params.viewport,
					devicePixelRatio: params.devicePixelRatio,
				},
			});
		},
		async browsingContextPrint(params) {
			const bidi = await ctx.getDriver().getBidi();
			const response = await bidi.send({
				method: "browsingContext.print",
				params: {
					context: params.context,
					background: params.background,
					margin: params.margin,
					orientation: params.orientation,
					page: params.page,
					pageRanges: params.pageRanges,
					scale: params.scale,
					shrinkToFit: params.shrinkToFit,
				},
			});
			return (response as { result: BidiPrintResult }).result;
		},
	};
}
