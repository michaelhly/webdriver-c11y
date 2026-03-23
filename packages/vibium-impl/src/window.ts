import type { WindowHandlers } from "@michaelhly.webdriver-interop/c11y";
import type { BidiContext } from "./context.js";

export function createWindowHandlers(ctx: BidiContext): WindowHandlers {
	return {
		async getWindowRect() {
			const win = await ctx.getPage().window();
			return {
				x: win.x,
				y: win.y,
				width: win.width,
				height: win.height,
			};
		},
		async setWindowRect(params) {
			await ctx.getPage().setWindow(params);
			return this.getWindowRect();
		},
		async maximizeWindow() {
			await ctx.getPage().setWindow({ state: "maximized" });
			return this.getWindowRect();
		},
		async minimizeWindow() {
			await ctx.getPage().setWindow({ state: "minimized" });
			return this.getWindowRect();
		},
		async fullscreenWindow() {
			await ctx.getPage().setWindow({ state: "fullscreen" });
			return this.getWindowRect();
		},
	};
}
