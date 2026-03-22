import type { WindowHandlers, Rect } from "@michaelhly.webdriver-interop/c11y";
import { UnsupportedOperationError } from "@michaelhly.webdriver-interop/c11y";
import type { VibiumContext } from "./context.js";

async function getViewportRect(ctx: VibiumContext): Promise<Rect> {
	const result = await ctx
		.getPage()
		.evaluate<{ w: number; h: number }>(
			"({ w: window.innerWidth, h: window.innerHeight })",
		);
	return { x: 0, y: 0, width: result.w, height: result.h };
}

export function createWindowHandlers(ctx: VibiumContext): WindowHandlers {
	return {
		async getWindowRect() {
			return getViewportRect(ctx);
		},
		async setWindowRect() {
			throw new UnsupportedOperationError(
				"setWindowRect is not supported by the BiDi backend",
			);
		},
		async maximizeWindow() {
			throw new UnsupportedOperationError(
				"maximizeWindow is not supported by the BiDi backend",
			);
		},
		async minimizeWindow() {
			throw new UnsupportedOperationError(
				"minimizeWindow is not supported by the BiDi backend",
			);
		},
		async fullscreenWindow() {
			throw new UnsupportedOperationError(
				"fullscreenWindow is not supported by the BiDi backend",
			);
		},
	};
}
