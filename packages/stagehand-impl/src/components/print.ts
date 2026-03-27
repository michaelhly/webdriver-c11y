import type { PrintHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { StagehandContext } from "./context.js";

export function createPrintHandlers(ctx: StagehandContext): PrintHandlers {
	return {
		async printPage(params) {
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
			return { data: result.data };
		},
	};
}
