import type { Rect, WindowHandlers } from "@michaelhly.webdriver-interop/c11y";
import type { StagehandContext } from "./compat/context.js";
import { getActivePage } from "./compat/page.js";

interface WindowBounds {
	left?: number;
	top?: number;
	width?: number;
	height?: number;
	windowState?: string;
}

export function createWindowHandlers(ctx: StagehandContext): WindowHandlers {
	async function getWindowId(): Promise<number> {
		const page = getActivePage(ctx);
		const { windowId } = await ctx.stagehand.context.conn.send<{
			windowId: number;
		}>("Browser.getWindowForTarget", { targetId: page.targetId() });
		return windowId;
	}

	function boundsToRect(b: WindowBounds): Rect {
		return {
			x: b.left ?? 0,
			y: b.top ?? 0,
			width: b.width ?? 0,
			height: b.height ?? 0,
		};
	}

	async function setBoundsAndReturn(
		windowId: number,
		bounds: WindowBounds,
	): Promise<Rect> {
		await ctx.stagehand.context.conn.send("Browser.setWindowBounds", {
			windowId,
			bounds,
		});
		const result = await ctx.stagehand.context.conn.send<{
			bounds: WindowBounds;
		}>("Browser.getWindowBounds", { windowId });
		return boundsToRect(result.bounds);
	}

	return {
		async getWindowRect() {
			const windowId = await getWindowId();
			const result = await ctx.stagehand.context.conn.send<{
				bounds: WindowBounds;
			}>("Browser.getWindowBounds", { windowId });
			return boundsToRect(result.bounds);
		},

		async setWindowRect(params) {
			const windowId = await getWindowId();
			const bounds: WindowBounds = { windowState: "normal" };
			if (params.x !== undefined) bounds.left = params.x;
			if (params.y !== undefined) bounds.top = params.y;
			if (params.width !== undefined) bounds.width = params.width;
			if (params.height !== undefined) bounds.height = params.height;
			return setBoundsAndReturn(windowId, bounds);
		},

		async maximizeWindow() {
			const windowId = await getWindowId();
			return setBoundsAndReturn(windowId, { windowState: "maximized" });
		},

		async minimizeWindow() {
			const windowId = await getWindowId();
			return setBoundsAndReturn(windowId, { windowState: "minimized" });
		},

		async fullscreenWindow() {
			const windowId = await getWindowId();
			return setBoundsAndReturn(windowId, { windowState: "fullscreen" });
		},
	};
}
