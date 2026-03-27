import type { ContextHandlers } from "@michaelhly.webdriver-c11y/schemas";
import { UnsupportedOperationError } from "@michaelhly.webdriver-c11y/schemas";
import type { StagehandContext } from "./context.js";

export function createContextHandlers(ctx: StagehandContext): ContextHandlers {
	return {
		async getWindowHandle() {
			// Use the page's target ID as the window handle
			const { targetInfo } = await ctx
				.getPage()
				.sendCDP<{ targetInfo: { targetId: string } }>("Target.getTargetInfo");
			return { handle: targetInfo.targetId };
		},
		async closeWindow() {
			const { targetInfo } = await ctx
				.getPage()
				.sendCDP<{ targetInfo: { targetId: string } }>("Target.getTargetInfo");
			await ctx.getPage().sendCDP("Target.closeTarget", {
				targetId: targetInfo.targetId,
			});
		},
		async switchToWindow(_params) {
			throw new UnsupportedOperationError(
				"Window switching not supported in Stagehand",
			);
		},
		async getWindowHandles() {
			// Return all page targets
			const { targetInfos } = await ctx.getPage().sendCDP<{
				targetInfos: Array<{ targetId: string; type: string }>;
			}>("Target.getTargets");
			const handles = targetInfos
				.filter((t) => t.type === "page")
				.map((t) => t.targetId);
			return { handles };
		},
		async newWindow(_params) {
			const { targetId } = await ctx
				.getPage()
				.sendCDP<{ targetId: string }>("Target.createTarget", {
					url: "about:blank",
				});
			return { handle: targetId, type: "tab" as const };
		},
		async switchToFrame({ id }) {
			if (id === null || id === undefined) {
				// Switch to top-level frame — no-op in Stagehand's page model
				return;
			}
			throw new UnsupportedOperationError(
				"Frame switching not fully supported in Stagehand; use frameLocator instead",
			);
		},
		async switchToParentFrame() {
			// No-op: Stagehand page operates on the main frame
		},
	};
}
