import type { WindowHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { ClassicContext } from "./context.js";

export function createWindowHandlers(ctx: ClassicContext): WindowHandlers {
	return {
		async getWindowRect() {
			const r = await ctx.getDriver().manage().window().getRect();
			return { x: r.x, y: r.y, width: r.width, height: r.height };
		},
		async setWindowRect(params) {
			const r = await ctx.getDriver().manage().window().setRect(params);
			return { x: r.x, y: r.y, width: r.width, height: r.height };
		},
		async maximizeWindow() {
			await ctx.getDriver().manage().window().maximize();
			return this.getWindowRect();
		},
		async minimizeWindow() {
			await ctx.getDriver().manage().window().minimize();
			return this.getWindowRect();
		},
		async fullscreenWindow() {
			await ctx.getDriver().manage().window().fullscreen();
			return this.getWindowRect();
		},
	};
}
