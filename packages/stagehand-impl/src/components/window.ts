import type { WindowHandlers } from "@michaelhly.webdriver-c11y/schema";
import type { StagehandContext } from "./context.js";

export function createWindowHandlers(ctx: StagehandContext): WindowHandlers {
	return {
		async getWindowRect() {
			const { windowId } = await ctx
				.getPage()
				.sendCDP<{ windowId: number }>("Browser.getWindowForTarget");
			const { bounds } = await ctx.getPage().sendCDP<{
				bounds: { left: number; top: number; width: number; height: number };
			}>("Browser.getWindowBounds", { windowId });
			return {
				x: bounds.left,
				y: bounds.top,
				width: bounds.width,
				height: bounds.height,
			};
		},
		async setWindowRect(params) {
			const { windowId } = await ctx
				.getPage()
				.sendCDP<{ windowId: number }>("Browser.getWindowForTarget");
			await ctx.getPage().sendCDP("Browser.setWindowBounds", {
				windowId,
				bounds: {
					left: params.x,
					top: params.y,
					width: params.width,
					height: params.height,
				},
			});
			return this.getWindowRect();
		},
		async maximizeWindow() {
			const { windowId } = await ctx
				.getPage()
				.sendCDP<{ windowId: number }>("Browser.getWindowForTarget");
			await ctx.getPage().sendCDP("Browser.setWindowBounds", {
				windowId,
				bounds: { windowState: "maximized" },
			});
			return this.getWindowRect();
		},
		async minimizeWindow() {
			const { windowId } = await ctx
				.getPage()
				.sendCDP<{ windowId: number }>("Browser.getWindowForTarget");
			await ctx.getPage().sendCDP("Browser.setWindowBounds", {
				windowId,
				bounds: { windowState: "minimized" },
			});
			return this.getWindowRect();
		},
		async fullscreenWindow() {
			const { windowId } = await ctx
				.getPage()
				.sendCDP<{ windowId: number }>("Browser.getWindowForTarget");
			await ctx.getPage().sendCDP("Browser.setWindowBounds", {
				windowId,
				bounds: { windowState: "fullscreen" },
			});
			return this.getWindowRect();
		},
	};
}
