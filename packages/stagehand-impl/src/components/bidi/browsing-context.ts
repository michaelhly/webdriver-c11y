import type {
	BidiBrowsingContextHandlers,
	BidiPrintResult,
	CreateResult,
	Info,
	InfoListResult,
	NavigateResult,
} from "@michaelhly.webdriver-c11y/schema";
import type { StagehandContext } from "../context.js";

export function createBidiBrowsingContextHandlers(
	ctx: StagehandContext,
): BidiBrowsingContextHandlers {
	return {
		async browsingContextCreate(params) {
			const { targetId } = await ctx
				.getPage()
				.sendCDP<{ targetId: string }>("Target.createTarget", {
					url: "about:blank",
					newWindow: params.type === "window",
				});
			return { context: targetId } satisfies CreateResult;
		},
		async browsingContextClose(params) {
			await ctx
				.getPage()
				.sendCDP("Target.closeTarget", { targetId: params.context });
		},
		async browsingContextActivate(params) {
			await ctx
				.getPage()
				.sendCDP("Target.activateTarget", { targetId: params.context });
		},
		async browsingContextNavigate(params) {
			const { frameId } = await ctx
				.getPage()
				.sendCDP<{ frameId: string; loaderId: string }>("Page.navigate", {
					url: params.url,
				});
			return {
				navigation: frameId,
				url: params.url,
			} satisfies NavigateResult;
		},
		async browsingContextReload(params) {
			await ctx.getPage().sendCDP("Page.reload", {
				ignoreCache: params.ignoreCache,
			});
			const url = ctx.getPage().url();
			return { url } satisfies NavigateResult;
		},
		async browsingContextTraverseHistory(params) {
			const { entries, currentIndex } = await ctx.getPage().sendCDP<{
				entries: Array<{ url: string }>;
				currentIndex: number;
			}>("Page.getNavigationHistory");
			const targetIndex = currentIndex + params.delta;
			const entry = entries[targetIndex];
			if (!entry) throw new Error("History index out of range");
			await ctx
				.getPage()
				.sendCDP("Page.navigateToHistoryEntry", { entryId: targetIndex });
		},
		async browsingContextGetTree(params) {
			const { frameTree } = await ctx.getPage().sendCDP<{
				frameTree: {
					frame: { id: string; url: string; parentId?: string };
					childFrames?: unknown[];
				};
			}>("Page.getFrameTree");

			function toInfo(
				node: {
					frame: { id: string; url: string; parentId?: string };
					childFrames?: unknown[];
				},
				depth: number,
			): Info {
				const children =
					params.maxDepth !== undefined && depth >= params.maxDepth
						? []
						: ((node.childFrames ?? []) as (typeof node)[]).map((c) =>
								toInfo(c, depth + 1),
							);
				const info: Info = {
					context: node.frame.id,
					url: node.frame.url,
					children,
				};
				if (node.frame.parentId !== undefined)
					info.parent = node.frame.parentId;
				return info;
			}

			return { contexts: [toInfo(frameTree, 0)] } satisfies InfoListResult;
		},
		async browsingContextSetViewport(params) {
			if (params.viewport) {
				await ctx
					.getPage()
					.setViewportSize(
						params.viewport.width,
						params.viewport.height,
						params.devicePixelRatio !== undefined
							? { deviceScaleFactor: params.devicePixelRatio }
							: undefined,
					);
			}
		},
		async browsingContextPrint(params) {
			const result = await ctx
				.getPage()
				.sendCDP<{ data: string }>("Page.printToPDF", {
					landscape: params.orientation === "landscape",
					printBackground: params.background,
					scale: params.scale,
					paperWidth: params.page?.width,
					paperHeight: params.page?.height,
					marginTop: params.margin?.top,
					marginBottom: params.margin?.bottom,
					marginLeft: params.margin?.left,
					marginRight: params.margin?.right,
					pageRanges: params.pageRanges?.join(","),
					preferCSSPageSize: !params.shrinkToFit,
				});
			return { data: result.data } satisfies BidiPrintResult;
		},
	};
}
